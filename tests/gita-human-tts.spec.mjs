import { test, expect } from '@playwright/test';

test.describe('Gita Sadhana natural English voice', () => {
  test('loads the lazy Kokoro controls without downloading the model', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/gita-sadhana/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#natural-voice-status')).toBeVisible();
    await expect(page.locator('#natural-voice-select')).toHaveValue('af_heart');
    await expect(page.locator('.listen-button[data-speak-lang^="en"]').first()).toContainText('natural English');

    const status = await page.evaluate(() => window.gitaHumanTTS?.getStatus());
    expect(status).toMatchObject({
      workerCreated: false,
      modelReady: false,
      voice: 'af_heart',
      active: false,
    });
    expect(errors).toEqual([]);
  });

  test('synthesizes real WAV audio with Kokoro in the browser', async ({ page }) => {
    test.skip(process.env.GITA_TTS_NETWORK_SMOKE !== '1', 'One-time network/model smoke test');
    test.setTimeout(720_000);

    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.goto('/gita-sadhana/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => Boolean(window.gitaHumanTTS), null, { timeout: 30_000 });
    const result = await page.evaluate(() => window.gitaHumanTTS.testSynthesis(
      'The Bhagavad Gita invites us to act with attention, courage, and compassion.',
      { voice: 'af_heart', speed: 0.96, timeoutMs: 660_000 }
    ));

    expect(result.modelId).toBe('onnx-community/Kokoro-82M-v1.0-ONNX');
    expect(result.dtype).toBe('q8');
    expect(result.device).toBe('wasm');
    expect(result.mimeType).toContain('audio');
    expect(result.chunks).toBeGreaterThanOrEqual(1);
    expect(result.durationSeconds).toBeGreaterThan(1);
    expect(result.bytes).toBeGreaterThan(10_000);
    expect(consoleErrors).toEqual([]);
  });
});
