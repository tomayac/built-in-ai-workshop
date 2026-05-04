import { ARTICLE, setBadge, setOut, makeMonitor, busy } from './shared.js';

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
  const badge = document.getElementById('sum-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document.getElementById('sum-btn').addEventListener('click', async () => {
  const btn    = document.getElementById('sum-btn');
  const out    = document.getElementById('sum-out');
  const prog   = document.getElementById('sum-progress');
  const type   = document.getElementById('sum-type').value;
  const length = document.getElementById('sum-length').value;
  const format = document.getElementById('sum-format').value;

  busy(btn, true);
  setOut(out, '⏳ Creating summarizer…', 'loading');

  try {
    // ── TODO 2: Create a Summarizer ─────────────────────────────────────────
    // Hint: const summarizer = await Summarizer.create({
    //   type, length, format,
    //   expectedInputLanguages: ['en'], outputLanguage: 'en',
    //   monitor: makeMonitor(prog),
    // });
    // ────────────────────────────────────────────────────────────────────────
    const summarizer = null; // ← replace with Summarizer.create(...)

    out.textContent = '';
    out.className = 'out';

    // ── TODO 3: Stream the summary ──────────────────────────────────────────
    // Call summarizer.summarizeStreaming(ARTICLE).
    // Each chunk is independent — concatenate them and update out.textContent.
    //
    // Hint:
    //   const stream = summarizer.summarizeStreaming(ARTICLE);
    //   let result = '';
    //   for await (const chunk of stream) {
    //     result += chunk;
    //     out.textContent = result;
    //   }
    // ────────────────────────────────────────────────────────────────────────

    prog.style.display = 'none';
    summarizer?.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
