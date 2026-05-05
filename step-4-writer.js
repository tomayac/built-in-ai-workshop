import { setBadge, setOutput, busy } from './shared.js';

// ── TODO 10: Check availability ───────────────────────────────────────────────
// Use the same options you'll pass to Writer.create().
//
// Hint: Writer.availability({
//   tone: 'neutral', format: 'plain-text', length: 'medium',
//   expectedInputLanguages: ['en'], outputLanguage: 'en',
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('writer-badge');
  try {
    setBadge(badge, 'unknown');
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
    // ── TODO 11: Create a Writer ────────────────────────────────────────────
    // Hint: const writer = await Writer.create({
    //   tone,
    //   length,
    //   format: 'plain-text',
    //   sharedContext: 'The user provides bullet points about a trip. Expand into a travel blog post.',
    //   expectedInputLanguages: ['en'],
    //   outputLanguage: 'en',
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
    const writer = null; // ← replace with Writer.create(...)

    // ── TODO 12: Stream the generated post ──────────────────────────────────
    // Call writer.writeStreaming(input).
    //
    // Hint:
    //   const stream = writer.writeStreaming(input);
    //   for await (const chunk of stream) {
    //     output.append(chunk);
    //   }
    // ────────────────────────────────────────────────────────────────────────

    downloadProgress.style.display = 'none';
    writer?.destroy();
  } catch (err) {
    setOutput(output, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(button, false);
  }
});
