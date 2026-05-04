// Shared article text used by all steps.
export const ARTICLE = `Barcelona is a city that vibrates. From the hyper-detailed stone carvings of Gaudí to the sizzle of a pan on the boardwalk, it's a place that demands your full attention—sometimes because of the beauty, and sometimes because someone is eyeing your wallet.

Here is the highlight reel (and the "lessons learned" reel) from my recent trip to the Catalan capital. Happy reading!

The Sagrada Família: Worth Every Penny

I've seen a lot of cathedrals, but nothing prepares you for the Sagrada Família. It doesn't feel like a building; it feels like a living organism. Walking inside is like stepping into a stone forest, with towering columns that branch out like trees and stained glass that fills the space with kaleidoscopic light.

Tip: Book your tickets online at least two to three weeks in advance. I watched so many heartbroken tourists turned away at the gate. This isn't a "show up and buy a ticket" kind of place anymore.

Parc Güell: Views Worth the Climb

Perched on a hill above the city, Parc Güell offers some of the best views of Barcelona. The iconic mosaic benches and gingerbread-style gatehouses are immediately recognizable. The free public park is large and worth exploring, but the Monumental Zone requires a timed ticket. Book ahead—seriously!

Barceloneta and the Seafood Scene

You haven't truly lived until you've eaten seafood within earshot of the Mediterranean. I headed down to Barceloneta for lunch and tucked into a massive spread of gambas rojas (red prawns) and black rice. The view of the sea, the sound of the waves, the smell of the salt air—it was perfect.

Pro Tip: Skip the tourist traps with the laminated menus on the main strip. Duck into the side streets or find a spot right on the sand where the locals are lingering over their wine.

The Ramblas Reality Check

The Las Ramblas promenade is iconic, beautiful, and... a bit of a gauntlet. While I was busy admiring the flower stalls and street performers, I felt a very subtle tug on my backpack. Luckily, I caught it in time. Keep your bags in front of you, stay alert, and don't let the charm of the city distract you from your zippers!

The Golden Rule of Planning

If there is one thing you take away from this post, let it be this: book your Parc Güell tickets at least 2–3 weeks in advance. I saw so many heartbroken travelers turned away at the gate.

Final Thoughts

Barcelona is a masterpiece of contradictions—it's historic yet modern, relaxing yet chaotic. It's a city that keeps you on your toes, but rewards you with some of the best views and flavors in the world.`;

// ── Utility functions ─────────────────────────────────────────────────────────

export function setBadge(el, status) {
  el.textContent = status;
  const map = { available: 'available', downloadable: 'downloadable',
                downloading: 'downloading', unavailable: 'unavailable' };
  el.className = `avail-badge avail-${map[status] ?? 'unknown'}`;
}

export function setOut(el, text, cls = '') {
  el.textContent = text;
  el.className = 'out' + (cls ? ` ${cls}` : '');
}

// Pass the returned function as the `monitor` option in create() to show
// download progress while the model is being fetched.
export function makeMonitor(wrap) {
  const bar = wrap.querySelector('progress');
  const lbl = wrap.querySelector('span');
  return (m) => {
    wrap.style.display = 'block';
    m.addEventListener('downloadprogress', (e) => {
      bar.value = e.loaded;
      bar.max   = e.total;
      lbl.textContent = `Downloading… ${Math.round(e.loaded / e.total * 100)}%`;
    });
  };
}

export function busy(btn, yes) {
  btn.disabled    = yes;
  btn.textContent = yes ? '⏳ Working…' : btn.dataset.label;
}

// ── One-time DOM setup ────────────────────────────────────────────────────────

// Store original button labels so busy() can restore them.
document.querySelectorAll('.btn').forEach(b => { b.dataset.label = b.textContent; });

// Fill the sample article display and the rewriter textarea.
document.getElementById('article-content').textContent = ARTICLE;
document.getElementById('rw-input').value = ARTICLE;

// ── Tab navigation ────────────────────────────────────────────────────────────

function activateTab(name) {
  document.querySelectorAll('[role="tab"]').forEach(b => {
    const active = b.dataset.tab === name;
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', active);
    b.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll('[role="tabpanel"]').forEach(p => {
    p.classList.toggle('active', p.id === 'tab-' + name);
  });
}

function tabFromHash() {
  const hash  = location.hash.slice(1);
  const names = [...document.querySelectorAll('[role="tab"]')].map(b => b.dataset.tab);
  return names.includes(hash) ? hash : names[0];
}

activateTab(tabFromHash());
window.addEventListener('hashchange', () => activateTab(tabFromHash()));

document.querySelectorAll('[role="tab"]').forEach(btn => {
  btn.addEventListener('click', () => { location.hash = btn.dataset.tab; });
});

document.querySelector('[role="tablist"]').addEventListener('keydown', e => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const idx  = tabs.indexOf(document.activeElement);
  if (idx === -1) return;
  let next = idx;
  if      (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
  else if (e.key === 'ArrowLeft')  next = (idx - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home')       next = 0;
  else if (e.key === 'End')        next = tabs.length - 1;
  else return;
  e.preventDefault();
  tabs[next].focus();
  location.hash = tabs[next].dataset.tab;
});
