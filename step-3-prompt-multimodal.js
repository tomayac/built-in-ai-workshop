import { setBadge, setOut, makeMonitor, busy } from './shared.js';

// JSON Schema — guarantees the model returns both 'alt' and 'caption'.
const ALT_CAPTION_SCHEMA = {
  type: 'object',
  properties: {
    alt: { type: 'string' },
    caption: { type: 'string' },
  },
  required: ['alt', 'caption'],
  additionalProperties: false,
};

// ── TODO 7: Check availability for multimodal (text + image) input ────────────
// The options must match what you'll pass to create() exactly.
//
// Hint: LanguageModel.availability({
//   expectedInputs: [
//     { type: 'text', languages: ['en'] },
//     { type: 'image' },            // ← key difference vs text-only
//   ],
//   expectedOutputs: [{ type: 'text', languages: ['en'] }],
// })
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const badge = document.getElementById('pm-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

// Image upload — store the loaded HTMLImageElement for use in prompt().
let uploadedImg = null;
const imgInput = document.getElementById('img-input');
const imgArea = document.getElementById('img-area');

imgArea.addEventListener('click', () => imgInput.click());
imgArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  imgArea.style.borderColor = '#1a73e8';
});
imgArea.addEventListener('dragleave', () => {
  imgArea.style.borderColor = '';
});
imgArea.addEventListener('drop', (e) => {
  e.preventDefault();
  imgArea.style.borderColor = '';
  const f = e.dataTransfer.files[0];
  if (f?.type.startsWith('image/')) loadImg(f);
});
imgInput.addEventListener('change', () => {
  if (imgInput.files[0]) loadImg(imgInput.files[0]);
});

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
  const btn = document.getElementById('pm-btn');
  const alt = document.getElementById('pm-alt');
  const cap = document.getElementById('pm-cap');
  const prog = document.getElementById('pm-progress');
  if (!uploadedImg) return;

  busy(btn, true);
  setOut(alt, '⏳ Analyzing image…', 'loading');
  setOut(cap, '', 'loading');

  try {
    // ── TODO 8: Create a multimodal LanguageModel session ───────────────────
    // Add { type: 'image' } to expectedInputs.
    // Optionally add a system prompt via initialPrompts.
    //
    // Hint: const session = await LanguageModel.create({
    //   expectedInputs: [
    //     { type: 'text', languages: ['en'] },
    //     { type: 'image' },
    //   ],
    //   expectedOutputs: [{ type: 'text', languages: ['en'] }],
    //   initialPrompts: [{
    //     role: 'system',
    //     content: 'You write concise alt text and engaging captions for travel blog images.',
    //   }],
    //   monitor: makeMonitor(prog),
    // });
    // ────────────────────────────────────────────────────────────────────────
    const session = null; // ← replace with LanguageModel.create(...)

    // ── TODO 9: Prompt with image + text, parse JSON, display results ────────
    // Pass the uploaded image as { type: 'image', value: uploadedImg }.
    //
    // Hint:
    //   const raw = await session.prompt([{
    //     role: 'user',
    //     content: [
    //       { type: 'text',  value: 'Write alt text and a caption for this travel photo.' },
    //       { type: 'image', value: uploadedImg },
    //     ],
    //   }], { responseConstraint: ALT_CAPTION_SCHEMA });
    //   const { alt: altText, caption } = JSON.parse(raw);
    //   setOut(alt, altText);
    //   setOut(cap, caption);
    // ────────────────────────────────────────────────────────────────────────

    prog.style.display = 'none';
    session?.destroy();
  } catch (err) {
    setOut(alt, `Error: ${err.message}`);
    setOut(cap, '');
    console.error(err);
  } finally {
    busy(btn, false);
  }
});
