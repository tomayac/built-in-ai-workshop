import { ARTICLE, setBadge, makeMonitor, busy } from '../shared.js';

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

// JSON Schema that constrains the model to only pick from TAGS_ENUM.
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

// Check availability on page load.
(async () => {
  const badge = document.getElementById('ps-badge');
  try {
    const status = await LanguageModel.availability({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
    });
    setBadge(badge, status);
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
    const session = await LanguageModel.create({
      expectedInputs: [{ type: 'text', languages: ['en'] }],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
      monitor: makeMonitor(prog),
    });

    // responseConstraint enforces the JSON Schema — output is guaranteed valid JSON.
    const raw = await session.prompt(
      `Pick relevant tags for this travel blog post. Only choose tags that clearly apply.\n\n${ARTICLE}`,
      { responseConstraint: TAG_SCHEMA }
    );
    const { tags } = JSON.parse(raw);

    out.innerHTML = tags
      .map((t) => `<span class="tag-chip">${t}</span>`)
      .join('');
    prog.style.display = 'none';
    session.destroy();
  } catch (err) {
    out.innerHTML = `<span style="color:#c5221f;">Error: ${err.message}</span>`;
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
