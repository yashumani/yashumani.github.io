const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const MODEL_LABEL = "Kokoro 82M";
const MODEL_DOWNLOAD_NOTE = "about 90 MB on first use";
const CACHE_NAME = "gita-sadhana-natural-voice-v1";
const VOICE_STORAGE_KEY = "gita-natural-voice";
const SPEED_STORAGE_KEY = "gita-natural-speed";
const DEFAULT_VOICE = "af_heart";
const DEFAULT_SPEED = 0.96;
const NATURAL_BUTTON_LABEL = "✦ Listen in natural English";

const VOICES = [
  { id: "af_heart", label: "Heart — warm American" },
  { id: "af_bella", label: "Bella — expressive American" },
  { id: "af_sarah", label: "Sarah — clear American" },
  { id: "am_michael", label: "Michael — calm American male" },
  { id: "bf_emma", label: "Emma — warm British" },
  { id: "bm_george", label: "George — British male" },
];

const state = {
  worker: null,
  workerMetadata: null,
  modelReady: false,
  preloadPromise: null,
  preloadResolve: null,
  preloadReject: null,
  requestCounter: 0,
  activeRequestId: null,
  activeButton: null,
  activeText: "",
  activeCacheKey: null,
  generationComplete: false,
  pendingDecodes: 0,
  audioContext: null,
  nextStartTime: 0,
  sources: new Set(),
  fallbackUtterance: null,
  testResolvers: new Map(),
  statusElement: null,
  panel: null,
  toastTimer: null,
  lastWorkerError: null,
};

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable in strict privacy modes; the feature still works.
  }
}

function currentVoice() {
  const selected = readStored(VOICE_STORAGE_KEY, DEFAULT_VOICE);
  return VOICES.some((voice) => voice.id === selected) ? selected : DEFAULT_VOICE;
}

function currentSpeed() {
  const value = Number.parseFloat(readStored(SPEED_STORAGE_KEY, String(DEFAULT_SPEED)));
  return Number.isFinite(value) && value >= 0.8 && value <= 1.15 ? value : DEFAULT_SPEED;
}

function nextRequestId(prefix = "listen") {
  state.requestCounter += 1;
  return `${prefix}-${Date.now()}-${state.requestCounter}`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function setStatus(message, status = "idle") {
  if (!state.statusElement) return;
  state.statusElement.textContent = message;
  state.statusElement.dataset.status = status;
}

function setButtonState(button, label, busy = false) {
  if (!button) return;
  button.textContent = label;
  button.classList.toggle("is-speaking", busy);
  button.classList.toggle("is-loading-voice", busy && !state.modelReady);
  button.setAttribute("aria-busy", String(busy));
}

function resetButton(button) {
  if (!button) return;
  setButtonState(button, button.dataset.humanVoiceLabel || NATURAL_BUTTON_LABEL, false);
}

function primeAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!state.audioContext || state.audioContext.state === "closed") {
    state.audioContext = new AudioContextClass({ latencyHint: "interactive" });
  }

  if (state.audioContext.state === "suspended") {
    state.audioContext.resume().catch(() => {});
  }
  return state.audioContext;
}

function clearScheduledAudio() {
  for (const source of state.sources) {
    try {
      source.stop();
    } catch {
      // A source may already have ended.
    }
  }
  state.sources.clear();
  state.nextStartTime = 0;
  state.pendingDecodes = 0;
}

function finishActiveListening(message = "Natural English voice ready.") {
  const button = state.activeButton;
  state.activeRequestId = null;
  state.activeButton = null;
  state.activeText = "";
  state.activeCacheKey = null;
  state.generationComplete = false;
  state.nextStartTime = 0;
  resetButton(button);
  setStatus(message, "ready");
}

function maybeFinishPlayback() {
  if (
    state.activeRequestId
    && state.generationComplete
    && state.pendingDecodes === 0
    && state.sources.size === 0
  ) {
    finishActiveListening();
  }
}

function stopNaturalSpeech({ announce = false, notifyWorker = true } = {}) {
  const requestId = state.activeRequestId;
  if (notifyWorker && requestId && state.worker) {
    state.worker.postMessage({ type: "cancel", requestId });
  }

  if (state.fallbackUtterance && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  state.fallbackUtterance = null;
  clearScheduledAudio();

  const button = state.activeButton;
  state.activeRequestId = null;
  state.activeButton = null;
  state.activeText = "";
  state.activeCacheKey = null;
  state.generationComplete = false;
  resetButton(button);

  if (announce) {
    setStatus("Listening stopped. Natural voice remains ready.", state.modelReady ? "ready" : "idle");
    showToast("Listening stopped.");
  }
}

function bestDeviceVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const english = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("en"));
  const naturalWords = /natural|neural|google|samantha|aria|jenny|ava|guy|ryan/i;
  return english.find((voice) => naturalWords.test(`${voice.name} ${voice.voiceURI}`))
    || english.find((voice) => voice.lang.toLowerCase() === "en-us")
    || english[0]
    || null;
}

function useDeviceFallback(text, button, reason) {
  stopNaturalSpeech({ notifyWorker: false });

  if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
    setStatus("Natural voice could not load, and this browser has no speech fallback.", "error");
    showToast("English audio is not available in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.94;
  utterance.pitch = 1;
  const voice = bestDeviceVoice();
  if (voice) utterance.voice = voice;

  const requestId = nextRequestId("fallback");
  state.activeRequestId = requestId;
  state.activeButton = button;
  state.activeText = text;
  state.fallbackUtterance = utterance;
  setButtonState(button, "■ Stop device voice", true);
  setStatus(`Neural voice unavailable; using ${voice?.name || "the device voice"}.`, "fallback");

  utterance.onend = () => {
    state.fallbackUtterance = null;
    finishActiveListening("Natural voice will retry on the next play.");
  };
  utterance.onerror = () => {
    state.fallbackUtterance = null;
    finishActiveListening("This device could not play the English narration.");
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  console.warn("Kokoro fallback:", reason);
}

function workerErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error || "Unknown natural voice error");
}

function ensureWorker() {
  if (state.worker) return state.worker;

  try {
    const worker = new Worker(new URL("./human-tts-worker.js", import.meta.url), {
      type: "module",
      name: "gita-natural-english",
    });
    worker.addEventListener("message", handleWorkerMessage);
    worker.addEventListener("error", (event) => {
      handleWorkerFailure(new Error(event.message || "The natural voice worker stopped unexpectedly."));
    });
    state.worker = worker;
    return worker;
  } catch (error) {
    handleWorkerFailure(error);
    throw error;
  }
}

function modelReadyPromise() {
  if (state.modelReady) return Promise.resolve(state.workerMetadata);
  if (state.preloadPromise) return state.preloadPromise;

  state.preloadPromise = new Promise((resolve, reject) => {
    state.preloadResolve = resolve;
    state.preloadReject = reject;
  });
  return state.preloadPromise;
}

function preloadNaturalVoice() {
  setStatus(`Preparing ${MODEL_LABEL} (${MODEL_DOWNLOAD_NOTE})…`, "loading");
  const worker = ensureWorker();
  const ready = modelReadyPromise();
  worker.postMessage({ type: "init" });
  return ready;
}

function handleWorkerFailure(error, requestId = null) {
  const message = workerErrorMessage(error);
  state.lastWorkerError = message;

  if (state.preloadReject) state.preloadReject(new Error(message));
  state.preloadPromise = null;
  state.preloadResolve = null;
  state.preloadReject = null;

  if (requestId && state.testResolvers.has(requestId)) {
    const resolver = state.testResolvers.get(requestId);
    clearTimeout(resolver.timeout);
    resolver.reject(new Error(message));
    state.testResolvers.delete(requestId);
    return;
  }

  if (state.activeRequestId && (!requestId || requestId === state.activeRequestId)) {
    const text = state.activeText;
    const button = state.activeButton;
    useDeviceFallback(text, button, message);
    return;
  }

  setStatus("Natural English voice could not initialize. Device voice remains available.", "error");
}

async function digestKey(value) {
  if (crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

async function cacheRequestFor(text, voice, speed) {
  const key = await digestKey(`${MODEL_ID}|${voice}|${speed}|${text}`);
  return new Request(new URL(`__natural-voice-cache__/${key}.wav`, document.baseURI).href);
}

async function readCachedAudio(request) {
  if (!("caches" in window)) return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(request);
    return response?.ok ? response.blob() : null;
  } catch {
    return null;
  }
}

async function storeCachedAudio(request, blob) {
  if (!("caches" in window) || !request || !blob?.size) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, new Response(blob, {
      headers: {
        "Content-Type": "audio/wav",
        "X-Gita-Voice-Model": MODEL_ID,
      },
    }));
  } catch {
    // Cache failure should never prevent listening.
  }
}

async function scheduleAudioBlob(blob, requestId) {
  const context = primeAudioContext();
  if (!context) throw new Error("Web Audio is unavailable in this browser.");

  state.pendingDecodes += 1;
  try {
    const bytes = await blob.arrayBuffer();
    const buffer = await context.decodeAudioData(bytes.slice(0));
    if (state.activeRequestId !== requestId) return;

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    const startAt = Math.max(context.currentTime + 0.035, state.nextStartTime || 0);
    state.nextStartTime = startAt + buffer.duration;
    state.sources.add(source);

    source.onended = () => {
      state.sources.delete(source);
      maybeFinishPlayback();
    };
    source.start(startAt);
  } finally {
    state.pendingDecodes = Math.max(0, state.pendingDecodes - 1);
    maybeFinishPlayback();
  }
}

function handleWorkerMessage(event) {
  const message = event.data || {};

  switch (message.type) {
    case "worker-online":
      state.workerMetadata = message;
      break;

    case "model-loading":
      setStatus(`Downloading ${MODEL_LABEL} ${MODEL_DOWNLOAD_NOTE}; it stays cached afterward…`, "loading");
      break;

    case "model-progress": {
      const percent = Number.isFinite(message.percent) ? Math.round(message.percent) : null;
      const suffix = percent === null ? "" : ` ${percent}%`;
      setStatus(`Preparing natural English voice${suffix}…`, "loading");
      if (state.activeButton && !state.modelReady) {
        setButtonState(state.activeButton, `◌ Loading natural voice${suffix}`, true);
      }
      break;
    }

    case "model-ready":
      state.modelReady = true;
      state.workerMetadata = message;
      state.lastWorkerError = null;
      setStatus("Natural English voice is ready and runs locally in this browser.", "ready");
      if (state.preloadResolve) state.preloadResolve(message);
      state.preloadResolve = null;
      state.preloadReject = null;
      break;

    case "synthesis-started":
      if (message.requestId === state.activeRequestId) {
        setButtonState(state.activeButton, "■ Stop natural voice", true);
        setStatus("Generating and playing the natural English narration…", "speaking");
      }
      break;

    case "audio-chunk":
      if (message.requestId === state.activeRequestId) {
        scheduleAudioBlob(message.blob, message.requestId).catch((error) => {
          handleWorkerFailure(error, message.requestId);
        });
      }
      break;

    case "synthesis-complete": {
      const resolver = state.testResolvers.get(message.requestId);
      if (resolver) {
        clearTimeout(resolver.timeout);
        resolver.resolve({
          modelId: message.modelId,
          device: message.device,
          dtype: message.dtype,
          voice: message.voice,
          speed: message.speed,
          chunks: message.chunks,
          durationSeconds: message.durationSeconds,
          bytes: message.bytes,
          mimeType: message.blob?.type || "audio/wav",
        });
        state.testResolvers.delete(message.requestId);
        break;
      }

      if (message.requestId !== state.activeRequestId) break;
      state.generationComplete = true;
      storeCachedAudio(state.activeCacheKey, message.blob);
      maybeFinishPlayback();
      break;
    }

    case "worker-error":
      handleWorkerFailure(new Error(message.message), message.requestId || null);
      break;

    default:
      break;
  }
}

function normalizeSpeechText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\bBG\s+(\d+)\.(\d+)\b/g, "Bhagavad Gita chapter $1, verse $2")
    .trim();
}

function detailsText(card, heading) {
  const detail = [...card.querySelectorAll("details")].find((item) =>
    item.querySelector("summary")?.textContent.trim().toLowerCase() === heading.toLowerCase(),
  );
  return detail?.querySelector(".detail-content")?.textContent || "";
}

function englishTextFor(button) {
  const lesson = button.closest(".lesson-card");
  if (lesson) {
    return normalizeSpeechText([
      lesson.querySelector("h3")?.textContent,
      lesson.querySelector(".lesson-context")?.textContent,
      detailsText(lesson, "Clear English"),
      lesson.querySelector(".reflection-card p")?.textContent
        ? `Reflection. ${lesson.querySelector(".reflection-card p").textContent}`
        : "",
    ].filter(Boolean).join(". "));
  }

  const foundation = button.closest(".foundation-verse");
  if (foundation) {
    return normalizeSpeechText([
      foundation.querySelector("h3")?.textContent,
      foundation.querySelector(".meaning-card:not(.hindi) p")?.textContent,
      foundation.querySelector(".insight-callout")?.textContent,
    ].filter(Boolean).join(". "));
  }

  return "";
}

async function startNaturalEnglish(text, button) {
  if (!text) {
    showToast("No English listening text is available for this lesson.");
    return;
  }

  if (state.activeButton === button && state.activeRequestId) {
    stopNaturalSpeech({ announce: true });
    return;
  }

  stopNaturalSpeech();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  primeAudioContext();

  const requestId = nextRequestId();
  const voice = currentVoice();
  const speed = currentSpeed();
  const cacheRequest = await cacheRequestFor(text, voice, speed);

  state.activeRequestId = requestId;
  state.activeButton = button;
  state.activeText = text;
  state.activeCacheKey = cacheRequest;
  state.generationComplete = false;
  state.nextStartTime = 0;
  setButtonState(button, "◌ Preparing natural voice…", true);
  setStatus("Checking the local narration cache…", "loading");

  const cached = await readCachedAudio(cacheRequest);
  if (state.activeRequestId !== requestId) return;

  if (cached) {
    state.generationComplete = true;
    setButtonState(button, "■ Stop natural voice", true);
    setStatus("Playing the cached natural English narration.", "speaking");
    scheduleAudioBlob(cached, requestId).catch((error) => {
      handleWorkerFailure(error, requestId);
    });
    return;
  }

  try {
    const worker = ensureWorker();
    modelReadyPromise();
    worker.postMessage({
      type: "synthesize",
      requestId,
      text,
      voice,
      speed,
    });
  } catch (error) {
    useDeviceFallback(text, button, error);
  }
}

function upgradeEnglishButtons(root = document) {
  const buttons = root.querySelectorAll?.('.listen-button[data-speak-lang^="en"]') || [];
  for (const button of buttons) {
    button.dataset.humanVoiceLabel = NATURAL_BUTTON_LABEL;
    button.dataset.humanVoice = "kokoro";
    button.title = "Natural neural English voice. The first use downloads the model once; later playback is cached.";
    if (button !== state.activeButton && !button.classList.contains("is-speaking")) {
      button.textContent = NATURAL_BUTTON_LABEL;
      button.setAttribute("aria-busy", "false");
    }
  }
}

function buildVoicePanel() {
  if (state.panel || !document.querySelector("#lesson-controls")) return;

  const panel = document.createElement("aside");
  panel.className = "natural-voice-panel";
  panel.setAttribute("aria-labelledby", "natural-voice-title");
  panel.innerHTML = `
    <div class="natural-voice-copy">
      <span class="natural-voice-icon" aria-hidden="true">◉</span>
      <div>
        <strong id="natural-voice-title">Human-like English listening</strong>
        <p>Powered by ${MODEL_LABEL}, running privately on your device. First use downloads ${MODEL_DOWNLOAD_NOTE}; the model and generated lesson audio are then cached in this browser.</p>
        <p class="natural-voice-disclosure">This is an open neural voice, not the proprietary ChatGPT voice. It should sound substantially more natural than the previous browser text-to-speech.</p>
      </div>
    </div>
    <div class="natural-voice-settings">
      <label>
        <span>Voice</span>
        <select id="natural-voice-select" aria-label="Natural English voice">
          ${VOICES.map((voice) => `<option value="${voice.id}">${voice.label}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Pace</span>
        <select id="natural-speed-select" aria-label="Natural English speaking pace">
          <option value="0.88">Reflective</option>
          <option value="0.96">Calm</option>
          <option value="1">Normal</option>
          <option value="1.08">Brisk</option>
        </select>
      </label>
      <button class="button button-small button-quiet natural-voice-prepare" id="natural-voice-prepare" type="button">Prepare voice</button>
    </div>
    <div class="natural-voice-status" id="natural-voice-status" role="status" aria-live="polite" data-status="idle">Natural voice loads only when you ask for it.</div>
    <a class="natural-voice-source" href="https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX" target="_blank" rel="noopener noreferrer">Model and voice samples</a>
  `;

  document.querySelector("#lesson-controls").insertAdjacentElement("afterend", panel);
  state.panel = panel;
  state.statusElement = panel.querySelector("#natural-voice-status");

  const voiceSelect = panel.querySelector("#natural-voice-select");
  const speedSelect = panel.querySelector("#natural-speed-select");
  voiceSelect.value = currentVoice();
  speedSelect.value = String(currentSpeed());

  voiceSelect.addEventListener("change", () => {
    writeStored(VOICE_STORAGE_KEY, voiceSelect.value);
    if (state.activeRequestId) stopNaturalSpeech({ announce: true });
    setStatus(`${voiceSelect.selectedOptions[0].textContent} selected.`, state.modelReady ? "ready" : "idle");
  });

  speedSelect.addEventListener("change", () => {
    writeStored(SPEED_STORAGE_KEY, speedSelect.value);
    if (state.activeRequestId) stopNaturalSpeech({ announce: true });
    setStatus(`${speedSelect.selectedOptions[0].textContent} pace selected.`, state.modelReady ? "ready" : "idle");
  });

  panel.querySelector("#natural-voice-prepare").addEventListener("click", () => {
    preloadNaturalVoice()
      .then(() => showToast("Natural English voice is ready."))
      .catch(() => showToast("Natural voice could not load; the device voice will be used."));
  });
}

function installInteractions() {
  document.addEventListener("click", (event) => {
    const listenButton = event.target.closest(".listen-button");
    if (listenButton) {
      const language = listenButton.dataset.speakLang || "";
      if (language.toLowerCase().startsWith("en")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        primeAudioContext();
        startNaturalEnglish(englishTextFor(listenButton), listenButton);
        return;
      }

      if (state.activeRequestId) stopNaturalSpeech();
      return;
    }

    const stopButton = event.target.closest(".speech-stop");
    if (stopButton && state.activeRequestId) {
      event.preventDefault();
      event.stopImmediatePropagation();
      stopNaturalSpeech({ announce: true });
    }
  }, true);

  window.addEventListener("beforeunload", () => stopNaturalSpeech());

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) upgradeEnglishButtons(node);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function testSynthesis(text = "The Bhagavad Gita invites us to examine action, attention, and compassion.", options = {}) {
  const worker = ensureWorker();
  const requestId = nextRequestId("smoke-test");
  const voice = options.voice || DEFAULT_VOICE;
  const speed = Number.isFinite(options.speed) ? options.speed : DEFAULT_SPEED;
  const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : 420_000;

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      state.testResolvers.delete(requestId);
      worker.postMessage({ type: "cancel", requestId });
      reject(new Error(`Kokoro synthesis did not finish within ${timeoutMs} ms.`));
    }, timeoutMs);

    state.testResolvers.set(requestId, { resolve, reject, timeout });
    worker.postMessage({
      type: "synthesize",
      requestId,
      text: normalizeSpeechText(text),
      voice,
      speed,
    });
  });
}

buildVoicePanel();
upgradeEnglishButtons();
installInteractions();

window.gitaHumanTTS = Object.freeze({
  version: "1.0.0",
  modelId: MODEL_ID,
  preload: preloadNaturalVoice,
  stop: () => stopNaturalSpeech({ announce: true }),
  testSynthesis,
  getStatus: () => ({
    workerCreated: Boolean(state.worker),
    modelReady: state.modelReady,
    active: Boolean(state.activeRequestId),
    model: state.workerMetadata,
    lastError: state.lastWorkerError,
    voice: currentVoice(),
    speed: currentSpeed(),
  }),
});
