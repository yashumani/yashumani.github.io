#!/usr/bin/env node
import { readFile, writeFile, mkdir, rename, access } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".automation-cache");
const SITE_DIR = path.join(ROOT, "gita-sadhana");
const PROGRESS_PATH = path.join(SITE_DIR, "gita-progress.json");
const MANIFEST_PATH = path.join(SITE_DIR, "content", "manifest.json");
const LESSON_DIR = path.join(SITE_DIR, "content", "lessons");
const TEMPLATE_PATH = path.join(SITE_DIR, "automation", "teacher-prompt.md");
const TIME_ZONE = "America/New_York";
const TOTAL_VERSES = 701;
const PACKET_BEGIN = "BEGIN_PUBLISH_PACKET_V1";
const PACKET_END = "END_PUBLISH_PACKET_V1";
const DRAFT_BEGIN = "BEGIN_GITA_LESSON_DRAFT_V1";
const DRAFT_END = "END_GITA_LESSON_DRAFT_V1";
const DLS_PDF_URL = "https://www.dlshq.org/download2/bgita.pdf";
const PUBLIC_BASE = "https://yashumani.github.io/gita-sadhana";
const CHAPTER_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];
const CHAPTER_NAMES = [
  ["अर्जुनविषादयोग", "Arjuna Viṣāda Yoga"],
  ["सांख्ययोग", "Sāṅkhya Yoga"],
  ["कर्मयोग", "Karma Yoga"],
  ["ज्ञानकर्मसंन्यासयोग", "Jñāna Karma Sannyāsa Yoga"],
  ["कर्मसंन्यासयोग", "Karma Sannyāsa Yoga"],
  ["ध्यानयोग", "Dhyāna Yoga"],
  ["ज्ञानविज्ञानयोग", "Jñāna Vijñāna Yoga"],
  ["अक्षरब्रह्मयोग", "Akṣara Brahma Yoga"],
  ["राजविद्याराजगुह्ययोग", "Rāja Vidyā Rāja Guhya Yoga"],
  ["विभूतियोग", "Vibhūti Yoga"],
  ["विश्वरूपदर्शनयोग", "Viśvarūpa Darśana Yoga"],
  ["भक्तियोग", "Bhakti Yoga"],
  ["क्षेत्रक्षेत्रज्ञविभागयोग", "Kṣetra Kṣetrajña Vibhāga Yoga"],
  ["गुणत्रयविभागयोग", "Guṇatraya Vibhāga Yoga"],
  ["पुरुषोत्तमयोग", "Puruṣottama Yoga"],
  ["दैवासुरसम्पद्विभागयोग", "Daivāsura Sampad Vibhāga Yoga"],
  ["श्रद्धात्रयविभागयोग", "Śraddhātraya Vibhāga Yoga"],
  ["मोक्षसंन्यासयोग", "Mokṣa Sannyāsa Yoga"]
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function stripAnsi(value = "") {
  return String(value).replace(/\u001B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
}

function todayInNewYork(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${map.year}-${map.month}-${map.day}`;
}

function runDate() {
  const value = process.env.RUN_DATE || todayInNewYork();
  invariant(/^\d{4}-\d{2}-\d{2}$/.test(value), `Invalid RUN_DATE: ${value}`);
  return value;
}

async function ensureDir(directory) {
  await mkdir(directory, { recursive: true });
}

async function exists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJsonAtomic(filePath, value) {
  await ensureDir(path.dirname(filePath));
  const temporary = `${filePath}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, filePath);
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

function semanticEqual(left, right) {
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}

function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) return;
  const text = String(value ?? "");
  if (text.includes("\n")) {
    const marker = `GITA_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    requireAppend(outputPath, `${name}<<${marker}\n${text}\n${marker}\n`);
  } else {
    requireAppend(outputPath, `${name}=${text}\n`);
  }
}

function requireAppend(filePath, text) {
  execFileSync("bash", ["-lc", `printf '%s' "$1" >> "$2"`, "_", text, filePath], {
    stdio: "ignore"
  });
}

function addSummary(markdown) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) requireAppend(summaryPath, `${markdown.trim()}\n\n`);
}

function chapterCount(chapter) {
  invariant(Number.isInteger(chapter) && chapter >= 1 && chapter <= 18, `Invalid chapter: ${chapter}`);
  return CHAPTER_COUNTS[chapter - 1];
}

function sequenceFor(chapter, verse) {
  invariant(Number.isInteger(verse) && verse >= 1 && verse <= chapterCount(chapter), `Invalid verse ${chapter}.${verse}`);
  return CHAPTER_COUNTS.slice(0, chapter - 1).reduce((sum, count) => sum + count, 0) + verse;
}

function pointerFor(chapter, verse) {
  return {
    chapter,
    verse,
    display: `${chapter}.${verse}`,
    lessonSequence: sequenceFor(chapter, verse)
  };
}

function nextPointer(chapter, verse) {
  if (verse < chapterCount(chapter)) return pointerFor(chapter, verse + 1);
  if (chapter < 18) return pointerFor(chapter + 1, 1);
  return null;
}

function idFor(chapter, verse) {
  return `bg-${String(chapter).padStart(2, "0")}-${String(verse).padStart(3, "0")}`;
}

function targetLabel(targets) {
  if (!targets.length) return "Journey complete";
  if (targets.length === 1) return `BG ${targets[0].display}`;
  return `BG ${targets[0].display}–${targets.at(-1).display}`;
}

function validatePointer(pointer, allowNull = false) {
  if (pointer === null && allowNull) return;
  invariant(pointer && typeof pointer === "object", "Missing verse pointer.");
  const expected = pointerFor(Number(pointer.chapter), Number(pointer.verse));
  invariant(pointer.display === expected.display, `Pointer display mismatch: expected ${expected.display}.`);
  invariant(Number(pointer.lessonSequence) === expected.lessonSequence, `Pointer sequence mismatch at ${expected.display}.`);
}

function validateProgress(progress) {
  invariant(progress && typeof progress === "object", "Progress file is invalid.");
  invariant(Number(progress.totalVerses) === TOTAL_VERSES, `Expected ${TOTAL_VERSES} total verses.`);
  invariant(Number.isInteger(progress.completedSequentialVerses), "completedSequentialVerses must be an integer.");
  invariant(progress.completedSequentialVerses >= 0 && progress.completedSequentialVerses <= TOTAL_VERSES, "Progress is outside valid range.");
  if (progress.completedSequentialVerses === TOTAL_VERSES) {
    invariant(progress.nextVerse === null, "A completed journey must have nextVerse=null.");
  } else {
    validatePointer(progress.nextVerse);
    invariant(
      Number(progress.nextVerse.lessonSequence) === progress.completedSequentialVerses + 1,
      "nextVerse must be exactly one sequence after completedSequentialVerses."
    );
  }
}

function dailyTargets(progress) {
  validateProgress({
    ...progress,
    totalVerses: progress.totalVerses ?? TOTAL_VERSES
  });
  if (!progress.nextVerse) return [];
  const first = pointerFor(progress.nextVerse.chapter, progress.nextVerse.verse);
  const targets = [first];
  if (first.verse < chapterCount(first.chapter)) {
    targets.push(pointerFor(first.chapter, first.verse + 1));
  }
  return targets;
}

function sameState(progress, expected) {
  return Number(progress.completedSequentialVerses) === Number(expected.completedSequentialVerses)
    && semanticEqual(progress.nextVerse, expected.nextVerse);
}

function progressionAfter(progress, targets, date) {
  invariant(targets.length >= 1 && targets.length <= 2, "A publication must include one or two targets.");
  const last = targets.at(-1);
  return {
    completedSequentialVerses: progress.completedSequentialVerses + targets.length,
    nextVerse: nextPointer(last.chapter, last.verse),
    lastPublishedDate: date,
    lastPublishedLessonId: idFor(last.chapter, last.verse)
  };
}

function cleanRequiredString(value, label, minLength = 1) {
  invariant(typeof value === "string" && value.trim().length >= minLength, `${label} must be a non-empty string.`);
  return value.trim();
}

function validateWordMeanings(items, label) {
  invariant(Array.isArray(items) && items.length >= 1, `${label} must contain at least one item.`);
  for (const [index, item] of items.entries()) {
    cleanRequiredString(item?.term, `${label}[${index}].term`);
    cleanRequiredString(item?.meaning, `${label}[${index}].meaning`);
  }
}

function validatePerspective(items) {
  invariant(Array.isArray(items), "interpretationPerspectives must be an array.");
  for (const [index, item] of items.entries()) {
    cleanRequiredString(item?.label, `interpretationPerspectives[${index}].label`);
    cleanRequiredString(item?.explanation, `interpretationPerspectives[${index}].explanation`);
  }
}

function validateApplications(items) {
  invariant(Array.isArray(items) && items.length >= 1, "practicalApplication must contain at least one item.");
  for (const [index, item] of items.entries()) {
    cleanRequiredString(item?.label, `practicalApplication[${index}].label`);
    cleanRequiredString(item?.text, `practicalApplication[${index}].text`);
  }
}

function validateSourceNotes(items) {
  invariant(Array.isArray(items) && items.length >= 2, "sourceNotes must contain at least two sources.");
  for (const [index, item] of items.entries()) {
    cleanRequiredString(item?.label, `sourceNotes[${index}].label`);
    cleanRequiredString(item?.scope, `sourceNotes[${index}].scope`);
    cleanRequiredString(item?.url, `sourceNotes[${index}].url`);
    new URL(item.url);
  }
}

function validateDraft(draft, targets, date) {
  invariant(draft?.schemaVersion === "GITA_LESSON_DRAFT_V1", "Draft schemaVersion must be GITA_LESSON_DRAFT_V1.");
  invariant(draft.runDate === date, `Draft runDate must be ${date}.`);
  invariant(Array.isArray(draft.lessons), "Draft lessons must be an array.");
  invariant(draft.lessons.length === targets.length, `Draft must contain exactly ${targets.length} lesson object(s).`);

  draft.lessons.forEach((lesson, index) => {
    const target = targets[index];
    invariant(Number(lesson.chapter) === target.chapter, `Lesson ${index + 1} chapter must be ${target.chapter}.`);
    invariant(Number(lesson.verse) === target.verse, `Lesson ${index + 1} verse must be ${target.verse}.`);
    cleanRequiredString(lesson.chapterNameSanskrit, `lesson ${target.display} chapterNameSanskrit`);
    cleanRequiredString(lesson.chapterNameEnglish, `lesson ${target.display} chapterNameEnglish`);
    cleanRequiredString(lesson.theme, `lesson ${target.display} theme`);
    cleanRequiredString(lesson.context, `lesson ${target.display} context`, 20);
    cleanRequiredString(lesson.contextHindi, `lesson ${target.display} contextHindi`, 20);
    cleanRequiredString(lesson.sanskritDevanagari, `lesson ${target.display} sanskritDevanagari`, 10);
    cleanRequiredString(lesson.transliteration, `lesson ${target.display} transliteration`, 10);
    validateWordMeanings(lesson.wordByWord, `lesson ${target.display} wordByWord`);
    cleanRequiredString(lesson.spokenHindi, `lesson ${target.display} spokenHindi`, 80);
    cleanRequiredString(lesson.clearEnglish, `lesson ${target.display} clearEnglish`, 80);
    validatePerspective(lesson.interpretationPerspectives);
    validateApplications(lesson.practicalApplication);
    cleanRequiredString(lesson.reflectionQuestion, `lesson ${target.display} reflectionQuestion`);
    cleanRequiredString(lesson.reflectionQuestionHindi, `lesson ${target.display} reflectionQuestionHindi`);
    validateSourceNotes(lesson.sourceNotes);

    const expectedSanskritName = CHAPTER_NAMES[target.chapter - 1][0];
    const expectedEnglishName = CHAPTER_NAMES[target.chapter - 1][1];
    invariant(
      lesson.chapterNameSanskrit.replace(/\s+/g, "") === expectedSanskritName.replace(/\s+/g, ""),
      `Chapter Sanskrit name mismatch for ${target.display}; expected ${expectedSanskritName}.`
    );
    invariant(
      lesson.chapterNameEnglish.toLowerCase().includes(expectedEnglishName.split(" ")[0].toLowerCase()),
      `Chapter English name looks inconsistent for ${target.display}; expected ${expectedEnglishName}.`
    );
  });

  cleanRequiredString(draft.dailyHindiSummary, "dailyHindiSummary", 40);
  cleanRequiredString(draft.dailyEnglishSummary, "dailyEnglishSummary", 40);
  cleanRequiredString(draft.dailyPractice, "dailyPractice", 10);
  cleanRequiredString(draft.nextPreview, "nextPreview", 5);
}

function buildPacket(draft, progress, targets, date) {
  const lessons = draft.lessons.map((lesson, index) => {
    const target = targets[index];
    return {
      id: idFor(target.chapter, target.verse),
      sequenceNumber: target.lessonSequence,
      date,
      chapter: target.chapter,
      verseStart: target.verse,
      verseEnd: target.verse,
      chapterNameSanskrit: lesson.chapterNameSanskrit.trim(),
      chapterNameEnglish: lesson.chapterNameEnglish.trim(),
      theme: lesson.theme.trim(),
      context: lesson.context.trim(),
      contextHindi: lesson.contextHindi.trim(),
      sanskritDevanagari: lesson.sanskritDevanagari.trim(),
      transliteration: lesson.transliteration.trim(),
      wordByWord: lesson.wordByWord,
      spokenHindi: lesson.spokenHindi.trim(),
      clearEnglish: lesson.clearEnglish.trim(),
      interpretationPerspectives: lesson.interpretationPerspectives,
      practicalApplication: lesson.practicalApplication,
      reflectionQuestion: lesson.reflectionQuestion.trim(),
      reflectionQuestionHindi: lesson.reflectionQuestionHindi.trim(),
      sourceNotes: lesson.sourceNotes,
      sequentialStatus: "sequential",
      publishedStatus: "staged"
    };
  });

  return {
    schemaVersion: "PUBLISH_PACKET_V1",
    runDate: date,
    editionNumbering: "Sivananda-DLS-701",
    expectedCurrentState: {
      completedSequentialVerses: progress.completedSequentialVerses,
      nextVerse: progress.nextVerse
    },
    lessons,
    progressAfterPublication: progressionAfter(progress, targets, date),
    generationNotes: [
      "Generated once by the 7:07 AM teacher workflow and published without interpretive rewriting.",
      `Daily Hindi summary: ${draft.dailyHindiSummary.trim()}`,
      `Daily English summary: ${draft.dailyEnglishSummary.trim()}`,
      `Daily practice: ${draft.dailyPractice.trim()}`,
      `Next preview: ${draft.nextPreview.trim()}`
    ]
  };
}

function validatePacket(packet, progressLike) {
  invariant(packet?.schemaVersion === "PUBLISH_PACKET_V1", "Packet schemaVersion is invalid.");
  invariant(packet.editionNumbering === "Sivananda-DLS-701", "Packet editionNumbering is invalid.");
  invariant(/^\d{4}-\d{2}-\d{2}$/.test(packet.runDate), "Packet runDate is invalid.");
  invariant(Array.isArray(packet.lessons) && packet.lessons.length >= 1 && packet.lessons.length <= 2, "Packet must contain one or two lessons.");
  invariant(sameState(progressLike, packet.expectedCurrentState), "Packet expectedCurrentState does not match the supplied state.");

  const expectedTargets = dailyTargets({
    totalVerses: TOTAL_VERSES,
    completedSequentialVerses: packet.expectedCurrentState.completedSequentialVerses,
    nextVerse: packet.expectedCurrentState.nextVerse
  });
  invariant(packet.lessons.length === expectedTargets.length, "Packet lesson count does not match the deterministic daily scope.");

  packet.lessons.forEach((lesson, index) => {
    const target = expectedTargets[index];
    invariant(lesson.id === idFor(target.chapter, target.verse), `Invalid lesson ID for ${target.display}.`);
    invariant(Number(lesson.sequenceNumber) === target.lessonSequence, `Invalid sequence number for ${target.display}.`);
    invariant(lesson.date === packet.runDate, `Lesson ${target.display} date does not match packet runDate.`);
    invariant(Number(lesson.chapter) === target.chapter, `Invalid chapter for ${target.display}.`);
    invariant(Number(lesson.verseStart) === target.verse && Number(lesson.verseEnd) === target.verse, `Invalid verse identity for ${target.display}.`);
    invariant(lesson.sequentialStatus === "sequential", `Lesson ${target.display} must be sequential.`);
    invariant(lesson.publishedStatus === "staged", `Packet lesson ${target.display} must be staged.`);
    cleanRequiredString(lesson.sanskritDevanagari, `lesson ${target.display} Sanskrit`);
    cleanRequiredString(lesson.transliteration, `lesson ${target.display} transliteration`);
    cleanRequiredString(lesson.spokenHindi, `lesson ${target.display} Hindi`);
    cleanRequiredString(lesson.clearEnglish, `lesson ${target.display} English`);
    validateWordMeanings(lesson.wordByWord, `lesson ${target.display} wordByWord`);
    validatePerspective(lesson.interpretationPerspectives);
    validateApplications(lesson.practicalApplication);
    validateSourceNotes(lesson.sourceNotes);
  });

  const expectedAfter = progressionAfter({
    completedSequentialVerses: packet.expectedCurrentState.completedSequentialVerses
  }, expectedTargets, packet.runDate);
  invariant(semanticEqual(packet.progressAfterPublication, expectedAfter), "Packet progressAfterPublication is incorrect.");
}

function extractMarkedJson(raw, begin, end) {
  const text = stripAnsi(raw);
  const start = text.indexOf(begin);
  const finish = text.indexOf(end, start + begin.length);
  invariant(start >= 0 && finish > start, `Could not find ${begin}/${end} markers.`);
  let payload = text.slice(start + begin.length, finish).trim();
  payload = payload.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  return JSON.parse(payload);
}

function htmlToText(html) {
  const entities = {
    amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
    "#39": "'", "#x27": "'", "#x2F": "/"
  };
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h[1-6]|tr|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, key) => {
      const normalized = key.toLowerCase();
      if (normalized.startsWith("#x")) return String.fromCodePoint(parseInt(normalized.slice(2), 16));
      if (normalized.startsWith("#")) return String.fromCodePoint(parseInt(normalized.slice(1), 10));
      return entities[normalized] ?? `&${key};`;
    })
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

async function download(url, destination, binary = false) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(90_000),
    headers: {
      "User-Agent": "Gita-Sadhana-Study-Automation/1.0 (+https://yashumani.github.io/gita-sadhana/)"
    }
  });
  invariant(response.ok, `Source download failed (${response.status}) for ${url}`);
  const data = binary ? Buffer.from(await response.arrayBuffer()) : await response.text();
  await writeFile(destination, data);
  return data;
}

function gitaSupersiteUrl(chapter, verse) {
  const query = new URLSearchParams({
    choose: "1",
    field_chapter_value: String(chapter),
    field_nsutra_value: String(verse),
    language: "dv",
    scvv: "1"
  });
  return `https://www.gitasupersite.iitk.ac.in/srimad?${query}`;
}

async function latestPublishedLessons(manifest) {
  const entries = Array.isArray(manifest.lessonFiles) ? manifest.lessonFiles.slice(-2) : [];
  const results = [];
  for (const entry of entries) {
    const relative = typeof entry === "string" ? entry : entry?.path;
    if (!relative) continue;
    const normalized = relative.replace(/^content\//, "");
    const absolute = path.join(SITE_DIR, "content", normalized);
    if (await exists(absolute)) results.push(await readJson(absolute));
  }
  return results;
}

async function prepare() {
  const date = runDate();
  const progress = await readJson(PROGRESS_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  validateProgress(progress);
  const targets = dailyTargets(progress);
  await ensureDir(CACHE_DIR);

  if (!targets.length) {
    setOutput("journey_complete", "true");
    setOutput("target_label", "Journey complete");
    addSummary("## Gita Sadhana\nThe sequential 701-verse journey is already complete. No lesson was staged.");
    return;
  }

  const pdfPath = path.join(CACHE_DIR, "sivananda-gita.pdf");
  const pdfTextPath = path.join(CACHE_DIR, "sivananda-gita.txt");
  const pdf = await download(DLS_PDF_URL, pdfPath, true);
  invariant(pdf.subarray(0, 4).toString() === "%PDF", "The Divine Life Society download is not a valid PDF.");

  try {
    execFileSync("pdftotext", ["-layout", pdfPath, pdfTextPath], { stdio: "pipe" });
  } catch (error) {
    throw new Error(`Could not extract the official DLS PDF with pdftotext: ${error.message}`);
  }
  const dlsText = await readFile(pdfTextPath, "utf8");
  invariant(dlsText.length > 20_000, "The extracted DLS text is unexpectedly short.");

  const comparativeSources = [];
  for (const target of targets) {
    const url = gitaSupersiteUrl(target.chapter, target.verse);
    const rawPath = path.join(CACHE_DIR, `gita-supersite-${target.chapter}-${target.verse}.html`);
    const textPath = path.join(CACHE_DIR, `gita-supersite-${target.chapter}-${target.verse}.txt`);
    const html = await download(url, rawPath, false);
    const text = htmlToText(html);
    invariant(text.length > 500, `Gita Supersite text for ${target.display} is unexpectedly short.`);
    await writeFile(textPath, `${text}\n`, "utf8");
    comparativeSources.push({
      verse: target.display,
      url,
      rawPath: path.relative(ROOT, rawPath),
      textPath: path.relative(ROOT, textPath)
    });
  }

  const latest = await latestPublishedLessons(manifest);
  const context = {
    runDate: date,
    timeZone: TIME_ZONE,
    editionNumbering: "Sivananda-DLS-701",
    expectedCurrentState: {
      completedSequentialVerses: progress.completedSequentialVerses,
      nextVerse: progress.nextVerse
    },
    targets,
    targetLabel: targetLabel(targets),
    chapterNames: targets.map(target => ({
      chapter: target.chapter,
      Sanskrit: CHAPTER_NAMES[target.chapter - 1][0],
      English: CHAPTER_NAMES[target.chapter - 1][1]
    })),
    previousPublishedLessons: latest,
    primarySource: {
      label: "Bhagavad Gita — Sri Swami Sivananda, The Divine Life Society",
      url: DLS_PDF_URL,
      extractedTextPath: path.relative(ROOT, pdfTextPath)
    },
    comparativeSources
  };

  await writeJsonAtomic(path.join(CACHE_DIR, "source-manifest.json"), context);
  const template = await readFile(TEMPLATE_PATH, "utf8");
  const prompt = `${template.trim()}

## AUTOMATION-SUPPLIED RUN CONTEXT

Read this JSON as authoritative for today's verse identity and local source paths:

\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Before answering, use your file-reading tools to inspect the local official source files listed above. Do not rely on memory for Sanskrit or verse numbering.
`;
  await writeFile(path.join(CACHE_DIR, "teacher-prompt.txt"), `${prompt}\n`, "utf8");

  setOutput("journey_complete", "false");
  setOutput("target_label", targetLabel(targets));
  setOutput("run_date", date);
  addSummary(`## 7:07 AM preflight\nPrepared verified source material for **${targetLabel(targets)}**. Public progress remains ${progress.completedSequentialVerses}/${TOTAL_VERSES}.`);
}

function renderIssueBody(packet, draft, owner) {
  const sections = packet.lessons.map(lesson => {
    const perspectives = lesson.interpretationPerspectives.length
      ? lesson.interpretationPerspectives.map(item => `- **${item.label}:** ${item.explanation}`).join("\n")
      : "- No material interpretive disagreement was necessary for this verse.";
    const applications = lesson.practicalApplication.map(item => `- **${item.label}:** ${item.text}`).join("\n");
    const words = lesson.wordByWord.map(item => `- **${item.term}:** ${item.meaning}`).join("\n");
    const sources = lesson.sourceNotes.map(item => `- [${item.label}](${item.url}) — ${item.scope}`).join("\n");
    return `## Bhagavad Gita ${lesson.chapter}.${lesson.verseStart} — ${lesson.theme}

### श्लोक · Sanskrit

${lesson.sanskritDevanagari}

### Roman transliteration

${lesson.transliteration}

### मुख्य शब्द · Key terms

${words}

### प्रसंग · Context in spoken Hindi

${lesson.contextHindi}

### Context in English

${lesson.context}

### बोलचाल की हिंदी

${lesson.spokenHindi}

### Clear English — a second lens

${lesson.clearEnglish}

### Interpretive perspectives

${perspectives}

### आज के जीवन में · Practical application

${applications}

### मनन · Reflection

**हिंदी:** ${lesson.reflectionQuestionHindi}

**English:** ${lesson.reflectionQuestion}

### Sources checked

${sources}`;
  }).join("\n\n---\n\n");

  return `@${owner}

# Gita Sadhana — Daily Listening Lesson

**Date:** ${packet.runDate}  
**Lesson:** ${targetLabel(packet.lessons.map(item => pointerFor(item.chapter, item.verseStart)))}  
**Website publication:** scheduled for 9:07 AM America/New_York

${sections}

---

## आज का सार · Hindi recap

${draft.dailyHindiSummary}

## English recap

${draft.dailyEnglishSummary}

## आज का अभ्यास · Practice

${draft.dailyPractice}

## आगे की झलक · Next preview

${draft.nextPreview}

> This is the exact lesson staged for the website. The 9:07 AM publisher validates and publishes these same lesson objects without rewriting their spiritual meaning.

<details>
<summary>Machine-readable validated publication packet</summary>

${PACKET_BEGIN}
${JSON.stringify(packet, null, 2)}
${PACKET_END}

</details>
`;
}

function packetIssueTitle(date, targets) {
  return `GITA-PUBLISH-PACKET | ${date} | ${targetLabel(targets)}`;
}

async function githubApi(route, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  invariant(token, "GITHUB_TOKEN is required.");
  invariant(repository, "GITHUB_REPOSITORY is required.");
  const response = await fetch(`https://api.github.com${route}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2026-03-10",
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    signal: AbortSignal.timeout(60_000)
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }
  if (!response.ok) {
    const detail = typeof payload === "string" ? payload : payload?.message || JSON.stringify(payload);
    throw new Error(`GitHub API ${options.method || "GET"} ${route} failed (${response.status}): ${detail}`);
  }
  return payload;
}

async function openIssues() {
  const repository = process.env.GITHUB_REPOSITORY;
  return (await githubApi(`/repos/${repository}/issues?state=open&per_page=100&sort=created&direction=asc`))
    .filter(issue => !issue.pull_request);
}

async function createAssignedIssue(title, body) {
  const repository = process.env.GITHUB_REPOSITORY;
  const owner = repository.split("/")[0];
  const base = { title, body, assignees: [owner] };
  try {
    return await githubApi(`/repos/${repository}/issues`, {
      method: "POST",
      body: JSON.stringify(base)
    });
  } catch (error) {
    if (!String(error.message).includes("(422)")) throw error;
    return githubApi(`/repos/${repository}/issues`, {
      method: "POST",
      body: JSON.stringify({ title, body })
    });
  }
}

async function stage() {
  const date = runDate();
  const progress = await readJson(PROGRESS_PATH);
  validateProgress(progress);
  const targets = dailyTargets(progress);
  invariant(targets.length > 0, "The journey is complete; no packet should be staged.");

  const outputPath = process.env.AI_OUTPUT_FILE || path.join(CACHE_DIR, "copilot-output.txt");
  const raw = await readFile(outputPath, "utf8");
  const draft = extractMarkedJson(raw, DRAFT_BEGIN, DRAFT_END);
  validateDraft(draft, targets, date);
  const packet = buildPacket(draft, progress, targets, date);
  validatePacket(packet, progress);

  const issues = await openIssues();
  const title = packetIssueTitle(date, targets);
  const existing = issues.find(issue => issue.title === title);
  if (existing) {
    const existingPacket = extractMarkedJson(existing.body || "", PACKET_BEGIN, PACKET_END);
    invariant(semanticEqual(existingPacket, packet), `A different packet already exists in issue #${existing.number}.`);
    setOutput("issue_number", existing.number);
    setOutput("issue_url", existing.html_url);
    setOutput("created", "false");
    addSummary(`## 7:07 AM staging\nPacket already existed in [issue #${existing.number}](${existing.html_url}); no duplicate was created.`);
    return;
  }

  const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
  const body = renderIssueBody(packet, draft, owner);
  invariant(Buffer.byteLength(body, "utf8") < 60_000, "Issue body is too large for safe publication.");
  const issue = await createAssignedIssue(title, body);

  await writeJsonAtomic(path.join(CACHE_DIR, "validated-packet.json"), packet);
  setOutput("issue_number", issue.number);
  setOutput("issue_url", issue.html_url);
  setOutput("created", "true");
  setOutput("target_label", targetLabel(targets));
  addSummary(`## 7:07 AM staging\nCreated [daily listening lesson issue #${issue.number}](${issue.html_url}) for **${targetLabel(targets)}**. The website remains unchanged until 9:07 AM validation.`);
}

function publishedLesson(stagedLesson) {
  return { ...stagedLesson, publishedStatus: "published" };
}

function manifestPathFor(id) {
  return `lessons/${id}.json`;
}

async function selectPacketIssue() {
  const issues = await openIssues();
  const packets = issues.filter(issue => issue.title.startsWith("GITA-PUBLISH-PACKET | "));
  if (!packets.length) return null;
  const date = runDate();
  return packets.find(issue => issue.title.startsWith(`GITA-PUBLISH-PACKET | ${date} | `)) || packets[0];
}

function recoveryStateMatches(progress, packet) {
  const after = packet.progressAfterPublication;
  return Number(progress.completedSequentialVerses) === Number(after.completedSequentialVerses)
    && semanticEqual(progress.nextVerse, after.nextVerse)
    && progress.lastPublishedDate === after.lastPublishedDate
    && progress.lastPublishedLessonId === after.lastPublishedLessonId;
}

async function publish() {
  const progress = await readJson(PROGRESS_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  validateProgress(progress);
  invariant(Array.isArray(manifest.lessonFiles), "Manifest lessonFiles must be an array.");

  const issue = await selectPacketIssue();
  if (!issue) {
    setOutput("packet_found", "false");
    setOutput("journey_complete", progress.completedSequentialVerses === TOTAL_VERSES ? "true" : "false");
    addSummary(progress.completedSequentialVerses === TOTAL_VERSES
      ? "## 9:07 AM publisher\nThe 701-verse journey is complete; no packet is expected."
      : `## 9:07 AM publisher\nNo staged lesson packet was found. Public progress remains ${progress.completedSequentialVerses}/${TOTAL_VERSES}.`);
    return;
  }

  const packet = extractMarkedJson(issue.body || "", PACKET_BEGIN, PACKET_END);
  validatePacket(packet, {
    totalVerses: TOTAL_VERSES,
    completedSequentialVerses: packet.expectedCurrentState.completedSequentialVerses,
    nextVerse: packet.expectedCurrentState.nextVerse
  });

  let mode;
  if (sameState(progress, packet.expectedCurrentState)) {
    mode = "publish";
  } else if (recoveryStateMatches(progress, packet)) {
    mode = "recover";
  } else {
    throw new Error(
      `Stale packet in issue #${issue.number}: repository state is ${progress.completedSequentialVerses}/${TOTAL_VERSES} with next ${progress.nextVerse?.display ?? "none"}, `
      + `but packet expected ${packet.expectedCurrentState.completedSequentialVerses}/${TOTAL_VERSES} with next ${packet.expectedCurrentState.nextVerse?.display ?? "none"}.`
    );
  }

  await ensureDir(LESSON_DIR);
  const manifestSet = new Set(manifest.lessonFiles.map(entry => typeof entry === "string" ? entry : entry?.path).filter(Boolean));
  let changed = false;
  const lessonPaths = [];

  for (const staged of packet.lessons) {
    const lesson = publishedLesson(staged);
    const relative = manifestPathFor(lesson.id);
    const absolute = path.join(SITE_DIR, "content", relative);
    lessonPaths.push(relative);

    if (await exists(absolute)) {
      const current = await readJson(absolute);
      invariant(semanticEqual(current, lesson), `Existing lesson file conflicts with staged packet: ${relative}`);
    } else {
      invariant(mode === "publish", `Recovery cannot continue because ${relative} is missing.`);
      await writeJsonAtomic(absolute, lesson);
      changed = true;
    }

    if (!manifestSet.has(relative)) {
      invariant(mode === "publish", `Recovery cannot continue because the manifest is missing ${relative}.`);
      manifest.lessonFiles.push(relative);
      manifestSet.add(relative);
      changed = true;
    }
  }

  if (mode === "publish") {
    manifest.updatedAt = packet.runDate;
    await writeJsonAtomic(MANIFEST_PATH, manifest);
    changed = true;

    const updatedProgress = {
      ...progress,
      completedSequentialVerses: packet.progressAfterPublication.completedSequentialVerses,
      nextVerse: packet.progressAfterPublication.nextVerse,
      lastPublishedDate: packet.progressAfterPublication.lastPublishedDate,
      lastPublishedLessonId: packet.progressAfterPublication.lastPublishedLessonId,
      updatedAt: packet.runDate
    };
    validateProgress(updatedProgress);
    await writeJsonAtomic(PROGRESS_PATH, updatedProgress);
    changed = true;
  } else {
    for (const relative of lessonPaths) {
      invariant(manifestSet.has(relative), `Recovery manifest is missing ${relative}.`);
    }
  }

  const receipt = {
    schemaVersion: "GITA_PUBLICATION_RECEIPT_V1",
    runDate: runDate(),
    packetRunDate: packet.runDate,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    mode,
    changed,
    lessonPaths,
    lessonIds: packet.lessons.map(lesson => lesson.id),
    progressAfterPublication: packet.progressAfterPublication
  };
  await ensureDir(CACHE_DIR);
  await writeJsonAtomic(path.join(CACHE_DIR, "publication-receipt.json"), receipt);

  setOutput("packet_found", "true");
  setOutput("journey_complete", "false");
  setOutput("did_change", changed ? "true" : "false");
  setOutput("issue_number", issue.number);
  setOutput("issue_url", issue.html_url);
  setOutput("published_ids", receipt.lessonIds.join(","));
  setOutput("last_lesson_id", receipt.lessonIds.at(-1));
  setOutput("commit_message", `Publish Gita lesson ${packet.runDate}: ${targetLabel(packet.lessons.map(item => pointerFor(item.chapter, item.verseStart)))}`);
  addSummary(`## 9:07 AM publisher\nValidated issue #${issue.number} in **${mode}** mode for ${receipt.lessonIds.join(", ")}. Repository state is prepared for ${packet.progressAfterPublication.completedSequentialVerses}/${TOTAL_VERSES}.`);
}

async function fetchPublicJson(url) {
  const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
    headers: { "User-Agent": "Gita-Sadhana-Publication-Verifier/1.0" }
  });
  invariant(response.ok, `Public verification fetch failed (${response.status}): ${url}`);
  return response.json();
}

async function sleep(milliseconds) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function verify() {
  const receipt = await readJson(path.join(CACHE_DIR, "publication-receipt.json"));
  const expected = receipt.progressAfterPublication;
  let lastError = null;

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    try {
      const publicProgress = await fetchPublicJson(`${PUBLIC_BASE}/gita-progress.json`);
      invariant(Number(publicProgress.completedSequentialVerses) === Number(expected.completedSequentialVerses), "Public completed count has not updated yet.");
      invariant(semanticEqual(publicProgress.nextVerse, expected.nextVerse), "Public nextVerse has not updated yet.");
      invariant(publicProgress.lastPublishedLessonId === expected.lastPublishedLessonId, "Public lastPublishedLessonId has not updated yet.");

      for (const lessonId of receipt.lessonIds) {
        const publicLesson = await fetchPublicJson(`${PUBLIC_BASE}/content/lessons/${lessonId}.json`);
        invariant(publicLesson.id === lessonId, `Public lesson ${lessonId} has not deployed correctly.`);
        invariant(publicLesson.publishedStatus === "published", `Public lesson ${lessonId} is not marked published.`);
      }

      const result = {
        verifiedAt: new Date().toISOString(),
        attempts: attempt,
        publicProgress,
        publicLessonUrl: `${PUBLIC_BASE}/#${receipt.lessonIds.at(-1)}`
      };
      await writeJsonAtomic(path.join(CACHE_DIR, "public-verification.json"), result);
      setOutput("public_lesson_url", result.publicLessonUrl);
      setOutput("verified_attempts", attempt);
      addSummary(`## Public verification\nGitHub Pages shows **${expected.completedSequentialVerses}/${TOTAL_VERSES}** and the permanent lesson anchor is [${receipt.lessonIds.at(-1)}](${result.publicLessonUrl}).`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 30) await sleep(10_000);
    }
  }
  throw new Error(`Public site did not reach the expected state after polling: ${lastError?.message || "unknown error"}`);
}

async function closePacket() {
  const repository = process.env.GITHUB_REPOSITORY;
  const receipt = await readJson(path.join(CACHE_DIR, "publication-receipt.json"));
  const verification = await readJson(path.join(CACHE_DIR, "public-verification.json"));
  const after = receipt.progressAfterPublication;
  const next = after.nextVerse?.display || "Journey complete";
  const comment = `Published and publicly verified.

- Lessons: ${receipt.lessonIds.join(", ")}
- Progress: ${after.completedSequentialVerses}/${TOTAL_VERSES}
- Next: ${next}
- Public lesson: ${verification.publicLessonUrl}
- Verification attempts: ${verification.attempts}

The staged packet has been processed without rewriting its lesson content.`;

  await githubApi(`/repos/${repository}/issues/${receipt.issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body: comment })
  });
  await githubApi(`/repos/${repository}/issues/${receipt.issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify({ state: "closed", state_reason: "completed" })
  });
  addSummary(`## Packet closed\nClosed staging issue #${receipt.issueNumber} after successful public verification.`);
}

async function alert() {
  const repository = process.env.GITHUB_REPOSITORY;
  const owner = repository?.split("/")[0] || "yashumani";
  const stage = (process.env.ALERT_STAGE || "automation").replace(/\s+/g, "-").toLowerCase();
  const date = runDate();
  const title = `GITA-AUTOMATION-ALERT | ${date} | ${stage}`;
  const issues = await openIssues();
  const existing = issues.find(issue => issue.title === title);
  if (existing) {
    setOutput("alert_issue_url", existing.html_url);
    return;
  }

  const message = process.env.ALERT_MESSAGE || "The workflow did not complete. Review the linked GitHub Actions run; progress was not advanced.";
  const runUrl = `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${repository}/actions/runs/${process.env.GITHUB_RUN_ID || ""}`;
  const body = `@${owner}

# Gita Sadhana automation needs attention

**Stage:** ${stage}  
**Date:** ${date}

${message}

[Open the workflow run](${runUrl})

The automation is fail-safe: no unverified lesson should advance the public progress record.`;
  const issue = await createAssignedIssue(title, body);
  setOutput("alert_issue_url", issue.html_url);
  addSummary(`## Alert created\nCreated [issue #${issue.number}](${issue.html_url}) because the automation could not finish safely.`);
}

function sampleDraft(date, targets) {
  return {
    schemaVersion: "GITA_LESSON_DRAFT_V1",
    runDate: date,
    lessons: targets.map(target => ({
      chapter: target.chapter,
      verse: target.verse,
      chapterNameSanskrit: CHAPTER_NAMES[target.chapter - 1][0],
      chapterNameEnglish: CHAPTER_NAMES[target.chapter - 1][1],
      theme: `Test theme ${target.display}`,
      context: "This is sufficiently long narrative context used only by the deterministic automation self-test.",
      contextHindi: "यह केवल स्वचालन की जाँच के लिए बनाया गया पर्याप्त लंबा प्रसंग है, वास्तविक आध्यात्मिक पाठ नहीं।",
      sanskritDevanagari: "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।",
      transliteration: "dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ",
      wordByWord: [{ term: "dharma-kṣetre", meaning: "in the field of dharma" }],
      spokenHindi: "यह केवल स्वचालन की संरचनात्मक जाँच के लिए लिखा गया एक लंबा हिंदी नमूना है। इसका उद्देश्य यह सुनिश्चित करना है कि आवश्यक पाठ, क्रम और सुरक्षा नियम सही ढंग से काम करते हैं; यह वास्तविक श्लोक-व्याख्या नहीं है।",
      clearEnglish: "This deliberately long English sample exists only to test structure, sequencing, validation, and fail-safe publication behavior. It is not presented as a real interpretation of the Bhagavad Gita.",
      interpretationPerspectives: [{ label: "Test", explanation: "A structural test perspective." }],
      practicalApplication: [{ label: "Test", text: "Confirm deterministic behavior." }],
      reflectionQuestion: "Does the automation preserve the correct sequence?",
      reflectionQuestionHindi: "क्या स्वचालन सही क्रम बनाए रखता है?",
      sourceNotes: [
        { label: "DLS", url: DLS_PDF_URL, scope: "Primary numbering source." },
        { label: "Gita Supersite", url: gitaSupersiteUrl(target.chapter, target.verse), scope: "Comparative source." }
      ]
    })),
    dailyHindiSummary: "यह पर्याप्त लंबा हिंदी सार केवल स्वचालन की संरचना और वैधता की जाँच के लिए उपयोग किया जा रहा है।",
    dailyEnglishSummary: "This sufficiently long English summary is used only to validate the automation structure and behavior.",
    dailyPractice: "Observe whether every deterministic check passes.",
    nextPreview: "The next valid verse pointer is calculated, not guessed."
  };
}

async function selfTest() {
  invariant(CHAPTER_COUNTS.reduce((sum, count) => sum + count, 0) === TOTAL_VERSES, "Chapter counts do not total 701.");
  invariant(sequenceFor(1, 1) === 1, "Sequence 1.1 failed.");
  invariant(sequenceFor(18, 78) === 701, "Sequence 18.78 failed.");
  invariant(idFor(5, 18) === "bg-05-018", "ID formatting failed.");

  const start = {
    totalVerses: TOTAL_VERSES,
    completedSequentialVerses: 0,
    nextVerse: pointerFor(1, 1)
  };
  const startTargets = dailyTargets(start);
  invariant(startTargets.length === 2 && startTargets[1].display === "1.2", "Normal two-verse scope failed.");

  const boundary = {
    totalVerses: TOTAL_VERSES,
    completedSequentialVerses: 46,
    nextVerse: pointerFor(1, 47)
  };
  const boundaryTargets = dailyTargets(boundary);
  invariant(boundaryTargets.length === 1, "Chapter-boundary scope must contain one verse.");
  const boundaryAfter = progressionAfter(boundary, boundaryTargets, "2026-09-03");
  invariant(boundaryAfter.nextVerse.display === "2.1", "Chapter-boundary next pointer failed.");

  const date = "2026-09-03";
  const draft = sampleDraft(date, startTargets);
  validateDraft(draft, startTargets, date);
  const packet = buildPacket(draft, start, startTargets, date);
  validatePacket(packet, start);
  const marked = `${DRAFT_BEGIN}\n${JSON.stringify(draft)}\n${DRAFT_END}`;
  invariant(semanticEqual(extractMarkedJson(marked, DRAFT_BEGIN, DRAFT_END), draft), "Marked JSON extraction failed.");

  console.log("Gita automation self-test passed.");
}

async function main() {
  const command = process.argv[2];
  const commands = {
    prepare,
    stage,
    publish,
    verify,
    close: closePacket,
    alert,
    "self-test": selfTest
  };
  invariant(commands[command], `Unknown command "${command}". Expected one of: ${Object.keys(commands).join(", ")}.`);
  await commands[command]();
}

main().catch(error => {
  console.error(`GITA_AUTOMATION_ERROR: ${error.stack || error.message || error}`);
  process.exitCode = 1;
});
