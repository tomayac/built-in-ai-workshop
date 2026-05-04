import { setBadge, setOut, makeMonitor, busy } from '../shared.js';

// Check availability on page load.
(async () => {
  const badge = document.getElementById('wr-badge');
  try {
    const status = await Writer.availability({
      tone: 'neutral', format: 'plain-text', length: 'medium',
      expectedInputLanguages: ['en'], outputLanguage: 'en',
    });
    setBadge(badge, status);
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
    const writer = await Writer.create({
      tone,
      length,
      format: 'plain-text',
      sharedContext: 'The user provides bullet points or notes about a trip. Expand them into a vivid travel blog post.',
      expectedInputLanguages: ['en'],
      outputLanguage: 'en',
      monitor: makeMonitor(prog),
    });

    // writeStreaming() yields independent chunks — concatenate them.
    const stream = writer.writeStreaming(input);
    let result = '';
    for await (const chunk of stream) {
      result += chunk;
      out.textContent = result;
    }

    prog.style.display = 'none';
    writer.destroy();
  } catch (err) {
    setOut(out, `Error: ${err.message}`);
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
