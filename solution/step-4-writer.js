import { setBadge, setOutput, busy } from '../shared.js';

// Check availability on page load.
(async () => {
  const badge = document.getElementById('writer-badge');
  try {
    const status = await Writer.availability({
      tone: 'neutral',
      format: 'plain-text',
      length: 'medium',
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
    });
    setBadge(badge, status);
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document.getElementById('writer-button').addEventListener('click', async () => {
  const button = document.getElementById('writer-button');
  const output = document.getElementById('writer-output');
  const downloadProgress = document.getElementById('writer-progress');
  const tone = document.getElementById('writer-tone').value;
  const length = document.getElementById('writer-length').value;
  const input = document.getElementById('writer-input').value.trim();
  if (!input) return;

  busy(button, true);
  output.textContent = '';
  output.className = 'output';

  try {
    const writer = await Writer.create({
      tone,
      length,
      format: 'plain-text',
      sharedContext:
        'The user provides bullet points or notes about a trip. Expand them into a vivid travel blog post.',
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

    const stream = writer.writeStreaming(input);
    for await (const chunk of stream) {
      output.append(chunk);
    }

    downloadProgress.style.display = 'none';
    writer.destroy();
  } catch (err) {
    setOutput(output, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(button, false);
  }
});
