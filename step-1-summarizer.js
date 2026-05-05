import { ARTICLE, setBadge, setOutput, busy } from './shared.js';

// ── TODO 1: Check availability ────────────────────────────────────────────────
// Call Summarizer.availability() with the same options you'll pass to create().
// Pass the result to setBadge(badge, status).
//
// Hint: Summarizer.availability({
//   type: 'key-points',
//   expectedInputLanguages: ['en'],
//   outputLanguage: 'en',
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('summarizer-badge');
  try {
    setBadge(badge, 'unknown');
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
      // ── TODO 2: Create a Summarizer ─────────────────────────────────────────
      // Hint: const summarizer = await Summarizer.create({
      //   type, length, format,
      //   expectedInputLanguages: ['en'], outputLanguage: 'en',
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
      const summarizer = null; // ← replace with Summarizer.create(...)

      output.textContent = '';
      output.className = 'output';

      // ── TODO 3: Stream the summary ──────────────────────────────────────────
      // Call summarizer.summarizeStreaming(ARTICLE).
      //
      // Hint:
      //   const stream = summarizer.summarizeStreaming(ARTICLE);
      //   for await (const chunk of stream) {
      //     output.append(chunk);
      //   }
      // ────────────────────────────────────────────────────────────────────────

      downloadProgress.style.display = 'none';
      summarizer?.destroy();
    } catch (err) {
      setOutput(output, `Error: ${err.message}`);
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
