/**
 * Notes & Noir Fragrances — About Us Controller (about_i263083)
 * Pure Vanilla JavaScript (ES6+) managing:
 * 1. Dynamic Ingredient Card Rendering from Data Array
 * 2. Live Header Search Overlay with Catalog Filtering
 * 3. Interactive Fragrance Pyramid Tabs (Top / Heart / Base)
 * 4. Ingredient Detail Modal with Add-to-Cart
 * 5. Signature Concentration & Longevity Calculator
 * 6. Newsletter / Consultation Form with Live Validation
 * 7. localStorage Sync (Cart, Wishlist, Newsletter Status)
 * 8. Mobile Navigation, Keyboard Accessibility & Edge Cases
 */

'use strict';

/* ==========================================================================
   1. Configuration & Shared Data
   ========================================================================== */

const STORAGE_KEYS = {
  CART: 'notesAndNoir_cart',
  WISHLIST: 'notesAndNoir_wishlist',
  ORDERS: 'notesAndNoir_orders',
  NEWSLETTER: 'notesAndNoir_newsletter_subs'
};

const FREE_SHIPPING_THRESHOLD = 75;

/**
 * Fallback inline SVG data URI used if an image fails to load,
 * ensuring broken-image icons never appear in the UI.
 */
const FALLBACK_BOTTLE_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="10" fill="#EFECE6"/>
      <rect x="46" y="18" width="28" height="16" rx="3" fill="#C5A059"/>
      <rect x="52" y="34" width="16" height="8" fill="#8D7343"/>
      <rect x="33" y="42" width="54" height="60" rx="8" fill="#2A2019" stroke="#C5A059" stroke-width="2"/>
      <rect x="42" y="56" width="36" height="30" rx="3" fill="#FBF8F3"/>
      <text x="60" y="75" text-anchor="middle" font-family="Georgia, serif" font-size="8" fill="#14110F">N&amp;N</text>
    </svg>`
  );

/**
 * Complete fragrance catalog — shared data array powering the
 * search overlay, calculator recommendations, and add-to-cart.
 */
const FRAGRANCE_CATALOG = [
  {
    id: 'noir-essence',
    name: 'Noir Essence',
    size: '100 ml',
    price: 95,
    notes: 'Jasmine, Smoked Amber, Cedarwood',
    family: 'Oriental / Amber',
    concentration: 'Extrait de Parfum',
    oilPercent: 30,
    wearHours: 14,
    occasion: 'Evening Gala',
    image: '../images/hero-bestsellers-noir.jpg'
  },
  {
    id: 'royal-essence',
    name: 'Royal Essence',
    size: '100 ml',
    price: 88,
    notes: 'Lavender, Bergamot, Royal Iris',
    family: 'Fresh Citrus',
    concentration: 'Eau de Parfum',
    oilPercent: 20,
    wearHours: 10,
    occasion: 'Daily Office',
    image: '../images/bestsellers/royal-essence.jpg'
  },
  {
    id: 'midnight-oud',
    name: 'Midnight Oud',
    size: '100 ml',
    price: 115,
    notes: 'Black Oud, Saffron, Smoked Leather',
    family: 'Woody',
    concentration: 'Extrait de Parfum',
    oilPercent: 32,
    wearHours: 16,
    occasion: 'Evening Gala',
    image: '../images/bestsellers/midnight-oud.svg'
  },
  {
    id: 'amber-touch',
    name: 'Amber Touch',
    size: '50 ml',
    price: 65,
    notes: 'Warm Amber, Madagascar Vanilla, Tonka',
    family: 'Oriental / Amber',
    concentration: 'Eau de Parfum',
    oilPercent: 22,
    wearHours: 10,
    occasion: 'Intimate Dinner',
    image: '../images/bestsellers/amber-touch.jpg'
  },
  {
    id: 'velvet-musk',
    name: 'Velvet Musk',
    size: '100 ml',
    price: 72,
    notes: 'White Musk, Sandalwood, Cashmere',
    family: 'Woody',
    concentration: 'Eau de Parfum',
    oilPercent: 20,
    wearHours: 9,
    occasion: 'Daily Office',
    image: '../images/bestsellers/velvet-musk.jpg'
  },
  {
    id: 'blush-bloom',
    name: 'Blush Bloom',
    size: '50 ml',
    price: 58,
    notes: 'Damask Rose, Peony, Pink Pepper',
    family: 'Floral',
    concentration: 'Eau de Parfum',
    oilPercent: 18,
    wearHours: 8,
    occasion: 'Daily Office',
    image: '../images/bestsellers/blush-bloom.jpg'
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    size: '100 ml',
    price: 68,
    notes: 'Sea Salt, Neroli, White Driftwood',
    family: 'Fresh Citrus',
    concentration: 'Eau de Toilette',
    oilPercent: 12,
    wearHours: 6,
    occasion: 'Daily Office',
    image: '../images/bestsellers/ocean-breeze.jpg'
  }
];

/**
 * Signature Ingredients & Craftsmanship Pillars data array.
 * Rendered dynamically as cards in the about page.
 */
const SIGNATURE_INGREDIENTS = [
  {
    id: 'grasse-jasmine',
    name: 'Grasse Jasmine',
    emoji: '🌸',
    origin: 'Grasse, France',
    extraction: 'Solvent Extraction (Enfleurage Heritage)',
    longevity: 4,
    pairing: 'Noir Essence',
    pairingId: 'noir-essence',
    description: 'Hand-picked at dawn from the terraced fields of Grasse, our jasmine absolute yields an intoxicating, creamy floral heart with honeyed depth.',
    maceration: '6 months cold maceration',
    concentration: 'Extrait de Parfum 30%'
  },
  {
    id: 'mysore-sandalwood',
    name: 'Aged Mysore Sandalwood',
    emoji: '🪵',
    origin: 'Mysore, India',
    extraction: 'Steam Distillation (60-year heartwood)',
    longevity: 5,
    pairing: 'Velvet Musk',
    pairingId: 'velvet-musk',
    description: 'Sourced from sustainably managed plantations, our sandalwood oil is distilled from heartwood aged over six decades, producing an unmatched creamy, woody warmth.',
    maceration: '8 months cask maturation',
    concentration: 'Eau de Parfum 20%'
  },
  {
    id: 'madagascar-vanilla',
    name: 'Madagascar Vanilla Bean',
    emoji: '🫘',
    origin: 'Antsirabe, Madagascar',
    extraction: 'CO₂ Supercritical Extraction',
    longevity: 4,
    pairing: 'Amber Touch',
    pairingId: 'amber-touch',
    description: 'Our vanilla absolute is extracted using supercritical CO₂, preserving the bean\'s full spectrum of over 250 aromatic compounds for a rich, gourmand base note.',
    maceration: '4 months blending rest',
    concentration: 'Eau de Parfum 22%'
  },
  {
    id: 'smoked-amber',
    name: 'Smoked Amber Resin',
    emoji: '🔥',
    origin: 'Baltic Coast & Oman',
    extraction: 'Dry Distillation over Applewood',
    longevity: 5,
    pairing: 'Midnight Oud',
    pairingId: 'midnight-oud',
    description: 'Baltic amber resin is slowly dry-distilled over smoldering applewood, then blended with Omani frankincense tears to create a smoky, resinous warmth unique to Notes & Noir.',
    maceration: '10 months slow infusion',
    concentration: 'Extrait de Parfum 32%'
  }
];

/**
 * Fragrance Pyramid data — Top, Heart, and Base notes
 * with detailed aroma profiles for the interactive tabs.
 */
const FRAGRANCE_PYRAMID = {
  top: {
    title: 'Top Notes — The First Impression',
    description: 'The lightest, most volatile molecules that greet your senses within the first 15 minutes. These citrus, herbal, and light floral accords create the initial burst of character before gracefully fading into the heart.',
    duration: 'Lasts 15–45 minutes',
    notes: [
      { emoji: '🍊', name: 'Calabrian Bergamot', role: 'Bright, sun-kissed citrus opening' },
      { emoji: '🌿', name: 'Clary Sage', role: 'Herbal freshness with a subtle sweetness' },
      { emoji: '🍋', name: 'Sicilian Lemon Zest', role: 'Effervescent, sparkling lift' },
      { emoji: '🫚', name: 'Pink Pepper', role: 'Spicy warmth that bridges to the heart' }
    ]
  },
  heart: {
    title: 'Heart Notes — The Soul of the Fragrance',
    description: 'The rich, full-bodied core that emerges as top notes dissipate. These floral, spice, and fruity accords define the fragrance\'s true character and personality, lingering for hours on skin.',
    duration: 'Lasts 2–4 hours',
    notes: [
      { emoji: '🌹', name: 'Turkish Damask Rose', role: 'Opulent, velvety floral heart' },
      { emoji: '🌸', name: 'Grasse Jasmine Absolute', role: 'Creamy, narcotic white floral' },
      { emoji: '🌺', name: 'Ylang-Ylang Extra', role: 'Exotic, tropical richness' },
      { emoji: '🫐', name: 'Iris Butter (Orris)', role: 'Powdery elegance and depth' }
    ]
  },
  base: {
    title: 'Base Notes — The Lasting Memory',
    description: 'The deepest, most persistent molecules that anchor the entire composition. These woody, resinous, and musky accords emerge after 30 minutes and can linger on skin and fabric for over 24 hours.',
    duration: 'Lasts 6–24+ hours',
    notes: [
      { emoji: '🪵', name: 'Mysore Sandalwood', role: 'Creamy, meditative woody warmth' },
      { emoji: '🔥', name: 'Smoked Amber Resin', role: 'Deep, resinous warmth' },
      { emoji: '🫘', name: 'Madagascar Vanilla', role: 'Gourmand sweetness and comfort' },
      { emoji: '🖤', name: 'Black Oud (Laos)', role: 'Dark, animalic complexity' }
    ]
  }
};

/* ==========================================================================
   2. Application State
   ========================================================================== */

const state = {
  cart: [],
  wishlist: [],
  lastFocusedElement: null
};

/* ==========================================================================
   3. Utility & Formatting Helpers
   ========================================================================== */

/** Format a number as USD currency string */
function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/** Safely read a JSON value from localStorage with fallback */
function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Safely write a JSON value to localStorage */
function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode restriction errors
  }
}

/** Announce a status message to screen readers via aria-live region */
function announceStatus(message) {
  const liveRegion = document.getElementById('about-status-live');
  if (liveRegion) {
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 30);
  }
}

/** Attach error-fallback handler to an img element */
function attachImageFallback(imgElement) {
  imgElement.addEventListener('error', () => {
    if (imgElement.src !== FALLBACK_BOTTLE_SVG) {
      imgElement.src = FALLBACK_BOTTLE_SVG;
    }
  });
}

/** Sanitize text for safe innerHTML insertion */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/* ==========================================================================
   4. State Initialization & localStorage Sync
   ========================================================================== */

/** Load cart and wishlist from localStorage into the state object */
function initializeState() {
  const storedCart = readJsonStorage(STORAGE_KEYS.CART, []);
  state.cart = Array.isArray(storedCart)
    ? storedCart.filter(
        (item) => item && typeof item.id === 'string' && Number(item.quantity) > 0
      )
    : [];

  const storedWishlist = readJsonStorage(STORAGE_KEYS.WISHLIST, []);
  state.wishlist = Array.isArray(storedWishlist) ? storedWishlist : [];
}

/** Persist current cart state to localStorage */
function saveCart() {
  writeJsonStorage(STORAGE_KEYS.CART, state.cart);
}

/** Persist current wishlist state to localStorage */
function saveWishlist() {
  writeJsonStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
}

/** Update the header cart and wishlist badge counters */
function updateHeaderCounters() {
  const totalCount = state.cart.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );
  const cartCounter = document.getElementById('header-cart-count');
  const wishlistCounter = document.getElementById('header-wishlist-count');

  if (cartCounter) cartCounter.textContent = String(totalCount);
  if (wishlistCounter) wishlistCounter.textContent = String(state.wishlist.length);
}

/**
 * Add a fragrance to the cart by product ID.
 * Updates localStorage so checkout.html immediately reflects the change.
 */
function addFragranceToCart(productId) {
  const product = FRAGRANCE_CATALOG.find((p) => p.id === productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      size: product.size,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  }

  saveCart();
  updateHeaderCounters();
  announceStatus(`Added ${product.name} to your cart.`);
}

/** Toggle a product in the wishlist */
function toggleWishlistItem(productId) {
  const idx = state.wishlist.indexOf(productId);
  if (idx === -1) {
    state.wishlist.push(productId);
  } else {
    state.wishlist.splice(idx, 1);
  }
  saveWishlist();
  updateHeaderCounters();
}

/* ==========================================================================
   5. Dynamic Ingredient Cards Rendering
   ========================================================================== */

/** Render the Signature Ingredients grid from the data array */
function renderIngredientCards() {
  const container = document.getElementById('ingredients-grid');
  if (!container) return;

  container.innerHTML = '';

  SIGNATURE_INGREDIENTS.forEach((ingredient) => {
    const card = document.createElement('article');
    card.className = 'ingredient-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Learn more about ${ingredient.name}`);
    card.setAttribute('data-ingredient-id', ingredient.id);

    // Build longevity pips (out of 5)
    let pipsHtml = '';
    for (let i = 1; i <= 5; i++) {
      pipsHtml += `<span class="longevity-bar__pip ${
        i <= ingredient.longevity ? 'longevity-bar__pip--filled' : ''
      }"></span>`;
    }

    card.innerHTML = `
      <div class="ingredient-card__icon" aria-hidden="true">${ingredient.emoji}</div>
      <h3 class="ingredient-card__name">${escapeHtml(ingredient.name)}</h3>
      <p class="ingredient-card__origin">${escapeHtml(ingredient.origin)}</p>
      <p class="ingredient-card__detail">${escapeHtml(ingredient.extraction)}</p>
      <div class="ingredient-card__longevity">
        <span>Longevity</span>
        <div class="longevity-bar" aria-label="Longevity rating ${ingredient.longevity} out of 5">
          ${pipsHtml}
        </div>
      </div>
      <span class="ingredient-card__cta">Discover extraction process →</span>
    `;

    container.appendChild(card);
  });
}

/* ==========================================================================
   6. Ingredient Detail Modal
   ========================================================================== */

/** Open an ingredient detail modal/lightbox */
function openIngredientModal(ingredientId) {
  const ingredient = SIGNATURE_INGREDIENTS.find((i) => i.id === ingredientId);
  if (!ingredient) return;

  const modalBody = document.getElementById('ingredient-modal-body');
  const modalTitle = document.getElementById('ingredient-modal-title');
  const modalSubtitle = document.getElementById('ingredient-modal-subtitle');

  if (!modalBody || !modalTitle) return;

  modalTitle.textContent = ingredient.name;
  if (modalSubtitle) modalSubtitle.textContent = ingredient.origin;

  modalBody.innerHTML = `
    <div class="modal-detail-row">
      <span class="modal-detail-row__label">Extraction Method</span>
      <span class="modal-detail-row__value">${escapeHtml(ingredient.extraction)}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-row__label">Maceration Time</span>
      <span class="modal-detail-row__value">${escapeHtml(ingredient.maceration)}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-row__label">Concentration</span>
      <span class="modal-detail-row__value">${escapeHtml(ingredient.concentration)}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-row__label">Longevity Rating</span>
      <span class="modal-detail-row__value">${ingredient.longevity} / 5</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-row__label">Best Paired With</span>
      <span class="modal-detail-row__value">${escapeHtml(ingredient.pairing)}</span>
    </div>
    <p style="margin:0;font-size:0.88rem;color:#5C5248;line-height:1.6;">
      ${escapeHtml(ingredient.description)}
    </p>
    <button type="button" class="btn-primary" id="modal-add-to-cart-btn" data-product-id="${escapeHtml(ingredient.pairingId)}">
      Add ${escapeHtml(ingredient.pairing)} to Cart
    </button>
  `;

  // Bind the add-to-cart button inside the modal
  const addBtn = document.getElementById('modal-add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addFragranceToCart(addBtn.getAttribute('data-product-id'));
      addBtn.textContent = 'Added to Cart ✓';
      addBtn.disabled = true;
      window.setTimeout(() => {
        closeModal('ingredient-modal');
      }, 1200);
    });
  }

  openModal('ingredient-modal');
}

/* ==========================================================================
   7. Modal Management (Open / Close / Focus Trap)
   ========================================================================== */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  state.lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const focusTarget = modal.querySelector(
    'button, [href], input, [tabindex]:not([tabindex="-1"])'
  );
  if (focusTarget) {
    window.setTimeout(() => focusTarget.focus(), 20);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';

  if (
    state.lastFocusedElement &&
    typeof state.lastFocusedElement.focus === 'function'
  ) {
    state.lastFocusedElement.focus();
  }
}

/* ==========================================================================
   8. Search Overlay & Live Filtering
   ========================================================================== */

function openSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  const triggerBtn = document.getElementById('open-search-btn');
  const searchInput = document.getElementById('catalog-search-input');
  if (!overlay) return;

  state.lastFocusedElement = document.activeElement;
  overlay.hidden = false;
  if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';

  renderSearchResults(searchInput ? searchInput.value : '');
  if (searchInput) {
    window.setTimeout(() => searchInput.focus(), 20);
  }
}

function closeSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  const triggerBtn = document.getElementById('open-search-btn');
  if (!overlay || overlay.hidden) return;

  overlay.hidden = true;
  if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';

  if (
    state.lastFocusedElement &&
    typeof state.lastFocusedElement.focus === 'function'
  ) {
    state.lastFocusedElement.focus();
  }
}

/**
 * Render search results filtered by the user's query.
 * Handles empty-result edge case with a helpful message.
 */
function renderSearchResults(query) {
  const resultsEl = document.getElementById('search-results');
  if (!resultsEl) return;

  const q = query.trim().toLowerCase();
  const filtered = FRAGRANCE_CATALOG.filter((item) => {
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q) ||
      item.family.toLowerCase().includes(q) ||
      String(item.price).includes(q)
    );
  });

  resultsEl.innerHTML = '';

  if (filtered.length === 0) {
    resultsEl.innerHTML = `<p class="search-empty">No fragrances matched "${escapeHtml(query)}". Try "Oud", "Noir", or "Amber".</p>`;
    return;
  }

  filtered.forEach((product) => {
    const isWishlisted = state.wishlist.includes(product.id);
    const card = document.createElement('div');
    card.className = 'search-result-card';
    card.innerHTML = `
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="search-result-card__img">
      <div class="search-result-card__info">
        <h3 class="search-result-card__title">${escapeHtml(product.name)}</h3>
        <p class="search-result-card__meta">${escapeHtml(product.size)} &middot; ${escapeHtml(product.notes)}</p>
        <div class="search-result-card__price">${formatCurrency(product.price)}</div>
      </div>
      <div class="search-result-card__actions">
        <button type="button" class="btn-mini btn-mini--dark" data-add-id="${escapeHtml(product.id)}">Add</button>
        <button type="button" class="btn-mini btn-mini--ghost ${isWishlisted ? 'is-active' : ''}" data-wish-id="${escapeHtml(product.id)}">
          ${isWishlisted ? 'Saved' : 'Wishlist'}
        </button>
      </div>
    `;

    const img = card.querySelector('.search-result-card__img');
    if (img) attachImageFallback(img);

    resultsEl.appendChild(card);
  });
}

/* ==========================================================================
   9. Wishlist & Account Modals
   ========================================================================== */

function renderWishlistModal() {
  const body = document.getElementById('wishlist-modal-body');
  if (!body) return;

  if (state.wishlist.length === 0) {
    body.innerHTML = `
      <p class="payment-note">Your wishlist is currently empty. Use Search to save your favorite Notes &amp; Noir fragrances.</p>
      <button type="button" class="btn-secondary" id="wishlist-browse-btn">Browse Fragrances</button>
    `;
    const btn = document.getElementById('wishlist-browse-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        closeModal('wishlist-modal');
        openSearchOverlay();
      });
    }
    return;
  }

  body.innerHTML = state.wishlist
    .map((id) => {
      const p = FRAGRANCE_CATALOG.find((item) => item.id === id);
      if (!p) return '';
      return `
        <div class="list-card">
          <div>
            <strong>${escapeHtml(p.name)}</strong>
            <div class="list-card__meta">${escapeHtml(p.size)} &middot; ${formatCurrency(p.price)}</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button type="button" class="btn-mini btn-mini--dark" data-wish-add="${escapeHtml(p.id)}">Add to Bag</button>
            <button type="button" class="btn-mini btn-mini--ghost" data-wish-remove="${escapeHtml(p.id)}">Remove</button>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderAccountModal() {
  const body = document.getElementById('account-modal-body');
  if (!body) return;

  const orders = readJsonStorage(STORAGE_KEYS.ORDERS, []);
  if (!Array.isArray(orders) || orders.length === 0) {
    body.innerHTML = `
      <p class="payment-note">No completed orders found on this browser yet. Place an order on the checkout page and your receipt will appear here.</p>
    `;
    return;
  }

  body.innerHTML = orders
    .map(
      (order) => `
      <div class="receipt-box">
        <div class="receipt-id">
          <span>${escapeHtml(order.orderId)}</span>
          <strong>${formatCurrency(order.total)}</strong>
        </div>
        <div class="list-card__meta">
          ${escapeHtml(order.customer?.fullName || 'Customer')} &middot; ${escapeHtml(order.customer?.city || '')}
          <br>${escapeHtml(order.paymentLabel || '')} &middot; ${new Date(order.createdAt).toLocaleDateString()}
        </div>
      </div>
    `
    )
    .join('');
}

/* ==========================================================================
   10. Fragrance Pyramid Interactive Tabs
   ========================================================================== */

/** Render a pyramid panel's content from the data */
function renderPyramidPanel(noteType) {
  const data = FRAGRANCE_PYRAMID[noteType];
  if (!data) return;

  const panel = document.getElementById(`pyramid-panel-${noteType}`);
  if (!panel) return;

  const notesHtml = data.notes
    .map(
      (note) => `
      <li class="pyramid-note-item">
        <div class="pyramid-note-item__emoji" aria-hidden="true">${note.emoji}</div>
        <div class="pyramid-note-item__info">
          <div class="pyramid-note-item__name">${escapeHtml(note.name)}</div>
          <div class="pyramid-note-item__role">${escapeHtml(note.role)}</div>
        </div>
      </li>
    `
    )
    .join('');

  panel.innerHTML = `
    <div class="pyramid-content">
      <div class="pyramid-info">
        <h3 class="pyramid-info__title">${escapeHtml(data.title)}</h3>
        <p class="pyramid-info__desc">${escapeHtml(data.description)}</p>
        <div class="pyramid-info__duration">
          <svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${escapeHtml(data.duration)}
        </div>
      </div>
      <ul class="pyramid-notes-list" aria-label="Aromatic notes in the ${noteType} layer">
        ${notesHtml}
      </ul>
    </div>
  `;
}

/** Switch the active pyramid tab */
function switchPyramidTab(noteType) {
  // Update tab buttons
  document.querySelectorAll('.pyramid-tab').forEach((tab) => {
    const isActive = tab.getAttribute('data-note-type') === noteType;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update panels
  document.querySelectorAll('.pyramid-panel').forEach((panel) => {
    panel.classList.remove('is-visible');
  });

  const activePanel = document.getElementById(`pyramid-panel-${noteType}`);
  if (activePanel) {
    // Small delay for CSS transition
    window.requestAnimationFrame(() => {
      activePanel.classList.add('is-visible');
    });
  }
}

/** Initialize all three pyramid panels */
function initPyramidTabs() {
  ['top', 'heart', 'base'].forEach((type) => renderPyramidPanel(type));
  switchPyramidTab('top');
}

/* ==========================================================================
   11. Signature Concentration & Longevity Calculator
   ========================================================================== */

/**
 * Compute the ideal fragrance recommendation based on user preferences.
 * Uses wear-duration and occasion to find the best match from the catalog,
 * then calculates practical usage statistics.
 */
function calculateRecommendation() {
  const durationSelect = document.getElementById('calc-duration');
  const occasionSelect = document.getElementById('calc-occasion');
  const resultEl = document.getElementById('calculator-result');

  if (!durationSelect || !occasionSelect || !resultEl) return;

  const durationVal = durationSelect.value;
  const occasionVal = occasionSelect.value;

  // Map duration preference to target hour ranges
  let minHours, maxHours;
  if (durationVal === '4-6') {
    minHours = 4;
    maxHours = 6;
  } else if (durationVal === '8-10') {
    minHours = 8;
    maxHours = 10;
  } else {
    minHours = 12;
    maxHours = 24;
  }

  // Find the best matching fragrance — prefer matching occasion, then wear-time
  let bestMatch = null;
  let bestScore = -1;

  FRAGRANCE_CATALOG.forEach((product) => {
    let score = 0;

    // Occasion match (high weight)
    if (product.occasion === occasionVal) score += 10;

    // Wear-time match
    if (product.wearHours >= minHours && product.wearHours <= maxHours) {
      score += 8;
    } else if (product.wearHours >= minHours - 2 && product.wearHours <= maxHours + 2) {
      score += 4;
    }

    // Prefer higher oil concentration for longer wear preferences
    if (durationVal === '12+' && product.oilPercent >= 25) score += 3;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = product;
    }
  });

  // Fallback if no match found (shouldn't happen with our data)
  if (!bestMatch) bestMatch = FRAGRANCE_CATALOG[0];

  // Calculate practical usage statistics
  const bottleSizeMl = parseInt(bestMatch.size) || 100;
  const sprayVolumeMl = 0.08; // ~0.08 ml per spray
  const totalSprays = Math.round(bottleSizeMl / sprayVolumeMl);
  const spraysPerDay = occasionVal === 'Evening Gala' ? 5 : occasionVal === 'Intimate Dinner' ? 4 : 3;
  const daysOfWear = Math.round(totalSprays / spraysPerDay);

  // Render result
  resultEl.innerHTML = `
    <h4 class="result-heading">Your Ideal Notes & Noir Match</h4>
    <div class="result-grid">
      <div class="result-stat">
        <span class="result-stat__value">${bestMatch.oilPercent}%</span>
        <span class="result-stat__label">Oil Concentration</span>
      </div>
      <div class="result-stat">
        <span class="result-stat__value">${bestMatch.wearHours} hrs</span>
        <span class="result-stat__label">Expected Wear Time</span>
      </div>
      <div class="result-stat">
        <span class="result-stat__value">~${totalSprays.toLocaleString()}</span>
        <span class="result-stat__label">Sprays per ${bottleSizeMl} ml Bottle</span>
      </div>
      <div class="result-stat">
        <span class="result-stat__value">${daysOfWear}</span>
        <span class="result-stat__label">Days of Wear (${spraysPerDay} sprays/day)</span>
      </div>
    </div>
    <div class="result-match">
      <div class="result-match__info">
        <div class="result-match__name">${escapeHtml(bestMatch.name)}</div>
        <div class="result-match__notes">${escapeHtml(bestMatch.concentration)} &middot; ${escapeHtml(bestMatch.notes)}</div>
      </div>
      <button type="button" class="btn-gold" id="calc-add-btn" data-product-id="${escapeHtml(bestMatch.id)}">
        Add to Cart — ${formatCurrency(bestMatch.price)}
      </button>
    </div>
  `;

  resultEl.classList.add('is-visible');

  // Bind add-to-cart
  const addBtn = document.getElementById('calc-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addFragranceToCart(addBtn.getAttribute('data-product-id'));
      addBtn.textContent = 'Added ✓';
      addBtn.disabled = true;
    });
  }

  announceStatus(
    `Recommendation: ${bestMatch.name} with ${bestMatch.oilPercent}% oil concentration, lasting ${bestMatch.wearHours} hours.`
  );
}

/* ==========================================================================
   12. Newsletter / Consultation Form — Live Validation
   ========================================================================== */

/** Validation rules for the newsletter form fields */
const newsletterValidators = {
  newsletterName(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your name.';
    const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
    if (letterCount < 2 || !/^[A-Za-z\s'.-]+$/.test(trimmed)) {
      return 'Name must contain at least 2 alphabetic characters.';
    }
    return '';
  },

  newsletterEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return 'Enter a valid email address (e.g. you@example.com).';
    }
    // Check for duplicate subscription in localStorage
    const existingSubs = readJsonStorage(STORAGE_KEYS.NEWSLETTER, []);
    if (
      Array.isArray(existingSubs) &&
      existingSubs.some((sub) => sub.email === trimmed.toLowerCase())
    ) {
      return 'This email is already subscribed to our newsletter.';
    }
    return '';
  },

  newsletterScent(value) {
    if (!value) return 'Please select your preferred scent family.';
    return '';
  }
};

/** Set or clear an error on a form field */
function setFieldError(input, message) {
  const errorEl = document.getElementById(`${input.id}-error`);
  if (message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
  } else {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
  }
}

/** Clear all validation states from a field */
function clearFieldError(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  input.classList.remove('is-invalid', 'is-valid');
  input.removeAttribute('aria-invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  }
}

/** Validate a single form field */
function validateSingleField(input) {
  const validator = newsletterValidators[input.id];
  if (!validator || input.disabled) return true;
  const errorMessage = validator(input.value);
  setFieldError(input, errorMessage);
  return errorMessage === '';
}

/** Handle the newsletter form submission */
function handleNewsletterSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('newsletterName');
  const emailInput = document.getElementById('newsletterEmail');
  const scentInput = document.getElementById('newsletterScent');

  if (!nameInput || !emailInput || !scentInput) return;

  // Validate all fields
  const nameValid = validateSingleField(nameInput);
  const emailValid = validateSingleField(emailInput);
  const scentValid = validateSingleField(scentInput);

  if (!nameValid || !emailValid || !scentValid) {
    // Focus the first invalid field
    const firstInvalid = [nameInput, emailInput, scentInput].find((inp) =>
      inp.classList.contains('is-invalid')
    );
    if (firstInvalid) firstInvalid.focus();
    announceStatus('Please fix the highlighted fields before submitting.');
    return;
  }

  // Save subscription to localStorage
  const subscription = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    scentFamily: scentInput.value,
    subscribedAt: new Date().toISOString()
  };

  const existingSubs = readJsonStorage(STORAGE_KEYS.NEWSLETTER, []);
  const updatedSubs = Array.isArray(existingSubs)
    ? [subscription, ...existingSubs]
    : [subscription];
  writeJsonStorage(STORAGE_KEYS.NEWSLETTER, updatedSubs);

  // Show personalized confirmation
  const form = document.getElementById('newsletter-form');
  const successEl = document.getElementById('newsletter-success');

  if (form) form.style.display = 'none';
  if (successEl) {
    const successText = successEl.querySelector('.newsletter-success__text');
    if (successText) {
      successText.textContent = `Thank you, ${escapeHtml(subscription.name)}! We'll curate ${subscription.scentFamily} recommendations just for you.`;
    }
    successEl.classList.add('is-visible');
  }

  announceStatus(`Newsletter subscription confirmed for ${subscription.name}.`);
}

/* ==========================================================================
   13. Event Binding & Bootstrapping
   ========================================================================== */

function bindEvents() {
  // ----- Hero image fallback -----
  const heroImg = document.getElementById('about-hero-img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
    });
  }

  // ----- Story image fallback -----
  const storyImg = document.getElementById('story-bottle-img');
  const storyPlaceholder = document.getElementById('story-image-placeholder');
  if (storyImg && storyPlaceholder) {
    storyImg.addEventListener('error', () => {
      storyImg.style.display = 'none';
      storyPlaceholder.style.display = 'flex';
    });
    storyImg.addEventListener('load', () => {
      storyPlaceholder.style.display = 'none';
    });
  }

  // ----- Mobile hamburger menu -----
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('primary-nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ----- Shop dropdown toggle -----
  const shopBtn = document.getElementById('shop-dropdown-btn');
  const shopMenu = document.getElementById('shop-dropdown-menu');
  if (shopBtn && shopMenu) {
    shopBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = shopMenu.hidden;
      shopMenu.hidden = !willOpen;
      shopBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (event) => {
      if (
        !shopMenu.hidden &&
        !event.target.closest('.nav-links__item--dropdown')
      ) {
        shopMenu.hidden = true;
        shopBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const quickBrowseBtn = document.getElementById('dropdown-quick-browse');
  if (quickBrowseBtn) {
    quickBrowseBtn.addEventListener('click', () => {
      if (shopMenu && shopBtn) {
        shopMenu.hidden = true;
        shopBtn.setAttribute('aria-expanded', 'false');
      }
      openSearchOverlay();
    });
  }

  // ----- Search overlay -----
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('catalog-search-input');
  const searchResults = document.getElementById('search-results');

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearchOverlay);
  if (closeSearchBtn)
    closeSearchBtn.addEventListener('click', closeSearchOverlay);
  document
    .querySelectorAll('[data-close-overlay="search-overlay"]')
    .forEach((el) => {
      el.addEventListener('click', closeSearchOverlay);
    });

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      renderSearchResults(event.target.value);
    });
  }

  if (searchResults) {
    searchResults.addEventListener('click', (event) => {
      const addBtn = event.target.closest('[data-add-id]');
      if (addBtn) {
        addFragranceToCart(addBtn.getAttribute('data-add-id'));
        addBtn.textContent = 'Added';
        window.setTimeout(() => {
          addBtn.textContent = 'Add';
        }, 1000);
        return;
      }

      const wishBtn = event.target.closest('[data-wish-id]');
      if (wishBtn) {
        toggleWishlistItem(wishBtn.getAttribute('data-wish-id'));
        renderSearchResults(searchInput ? searchInput.value : '');
      }
    });
  }

  // ----- Wishlist modal -----
  const openWishlistBtn = document.getElementById('open-wishlist-btn');
  if (openWishlistBtn) {
    openWishlistBtn.addEventListener('click', () => {
      renderWishlistModal();
      openModal('wishlist-modal');
    });
  }

  const wishlistBody = document.getElementById('wishlist-modal-body');
  if (wishlistBody) {
    wishlistBody.addEventListener('click', (event) => {
      const addId = event.target
        .closest('[data-wish-add]')
        ?.getAttribute('data-wish-add');
      if (addId) {
        addFragranceToCart(addId);
        closeModal('wishlist-modal');
        return;
      }
      const removeId = event.target
        .closest('[data-wish-remove]')
        ?.getAttribute('data-wish-remove');
      if (removeId) {
        toggleWishlistItem(removeId);
        renderWishlistModal();
      }
    });
  }

  // ----- Account modal -----
  const openAccountBtn = document.getElementById('open-account-btn');
  const trackOrderBtn = document.getElementById('footer-track-order-btn');
  [openAccountBtn, trackOrderBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        renderAccountModal();
        openModal('account-modal');
      });
    }
  });

  // ----- Generic modal close triggers -----
  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', () => {
      closeModal(el.getAttribute('data-close-modal'));
    });
  });

  // ----- Ingredient cards click & keyboard delegation -----
  const ingredientsGrid = document.getElementById('ingredients-grid');
  if (ingredientsGrid) {
    ingredientsGrid.addEventListener('click', (event) => {
      const card = event.target.closest('.ingredient-card');
      if (card) {
        openIngredientModal(card.getAttribute('data-ingredient-id'));
      }
    });

    ingredientsGrid.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const card = event.target.closest('.ingredient-card');
        if (card) {
          event.preventDefault();
          openIngredientModal(card.getAttribute('data-ingredient-id'));
        }
      }
    });
  }

  // ----- Pyramid tabs -----
  document.querySelectorAll('.pyramid-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      switchPyramidTab(tab.getAttribute('data-note-type'));
    });
  });

  // ----- Concentration calculator -----
  const calcBtn = document.getElementById('calc-submit-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', calculateRecommendation);
  }

  // ----- Newsletter form -----
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    // Live validation on input/blur
    newsletterForm.querySelectorAll('.form-input, .form-select').forEach((input) => {
      input.addEventListener('blur', () => {
        if (
          input.value.trim() !== '' ||
          input.classList.contains('is-invalid')
        ) {
          validateSingleField(input);
        }
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateSingleField(input);
        }
      });

      // Also handle change for select elements
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => {
          if (input.classList.contains('is-invalid')) {
            validateSingleField(input);
          }
        });
      }
    });

    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }

  // ----- Escape key closes all overlays/modals/menus -----
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    closeSearchOverlay();
    closeModal('ingredient-modal');
    closeModal('wishlist-modal');
    closeModal('account-modal');

    if (shopMenu && !shopMenu.hidden && shopBtn) {
      shopMenu.hidden = true;
      shopBtn.setAttribute('aria-expanded', 'false');
    }

    if (navMenu && navMenu.classList.contains('is-open') && menuToggle) {
      navMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   14. DOM Ready — Application Bootstrap
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeState();
  updateHeaderCounters();
  renderIngredientCards();
  initPyramidTabs();
  bindEvents();
});
