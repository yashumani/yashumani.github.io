import {
  KokoroTTS,
  TextSplitterStream,
} from "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const DEVICE = "wasm";
const DTYPE = "q8";

let tts = null;
let ttsPromise = null;
let activeRequestId = null;
const downloads = new Map();

function post(type, detail = {}) {
  self.postMessage({ type, ...detail });
}

function safeMessage(error) {
  return error instanceof Error ? error.message : String(error || "Unknown TTS error");
}

function reportProgress(info = {}) {
  const file = info.file || info.name || "voice-model";

  if (
    info.status === "progress"
    && Number.isFinite(info.loaded)
    && Number.isFinite(info.total)
    && info.total > 0
  ) {
    downloads.set(file, { loaded: info.loaded, total: info.total });
    const totals = [...downloads.values()].reduce(
      (sum, item) => ({
        loaded: sum.loaded + item.loaded,
        total: sum.total + item.total,
      }),
      { loaded: 0, total: 0 },
    );
    const percent = totals.total > 0
      ? Math.max(0, Math.min(100, (totals.loaded / totals.total) * 100))
      : null;

    post("model-progress", {
      status: info.status,
      file,
      percent,
      loaded: totals.loaded,
      total: totals.total,
    });
    return;
  }

  post("model-progress", {
    status: info.status || "loading",
    file,
    percent: Number.isFinite(info.progress) ? info.progress : null,
  });
}

async function ensureModel() {
  if (tts) return tts;
  if (ttsPromise) return ttsPromise;

  post("model-loading", {
    modelId: MODEL_ID,
    device: DEVICE,
    dtype: DTYPE,
  });

  ttsPromise = KokoroTTS.from_pretrained(MODEL_ID, {
    device: DEVICE,
    dtype: DTYPE,
    progress_callback: reportProgress,
  })
    .then((instance) => {
      tts = instance;
      post("model-ready", {
        modelId: MODEL_ID,
        device: DEVICE,
        dtype: DTYPE,
        voices: Object.keys(instance.voices || {}),
      });
      return instance;
    })
    .catch((error) => {
      ttsPromise = null;
      post("worker-error", {
        scope: "model",
        message: safeMessage(error),
      });
      throw error;
    });

  return ttsPromise;
}

function mergeAudio(chunks) {
  if (!chunks.length) return null;
  if (chunks.length === 1) return chunks[0];

  const sampleRate = chunks[0].sampling_rate;
  const totalSamples = chunks.reduce((sum, chunk) => sum + chunk.audio.length, 0);
  const waveform = new Float32Array(totalSamples);
  let offset = 0;

  for (const chunk of chunks) {
    waveform.set(chunk.audio, offset);
    offset += chunk.audio.length;
  }

  return new chunks[0].constructor(waveform, sampleRate);
}

async function synthesize({ requestId, text, voice, speed }) {
  activeRequestId = requestId;
  const engine = await ensureModel();
  if (activeRequestId !== requestId) return;

  const splitter = new TextSplitterStream();
  splitter.push(text);
  splitter.close();

  const chunks = [];
  let durationSeconds = 0;
  let chunkIndex = 0;

  post("synthesis-started", { requestId, voice, speed });

  for await (const result of engine.stream(splitter, { voice, speed })) {
    if (activeRequestId !== requestId) {
      post("synthesis-canceled", { requestId });
      return;
    }

    const { audio, text: spokenText } = result;
    chunks.push(audio);
    const chunkDuration = audio.audio.length / audio.sampling_rate;
    durationSeconds += chunkDuration;

    post("audio-chunk", {
      requestId,
      chunkIndex,
      text: spokenText,
      durationSeconds: chunkDuration,
      blob: audio.toBlob(),
    });
    chunkIndex += 1;
  }

  if (activeRequestId !== requestId) {
    post("synthesis-canceled", { requestId });
    return;
  }

  const merged = mergeAudio(chunks);
  if (!merged) throw new Error("Kokoro returned no audio chunks.");

  const mergedBlob = merged.toBlob();
  post("synthesis-complete", {
    requestId,
    modelId: MODEL_ID,
    device: DEVICE,
    dtype: DTYPE,
    voice,
    speed,
    chunks: chunkIndex,
    durationSeconds,
    bytes: mergedBlob.size,
    blob: mergedBlob,
  });
  activeRequestId = null;
}

self.addEventListener("message", (event) => {
  const message = event.data || {};

  if (message.type === "init") {
    ensureModel().catch(() => {});
    return;
  }

  if (message.type === "cancel") {
    if (!message.requestId || activeRequestId === message.requestId) {
      activeRequestId = null;
    }
    return;
  }

  if (message.type === "synthesize") {
    synthesize(message).catch((error) => {
      if (activeRequestId === message.requestId) activeRequestId = null;
      post("worker-error", {
        requestId: message.requestId,
        scope: "synthesis",
        message: safeMessage(error),
      });
    });
  }
});

post("worker-online", {
  modelId: MODEL_ID,
  device: DEVICE,
  dtype: DTYPE,
});
