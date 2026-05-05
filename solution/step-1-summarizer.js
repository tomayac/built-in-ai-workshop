import { ARTICLE, setBadge, setOut, makeMonitor, busy } from '../shared.js';

// Check availability on page load.
(async () => {
  const badge = document.getElementById('sum-badge');
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

document.getElementById('sum-btn').addEventListener('click', async () => {
  const btn = document.getElementById('sum-btn');
  const out = document.getElementById('sum-out');
  const prog = document.getElementById('sum-progress');
  const type = document.getElementById('sum-type').value;
  const length = document.getElementById('sum-length').value;
  const format = document.getElementById('sum-format').value;

  busy(btn, true);
  setOut(out, '⏳ Creating summarizer…', 'loading');

  try {
    const summarizer = await Summarizer.create({
      type,
      length,
      format,
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
      monitor: makeMonitor(prog),
    });

    out.textContent = '';
    out.className = 'out';

    // summarizeStreaming() yields independent chunks — concatenate them.
    const stream = summarizer.summarizeStreaming(ARTICLE);
    let result = '';
    for await (const chunk of stream) {
      result += chunk;
      out.textContent = result;
    }

    prog.style.display = 'none';
    summarizer.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
