const CHAPTER_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];
const CHAPTER_NAMES = [
  ["Arjuna Viṣāda Yoga", "अर्जुनविषादयोग"],
  ["Sāṅkhya Yoga", "सांख्ययोग"],
  ["Karma Yoga", "कर्मयोग"],
  ["Jñāna Karma Sannyāsa Yoga", "ज्ञानकर्मसंन्यासयोग"],
  ["Karma Sannyāsa Yoga", "कर्मसंन्यासयोग"],
  ["Dhyāna Yoga", "ध्यानयोग"],
  ["Jñāna Vijñāna Yoga", "ज्ञानविज्ञानयोग"],
  ["Akṣara Brahma Yoga", "अक्षरब्रह्मयोग"],
  ["Rāja Vidyā Rāja Guhya Yoga", "राजविद्याराजगुह्ययोग"],
  ["Vibhūti Yoga", "विभूतियोग"],
  ["Viśvarūpa Darśana Yoga", "विश्वरूपदर्शनयोग"],
  ["Bhakti Yoga", "भक्तियोग"],
  ["Kṣetra Kṣetrajña Vibhāga Yoga", "क्षेत्रक्षेत्रज्ञविभागयोग"],
  ["Guṇatraya Vibhāga Yoga", "गुणत्रयविभागयोग"],
  ["Puruṣottama Yoga", "पुरुषोत्तमयोग"],
  ["Daivāsura Sampad Vibhāga Yoga", "दैवासुरसम्पद्विभागयोग"],
  ["Śraddhātraya Vibhāga Yoga", "श्रद्धात्रयविभागयोग"],
  ["Mokṣa Sannyāsa Yoga", "मोक्षसंन्यासयोग"]
];

const FALLBACK_PROGRESS = {
  totalVerses: 701,
  completedSequentialVerses: 0,
  nextVerse: { chapter: 1, verse: 1, display: "1.1", lessonSequence: 1 },
  lastPublishedDate: null,
  lastPublishedLessonId: null,
  exploredVerseIds: ["5.18"],
  updatedAt: "2026-09-03"
};

const state = {
  progress: FALLBACK_PROGRESS,
  manifest: { lessonFiles: [], updatedAt: "2026-09-03" },
  foundation: null,
  lessons: [],
  filteredLessons: [],
  speechUtterance: null,
  speechButton: null,
  toastTimer: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function nl2br(value = "") {
  return escapeHtml(value).replaceAll("\n", "<br>");
}

function normalizeDate(dateString) {
  if (!dateString) return "Not yet published";
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

async function loadJson(path, fallback = null) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.warn(`Could not load ${path}:`, error);
    return fallback;
  }
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderProgress() {
  const progress = state.progress || FALLBACK_PROGRESS;
  const total = Number(progress.totalVerses) || 701;
  const completed = Math.max(0, Math.min(Number(progress.completedSequentialVerses) || 0, total));
  const percentage = total ? (completed / total) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  $("#completed-count").textContent = completed.toLocaleString();
  $("#total-count").textContent = total.toLocaleString();
  $("#progress-percent").textContent = `${percentage.toFixed(percentage > 0 && percentage < 1 ? 1 : 0)}%`;
  $("#top-progress-label").textContent = `${completed} / ${total}`;
  $("#top-progress-fill").style.width = `${percentage}%`;
  $("#ring-value").style.strokeDasharray = `${circumference}`;
  $("#ring-value").style.strokeDashoffset = `${offset}`;
  $("#progress-ring").setAttribute("aria-label", `${percentage.toFixed(1)} percent complete`);

  const nextDisplay = progress.nextVerse?.display || `${progress.nextVerse?.chapter || 1}.${progress.nextVerse?.verse || 1}`;
  $("#next-verse").textContent = nextDisplay;
  $("#progress-message").textContent = completed === 0
    ? `The sequential journey begins at Chapter ${progress.nextVerse?.chapter || 1}, Verse ${progress.nextVerse?.verse || 1}.`
    : `Continue with Bhagavad Gita ${nextDisplay}.`;

  if (progress.lastPublishedLessonId) {
    $("#last-published").textContent = progress.lastPublishedLessonId.replace("bg-", "").replaceAll("-", ".");
    $("#last-published-date").textContent = `Published ${normalizeDate(progress.lastPublishedDate)}.`;
  }

  $("#data-updated").textContent = normalizeDate(progress.updatedAt || state.manifest?.updatedAt);
  renderChapterProgress(completed);
}

function renderChapterProgress(completedTotal) {
  const container = $("#chapter-strip");
  if (!container) return;
  let remaining = completedTotal;
  let activeChapter = 1;
  let completedChapters = 0;

  const html = CHAPTER_COUNTS.map((count, index) => {
    const completed = Math.max(0, Math.min(remaining, count));
    remaining -= completed;
    const percent = (completed / count) * 100;
    const chapterNumber = index + 1;
    if (completed === count) completedChapters += 1;
    if (completed < count && activeChapter === 1 && completedTotal > 0) activeChapter = chapterNumber;
    const statusClass = completed === count ? "is-complete" : completed > 0 ? "is-active" : "";
    return `
      <div class="chapter-pill ${statusClass}" style="--chapter-progress:${percent}%" title="Chapter ${chapterNumber}: ${completed} of ${count} verses">
        <strong>${chapterNumber}</strong>
        <span lang="hi">${escapeHtml(CHAPTER_NAMES[index][1])}</span>
        <small>${completed} / ${count}</small>
      </div>`;
  }).join("");

  container.innerHTML = html;
  const summary = $("#chapter-progress-summary");
  if (completedTotal === 0) {
    summary.textContent = "No sequential chapter has begun yet.";
  } else if (completedChapters === 18) {
    summary.textContent = "All eighteen chapters are complete.";
  } else {
    summary.textContent = `${completedChapters} chapter${completedChapters === 1 ? "" : "s"} complete · currently in Chapter ${activeChapter}.`;
  }
}

function renderChapterFilter() {
  const select = $("#chapter-filter");
  if (!select || select.options.length > 1) return;
  CHAPTER_NAMES.forEach(([english], index) => {
    const option = document.createElement("option");
    option.value = String(index + 1);
    option.textContent = `Chapter ${index + 1} — ${english}`;
    select.append(option);
  });
}

function renderFoundation() {
  const data = state.foundation;
  const container = $("#foundation-content");
  if (!container) return;

  if (!data) {
    container.innerHTML = `<div class="loading-card">The foundation data could not be loaded. Open <code>content/foundation.json</code> in the repository for the preserved text.</div>`;
    return;
  }

  const wordChips = (data.verse.wordByWord || []).map(item =>
    `<span class="word-chip"><b>${escapeHtml(item.term)}</b> · ${escapeHtml(item.meaning)}</span>`
  ).join("");

  const conclusionItems = (data.pujaConclusion.points || []).map(item => `<li>${escapeHtml(item)}</li>`).join("");
  const definitions = (data.brahmanVsBrahmin.definitions || []).map(item => `
    <div class="definition">
      <strong>${escapeHtml(item.term)}</strong>
      <span>${escapeHtml(item.meaning)}</span>
    </div>`).join("");
  const qualities = (data.brahminIdeal.qualities || []).map(item => `<span>${escapeHtml(item)}</span>`).join("");
  const beyondParagraphs = (data.beyondGita.paragraphs || []).map(item => `<p>${escapeHtml(item)}</p>`).join("");

  container.innerHTML = `
    <article class="foundation-verse" id="${escapeHtml(data.verse.id)}" data-searchable="${escapeHtml([data.title, data.verse.reference, data.verse.sanskritDevanagari, data.verse.transliteration, data.verse.spokenHindi, data.verse.clearEnglish].join(" ").toLowerCase())}">
      <header class="foundation-verse-head">
        <div>
          <h3>${escapeHtml(data.verse.reference)} · Equal vision</h3>
          <p>${escapeHtml(data.verse.chapterNameEnglish)}</p>
        </div>
        <span class="status-label status-explored">Explored · not counted</span>
      </header>
      <div class="foundation-verse-body">
        <div class="verse-block">
          <p class="sanskrit" lang="sa">${nl2br(data.verse.sanskritDevanagari)}</p>
          <p class="transliteration">${nl2br(data.verse.transliteration)}</p>
        </div>
        <div class="word-grid" aria-label="Selected Sanskrit terms">${wordChips}</div>
        <div class="listen-row">
          <button class="button button-small button-quiet listen-button" type="button" data-speak-lang="hi-IN" data-speak-source="foundation-hindi">▶ हिंदी में सुनें</button>
          <button class="button button-small button-quiet listen-button" type="button" data-speak-lang="en-US" data-speak-source="foundation-english">▶ Listen in English</button>
          <button class="button button-small button-quiet speech-stop" type="button">■ Stop</button>
          <button class="button button-small button-quiet share-anchor" type="button" data-anchor="${escapeHtml(data.verse.id)}">⌁ Share this verse</button>
        </div>
        <div class="foundation-meaning-grid">
          <article class="meaning-card hindi">
            <h4 lang="hi">बोलचाल की हिंदी</h4>
            <p lang="hi">${escapeHtml(data.verse.spokenHindi)}</p>
          </article>
          <article class="meaning-card">
            <h4>Clear English</h4>
            <p>${escapeHtml(data.verse.clearEnglish)}</p>
          </article>
        </div>
        <p class="insight-callout"><strong>Textual boundary:</strong> ${escapeHtml(data.verse.textualScope)}</p>
      </div>
    </article>

    <article class="conclusion-card">
      <p class="eyebrow">A precise answer</p>
      <h3>${escapeHtml(data.pujaConclusion.title)}</h3>
      <p>${escapeHtml(data.pujaConclusion.lead)}</p>
      <ul class="conclusion-list">${conclusionItems}</ul>
      <blockquote class="maxim">${escapeHtml(data.pujaConclusion.maxim)}</blockquote>
    </article>

    <div class="foundation-grid">
      <article class="foundation-card">
        <h3>${escapeHtml(data.brahmanVsBrahmin.title)}</h3>
        <div class="definition-pair">${definitions}</div>
        <p>${escapeHtml(data.brahmanVsBrahmin.note)}</p>
      </article>
      <article class="foundation-card">
        <span class="status-label status-sequential">${escapeHtml(data.brahminIdeal.reference)}</span>
        <h3>${escapeHtml(data.brahminIdeal.title)}</h3>
        <div class="quality-cloud">${qualities}</div>
        <p>${escapeHtml(data.brahminIdeal.explanation)}</p>
      </article>
    </div>

    <details class="foundation-disclosure">
      <summary>${escapeHtml(data.beyondGita.title)}</summary>
      <div class="foundation-disclosure-body">
        <span class="status-label status-foundation">${escapeHtml(data.beyondGita.scopeLabel)}</span>
        ${beyondParagraphs}
        <p class="insight-callout"><strong>Why this matters:</strong> ${escapeHtml(data.beyondGita.insight)}</p>
      </div>
    </details>`;

  state.speechTexts = {
    ...(state.speechTexts || {}),
    "foundation-hindi": data.verse.spokenHindi,
    "foundation-english": data.verse.clearEnglish
  };
}

function validateLessons(lessons) {
  const seen = new Set();
  const accepted = [];
  let previousSequence = 0;

  for (const lesson of lessons) {
    if (!lesson?.id || seen.has(lesson.id)) {
      console.warn("Skipped duplicate or invalid lesson:", lesson?.id);
      continue;
    }
    seen.add(lesson.id);
    const sequence = Number(lesson.sequenceNumber) || 0;
    if (sequence && sequence < previousSequence) {
      console.warn(`Inconsistent lesson sequence at ${lesson.id}.`);
    }
    previousSequence = Math.max(previousSequence, sequence);
    accepted.push(lesson);
  }
  return accepted.sort((a, b) => (Number(a.sequenceNumber) || 0) - (Number(b.sequenceNumber) || 0));
}

async function loadLessons() {
  const files = Array.isArray(state.manifest?.lessonFiles) ? state.manifest.lessonFiles : [];
  if (!files.length) {
    state.lessons = [];
    state.filteredLessons = [];
    renderLessons();
    return;
  }

  const resolved = await Promise.all(files.map(async entry => {
    const path = typeof entry === "string" ? entry : entry.path;
    if (!path) return null;
    return loadJson(`content/${path.replace(/^content\//, "")}`, null);
  }));

  state.lessons = validateLessons(resolved.filter(Boolean));
  state.filteredLessons = [...state.lessons];
  renderLessons();
}

function getLessonReference(lesson) {
  if (lesson.verseStart === lesson.verseEnd || !lesson.verseEnd) return `${lesson.chapter}.${lesson.verseStart}`;
  return `${lesson.chapter}.${lesson.verseStart}–${lesson.verseEnd}`;
}

function renderPerspectiveList(items = []) {
  if (!items.length) return "<p>No additional perspective was recorded for this lesson.</p>";
  return `<div class="perspective-list">${items.map(item => `
    <div class="perspective">
      <strong>${escapeHtml(item.label || item.tradition || "Perspective")}</strong>
      <span>${escapeHtml(item.explanation || item.text || "")}</span>
    </div>`).join("")}</div>`;
}

function renderApplication(items) {
  const list = Array.isArray(items) ? items : items ? [items] : [];
  if (!list.length) return "<p>No application note was recorded.</p>";
  return `<div class="application-list">${list.map((item, index) => {
    const text = typeof item === "string" ? item : item.text || item.explanation || "";
    const label = typeof item === "string" ? `Practice ${index + 1}` : item.label || `Practice ${index + 1}`;
    return `<div class="application-item"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(text)}</span></div>`;
  }).join("")}</div>`;
}

function renderSourceNotes(notes = []) {
  if (!notes.length) return "<p>Source notes were not supplied.</p>";
  return `<ul class="source-note-list">${notes.map(note => {
    const label = note.label || note.title || note.reference || "Source";
    const detail = note.scope || note.note || "";
    return `<li>${note.url ? `<a href="${escapeHtml(note.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>` : escapeHtml(label)}${detail ? ` — ${escapeHtml(detail)}` : ""}</li>`;
  }).join("")}</ul>`;
}

function renderLessonCard(lesson) {
  const ref = getLessonReference(lesson);
  const bookmarkKey = `gita-bookmark:${lesson.id}`;
  const readKey = `gita-read:${lesson.id}`;
  const isBookmarked = localStorage.getItem(bookmarkKey) === "true";
  const isRead = localStorage.getItem(readKey) === "true";
  const words = (lesson.wordByWord || []).map(item => `<span class="word-chip"><b>${escapeHtml(item.term)}</b> · ${escapeHtml(item.meaning)}</span>`).join("");
  const textBlob = [ref, lesson.theme, lesson.context, lesson.sanskritDevanagari, lesson.transliteration, lesson.spokenHindi, lesson.clearEnglish].join(" ").toLowerCase();

  state.speechTexts = {
    ...(state.speechTexts || {}),
    [`${lesson.id}-hi`]: [lesson.contextHindi || "", lesson.spokenHindi || "", lesson.reflectionQuestionHindi || ""].filter(Boolean).join(" "),
    [`${lesson.id}-en`]: [lesson.context || "", lesson.clearEnglish || "", lesson.reflectionQuestion || ""].filter(Boolean).join(" ")
  };

  return `
    <article class="lesson-card ${isBookmarked ? "is-bookmarked" : ""}" id="${escapeHtml(lesson.id)}" data-chapter="${escapeHtml(lesson.chapter)}" data-searchable="${escapeHtml(textBlob)}">
      <header class="lesson-card-header">
        <div class="lesson-meta">
          <span class="status-label status-sequential">Sequential ${escapeHtml(lesson.sequenceNumber || "")}</span>
          <span class="status-label status-next">Gita ${escapeHtml(ref)}</span>
          <time datetime="${escapeHtml(lesson.date || "")}">${escapeHtml(normalizeDate(lesson.date))}</time>
        </div>
        <h3>${escapeHtml(lesson.theme || `Bhagavad Gita ${ref}`)}</h3>
        <p class="lesson-context">${escapeHtml(lesson.context || "")}</p>
        <div class="lesson-actions">
          <button class="button button-small button-quiet listen-button" type="button" data-speak-lang="hi-IN" data-speak-source="${escapeHtml(`${lesson.id}-hi`)}">▶ हिंदी में सुनें</button>
          <button class="button button-small button-quiet listen-button" type="button" data-speak-lang="en-US" data-speak-source="${escapeHtml(`${lesson.id}-en`)}">▶ Listen in English</button>
          <button class="button button-small button-quiet speech-stop" type="button">■ Stop</button>
          <button class="button button-small button-quiet bookmark-button ${isBookmarked ? "is-active" : ""}" type="button" data-lesson-id="${escapeHtml(lesson.id)}" aria-pressed="${isBookmarked}">${isBookmarked ? "◆ Bookmarked" : "◇ Bookmark"}</button>
          <button class="button button-small button-quiet read-button ${isRead ? "is-active" : ""}" type="button" data-lesson-id="${escapeHtml(lesson.id)}" aria-pressed="${isRead}">${isRead ? "✓ Heard" : "○ Mark heard"}</button>
          <button class="button button-small button-quiet share-anchor" type="button" data-anchor="${escapeHtml(lesson.id)}">⌁ Share</button>
          <button class="button button-small button-quiet print-lesson" type="button" data-lesson-id="${escapeHtml(lesson.id)}">Print</button>
        </div>
      </header>
      <div class="lesson-body">
        <div class="verse-block">
          <p class="sanskrit" lang="sa">${nl2br(lesson.sanskritDevanagari || "")}</p>
          <p class="transliteration">${nl2br(lesson.transliteration || "")}</p>
        </div>
        <div class="word-grid">${words}</div>
        <div class="lesson-details">
          <details open>
            <summary>बोलचाल की हिंदी</summary>
            <div class="detail-content hindi" lang="hi"><p>${escapeHtml(lesson.spokenHindi || "")}</p></div>
          </details>
          <details>
            <summary>Clear English</summary>
            <div class="detail-content"><p>${escapeHtml(lesson.clearEnglish || "")}</p></div>
          </details>
          <details>
            <summary>Interpretive perspectives</summary>
            <div class="detail-content">${renderPerspectiveList(lesson.interpretationPerspectives)}</div>
          </details>
          <details>
            <summary>Practical application</summary>
            <div class="detail-content">${renderApplication(lesson.practicalApplication)}</div>
          </details>
          <details>
            <summary>Source notes</summary>
            <div class="detail-content">${renderSourceNotes(lesson.sourceNotes)}</div>
          </details>
        </div>
        <div class="reflection-card">
          <span>Today’s reflection</span>
          <p>${escapeHtml(lesson.reflectionQuestion || "What is this verse asking you to notice in your life today?")}</p>
        </div>
      </div>
    </article>`;
}

function renderLessons() {
  const container = $("#lesson-list");
  const status = $("#lesson-status");
  if (!container) return;

  const lessons = state.filteredLessons;
  if (!state.lessons.length) {
    status.textContent = "0 sequential lessons published · next is Bhagavad Gita 1.1";
    return;
  }

  if (!lessons.length) {
    container.innerHTML = `<div class="lesson-empty">No published lesson matches this search. The foundation module remains available below.</div>`;
    status.textContent = `0 of ${state.lessons.length} published lessons shown`;
    return;
  }

  container.innerHTML = lessons.map(renderLessonCard).join("");
  status.textContent = `${lessons.length} of ${state.lessons.length} published lesson${state.lessons.length === 1 ? "" : "s"} shown`;
  appendTimelineLessons();
  revealHashTarget();
}

function appendTimelineLessons() {
  const timeline = $("#journey-timeline");
  if (!timeline || !state.lessons.length) return;
  $$(".timeline-item[data-dynamic='true']", timeline).forEach(item => item.remove());
  const nextItem = $(".timeline-item.is-next", timeline);

  state.lessons.forEach(lesson => {
    const article = document.createElement("article");
    article.className = "timeline-item is-complete";
    article.dataset.dynamic = "true";
    article.innerHTML = `
      <div class="timeline-marker" aria-hidden="true">✓</div>
      <div>
        <time datetime="${escapeHtml(lesson.date || "")}">${escapeHtml(normalizeDate(lesson.date))}</time>
        <h3><a href="#${escapeHtml(lesson.id)}">Bhagavad Gita ${escapeHtml(getLessonReference(lesson))} · ${escapeHtml(lesson.theme || "Daily lesson")}</a></h3>
        <p>${escapeHtml(lesson.context || "")}</p>
      </div>`;
    timeline.insertBefore(article, nextItem);
  });
}

function applyFilters() {
  const query = ($("#lesson-search")?.value || "").trim().toLowerCase();
  const chapter = $("#chapter-filter")?.value || "all";
  state.filteredLessons = state.lessons.filter(lesson => {
    const ref = getLessonReference(lesson);
    const haystack = [ref, lesson.theme, lesson.context, lesson.sanskritDevanagari, lesson.transliteration, lesson.spokenHindi, lesson.clearEnglish].join(" ").toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesChapter = chapter === "all" || String(lesson.chapter) === chapter;
    return matchesQuery && matchesChapter;
  });
  renderLessons();
}

function chooseVoice(lang) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const prefix = lang.toLowerCase().split("-")[0];
  return voices.find(voice => voice.lang.toLowerCase() === lang.toLowerCase())
    || voices.find(voice => voice.lang.toLowerCase().startsWith(prefix))
    || null;
}

function stopSpeech(announce = false) {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (state.speechButton) {
    state.speechButton.classList.remove("is-speaking");
    state.speechButton.textContent = state.speechButton.dataset.originalText || state.speechButton.textContent;
  }
  state.speechUtterance = null;
  state.speechButton = null;
  if (announce) showToast("Listening stopped.");
}

function speakText(text, lang, button) {
  if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
    showToast("Read-aloud is not available in this browser.");
    return;
  }
  if (!text?.trim()) {
    showToast("No listening text is available for this section yet.");
    return;
  }

  if (state.speechButton === button && window.speechSynthesis.speaking) {
    stopSpeech(true);
    return;
  }

  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  const voice = chooseVoice(lang);
  if (voice) utterance.voice = voice;
  utterance.rate = lang.startsWith("hi") ? 0.9 : 0.94;
  utterance.pitch = 1;

  button.dataset.originalText ||= button.textContent;
  button.textContent = "■ Stop listening";
  button.classList.add("is-speaking");
  state.speechButton = button;
  state.speechUtterance = utterance;

  utterance.onend = () => stopSpeech();
  utterance.onerror = event => {
    stopSpeech();
    if (event.error !== "canceled") showToast("This device could not start the selected voice.");
  };

  window.speechSynthesis.speak(utterance);
  if (!voice) showToast(`Using the device’s default ${lang.startsWith("hi") ? "Hindi" : "English"} voice.`);
}

async function shareAnchor(anchor) {
  const url = new URL(window.location.href);
  url.hash = anchor;
  const title = anchor === "bg-05-018" ? "Bhagavad Gita 5.18 — Equal Vision" : "Gita Sadhana lesson";
  try {
    if (navigator.share) {
      await navigator.share({ title, url: url.href });
      return;
    }
    await navigator.clipboard.writeText(url.href);
    showToast("Verse link copied.");
  } catch (error) {
    if (error?.name !== "AbortError") showToast("Could not copy the link on this device.");
  }
}

function revealHashTarget() {
  if (!window.location.hash) return;
  const target = document.getElementById(window.location.hash.slice(1));
  if (!target) return;
  target.querySelectorAll("details").forEach(detail => { detail.open = true; });
  setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
}

function setupInteractions() {
  renderChapterFilter();

  $("#lesson-search")?.addEventListener("input", applyFilters);
  $("#chapter-filter")?.addEventListener("change", applyFilters);
  $("#expand-all")?.addEventListener("click", () => {
    $$("#lesson-list details, #foundation-content details").forEach(detail => { detail.open = true; });
    showToast("All meaning sections expanded.");
  });
  $("#collapse-all")?.addEventListener("click", () => {
    $$("#lesson-list details, #foundation-content details").forEach(detail => { detail.open = false; });
    showToast("All meaning sections collapsed.");
  });

  document.addEventListener("click", event => {
    const listenButton = event.target.closest(".listen-button");
    if (listenButton) {
      const text = state.speechTexts?.[listenButton.dataset.speakSource] || "";
      speakText(text, listenButton.dataset.speakLang || "en-US", listenButton);
      return;
    }

    if (event.target.closest(".speech-stop")) {
      stopSpeech(true);
      return;
    }

    const shareButton = event.target.closest(".share-anchor");
    if (shareButton) {
      shareAnchor(shareButton.dataset.anchor);
      return;
    }

    const bookmarkButton = event.target.closest(".bookmark-button");
    if (bookmarkButton) {
      const id = bookmarkButton.dataset.lessonId;
      const key = `gita-bookmark:${id}`;
      const next = localStorage.getItem(key) !== "true";
      localStorage.setItem(key, String(next));
      bookmarkButton.classList.toggle("is-active", next);
      bookmarkButton.setAttribute("aria-pressed", String(next));
      bookmarkButton.textContent = next ? "◆ Bookmarked" : "◇ Bookmark";
      document.getElementById(id)?.classList.toggle("is-bookmarked", next);
      showToast(next ? "Lesson bookmarked on this device." : "Bookmark removed.");
      return;
    }

    const readButton = event.target.closest(".read-button");
    if (readButton) {
      const id = readButton.dataset.lessonId;
      const key = `gita-read:${id}`;
      const next = localStorage.getItem(key) !== "true";
      localStorage.setItem(key, String(next));
      readButton.classList.toggle("is-active", next);
      readButton.setAttribute("aria-pressed", String(next));
      readButton.textContent = next ? "✓ Heard" : "○ Mark heard";
      showToast(next ? "Marked as heard on this device." : "Heard mark removed.");
      return;
    }

    const printButton = event.target.closest(".print-lesson");
    if (printButton) {
      const lesson = document.getElementById(printButton.dataset.lessonId);
      if (!lesson) return;
      document.body.classList.add("printing-one");
      lesson.classList.add("print-target");
      const cleanupPrint = () => {
        document.body.classList.remove("printing-one");
        lesson.classList.remove("print-target");
        window.removeEventListener("afterprint", cleanupPrint);
      };
      window.addEventListener("afterprint", cleanupPrint);
      window.print();
      setTimeout(cleanupPrint, 1500);
    }
  });

  window.addEventListener("beforeunload", () => stopSpeech());
  window.addEventListener("hashchange", revealHashTarget);
  window.speechSynthesis?.addEventListener?.("voiceschanged", () => window.speechSynthesis.getVoices());
}

function setupScrollSpy() {
  const topbar = $("#topbar");
  window.addEventListener("scroll", () => topbar?.classList.toggle("is-scrolled", window.scrollY > 12), { passive: true });

  const sections = $$(".section-anchor");
  const navLinks = $$(".desktop-nav a, .mobile-dock a");
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-24% 0px -62%", threshold: [0.08, 0.25, 0.5] });

  sections.forEach(section => observer.observe(section));
}

async function init() {
  const [progress, manifest, foundation] = await Promise.all([
    loadJson("gita-progress.json", FALLBACK_PROGRESS),
    loadJson("content/manifest.json", { lessonFiles: [], updatedAt: FALLBACK_PROGRESS.updatedAt }),
    loadJson("content/foundation.json", null)
  ]);

  state.progress = progress || FALLBACK_PROGRESS;
  state.manifest = manifest || { lessonFiles: [] };
  state.foundation = foundation;
  state.speechTexts = {};

  renderProgress();
  renderFoundation();
  setupInteractions();
  setupScrollSpy();
  await loadLessons();
  revealHashTarget();
}

init().catch(error => {
  console.error("Gita Sadhana failed to initialize:", error);
  showToast("The journey data could not be fully loaded. Please refresh once.");
});
