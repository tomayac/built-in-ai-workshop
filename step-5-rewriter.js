import { setBadge, setOut, makeMonitor, busy } from './shared.js';

// ── TODO 13: Check availability ───────────────────────────────────────────────
// Use the same options you'll pass to Rewriter.create().
//
// Hint: Rewriter.availability({
//   tone: 'as-is', format: 'as-is', length: 'as-is',
//   expectedInputLanguages: ['en'], outputLanguage: 'en',
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('rw-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document.getElementById('rw-btn').addEventListener('click', async () => {
  const btn    = document.getElementById('rw-btn');
  const out    = document.getElementById('rw-out');
  const prog   = document.getElementById('rw-progress');
  const tone   = document.getElementById('rw-tone').value;
  const length = document.getElementById('rw-length').value;
  const input  = document.getElementById('rw-input').value.trim();
  if (!input) return;

  busy(btn, true);
  out.textContent = '';
  out.className = 'out';

  try {
    // ── TODO 14: Create a Rewriter ──────────────────────────────────────────
    // Hint: const rewriter = await Rewriter.create({
    //   tone,
    //   length,
    //   format: 'as-is',
    //   sharedContext: 'Rewriting a travel blog post.',
    //   expectedInputLanguages: ['en'],
    //   outputLanguage: 'en',
    //   monitor: makeMonitor(prog),
    // });
    // ────────────────────────────────────────────────────────────────────────
    const rewriter = null; // ← replace with Rewriter.create(...)

    // ── TODO 15: Stream the rewritten text ──────────────────────────────────
    // Call rewriter.rewriteStreaming(input).
    // Same pattern as TODO 12 — concatenate chunks and update out.textContent.
    // ────────────────────────────────────────────────────────────────────────

    prog.style.display = 'none';
    rewriter?.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
