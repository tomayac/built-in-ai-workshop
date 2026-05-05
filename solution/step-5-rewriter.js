import { setBadge, setOut, makeMonitor, busy } from '../shared.js';

// Check availability on page load.
(async () => {
  const badge = document.getElementById('rw-badge');
  try {
    const status = await Rewriter.availability({
      tone: 'as-is',
      format: 'as-is',
      length: 'as-is',
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
    });
    setBadge(badge, status);
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document.getElementById('rw-btn').addEventListener('click', async () => {
  const btn = document.getElementById('rw-btn');
  const out = document.getElementById('rw-out');
  const prog = document.getElementById('rw-progress');
  const tone = document.getElementById('rw-tone').value;
  const length = document.getElementById('rw-length').value;
  const input = document.getElementById('rw-input').value.trim();
  if (!input) return;

  busy(btn, true);
  out.textContent = '';
  out.className = 'out';

  try {
    const rewriter = await Rewriter.create({
      tone,
      length,
      format: 'as-is',
      sharedContext: 'Rewriting a travel blog post.',
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
      monitor: makeMonitor(prog),
    });

    // rewriteStreaming() yields independent chunks — concatenate them.
    const stream = rewriter.rewriteStreaming(input);
    let result = '';
    for await (const chunk of stream) {
      result += chunk;
      out.textContent = result;
    }

    prog.style.display = 'none';
    rewriter.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
