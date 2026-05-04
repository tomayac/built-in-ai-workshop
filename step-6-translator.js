import { ARTICLE, setBadge, setOut, makeMonitor, busy } from './shared.js';

// ── TODO 16: Check availability ───────────────────────────────────────────────
// Call Translator.availability() with the source→target language pair.
//
// Hint: Translator.availability({ sourceLanguage: 'en', targetLanguage: target })
// ─────────────────────────────────────────────────────────────────────────────
async function checkAvailability(target) {
  const badge = document.getElementById('tr-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
}

checkAvailability('es');

document.getElementById('tr-target').addEventListener('change', e => {
  checkAvailability(e.target.value);
});

document.getElementById('tr-btn').addEventListener('click', async () => {
  const btn    = document.getElementById('tr-btn');
  const out    = document.getElementById('tr-out');
  const prog   = document.getElementById('tr-progress');
  const target = document.getElementById('tr-target').value;

  busy(btn, true);
  setOut(out, '⏳ Translating…', 'loading');

  try {
    // ── TODO 17: Create a Translator ────────────────────────────────────────
    // Hint: const translator = await Translator.create({
    //   sourceLanguage: 'en',
    //   targetLanguage: target,
    //   monitor: makeMonitor(prog),
    // });
    // ────────────────────────────────────────────────────────────────────────
    const translator = null; // ← replace with Translator.create(...)

    // ── TODO 18: Translate and display the result ────────────────────────────
    // Note: translate() is NOT streaming — it returns the full result at once.
    //
    // Hint:
    //   const result = await translator.translate(ARTICLE);
    //   setOut(out, result);
    // ────────────────────────────────────────────────────────────────────────

    prog.style.display = 'none';
    translator?.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
