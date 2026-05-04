import { ARTICLE, setBadge, setOut, makeMonitor, busy } from '../shared.js';

async function checkAvailability(target) {
  const badge = document.getElementById('tr-badge');
  try {
    const status = await Translator.availability({ sourceLanguage: 'en', targetLanguage: target });
    setBadge(badge, status);
  } catch {
    setBadge(badge, 'unavailable');
  }
}

// Check availability on page load with the default target language.
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
    const translator = await Translator.create({
      sourceLanguage: 'en',
      targetLanguage: target,
      monitor: makeMonitor(prog),
    });

    // translate() is NOT streaming — it returns the full result at once.
    const result = await translator.translate(ARTICLE);
    setOut(out, result);
    prog.style.display = 'none';
    translator.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
