import { ARTICLE, setBadge, setOutput, busy } from './shared.js';

document
  .getElementById('polyfills-backend')
  .addEventListener('change', (event) => {
    const isGemini = event.target.value === 'gemini';
    document.getElementById('polyfills-key-row').style.display = isGemini
      ? ''
      : 'none';
    document.getElementById('polyfills-transformers-note').style.display =
      isGemini ? 'none' : '';
    if (isGemini) {
      delete window.TRANSFORMERS_CONFIG;
    } else {
      delete window.GEMINI_CONFIG;
    }
  });

document
  .getElementById('polyfills-button')
  .addEventListener('click', async () => {
    const button = document.getElementById('polyfills-button');
    const output = document.getElementById('polyfills-output');
    const badge = document.getElementById('polyfills-badge');
    const backend = document.getElementById('polyfills-backend').value;
    const apiKey = document.getElementById('polyfills-api-key').value.trim();

    busy(button, true);
    setOutput(output, '⏳ Loading polyfill…', 'loading');

    if (backend === 'gemini' && !apiKey) {
      setOutput(output, 'Paste a Gemini API key above before running.');
      busy(button, false);
      return;
    }

    try {
      // ── TODO 19: Configure the backend ────────────────────────────────────────
      // Set window.GEMINI_CONFIG or window.TRANSFORMERS_CONFIG *before* importing
      // the polyfill — the polyfill reads these globals at import time.
      //
      // Gemini (cloud) — get a key at https://aistudio.google.com/app/apikey:
      //   window.GEMINI_CONFIG = { apiKey };
      //   // ⚠️ Never commit this key — it carries your full Gemini quota with no
      //   // access controls. The one safe exception: the Firebase AI Logic backend
      //   // with App Check enabled, which validates requests come from your app.
      //
      // Transformers.js (fully in-browser, no API key needed):
      //   window.TRANSFORMERS_CONFIG = { apiKey: 'dummy', device: 'webgpu', dtype: 'q4f16' };
      // ─────────────────────────────────────────────────────────────────────────

      // ── TODO 20: Conditionally load polyfills ─────────────────────────────────
      // Import each polyfill only when the native API is absent.
      // On Chrome with built-in AI both checks will be false — native APIs win.
      //
      // Hint:
      //   const imports = [];
      //   if (!('LanguageModel' in window))
      //     imports.push(import('https://esm.sh/prompt-api-polyfill'));
      //   if (!('Writer' in window))
      //     imports.push(import('https://esm.sh/built-in-ai-task-apis-polyfills/writer'));
      //   await Promise.all(imports);
      // ─────────────────────────────────────────────────────────────────────────

      const status = await Writer.availability();
      setBadge(badge, status);
      setOutput(output, '⏳ Writing…', 'loading');

      // ── TODO 21: Create a Writer and stream the result ────────────────────────
      // The API is identical to step 4 — that's the whole point of a polyfill!
      //
      // Hint:
      //   const writer = await Writer.create({
      //     tone: 'casual',
      //     format: 'plain-text',
      //     length: 'short',
      //     sharedContext: ARTICLE,
      //   });
      //   const stream = writer.writeStreaming(
      //     'Write a short social media post about this travel story.',
      //   );
      //   let full = '';
      //   for await (const chunk of stream) {
      //     full += chunk;
      //     setOutput(output, full);
      //   }
      //   writer.destroy();
      // ─────────────────────────────────────────────────────────────────────────
    } catch (err) {
      setBadge(badge, 'unavailable');
      setOutput(output, `Error: ${err.message}`);
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
