import { setBadge, setOut, makeMonitor, busy } from './shared.js';

// ── TODO 10: Check availability ───────────────────────────────────────────────
// Use the same options you'll pass to Writer.create().
//
// Hint: Writer.availability({
//   tone: 'neutral', format: 'plain-text', length: 'medium',
//   expectedInputLanguages: ['en'], outputLanguage: 'en',
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('wr-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document.getElementById('wr-btn').addEventListener('click', async () => {
  const btn    = document.getElementById('wr-btn');
  const out    = document.getElementById('wr-out');
  const prog   = document.getElementById('wr-progress');
  const tone   = document.getElementById('wr-tone').value;
  const length = document.getElementById('wr-length').value;
  const input  = document.getElementById('wr-input').value.trim();
  if (!input) return;

  busy(btn, true);
  out.textContent = '';
  out.className = 'out';

  try {
    // ── TODO 11: Create a Writer ────────────────────────────────────────────
    // Hint: const writer = await Writer.create({
    //   tone,
    //   length,
    //   format: 'plain-text',
    //   sharedContext: 'The user provides bullet points about a trip. Expand into a travel blog post.',
    //   expectedInputLanguages: ['en'],
    //   outputLanguage: 'en',
    //   monitor: makeMonitor(prog),
    // });
    // ────────────────────────────────────────────────────────────────────────
    const writer = null; // ← replace with Writer.create(...)

    // ── TODO 12: Stream the generated post ──────────────────────────────────
    // Call writer.writeStreaming(input).
    // Each chunk is independent — concatenate and update out.textContent.
    //
    // Hint:
    //   const stream = writer.writeStreaming(input);
    //   let result = '';
    //   for await (const chunk of stream) {
    //     result += chunk;
    //     out.textContent = result;
    //   }
    // ────────────────────────────────────────────────────────────────────────

    prog.style.display = 'none';
    writer?.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
