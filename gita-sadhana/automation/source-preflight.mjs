#!/usr/bin/env node
import { readFile, writeFile, mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const ROOT = process.cwd();
const SITE_DIR = path.join(ROOT, "gita-sadhana");
const CACHE_DIR = path.join(ROOT, ".automation-cache");
const PROGRESS_PATH = path.join(SITE_DIR, "gita-progress.json");
const MANIFEST_PATH = path.join(SITE_DIR, "content", "manifest.json");
const CORPUS_PATH = path.join(SITE_DIR, "data", "sanskrit-701.json");
const TEMPLATE_PATH = path.join(SITE_DIR, "automation", "teacher-prompt.md");
const DLS_PDF_URL = "https://www.dlshq.org/download2/bgita.pdf";
const CORPUS_SOURCE_PAGE = "https://github.com/ChiragMirani/gita-quotes/blob/cddb2aabcb18b2ddf4ca965a0e673c1eee43146b/docs/data.json";
const CORPUS_SOURCE_COMMIT = "cddb2aabcb18b2ddf4ca965a0e673c1eee43146b";
const CORPUS_SOURCE_BLOB = "04cc915b3c40262ddd5abf40eea9421ae7649a18";
const TIME_ZONE = "America/New_York";
const TOTAL_VERSES = 701;
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

function todayInNewYork(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function runDate() {
  const value = process.env.RUN_DATE || todayInNewYork();
  invariant(/^\d{4}-\d{2}-\d{2}$/.test(value), `Invalid RUN_DATE: ${value}`);
  return value;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function setOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) return;
  const text = String(value ?? "");
  if (text.includes("\n")) {
    const marker = `GITA_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    await appendFile(process.env.GITHUB_OUTPUT, `${name}<<${marker}\n${text}\n${marker}\n`, "utf8");
  } else {
    await appendFile(process.env.GITHUB_OUTPUT, `${name}=${text}\n`, "utf8");
  }
}

async function addSummary(markdown) {
  if (!process.env.GITHUB_STEP_SUMMARY) return;
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `${markdown.trim()}\n\n`, "utf8");
}

function sequenceFor(chapter, verse) {
  invariant(Number.isInteger(chapter) && chapter >= 1 && chapter <= 18, `Invalid chapter ${chapter}.`);
  invariant(Number.isInteger(verse) && verse >= 1 && verse <= CHAPTER_COUNTS[chapter - 1], `Invalid verse ${chapter}.${verse}.`);
  return CHAPTER_COUNTS.slice(0, chapter - 1).reduce((sum, count) => sum + count, 0) + verse;
}

function pointerFor(chapter, verse) {
  return { chapter, verse, display: `${chapter}.${verse}`, lessonSequence: sequenceFor(chapter, verse) };
}

function validateProgress(progress) {
  invariant(progress?.totalVerses === TOTAL_VERSES, `Progress must use ${TOTAL_VERSES} verses.`);
  invariant(Number.isInteger(progress.completedSequentialVerses), "completedSequentialVerses must be an integer.");
  invariant(progress.completedSequentialVerses >= 0 && progress.completedSequentialVerses <= TOTAL_VERSES, "Progress is outside the valid range.");
  if (progress.completedSequentialVerses === TOTAL_VERSES) {
    invariant(progress.nextVerse === null, "Completed progress must have nextVerse=null.");
    return;
  }
  const expected = pointerFor(Number(progress.nextVerse?.chapter), Number(progress.nextVerse?.verse));
  invariant(progress.nextVerse.display === expected.display, "Progress nextVerse display is inconsistent.");
  invariant(Number(progress.nextVerse.lessonSequence) === expected.lessonSequence, "Progress nextVerse sequence is inconsistent.");
  invariant(expected.lessonSequence === progress.completedSequentialVerses + 1, "Progress nextVerse must immediately follow completion.");
}

function dailyTargets(progress) {
  if (!progress.nextVerse) return [];
  const first = pointerFor(progress.nextVerse.chapter, progress.nextVerse.verse);
  if (first.verse === CHAPTER_COUNTS[first.chapter - 1]) return [first];
  return [first, pointerFor(first.chapter, first.verse + 1)];
}

function targetLabel(targets) {
  if (!targets.length) return "Journey complete";
  return targets.length === 1
    ? `BG ${targets[0].display}`
    : `BG ${targets[0].display}–${targets.at(-1).display}`;
}

function validateCorpus(corpus) {
  invariant(corpus?.schemaVersion === "GITA_SANSKRIT_CORPUS_V1", "The local Sanskrit corpus schema is invalid.");
  invariant(corpus.editionNumbering === "Sivananda-DLS-701-compatible", "The local corpus numbering contract is invalid.");
  invariant(corpus.totalVerses === TOTAL_VERSES, `The local corpus must contain ${TOTAL_VERSES} verses.`);
  invariant(JSON.stringify(corpus.chapterCounts) === JSON.stringify(CHAPTER_COUNTS), "The local corpus chapter counts are inconsistent.");
  invariant(corpus.source?.sourceCommit === CORPUS_SOURCE_COMMIT, "The local corpus source commit is not the pinned commit.");
  invariant(corpus.source?.sourceGitBlobSha1 === CORPUS_SOURCE_BLOB, "The local corpus source blob is not the verified blob.");
  invariant(Array.isArray(corpus.verses) && corpus.verses.length === TOTAL_VERSES, "The local corpus verse array is incomplete.");

  const seen = new Set();
  corpus.verses.forEach((verse, index) => {
    const expectedSequence = sequenceFor(Number(verse.chapter), Number(verse.verse));
    const expectedId = `bg-${String(verse.chapter).padStart(2, "0")}-${String(verse.verse).padStart(3, "0")}`;
    invariant(verse.id === expectedId, `Corpus ID mismatch at row ${index + 1}.`);
    invariant(verse.sequenceNumber === expectedSequence && index + 1 === expectedSequence, `Corpus sequence mismatch at ${expectedId}.`);
    invariant(!seen.has(expectedId), `Duplicate corpus ID ${expectedId}.`);
    seen.add(expectedId);
    invariant(typeof verse.sanskritDevanagari === "string" && /[\u0900-\u097F]/u.test(verse.sanskritDevanagari), `Corpus Sanskrit is missing at ${expectedId}.`);
    invariant(typeof verse.transliteration === "string" && verse.transliteration.trim().length >= 8, `Corpus transliteration is missing at ${expectedId}.`);
  });

  const byId = new Map(corpus.verses.map(verse => [verse.id, verse]));
  invariant(byId.get("bg-01-001")?.sanskritDevanagari.includes("धर्मक्षेत्रे"), "BG 1.1 corpus sentinel failed.");
  invariant(byId.get("bg-13-001")?.sanskritDevanagari.includes("प्रकृतिं पुरुषं"), "BG 13.1 701-numbering corpus sentinel failed.");
  invariant(byId.get("bg-18-078")?.sanskritDevanagari.includes("यत्र योगेश्वरः कृष्णो"), "BG 18.78 corpus sentinel failed.");
  return byId;
}

async function downloadOfficialPdf(destination) {
  const response = await fetch(DLS_PDF_URL, {
    signal: AbortSignal.timeout(90_000),
    headers: { "User-Agent": "Gita-Sadhana-Study-Automation/2.0 (+https://yashumani.github.io/gita-sadhana/)" }
  });
  invariant(response.ok, `Official DLS PDF download failed (${response.status}).`);
  const bytes = Buffer.from(await response.arrayBuffer());
  invariant(bytes.subarray(0, 4).toString() === "%PDF", "The official DLS source is not a valid PDF.");
  await writeFile(destination, bytes);
  return {
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex")
  };
}

async function latestPublishedLessons(manifest) {
  const entries = Array.isArray(manifest.lessonFiles) ? manifest.lessonFiles.slice(-2) : [];
  const lessons = [];
  for (const entry of entries) {
    const relative = typeof entry === "string" ? entry : entry?.path;
    if (!relative) continue;
    const normalized = relative.replace(/^content\//, "");
    const absolute = path.join(SITE_DIR, "content", normalized);
    try {
      lessons.push(await readJson(absolute));
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
  return lessons;
}

async function main() {
  const date = runDate();
  const progress = await readJson(PROGRESS_PATH);
  const manifest = await readJson(MANIFEST_PATH);
  validateProgress(progress);
  const targets = dailyTargets(progress);

  await mkdir(CACHE_DIR, { recursive: true });
  if (!targets.length) {
    await setOutput("journey_complete", "true");
    await setOutput("target_label", "Journey complete");
    await addSummary("## Gita Sadhana source preflight\nThe sequential 701-verse journey is already complete. No lesson was prepared.");
    return;
  }

  const corpusRaw = await readFile(CORPUS_PATH);
  const corpusSha256 = createHash("sha256").update(corpusRaw).digest("hex");
  const corpus = JSON.parse(corpusRaw.toString("utf8"));
  const corpusById = validateCorpus(corpus);

  const pdfPath = path.join(CACHE_DIR, "sivananda-gita.pdf");
  const pdfTextPath = path.join(CACHE_DIR, "sivananda-gita.txt");
  const pdfVerification = await downloadOfficialPdf(pdfPath);
  try {
    execFileSync("pdftotext", ["-layout", pdfPath, pdfTextPath], { stdio: "pipe" });
  } catch (error) {
    throw new Error(`Could not extract the official DLS PDF: ${error.message}`);
  }
  const dlsText = await readFile(pdfTextPath, "utf8");
  invariant(dlsText.length > 20000, "The extracted DLS text is unexpectedly short.");
  invariant(/701\s+Sanskrit\s+verses/i.test(dlsText), "The official DLS extraction did not preserve its 701-verse edition statement.");
  invariant(/Dharmakshetre\s+Kurukshetre/i.test(dlsText), "The official DLS extraction failed its BG 1.1 sentinel.");
  invariant(/Prakritim\s+purusham\s+chaiva/i.test(dlsText), "The official DLS extraction failed its Chapter 13 numbering sentinel.");

  const targetVerses = [];
  const targetSourceFiles = [];
  for (const target of targets) {
    const id = `bg-${String(target.chapter).padStart(2, "0")}-${String(target.verse).padStart(3, "0")}`;
    const verse = corpusById.get(id);
    invariant(verse, `The local corpus is missing ${id}.`);
    const evidence = {
      verseIdentity: target,
      exactSanskrit: verse.sanskritDevanagari,
      exactTransliteration: verse.transliteration,
      source: {
        name: "Pinned 701-verse Sanskrit corpus derived from VedicScriptures data",
        sourcePage: CORPUS_SOURCE_PAGE,
        sourceCommit: CORPUS_SOURCE_COMMIT,
        sourceGitBlobSha1: CORPUS_SOURCE_BLOB,
        localCorpusPath: path.relative(ROOT, CORPUS_PATH)
      },
      primaryEdition: {
        name: "Bhagavad Gita — Sri Swami Sivananda, The Divine Life Society",
        url: DLS_PDF_URL,
        localPdfPath: path.relative(ROOT, pdfPath),
        localExtractedTextPath: path.relative(ROOT, pdfTextPath)
      }
    };
    const fileName = `verse-source-${id}.json`;
    const absolute = path.join(CACHE_DIR, fileName);
    await writeJson(absolute, evidence);
    targetVerses.push({
      ...target,
      id,
      chapterNameSanskrit: CHAPTER_NAMES[target.chapter - 1][0],
      chapterNameEnglish: CHAPTER_NAMES[target.chapter - 1][1],
      sanskritDevanagari: verse.sanskritDevanagari,
      transliteration: verse.transliteration
    });
    targetSourceFiles.push(path.relative(ROOT, absolute));
  }

  const context = {
    runDate: date,
    timeZone: TIME_ZONE,
    editionNumbering: "Sivananda-DLS-701",
    expectedCurrentState: {
      completedSequentialVerses: progress.completedSequentialVerses,
      nextVerse: progress.nextVerse
    },
    targetLabel: targetLabel(targets),
    targets: targetVerses,
    previousPublishedLessons: await latestPublishedLessons(manifest),
    sourceFiles: {
      officialDlsPdf: path.relative(ROOT, pdfPath),
      officialDlsExtractedText: path.relative(ROOT, pdfTextPath),
      localSanskritCorpus: path.relative(ROOT, CORPUS_PATH),
      targetVerseEvidence: targetSourceFiles
    },
    sourceVerification: {
      officialDls: {
        url: DLS_PDF_URL,
        pdfBytes: pdfVerification.bytes,
        pdfSha256: pdfVerification.sha256,
        extractedCharacters: dlsText.length,
        editionStatementFound: true,
        chapter13OpeningFound: true
      },
      sanskritCorpus: {
        sourcePage: CORPUS_SOURCE_PAGE,
        pinnedCommit: CORPUS_SOURCE_COMMIT,
        verifiedUpstreamGitBlobSha1: CORPUS_SOURCE_BLOB,
        localReducedCorpusSha256: corpusSha256,
        totalVerses: corpus.verses.length,
        chapterCounts: corpus.chapterCounts,
        sentinelsVerified: ["1.1", "13.1", "18.78"]
      }
    },
    sourceNoteRequirements: [
      {
        label: "Sri Swami Sivananda / The Divine Life Society edition",
        url: DLS_PDF_URL,
        scope: "Primary reading edition, 701-verse numbering, transliteration, translation, and commentary context."
      },
      {
        label: "Pinned Sanskrit corpus derived from VedicScriptures data",
        url: CORPUS_SOURCE_PAGE,
        scope: "Exact Devanagari and Roman transliteration, including the 35-verse Chapter 13 numbering used in this journey."
      }
    ]
  };

  const manifestPath = path.join(CACHE_DIR, "source-manifest.json");
  await writeJson(manifestPath, context);
  const template = await readFile(TEMPLATE_PATH, "utf8");
  const prompt = `${template.trim()}

## AUTOMATION-SUPPLIED RUN CONTEXT

The following JSON is authoritative for today's date, verse identity, exact Sanskrit, transliteration, continuity, local evidence paths, and source-note URLs:

\`\`\`json
${JSON.stringify(context, null, 2)}
\`\`\`

Before answering, inspect the official DLS extracted text and every target-verse evidence file listed above. Do not rely on memory for Sanskrit, numbering, or source attribution.
`;
  await writeFile(path.join(CACHE_DIR, "teacher-prompt.txt"), `${prompt}\n`, "utf8");

  await setOutput("journey_complete", "false");
  await setOutput("target_label", targetLabel(targets));
  await setOutput("run_date", date);
  await addSummary(`## Gita Sadhana source preflight\nPrepared **${targetLabel(targets)}** from the verified DLS PDF and the immutable local 701-verse Sanskrit corpus. Public progress remains ${progress.completedSequentialVerses}/${TOTAL_VERSES}.`);
}

main().catch(error => {
  console.error(`GITA_SOURCE_PREFLIGHT_ERROR: ${error.stack || error.message || error}`);
  process.exitCode = 1;
});
