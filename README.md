# Chrome Built-in AI Workshop

A hands-on workshop that teaches you to use Chrome's Built-in AI APIs through
six progressively guided coding exercises. All inference runs locally in the
browser — no API keys, no server, no network calls to an external AI service.

## What you'll build

A travel-blog demo app that processes a sample article about Barcelona using six
different on-device AI APIs:

| Step | API                            | What it does                                                                     |
| ---- | ------------------------------ | -------------------------------------------------------------------------------- |
| 1    | **Summarizer**                 | Condenses the article (headline, teaser, key-points, tldr) with streaming output |
| 2    | **Prompt — Structured Output** | Generates tags constrained by a JSON Schema `enum` via `LanguageModel`           |
| 3    | **Prompt — Multimodal**        | Generates alt text and a caption for an uploaded travel photo                    |
| 4    | **Writer**                     | Expands bullet-point notes into a full blog post                                 |
| 5    | **Rewriter**                   | Rewrites the article with a different tone or length                             |
| 6    | **Translator**                 | Translates the article into one of ten target languages                          |

## Requirements

- **Chrome 138+** (or a recent Canary build) with Built-in AI enabled.
- Follow the
  [Chrome Built-in AI setup guide](https://developer.chrome.com/docs/ai/built-in)
  to enable the experimental flags and download the on-device model.
- No build step, no npm install — the app is plain HTML + ES modules.

## How to run

Serve the files from a local HTTP server (required for ES modules):

```bash
npx serve .
# or
python3 -m http.server
```

Then open `http://localhost:3000` (or whichever port your server uses) and
navigate to `starter.html`.

## Workshop structure

Your working file — open this in the browser

```
starter.html
```

Finished version for reference

```
solution.html
```

Starter stubs with TODO comments

```
step-1-summarizer.js
step-2-prompt-structured.js
step-3-prompt-multimodal.js
step-4-writer.js
step-5-rewriter.js
step-6-translator.js
```

Completed implementations

```
solution/
  step-1-summarizer.js
  step-2-prompt-structured.js
  step-3-prompt-multimodal.js
  step-4-writer.js
  step-5-rewriter.js
  step-6-translator.js
```

Shared article text and UI helpers

```
shared.js
```

Shared stylesheet

```
styles.css
```

Each `step-N-*.js` file contains numbered `TODO` comments with hints. Complete
the TODOs in order; when you're stuck, peek at the matching file in `solution/`.

## Resources

- [Chrome Built-in AI docs](https://developer.chrome.com/docs/ai/built-in)
- [Web AI demos (GoogleChromeLabs)](https://github.com/GoogleChromeLabs/web-ai-demos)
