import { setBadge, setOutput, busy } from './shared.js';

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
  const badge = document.getElementById('prompt-multimodal-badge');
  try {
    setBadge(badge, 'unknown');
  } catch {
    setBadge(badge, 'unavailable');
  }
})();

// Image upload — store the loaded HTMLImageElement for use in prompt().
let uploadedImage = null;
const imageInput = document.getElementById('image-input');
const imageArea = document.getElementById('image-area');

imageArea.addEventListener('click', () => imageInput.click());
imageArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  imageArea.style.borderColor = '#1a73e8';
});
imageArea.addEventListener('dragleave', () => {
  imageArea.style.borderColor = '';
});
imageArea.addEventListener('drop', (event) => {
  event.preventDefault();
  imageArea.style.borderColor = '';
  const file = event.dataTransfer.files[0];
  if (file?.type.startsWith('image/')) loadImage(file);
});
imageInput.addEventListener('change', () => {
  if (imageInput.files[0]) loadImage(imageInput.files[0]);
});

function loadImage(file) {
  const url = URL.createObjectURL(file);
  uploadedImage = new Image();
  uploadedImage.src = url;
  uploadedImage.onload = () => {
    imageArea.innerHTML = '';
    imageArea.appendChild(uploadedImage);
    document.getElementById('prompt-multimodal-button').disabled = false;
  };
}

document
  .getElementById('prompt-multimodal-button')
  .addEventListener('click', async () => {
    const button = document.getElementById('prompt-multimodal-button');
    const altOutput = document.getElementById('prompt-multimodal-alt-text');
    const captionOutput = document.getElementById('prompt-multimodal-caption');
    const downloadProgress = document.getElementById(
      'prompt-multimodal-progress'
    );
    if (!uploadedImage) return;

    busy(button, true);
    setOutput(altOutput, '⏳ Analyzing image…', 'loading');
    setOutput(captionOutput, '', 'loading');

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
      //   monitor(m) {
      //     downloadProgress.style.display = 'block';
      //     m.addEventListener('downloadprogress', (event) => {
      //       downloadProgress.querySelector('progress').value = event.loaded;
      //       downloadProgress.querySelector('progress').max = event.total;
      //       downloadProgress.querySelector('span').textContent =
      //         `Downloading… ${Math.round((event.loaded / event.total) * 100)}%`;
      //     });
      //   },
      // });
      // ────────────────────────────────────────────────────────────────────────
      const session = null; // ← replace with LanguageModel.create(...)

      // ── TODO 9: Prompt with image + text, parse JSON, display results ────────
      // Pass the uploaded image as { type: 'image', value: uploadedImage }.
      //
      // Hint:
      //   const raw = await session.prompt([{
      //     role: 'user',
      //     content: [
      //       { type: 'text',  value: 'Write alt text and a caption for this travel photo.' },
      //       { type: 'image', value: uploadedImage },
      //     ],
      //   }], { responseConstraint: ALT_CAPTION_SCHEMA });
      //   const { alt: altText, caption } = JSON.parse(raw);
      //   setOutput(altOutput, altText);
      //   setOutput(captionOutput, caption);
      // ────────────────────────────────────────────────────────────────────────

      downloadProgress.style.display = 'none';
      session?.destroy();
    } catch (err) {
      setOutput(altOutput, `Error: ${err.message}`);
      setOutput(captionOutput, '');
      console.error(err);
    } finally {
      busy(button, false);
    }
  });
