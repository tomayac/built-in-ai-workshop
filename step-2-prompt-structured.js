import { ARTICLE, setBadge, makeMonitor, busy } from './shared.js';

const TAGS_ENUM = [
  'Adventure',
  'Barcelona',
  'Beach',
  'City',
  'Coast',
  'Culture',
  'Europe',
  'Food',
  'Gaudi',
  'History',
  'Relaxation',
  'Sagrada Familia',
  'Spain',
  'Travel',
];

// This JSON Schema constrains the model — it can only output tags from TAGS_ENUM.
const TAG_SCHEMA = {
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: { type: 'string', enum: TAGS_ENUM },
    },
  },
  required: ['tags'],
  additionalProperties: false,
};

// ── TODO 4: Check availability ────────────────────────────────────────────────
// Call LanguageModel.availability() with expectedInputs and expectedOutputs.
// Pass the result to setBadge(badge, status).
//
// Hint: LanguageModel.availability({
//   expectedInputs:  [{ type: 'text', languages: ['en'] }],
//   expectedOutputs: [{ type: 'text', languages: ['en'] }],
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('ps-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

document.getElementById('ps-btn').addEventListener('click', async () => {
  const btn = document.getElementById('ps-btn');
  const out = document.getElementById('ps-out');
  const prog = document.getElementById('ps-progress');

  busy(btn, true);
  out.innerHTML =
    '<span style="color:#9aa0a6;font-style:italic;font-size:.88rem;">⏳ Generating tags…</span>';

  try {
    // ── TODO 5: Create a LanguageModel session ──────────────────────────────
    // Hint: const session = await LanguageModel.create({
    //   expectedInputs:  [{ type: 'text', languages: ['en'] }],
    //   expectedOutputs: [{ type: 'text', languages: ['en'] }],
    //   monitor: makeMonitor(prog),
    // });
    // ────────────────────────────────────────────────────────────────────────
    const session = null; // ← replace with LanguageModel.create(...)

    // ── TODO 6: Prompt with responseConstraint, parse JSON, render tags ─────
    // Use responseConstraint: TAG_SCHEMA to guarantee valid JSON output.
    //
    // Hint:
    //   const raw = await session.prompt(
    //     `Pick relevant tags for this travel blog post:\n\n${ARTICLE}`,
    //     { responseConstraint: TAG_SCHEMA },
    //   );
    //   const { tags } = JSON.parse(raw);
    //   out.innerHTML = tags.map(t => `<span class="tag-chip">${t}</span>`).join('');
    // ────────────────────────────────────────────────────────────────────────

    prog.style.display = 'none';
    session?.destroy();
  } catch (err) {
    out.innerHTML = `<span style="color:#c5221f;">Error: ${err.message}</span>`;
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
