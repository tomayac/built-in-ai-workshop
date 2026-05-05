import { ARTICLE, setBadge, busy } from '../shared.js';

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
  const badge = document.getElementById('prompt-structured-badge');
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

document
  .getElementById('prompt-structured-button')
  .addEventListener('click', async () => {
    const button = document.getElementById('prompt-structured-button');
    const output = document.getElementById('prompt-structured-output');
    const downloadProgress = document.getElementById(
      'prompt-structured-progress'
    );

    busy(button, true);
    output.innerHTML =
      '<span style="color:#9aa0a6;font-style:italic;font-size:.88rem;">⏳ Generating tags…</span>';

    try {
      const session = await LanguageModel.create({
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
        monitor(m) {
          downloadProgress.style.display = 'block';
          m.addEventListener('downloadprogress', (event) => {
            downloadProgress.querySelector('progress').value = event.loaded;
            downloadProgress.querySelector('progress').max = event.total;
            downloadProgress.querySelector('span').textContent =
              `Downloading… ${Math.round((event.loaded / event.total) * 100)}%`;
          });
        },
      });

      // responseConstraint enforces the JSON Schema — output is guaranteed valid JSON.
      const raw = await session.prompt(
        `Pick relevant tags for this travel blog post. Only choose tags that clearly apply.\n\n${ARTICLE}`,
        { responseConstraint: TAG_SCHEMA }
      );
      const { tags } = JSON.parse(raw);

      output.innerHTML = tags
        .map((tag) => `<span class="tag-chip">${tag}</span>`)
        .join('');
      downloadProgress.style.display = 'none';
      session.destroy();
    } catch (err) {
      output.innerHTML = `<span style="color:#c5221f;">Error: ${err.message}</span>`;
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
