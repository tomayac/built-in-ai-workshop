import { ARTICLE, setBadge, setOutput, busy } from '../shared.js';

async function checkAvailability(target) {
  const badge = document.getElementById('translator-badge');
  try {
    const status = await Translator.availability({
      sourceLanguage: 'en',
      targetLanguage: target,
    });
    setBadge(badge, status);
  } catch {
    setBadge(badge, 'unavailable');
  }
}

// Check availability on page load with the default target language.
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
      const translator = await Translator.create({
        sourceLanguage: 'en',
        targetLanguage: target,
        monitor(m) {
          downloadProgress.style.display = 'block';
          m.addEventListener('downloadprogress', (event) => {
            downloadProgress.querySelector('progress').value = event.loaded;
            downloadProgress.querySelector('progress').max = event.total;
            downloadProgress.querySelector('span').textContent =
              `Downloading… ${Math.round((event.loaded / event.total) * 100)}%`;
          });
        },
      });

      // translate() is NOT streaming — it returns the full result at once.
      const result = await translator.translate(ARTICLE);
      setOutput(output, result);
      downloadProgress.style.display = 'none';
      translator.destroy();
    } catch (err) {
      setOutput(output, `Error: ${err.message}`);
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
