import { setBadge, setOutput, busy } from './shared.js';

// ── TODO 13: Check availability ───────────────────────────────────────────────
// Use the same options you'll pass to Rewriter.create().
//
// Hint: Rewriter.availability({
//   tone: 'as-is', format: 'as-is', length: 'as-is',
//   expectedInputLanguages: ['en'], outputLanguage: 'en',
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('rewriter-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document
  .getElementById('rewriter-button')
  .addEventListener('click', async () => {
    const button = document.getElementById('rewriter-button');
    const output = document.getElementById('rewriter-output');
    const downloadProgress = document.getElementById('rewriter-progress');
    const tone = document.getElementById('rewriter-tone').value;
    const length = document.getElementById('rewriter-length').value;
    const input = document.getElementById('rewriter-input').value.trim();
    if (!input) return;

    busy(button, true);
    output.textContent = '';
    output.className = 'output';

    try {
      // ── TODO 14: Create a Rewriter ──────────────────────────────────────────
      // Hint: const rewriter = await Rewriter.create({
      //   tone,
      //   length,
      //   format: 'as-is',
      //   sharedContext: 'Rewriting a travel blog post.',
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
      const rewriter = null; // ← replace with Rewriter.create(...)

      // ── TODO 15: Stream the rewritten text ──────────────────────────────────
      // Call rewriter.rewriteStreaming(input).
      // Same pattern as TODO 12 — for await each chunk and call output.append(chunk).
      // ────────────────────────────────────────────────────────────────────────

      downloadProgress.style.display = 'none';
      rewriter?.destroy();
    } catch (err) {
      setOutput(output, `Error: ${err.message}`);
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
