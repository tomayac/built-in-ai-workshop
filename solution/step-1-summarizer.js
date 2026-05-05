import { ARTICLE, setBadge, setOutput, busy } from '../shared.js';

// Check availability on page load.
(async () => {
  const badge = document.getElementById('summarizer-badge');
  try {
    const status = await Summarizer.availability({
      type: 'key-points',
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
    });
    setBadge(badge, status);
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document
  .getElementById('summarizer-button')
  .addEventListener('click', async () => {
    const button = document.getElementById('summarizer-button');
    const output = document.getElementById('summarizer-output');
    const downloadProgress = document.getElementById('summarizer-progress');
    const type = document.getElementById('summarizer-type').value;
    const length = document.getElementById('summarizer-length').value;
    const format = document.getElementById('summarizer-format').value;

    busy(button, true);
    setOutput(output, '⏳ Creating summarizer…', 'loading');

    try {
      const summarizer = await Summarizer.create({
        type,
        length,
        format,
        expectedInputLanguages: ['en'],
        outputLanguage: 'en',
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

      output.textContent = '';
      output.className = 'output';

      const stream = summarizer.summarizeStreaming(ARTICLE);
      for await (const chunk of stream) {
        output.append(chunk);
      }

      downloadProgress.style.display = 'none';
      summarizer.destroy();
    } catch (err) {
      setOutput(output, `Error: ${err.message}`);
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
