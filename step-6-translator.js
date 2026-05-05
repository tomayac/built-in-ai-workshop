import { ARTICLE, setBadge, setOutput, busy } from './shared.js';

// ── TODO 16: Check availability ───────────────────────────────────────────────
// Call Translator.availability() with the source→target language pair.
//
// Hint: Translator.availability({ sourceLanguage: 'en', targetLanguage: target })
// ─────────────────────────────────────────────────────────────────────────────
async function checkAvailability(target) {
  const badge = document.getElementById('translator-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
}

checkAvailability('es');

document
  .getElementById('translator-target')
  .addEventListener('change', (event) => {
    checkAvailability(event.target.value);
  });

document
  .getElementById('translator-button')
  .addEventListener('click', async () => {
    const button = document.getElementById('translator-button');
    const output = document.getElementById('translator-output');
    const downloadProgress = document.getElementById('translator-progress');
    const target = document.getElementById('translator-target').value;

    busy(button, true);
    setOutput(output, '⏳ Translating…', 'loading');

    try {
      // ── TODO 17: Create a Translator ────────────────────────────────────────
      // Hint: const translator = await Translator.create({
      //   sourceLanguage: 'en',
      //   targetLanguage: target,
      //   monitor(m) {
      //     downloadProgress.style.display = 'block';
      //     m.addEventListener('downloadprogress', (event) => {
      //       downloadProgress.querySelector('progress').value = event.loaded;
      //       downloadProgress.querySelector('progress').max = event.total;
      //       downloadProgress.querySelector('span').textContent =
      //         `Downloading… ${Math.round((event.loaded / event.total) * 100)}%`;
      //     });
      //   },
      // });
      // ────────────────────────────────────────────────────────────────────────
      const translator = null; // ← replace with Translator.create(...)

      // ── TODO 18: Translate and display the result ────────────────────────────
      // Note: translate() is NOT streaming — it returns the full result at once.
      //
      // Hint:
      //   const result = await translator.translate(ARTICLE);
      //   setOutput(output, result);
      // ────────────────────────────────────────────────────────────────────────

      downloadProgress.style.display = 'none';
      translator?.destroy();
    } catch (err) {
      setOutput(output, `Error: ${err.message}`);
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
