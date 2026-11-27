/**
 * Notes & Noir Fragrances — Shop by Fragrance Notes (notes_i263084.js)
 * Handles dynamic 9-note rendering, keyboard accessibility, localStorage persistence,
 * fragrance filtering, wishlist/cart counter updates, and bespoke scent finder validation.
 */
'use strict';

(() => {
  const STORAGE_KEYS = {
    selectedNote: 'notesNoir_selectedNote',
    wishlist: 'notesNoir_wishlist',
    cart: 'notesNoir_cart'
  };

  /**
   * Exact 9 fragrance notes required in display order.
   */
  const FRAGRANCE_NOTES = [
    {
      id: 'citrus',
      name: 'Citrus',
      image: '../images/notes/citrus.jpg',
      alt: 'Close-up macro of sunlit Calabrian bergamot and golden citrus zest',
      palette: ['#F6D78F', '#E49F4A'],
      sensoryDescription:
        'Crisp, luminous, and effervescent. Cold-pressed Calabrian bergamot, blood orange, and yuzu bring bright, sunlit clarity to top-note openings.'
    },
    {
      id: 'floral',
      name: 'Floral',
      image: '../images/notes/floral.jpg',
      alt: 'Close-up macro of fresh white jasmine and velvet rose petals in soft daylight',
      palette: ['#F3E8E2', '#D8B4A8'],
      sensoryDescription:
        'Dewy, poetic, and expressive. Night-blooming Sambac jasmine, Grasse rose centifolia, and powdery iris unfold with refined botanical elegance.'
    },
    {
      id: 'woody',
      name: 'Woody',
      image: '../images/notes/woody.jpg',
      alt: 'Close-up macro of sculpted cedarwood bark and warm sandalwood shavings',
      palette: ['#C8A887', '#7A5438'],
      sensoryDescription:
        'Grounded, architectural, and serene. Atlas cedar, creamy Mysore sandalwood, and smoky Haitian vetiver anchor every composition with depth.'
    },
    {
      id: 'vanilla',
      name: 'Vanilla',
      image: '../images/notes/vanilla.jpg',
      alt: 'Close-up macro of glossy dark Madagascar vanilla pods and warm cream blossoms',
      palette: ['#EAD5B8', '#8F6442'],
      sensoryDescription:
        'Velvety, comforting, and enveloping. Hand-cured Madagascar bourbon vanilla bean balances dark, resinous warmth against soft skin-like sweetness.'
    },
    {
      id: 'spicy',
      name: 'Spicy',
      image: '../images/notes/spicy.jpg',
      alt: 'Close-up macro of whole green cardamom pods, saffron threads, and pink peppercorns',
      palette: ['#D5976E', '#8C3E2A'],
      sensoryDescription:
        'Vibrant, textured, and magnetic. Crushed black cardamom, Kashmiri saffron, and pink pepper ignite compositions with warm aromatic intrigue.'
    },
    {
      id: 'amber',
      name: 'Amber',
      image: '../images/notes/amber.jpg',
      alt: 'Close-up macro of translucent golden labdanum and benzoin amber resin droplets',
      palette: ['#E8AE68', '#8C4E1F'],
      sensoryDescription:
        'Golden, opulent, and lingering. Cistus labdanum, Siam benzoin, and warm balsamic resins glow softly on the skin long into the evening.'
    },
    {
      id: 'musk',
      name: 'Musk',
      image: '../images/notes/musk.jpg',
      alt: 'Close-up macro of soft ivory cashmere silk and botanical ambrette seeds',
      palette: ['#ECE5DD', '#B5AAA0'],
      sensoryDescription:
        'Intimate, clean, and tactile. Botanical ambrette seed and airy white cashmere musks melt seamlessly into skin for an effortless signature.'
    },
    {
      id: 'fresh',
      name: 'Fresh',
      image: '../images/notes/fresh.jpg',
      alt: 'Close-up macro of morning dew on crushed fig leaf and crisp neroli blossoms',
      palette: ['#CFE0D5', '#6E9180'],
      sensoryDescription:
        'Airy, green, and restorative. Rain-washed fig leaf, Mediterranean sea salt, and crisp neroli evoke cool coastal air at dawn.'
    },
    {
      id: 'gourmand',
      name: 'Gourmand',
      image: '../images/notes/gourmand.jpg',
      alt: 'Close-up macro of roasted hazelnut praline, dark cacao nibs, and tonka bean',
      palette: ['#C99E78', '#5E3B28'],
      sensoryDescription:
        'Rich, indulgent, and decadent. Toasted hazelnut praline, dark roasted cacao, and spiced tonka bean create an irresistible evening trail.'
    }
  ];

  /**
   * Curated Notes & Noir perfume catalog (used directly or extended by window.NN_DATA).
   */
  const DEFAULT_PERFUMES = [
    {
      id: 'nn-bergamot-soleil',
      name: 'Bergamot Soleil',
      concentration: 'Eau de Parfum',
      size: '100 ml',
      price: 165,
      intensity: 'subtle',
      notes: ['citrus', 'fresh', 'musk'],
      noteLabels: ['Citrus', 'Fresh', 'Musk'],
      image: '../images/perfumes/bergamot-soleil.jpg',
      description: 'Sun-drenched Calabrian bergamot and crushed petitgrain over airy white cedar musk.'
    },
    {
      id: 'nn-jasmin-nocturne',
      name: 'Jasmin Nocturne',
      concentration: 'Extrait de Parfum',
      size: '50 ml',
      price: 210,
      intensity: 'bold',
      notes: ['floral', 'amber', 'musk'],
      noteLabels: ['Floral', 'Amber', 'Musk'],
      image: '../images/perfumes/jasmin-nocturne.jpg',
      description: 'Night-harvested Sambac jasmine wrapped in golden benzoin resin and warm skin musk.'
    },
    {
      id: 'nn-cedar-vetiver',
      name: 'Cedar & Smoked Vetiver',
      concentration: 'Eau de Parfum',
      size: '100 ml',
      price: 175,
      intensity: 'balanced',
      notes: ['woody', 'spicy', 'fresh'],
      noteLabels: ['Woody', 'Spicy', 'Fresh'],
      image: '../images/perfumes/cedar-vetiver.jpg',
      description: 'Dry Atlas cedarwood paired with Haitian vetiver roots and cracked black pepper.'
    },
    {
      id: 'nn-vanille-doree',
      name: 'Vanille Dorée',
      concentration: 'Extrait de Parfum',
      size: '75 ml',
      price: 195,
      intensity: 'bold',
      notes: ['vanilla', 'amber', 'gourmand'],
      noteLabels: ['Vanilla', 'Amber', 'Gourmand'],
      image: '../images/perfumes/vanille-doree.jpg',
      description: 'Smoky Madagascar vanilla pods steeped in labdanum amber and caramelized tonka.'
    },
    {
      id: 'nn-saffron-cardamom',
      name: 'Saffron & Black Cardamom',
      concentration: 'Eau de Parfum',
      size: '100 ml',
      price: 185,
      intensity: 'bold',
      notes: ['spicy', 'woody', 'amber'],
      noteLabels: ['Spicy', 'Woody', 'Amber'],
      image: '../images/perfumes/saffron-cardamom.jpg',
      description: 'Roasted cardamom pods and crimson saffron threads balanced by creamy sandalwood.'
    },
    {
      id: 'nn-ambre-velours',
      name: 'Ambre Velours',
      concentration: 'Extrait de Parfum',
      size: '50 ml',
      price: 205,
      intensity: 'bold',
      notes: ['amber', 'vanilla', 'spicy'],
      noteLabels: ['Amber', 'Vanilla', 'Spicy'],
      image: '../images/perfumes/ambre-velours.jpg',
      description: 'Luminous cistus labdanum, warm cinnamon bark, and velvety bourbon vanilla.'
    },
    {
      id: 'nn-cashmere-skin',
      name: 'Cashmere Skin',
      concentration: 'Eau de Parfum',
      size: '100 ml',
      price: 155,
      intensity: 'subtle',
      notes: ['musk', 'floral', 'woody'],
      noteLabels: ['Musk', 'Floral', 'Woody'],
      image: '../images/perfumes/cashmere-skin.jpg',
      description: 'Botanical ambrette seed, powdery white iris, and soft blonde sandalwood.'
    },
    {
      id: 'nn-neroli-rain',
      name: 'Neroli & Morning Rain',
      concentration: 'Eau de Toilette',
      size: '100 ml',
      price: 140,
      intensity: 'subtle',
      notes: ['fresh', 'citrus', 'floral'],
      noteLabels: ['Fresh', 'Citrus', 'Floral'],
      image: '../images/perfumes/neroli-rain.jpg',
      description: 'Dewy fig leaves, Tunisian neroli blossom, and crisp mandarin peel.'
    },
    {
      id: 'nn-praline-noir',
      name: 'Praline & Tonka Noir',
      concentration: 'Eau de Parfum',
      size: '75 ml',
      price: 180,
      intensity: 'balanced',
      notes: ['gourmand', 'vanilla', 'woody'],
      noteLabels: ['Gourmand', 'Vanilla', 'Woody'],
      image: '../images/perfumes/praline-noir.jpg',
      description: 'Toasted hazelnut praline and dark cacao nibs grounded by roasted oakwood.'
    },
    {
      id: 'nn-yuzu-sea-salt',
      name: 'Yuzu & Coastal Sage',
      concentration: 'Eau de Parfum',
      size: '100 ml',
      price: 160,
      intensity: 'balanced',
      notes: ['citrus', 'fresh', 'woody'],
      noteLabels: ['Citrus', 'Fresh', 'Woody'],
      image: '../images/perfumes/yuzu-sea-salt.jpg',
      description: 'Sparkling Japanese yuzu zest, mineral sea salt, and sun-bleached driftwood.'
    },
    {
      id: 'nn-rose-epicee',
      name: 'Rose Épicée',
      concentration: 'Eau de Parfum',
      size: '75 ml',
      price: 178,
      intensity: 'balanced',
      notes: ['floral', 'spicy', 'musk'],
      noteLabels: ['Floral', 'Spicy', 'Musk'],
      image: '../images/perfumes/rose-epicee.jpg',
      description: 'Velvet Damask rose spiced with pink peppercorn over clean cashmere musk.'
    },
    {
      id: 'nn-cacao-santale',
      name: 'Cacao & Santal',
      concentration: 'Extrait de Parfum',
      size: '50 ml',
      price: 198,
      intensity: 'balanced',
      notes: ['gourmand', 'amber', 'musk'],
      noteLabels: ['Gourmand', 'Amber', 'Musk'],
      image: '../images/perfumes/cacao-santale.jpg',
      description: 'Bitter dark chocolate, warm benzoin, and whipped vanilla-musk drydown.'
    }
  ];

  // Use shared data array if provided by data_i263084.js, otherwise fall back cleanly.
  const PERFUMES =
    Array.isArray(window.NN_PERFUMES) && window.NN_PERFUMES.length > 0
      ? window.NN_PERFUMES
      : DEFAULT_PERFUMES;

  const state = {
    selectedNote: null,
    wishlist: [],
    cart: []
  };

  /* --------------------------------------------------------------------------
     LocalStorage Helpers
     -------------------------------------------------------------------------- */
  function readJsonStorage(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }

  function readSelectedNote() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.selectedNote);
      if (!saved) return null;
      const isValid = FRAGRANCE_NOTES.some((note) => note.id === saved);
      return isValid ? saved : null;
    } catch {
      return null;
    }
  }

  function saveSelectedNote(noteId) {
    try {
      if (noteId) {
        window.localStorage.setItem(STORAGE_KEYS.selectedNote, noteId);
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.selectedNote);
      }
    } catch {
      // Ignore storage restrictions gracefully
    }
  }

  /* --------------------------------------------------------------------------
     Inline SVG Fallbacks for Local Image Assets
     -------------------------------------------------------------------------- */
  function createHeroSvgFallback() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-label="Notes and Noir perfume bottle with white jasmine blossoms on beige silk">
        <defs>
          <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#EFE5D8"/>
            <stop offset="55%" stop-color="#DFD0BE"/>
            <stop offset="100%" stop-color="#CDBBA6"/>
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.92"/>
            <stop offset="50%" stop-color="#E7D8C3" stop-opacity="0.72"/>
            <stop offset="100%" stop-color="#C9AF8E" stop-opacity="0.88"/>
          </linearGradient>
        </defs>
        <rect width="640" height="420" fill="url(#silk)"/>
        <path d="M0 320 Q180 265 360 315 T640 285 L640 420 L0 420 Z" fill="#D5C4B0" opacity="0.55"/>
        <ellipse cx="330" cy="340" rx="125" ry="22" fill="#9D8974" opacity="0.28"/>
        <!-- Bottle Cap & Collar -->
        <rect x="294" y="76" width="72" height="44" rx="4" fill="#1A1A1A"/>
        <rect x="308" y="120" width="44" height="14" fill="#B5966F"/>
        <!-- Bottle Body -->
        <rect x="248" y="134" width="164" height="202" rx="14" fill="url(#glass)" stroke="#B8A38B" stroke-width="2"/>
        <rect x="268" y="168" width="124" height="118" rx="4" fill="#FAF6F0" stroke="#D8CBB9" stroke-width="1.5"/>
        <text x="330" y="218" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#1A1A1A">Notes &amp; Noir</text>
        <text x="330" y="242" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" letter-spacing="3" fill="#6E645A">FRAGRANCES</text>
        <!-- White Jasmine Blossoms -->
        <g transform="translate(178 292)" fill="#FFFDFB" stroke="#E2D9CE" stroke-width="1">
          <ellipse cx="0" cy="-18" rx="9" ry="18"/>
          <ellipse cx="17" cy="-5" rx="9" ry="18" transform="rotate(72 17 -5)"/>
          <ellipse cx="11" cy="15" rx="9" ry="18" transform="rotate(144 11 15)"/>
          <ellipse cx="-11" cy="15" rx="9" ry="18" transform="rotate(216 -11 15)"/>
          <ellipse cx="-17" cy="-5" rx="9" ry="18" transform="rotate(288 -17 -5)"/>
          <circle cx="0" cy="0" r="6" fill="#E8C97A"/>
        </g>
        <g transform="translate(465 304) scale(0.88)" fill="#FFFDFB" stroke="#E2D9CE" stroke-width="1">
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
    const [light, dark] = note.palette || ['#E8DFD5', '#9A846B'];
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
        <defs>
          <radialGradient id="g-${note.id}" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="100%" stop-color="${dark}"/>
          </radialGradient>
        </defs>
        <rect width="300" height="400" fill="url(#g-${note.id})"/>
        <circle cx="150" cy="155" r="78" fill="#FFFFFF" opacity="0.22"/>
        <circle cx="190" cy="215" r="54" fill="#1A1A1A" opacity="0.08"/>
        <circle cx="110" cy="205" r="40" fill="#FFFFFF" opacity="0.16"/>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function createPerfumeSvgFallback(perfume) {
    const primaryNote = FRAGRANCE_NOTES.find((n) => n.id === perfume.notes[0]);
    const [light, dark] = primaryNote ? primaryNote.palette : ['#EDE5DC', '#B8A48D'];
    const safeTitle = perfume.name.replace(/&/g, '&amp;');
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="bg-${perfume.id}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="100%" stop-color="${dark}"/>
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg-${perfume.id})" opacity="0.48"/>
        <rect width="400" height="300" fill="#F7F3EE" opacity="0.42"/>
        <ellipse cx="200" cy="252" rx="68" ry="12" fill="#1A1A1A" opacity="0.12"/>
        <rect x="178" y="48" width="44" height="28" rx="3" fill="#1A1A1A"/>
        <rect x="148" y="82" width="104" height="162" rx="10" fill="#FFFDF9" fill-opacity="0.88" stroke="#C5B6A4" stroke-width="1.5"/>
        <rect x="160" y="114" width="80" height="72" rx="2" fill="#FAF6F0" stroke="#DDD3C7"/>
        <text x="200" y="146" text-anchor="middle" font-family="Georgia, serif" font-size="10.5" fill="#1A1A1A">${safeTitle}</text>
        <text x="200" y="164" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" letter-spacing="1.8" fill="#6E645A">NOTES &amp; NOIR</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function attachImageFallback(imgElement, getFallbackUri) {
    const applyFallback = () => {
      if (imgElement.dataset.fallbackApplied === 'true') return;
      imgElement.dataset.fallbackApplied = 'true';
      imgElement.src = getFallbackUri();
    };

    imgElement.addEventListener('error', applyFallback);
    if (imgElement.complete && imgElement.naturalWidth === 0) {
      applyFallback();
    }
  }

  /* --------------------------------------------------------------------------
     Header Counters Sync (Integrates with shared_i263084.js & localStorage)
     -------------------------------------------------------------------------- */
  function updateHeaderCounters() {
    const wishlistTotal = state.wishlist.length;
    const cartTotal = state.cart.reduce((sum, item) => sum + (item.qty || 1), 0);

    document
      .querySelectorAll('#wishlist-count, .wishlist-count, [data-wishlist-count]')
      .forEach((el) => {
        el.textContent = String(wishlistTotal);
      });

    document
      .querySelectorAll('#cart-count, .cart-count, [data-cart-count]')
      .forEach((el) => {
        el.textContent = String(cartTotal);
      });

    if (typeof window.updateHeaderCounters === 'function') {
      try {
        window.updateHeaderCounters();
      } catch {
        // Ignore if shared helper expects different global state
      }
    }
  }

  function announceFeedback(message) {
    const feedbackEl = document.getElementById('action-feedback');
    if (!feedbackEl) return;
    feedbackEl.textContent = message;
    feedbackEl.classList.remove('visually-hidden');

    window.clearTimeout(announceFeedback.timerId);
    announceFeedback.timerId = window.setTimeout(() => {
      feedbackEl.classList.add('visually-hidden');
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     Render 9 Fragrance Note Cards
     -------------------------------------------------------------------------- */
  function renderNoteCards() {
    const grid = document.getElementById('fragrance-notes-grid');
    if (!grid) return;

    grid.innerHTML = '';

    FRAGRANCE_NOTES.forEach((note) => {
      const isSelected = state.selectedNote === note.id;
      const card = document.createElement('div');
      card.className = `nn-note-card${isSelected ? ' is-active' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', String(isSelected));
      card.setAttribute('aria-label', `Filter by ${note.name} fragrance note`);
      card.dataset.noteId = note.id;

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

      card.addEventListener('click', () => handleNoteToggle(note.id));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleNoteToggle(note.id);
        }
      });

      grid.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     Render Sensory Note Banner & Filtered Perfumes
     -------------------------------------------------------------------------- */
  function updateSensoryBanner(filteredCount) {
    const kickerEl = document.getElementById('note-banner-kicker');
    const titleEl = document.getElementById('filtered-results-heading');
    const descEl = document.getElementById('note-banner-description');
    const countPill = document.getElementById('results-count-pill');
    const bannerResetBtn = document.getElementById('banner-reset-btn');
    const topResetBtn = document.getElementById('reset-note-filter-btn');
    const finderHintEl = document.getElementById('finder-active-note-hint');

    const activeNoteObj = FRAGRANCE_NOTES.find((n) => n.id === state.selectedNote);

    if (activeNoteObj) {
      if (kickerEl) kickerEl.textContent = 'Selected Olfactory Family';
      if (titleEl) titleEl.textContent = `${activeNoteObj.name} Fragrance Creations`;
      if (descEl) descEl.textContent = activeNoteObj.sensoryDescription;
      if (bannerResetBtn) bannerResetBtn.classList.remove('d-none');
      if (topResetBtn) topResetBtn.classList.remove('d-none');
      if (finderHintEl) {
        finderHintEl.innerHTML = `Active focus: <strong>${activeNoteObj.name} Notes</strong>`;
      }
    } else {
      if (kickerEl) kickerEl.textContent = 'Signature Collection';
      if (titleEl) titleEl.textContent = 'All Notes & Noir Creations';
      if (descEl) {
        descEl.textContent =
          'Select any fragrance note above to explore its botanical origin, olfactory character, and curated eau de parfum pairings.';
      }
      if (bannerResetBtn) bannerResetBtn.classList.add('d-none');
      if (topResetBtn) topResetBtn.classList.add('d-none');
      if (finderHintEl) {
        finderHintEl.innerHTML = 'Active focus: <strong>All Note Families</strong>';
      }
    }

    if (countPill) {
      const label = filteredCount === 1 ? '1 Fragrance' : `${filteredCount} Fragrances`;
      countPill.textContent = label;
    }
  }

  function renderPerfumes() {
    const grid = document.getElementById('perfumes-grid');
    const emptyState = document.getElementById('perfumes-empty-state');
    if (!grid || !emptyState) return;

    const filtered = state.selectedNote
      ? PERFUMES.filter((perfume) => perfume.notes.includes(state.selectedNote))
      : PERFUMES;

    updateSensoryBanner(filtered.length);
    grid.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.classList.remove('d-none');
      return;
    }

    emptyState.classList.add('d-none');

    filtered.forEach((perfume) => {
      const isWishlisted = state.wishlist.includes(perfume.id);
      const col = document.createElement('div');
      col.className = 'col-xl-3 col-lg-4 col-md-6';

      const noteChipsHtml = perfume.notes
        .map((noteKey, idx) => {
          const displayLabel = (perfume.noteLabels && perfume.noteLabels[idx]) || noteKey;
          const highlighted = state.selectedNote === noteKey ? ' is-highlighted' : '';
          return `<span class="nn-note-chip${highlighted}">${displayLabel}</span>`;
        })
        .join('');

      col.innerHTML = `
        <article class="nn-perfume-card">
          <div class="nn-perfume-media">
            <img
              src="${perfume.image}"
              alt="${perfume.name} ${perfume.concentration} bottle"
              class="nn-perfume-img"
              loading="lazy"
            />
            <span class="nn-perfume-badge">${perfume.concentration}</span>
          </div>
          <div class="nn-perfume-body">
            <div class="nn-perfume-meta-row">
              <h3 class="nn-perfume-title">${perfume.name}</h3>
              <span class="nn-perfume-price">$${perfume.price}</span>
            </div>
            <p class="nn-perfume-specs">${perfume.concentration} &middot; ${perfume.size}</p>
            <p class="nn-perfume-desc">${perfume.description}</p>
            <div class="nn-perfume-tags" aria-label="Fragrance notes">
              ${noteChipsHtml}
            </div>
            <div class="nn-perfume-actions">
              <button
                type="button"
                class="btn nn-btn-dark js-add-to-cart"
                data-perfume-id="${perfume.id}"
              >
                Add to Cart
              </button>
              <button
                type="button"
                class="btn nn-btn-outline-dark js-toggle-wishlist${isWishlisted ? ' is-wishlisted' : ''}"
                data-perfume-id="${perfume.id}"
                aria-pressed="${String(isWishlisted)}"
                aria-label="${isWishlisted ? `Remove ${perfume.name} from wishlist` : `Add ${perfume.name} to wishlist`}"
              >
                ${isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>
          </div>
        </article>
      `;

      const img = col.querySelector('img');
      if (img) {
        attachImageFallback(img, () => createPerfumeSvgFallback(perfume));
      }

      const cartBtn = col.querySelector('.js-add-to-cart');
      if (cartBtn) {
        cartBtn.addEventListener('click', () => handleAddToCart(perfume));
      }

      const wishlistBtn = col.querySelector('.js-toggle-wishlist');
      if (wishlistBtn) {
        wishlistBtn.addEventListener('click', () => handleToggleWishlist(perfume, wishlistBtn));
      }

      grid.appendChild(col);
    });
  }

  /* --------------------------------------------------------------------------
     Note Selection, Wishlist, and Cart Interactions
     -------------------------------------------------------------------------- */
  function handleNoteToggle(noteId) {
    state.selectedNote = state.selectedNote === noteId ? null : noteId;
    saveSelectedNote(state.selectedNote);
    renderNoteCards();
    renderPerfumes();
  }

  function resetFilter() {
    state.selectedNote = null;
    saveSelectedNote(null);
    renderNoteCards();
    renderPerfumes();
  }

  function handleAddToCart(perfume) {
    const existing = state.cart.find((item) => item.id === perfume.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: perfume.id,
        name: perfume.name,
        price: perfume.price,
        size: perfume.size,
        qty: 1
      });
    }

    writeJsonStorage(STORAGE_KEYS.cart, state.cart);
    updateHeaderCounters();
    announceFeedback(`Added ${perfume.name} (${perfume.size}) to your shopping bag.`);
  }

  function handleToggleWishlist(perfume, buttonEl) {
    const index = state.wishlist.indexOf(perfume.id);
    let added = false;

    if (index === -1) {
      state.wishlist.push(perfume.id);
      added = true;
    } else {
      state.wishlist.splice(index, 1);
    }

    writeJsonStorage(STORAGE_KEYS.wishlist, state.wishlist);
    updateHeaderCounters();

    if (buttonEl) {
      buttonEl.classList.toggle('is-wishlisted', added);
      buttonEl.setAttribute('aria-pressed', String(added));
      buttonEl.setAttribute(
        'aria-label',
        added ? `Remove ${perfume.name} from wishlist` : `Add ${perfume.name} to wishlist`
      );
      buttonEl.textContent = added ? 'Wishlisted' : 'Wishlist';
    }

    announceFeedback(
      added
        ? `${perfume.name} saved to your wishlist.`
        : `${perfume.name} removed from your wishlist.`
    );
  }

  /* --------------------------------------------------------------------------
     Scent Pairing / Note Finder Form Validation & Recommendation
     -------------------------------------------------------------------------- */
  function initScentFinderForm() {
    const form = document.getElementById('scent-finder-form');
    const emailInput = document.getElementById('finder-email');
    const intensityError = document.getElementById('intensity-error');
    const emailError = document.getElementById('email-error');
    const resultContainer = document.getElementById('finder-recommendation-result');

    if (!form || !emailInput || !intensityError || !emailError || !resultContainer) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function getSelectedIntensity() {
      const checked = form.querySelector('input[name="intensity"]:checked');
      return checked ? checked.value : '';
    }

    function validateIntensity() {
      const intensity = getSelectedIntensity();
      if (!intensity) {
        intensityError.textContent = 'Please select your preferred note intensity.';
        return false;
      }
      intensityError.textContent = '';
      return true;
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      if (!value) {
        emailError.textContent = 'Please enter your email address.';
        emailInput.classList.add('is-invalid');
        return false;
      }
      if (!emailRegex.test(value)) {
        emailError.textContent = 'Please enter a valid email address (e.g., name@domain.com).';
        emailInput.classList.add('is-invalid');
        return false;
      }
      emailError.textContent = '';
      emailInput.classList.remove('is-invalid');
      return true;
    }

    form.querySelectorAll('input[name="intensity"]').forEach((radio) => {
      radio.addEventListener('change', validateIntensity);
    });

    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid') || emailInput.value.trim().length > 0) {
        validateEmail();
      }
    });

    emailInput.addEventListener('blur', validateEmail);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const isIntensityValid = validateIntensity();
      const isEmailValid = validateEmail();

      if (!isIntensityValid || !isEmailValid) {
        resultContainer.classList.add('d-none');
        if (!isIntensityValid) {
          const firstRadio = form.querySelector('input[name="intensity"]');
          if (firstRadio) firstRadio.focus();
        } else {
          emailInput.focus();
        }
        return;
      }

      const intensity = getSelectedIntensity();
      const email = emailInput.value.trim();

      // Match active note + chosen intensity, falling back gracefully to intensity match
      const noteScopedMatches = state.selectedNote
        ? PERFUMES.filter((p) => p.notes.includes(state.selectedNote) && p.intensity === intensity)
        : [];
      const intensityMatches = PERFUMES.filter((p) => p.intensity === intensity);
      const recommended =
        noteScopedMatches[0] ||
        (state.selectedNote
          ? PERFUMES.find((p) => p.notes.includes(state.selectedNote))
          : null) ||
        intensityMatches[0] ||
        PERFUMES[0];

      const intensityLabelMap = {
        subtle: 'Subtle & Skin-Close',
        balanced: 'Balanced & Everyday',
        bold: 'Bold & Long-Lasting'
      };

      resultContainer.innerHTML = `
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <span class="nn-banner-kicker">Your Bespoke Match &middot; ${intensityLabelMap[intensity]}</span>
            <h3 class="nn-perfume-title mt-1 mb-1">${recommended.name} (${recommended.concentration})</h3>
            <p class="nn-perfume-desc mb-1">${recommended.description}</p>
            <p class="small text-muted mb-0">
              Pairing notes sent to <strong>${escapeHtml(email)}</strong> &middot; ${recommended.size} &middot; $${recommended.price}
            </p>
          </div>
          <div class="flex-shrink-0">
            <button type="button" class="btn nn-btn-dark js-rec-add-cart">
              Add Recommended ($${recommended.price})
            </button>
          </div>
        </div>
      `;

      resultContainer.classList.remove('d-none');

      const recCartBtn = resultContainer.querySelector('.js-rec-add-cart');
      if (recCartBtn) {
        recCartBtn.addEventListener('click', () => handleAddToCart(recommended));
      }
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */
  function init() {
    state.selectedNote = readSelectedNote();
    state.wishlist = readJsonStorage(STORAGE_KEYS.wishlist, []);
    state.cart = readJsonStorage(STORAGE_KEYS.cart, []);

    const heroImg = document.querySelector('.nn-hero-image');
    if (heroImg) {
      attachImageFallback(heroImg, createHeroSvgFallback);
    }

    const resetButtons = [
      document.getElementById('reset-note-filter-btn'),
      document.getElementById('banner-reset-btn'),
      document.getElementById('empty-reset-btn')
    ];
    resetButtons.forEach((btn) => {
      if (btn) btn.addEventListener('click', resetFilter);
    });

    renderNoteCards();
    renderPerfumes();
    updateHeaderCounters();
    initScentFinderForm();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
