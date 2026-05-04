import { setBadge, setOut, makeMonitor, busy } from '../shared.js';

// JSON Schema — guarantees the model returns both 'alt' and 'caption'.
const ALT_CAPTION_SCHEMA = {
  type: 'object',
  properties: {
    alt:     { type: 'string' },
    caption: { type: 'string' },
  },
  required: ['alt', 'caption'],
  additionalProperties: false,
};

// Check availability on page load.
(async () => {
  const badge = document.getElementById('pm-badge');
  try {
    const status = await LanguageModel.availability({
      expectedInputs: [
        { type: 'text', languages: ['en'] },
        { type: 'image' },
      ],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
    });
    setBadge(badge, status);
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

// Image upload — store the loaded HTMLImageElement for later use in prompt().
let uploadedImg = null;
const imgInput  = document.getElementById('img-input');
const imgArea   = document.getElementById('img-area');

imgArea.addEventListener('click', () => imgInput.click());
imgArea.addEventListener('dragover', e => { e.preventDefault(); imgArea.style.borderColor = '#1a73e8'; });
imgArea.addEventListener('dragleave', () => { imgArea.style.borderColor = ''; });
imgArea.addEventListener('drop', e => {
  e.preventDefault();
  imgArea.style.borderColor = '';
  const f = e.dataTransfer.files[0];
  if (f?.type.startsWith('image/')) loadImg(f);
});
imgInput.addEventListener('change', () => { if (imgInput.files[0]) loadImg(imgInput.files[0]); });

function loadImg(file) {
  const url = URL.createObjectURL(file);
  uploadedImg = new Image();
  uploadedImg.src = url;
  uploadedImg.onload = () => {
    imgArea.innerHTML = '';
    imgArea.appendChild(uploadedImg);
    document.getElementById('pm-btn').disabled = false;
  };
}

document.getElementById('pm-btn').addEventListener('click', async () => {
  const btn  = document.getElementById('pm-btn');
  const alt  = document.getElementById('pm-alt');
  const cap  = document.getElementById('pm-cap');
  const prog = document.getElementById('pm-progress');
  if (!uploadedImg) return;

  busy(btn, true);
  setOut(alt, '⏳ Analyzing image…', 'loading');
  setOut(cap, '', 'loading');

  try {
    const session = await LanguageModel.create({
      expectedInputs: [
        { type: 'text', languages: ['en'] },
        { type: 'image' },
      ],
      expectedOutputs: [{ type: 'text', languages: ['en'] }],
      initialPrompts: [{
        role: 'system',
        content: 'You write concise, accessible alt text and engaging captions for travel blog images.',
      }],
      monitor: makeMonitor(prog),
    });

    // Pass both text and the HTMLImageElement as multimodal content.
    const raw = await session.prompt([{
      role: 'user',
      content: [
        { type: 'text',  value: 'Write a concise alt text (accessibility) and a creative caption for this travel photo.' },
        { type: 'image', value: uploadedImg },
      ],
    }], { responseConstraint: ALT_CAPTION_SCHEMA });

    const { alt: altText, caption } = JSON.parse(raw);
    setOut(alt, altText);
    setOut(cap, caption);
    prog.style.display = 'none';
    session.destroy();
  } catch (err) {
    setOut(alt, `Error: ${err.message}`);
    setOut(cap, '');
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
