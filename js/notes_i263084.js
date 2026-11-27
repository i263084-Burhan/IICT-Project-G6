/**
 * Notes & Noir Fragrances — Shop by Fragrance Notes (notes_i263084.js)
 * Renders the 9 fragrance note cards dynamically from a JavaScript data array,
 * supports keyboard & click selection, and persists the active note in localStorage.
 */
'use strict';

(() => {
  const SELECTED_NOTE_KEY = 'notesNoir_selectedNote';

  const FRAGRANCE_NOTES = [
    {
      id: 'citrus',
      name: 'Citrus',
      image: '../images/notes/citrus.jpg',
      alt: 'Close-up macro photograph of fresh sliced oranges',
      fallbackColors: ['#F9D98C', '#E07A28']
    },
    {
      id: 'floral',
      name: 'Floral',
      image: '../images/notes/floral.jpg',
      alt: 'Close-up macro photograph of soft pink roses in bloom',
      fallbackColors: ['#F3D0D7', '#C96B84']
    },
    {
      id: 'woody',
      name: 'Woody',
      image: '../images/notes/woody.jpg',
      alt: 'Close-up macro photograph of textured natural tree bark',
      fallbackColors: ['#B38B67', '#5E3F28']
    },
    {
      id: 'vanilla',
      name: 'Vanilla',
      image: '../images/notes/vanilla.jpg',
      alt: 'Close-up macro photograph of vanilla orchid blossoms and dark vanilla pods',
      fallbackColors: ['#F4E6CE', '#8B623D']
    },
    {
      id: 'spicy',
      name: 'Spicy',
      image: '../images/notes/spicy.jpg',
      alt: 'Close-up macro photograph of rolled cinnamon sticks and star anise',
      fallbackColors: ['#CD8258', '#75331E']
    },
    {
      id: 'amber',
      name: 'Amber',
      image: '../images/notes/amber.jpg',
      alt: 'Close-up macro photograph of glowing golden amber resin',
      fallbackColors: ['#F0B35B', '#8E4316']
    },
    {
      id: 'musk',
      name: 'Musk',
      image: '../images/notes/musk.jpg',
      alt: 'Close-up macro photograph of soft white fleece texture',
      fallbackColors: ['#F6F3EE', '#C7BFB5']
    },
    {
      id: 'fresh',
      name: 'Fresh',
      image: '../images/notes/fresh.jpg',
      alt: 'Close-up macro photograph of crisp green mint leaves',
      fallbackColors: ['#C5E2CE', '#3E7B56']
    },
    {
      id: 'gourmand',
      name: 'Gourmand',
      image: '../images/notes/gourmand.jpg',
      alt: 'Close-up macro photograph of dark chocolate pralines',
      fallbackColors: ['#9A6C4C', '#3F2316']
    }
  ];

  let selectedNoteId = null;

  function readSavedNote() {
    try {
      const saved = window.localStorage.getItem(SELECTED_NOTE_KEY);
      if (!saved) return null;
      return FRAGRANCE_NOTES.some((note) => note.id === saved) ? saved : null;
    } catch {
      return null;
    }
  }

  function writeSavedNote(noteId) {
    try {
      if (noteId) {
        window.localStorage.setItem(SELECTED_NOTE_KEY, noteId);
      } else {
        window.localStorage.removeItem(SELECTED_NOTE_KEY);
      }
    } catch {
      // Ignore storage access errors
    }
  }

  function createHeroSvgFallback() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
        <defs>
          <linearGradient id="nn-silk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#EFE6DA"/>
            <stop offset="55%" stop-color="#DFD0BE"/>
            <stop offset="100%" stop-color="#CBB9A3"/>
          </linearGradient>
          <linearGradient id="nn-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.95"/>
            <stop offset="55%" stop-color="#E5D5C0" stop-opacity="0.72"/>
            <stop offset="100%" stop-color="#C4AA88" stop-opacity="0.9"/>
          </linearGradient>
        </defs>
        <rect width="640" height="400" fill="url(#nn-silk)"/>
        <path d="M0 310 Q180 255 370 305 T640 275 L640 400 L0 400 Z" fill="#D5C4B0" opacity="0.55"/>
        <ellipse cx="330" cy="332" rx="125" ry="20" fill="#8C7864" opacity="0.24"/>
        <rect x="294" y="68" width="72" height="42" rx="4" fill="#141414"/>
        <rect x="308" y="110" width="44" height="14" fill="#B5956E"/>
        <rect x="248" y="124" width="164" height="200" rx="12" fill="url(#nn-glass)" stroke="#B8A28A" stroke-width="2"/>
        <rect x="268" y="160" width="124" height="114" rx="4" fill="#FAF6F0" stroke="#D8CBB9" stroke-width="1.5"/>
        <text x="330" y="210" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#141414">Notes &amp; Noir</text>
        <text x="330" y="234" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" letter-spacing="3" fill="#6E645A">FRAGRANCES</text>
        <g transform="translate(178 286)" fill="#FFFDFB" stroke="#E2D9CE" stroke-width="1">
          <ellipse cx="0" cy="-18" rx="9" ry="18"/>
          <ellipse cx="17" cy="-5" rx="9" ry="18" transform="rotate(72 17 -5)"/>
          <ellipse cx="11" cy="15" rx="9" ry="18" transform="rotate(144 11 15)"/>
          <ellipse cx="-11" cy="15" rx="9" ry="18" transform="rotate(216 -11 15)"/>
          <ellipse cx="-17" cy="-5" rx="9" ry="18" transform="rotate(288 -17 -5)"/>
          <circle cx="0" cy="0" r="6" fill="#E8C97A"/>
        </g>
        <g transform="translate(466 296) scale(0.9)" fill="#FFFDFB" stroke="#E2D9CE" stroke-width="1">
          <ellipse cx="0" cy="-18" rx="9" ry="18"/>
          <ellipse cx="17" cy="-5" rx="9" ry="18" transform="rotate(72 17 -5)"/>
          <ellipse cx="11" cy="15" rx="9" ry="18" transform="rotate(144 11 15)"/>
          <ellipse cx="-11" cy="15" rx="9" ry="18" transform="rotate(216 -11 15)"/>
          <ellipse cx="-17" cy="-5" rx="9" ry="18" transform="rotate(288 -17 -5)"/>
          <circle cx="0" cy="0" r="6" fill="#E8C97A"/>
        </g>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function createNoteSvgFallback(note) {
    const [light, dark] = note.fallbackColors;
    let motif = '';

    switch (note.id) {
      case 'citrus':
        motif = `
          <circle cx="150" cy="150" r="76" fill="#F4A12E" stroke="#FFF4D6" stroke-width="8"/>
          <circle cx="150" cy="150" r="58" fill="#F9BA48"/>
          <path d="M150 92 L150 208 M92 150 L208 150 M109 109 L191 191 M191 109 L109 191" stroke="#FFF4D6" stroke-width="4"/>
        `;
        break;
      case 'floral':
        motif = `
          <circle cx="150" cy="155" r="72" fill="#DC8399" opacity="0.88"/>
          <circle cx="136" cy="142" r="46" fill="#E9A2B3"/>
          <circle cx="164" cy="152" r="38" fill="#CE6D85"/>
          <circle cx="150" cy="150" r="20" fill="#F4C7D2"/>
        `;
        break;
      case 'woody':
        motif = `
          <path d="M75 0 V400 M120 0 Q132 180 112 400 M185 0 Q170 210 192 400 M238 0 V400" stroke="#422918" stroke-width="10" fill="none" opacity="0.45"/>
          <path d="M98 40 Q110 170 95 340 M155 20 Q145 190 160 360" stroke="#D3B494" stroke-width="5" fill="none" opacity="0.35"/>
        `;
        break;
      case 'vanilla':
        motif = `
          <ellipse cx="150" cy="135" rx="54" ry="26" fill="#FFF8EA" transform="rotate(-18 150 135)"/>
          <ellipse cx="150" cy="135" rx="54" ry="26" fill="#FAF0DA" transform="rotate(34 150 135)"/>
          <circle cx="150" cy="135" r="12" fill="#D5A64B"/>
          <path d="M115 215 Q160 250 210 275" stroke="#4D2E1B" stroke-width="11" stroke-linecap="round" fill="none"/>
          <path d="M98 232 Q150 268 196 292" stroke="#3B2112" stroke-width="9" stroke-linecap="round" fill="none"/>
        `;
        break;
      case 'spicy':
        motif = `
          <rect x="85" y="135" width="130" height="22" rx="10" fill="#8D4525" transform="rotate(-24 150 146)"/>
          <rect x="92" y="170" width="128" height="20" rx="9" fill="#A85934" transform="rotate(14 150 180)"/>
          <circle cx="195" cy="112" r="22" fill="#632B18"/>
        `;
        break;
      case 'amber':
        motif = `
          <ellipse cx="150" cy="155" rx="68" ry="82" fill="#F2AA44" opacity="0.88"/>
          <ellipse cx="132" cy="128" rx="28" ry="40" fill="#FFE0A3" opacity="0.5"/>
        `;
        break;
      case 'musk':
        motif = `
          <circle cx="115" cy="145" r="56" fill="#FFFFFF" opacity="0.72"/>
          <circle cx="176" cy="138" r="62" fill="#FFFFFF" opacity="0.78"/>
          <circle cx="145" cy="182" r="60" fill="#FAF7F2" opacity="0.85"/>
        `;
        break;
      case 'fresh':
        motif = `
          <ellipse cx="135" cy="150" rx="34" ry="68" fill="#4D8C63" transform="rotate(-22 135 150)"/>
          <ellipse cx="172" cy="162" rx="32" ry="62" fill="#66A67B" transform="rotate(24 172 162)"/>
          <circle cx="132" cy="132" r="5" fill="#E8F8EC"/>
          <circle cx="176" cy="152" r="4" fill="#E8F8EC"/>
        `;
        break;
      case 'gourmand':
        motif = `
          <rect x="88" y="102" width="66" height="66" rx="12" fill="#4B2B1C"/>
          <rect x="150" y="142" width="66" height="66" rx="12" fill="#5E3724"/>
          <circle cx="121" cy="135" r="14" fill="#7D4C33"/>
          <circle cx="183" cy="175" r="14" fill="#8B563A"/>
        `;
        break;
      default:
        break;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        <defs>
          <radialGradient id="grad-${note.id}" cx="45%" cy="35%" r="75%">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="100%" stop-color="${dark}"/>
          </radialGradient>
        </defs>
        <rect width="300" height="400" fill="url(#grad-${note.id})"/>
        ${motif}
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function attachImageFallback(img, fallbackFn) {
    const applyFallback = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.src = fallbackFn();
    };

    img.addEventListener('error', applyFallback);
    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    }
  }

  function syncShopLinks() {
    const shopLinks = document.querySelectorAll('a[href^="shop.html"]');
    shopLinks.forEach((link) => {
      link.setAttribute(
        'href',
        selectedNoteId ? `shop.html?note=${encodeURIComponent(selectedNoteId)}` : 'shop.html'
      );
    });
  }

  function announceSelection(note) {
    const statusEl = document.getElementById('notes-live-status');
    if (!statusEl) return;
    statusEl.textContent = note
      ? `${note.name} fragrance note selected and saved.`
      : 'Fragrance note filter cleared.';
  }

  function selectNote(noteId) {
    selectedNoteId = selectedNoteId === noteId ? null : noteId;
    writeSavedNote(selectedNoteId);
    renderNotes();
    syncShopLinks();

    const matchedNote = FRAGRANCE_NOTES.find((note) => note.id === selectedNoteId) || null;
    announceSelection(matchedNote);

    document.dispatchEvent(
      new CustomEvent('nn:noteSelected', {
        detail: {
          noteId: selectedNoteId,
          noteName: matchedNote ? matchedNote.name : null
        }
      })
    );
  }

  function renderNotes() {
    const grid = document.getElementById('fragrance-notes-grid');
    if (!grid) return;

    grid.innerHTML = '';

    FRAGRANCE_NOTES.forEach((note) => {
      const isActive = selectedNoteId === note.id;
      const card = document.createElement('div');
      card.className = `nn-note-card${isActive ? ' is-active' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', String(isActive));
      card.setAttribute('aria-label', `Select ${note.name} fragrance note`);
      card.dataset.note = note.id;

      card.innerHTML = `
        <div class="nn-note-media">
          <img
            src="${note.image}"
            alt="${note.alt}"
            class="nn-note-img"
            loading="lazy"
          />
        </div>
        <div class="nn-note-label-bar">
          <span class="nn-note-name">${note.name}</span>
        </div>
      `;

      const img = card.querySelector('img');
      if (img) {
        attachImageFallback(img, () => createNoteSvgFallback(note));
      }

      card.addEventListener('click', () => selectNote(note.id));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectNote(note.id);
        }
      });

      grid.appendChild(card);
    });
  }

  function init() {
    selectedNoteId = readSavedNote();

    const heroImg = document.querySelector('.nn-hero-image');
    if (heroImg) {
      attachImageFallback(heroImg, createHeroSvgFallback);
    }

    renderNotes();
    syncShopLinks();

    if (typeof window.updateHeaderCounters === 'function') {
      try {
        window.updateHeaderCounters();
      } catch {
        // Ignore if shared helper is unavailable
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
