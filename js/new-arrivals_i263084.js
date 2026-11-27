/**
 * Notes & Noir Fragrances — New Arrivals Page (new-arrivals_i263084.js)
 * Dynamically renders the 6 new arrival product cards from a JS data array,
 * wires Add to Cart to localStorage, updates header Cart (X) & free-shipping
 * progress in real time, and provides brief button & screen-reader feedback.
 */
'use strict';

(() => {
  const CART_STORAGE_KEY = 'notesNoir_cart';

  /* -------------------------------------------------------------------------
     Product Data — 6 New Arrivals
     ---------------------------------------------------------------------- */
  const NEW_ARRIVALS = [
    {
      id: 'noir-essence',
      name: 'Noir Essence',
      rating: 4.7,
      reviewCount: '1.1k',
      price: 89.99,
      image: '../images/new-arrivals/noir-essence.jpg',
      alt: 'Noir Essence perfume in a dark obsidian square glass bottle with dark wood accents',
      bottleColor: '#1A1820',
      capColor: '#3B3530',
      backdropColors: ['#EFE5DA', '#D6C6B4'],
      botanicalType: 'oud'
    },
    {
      id: 'rose-bloom',
      name: 'Rosé Bloom',
      rating: 4.6,
      reviewCount: '980',
      price: 79.99,
      image: '../images/new-arrivals/rose-bloom.jpg',
      alt: 'Rosé Bloom perfume in a blush pink glass bottle with a crystal cap and pink roses',
      bottleColor: '#E5B2BC',
      capColor: '#F5EFEF',
      backdropColors: ['#F3E6DF', '#E1C5BC'],
      botanicalType: 'roses'
    },
    {
      id: 'aqua-horizon',
      name: 'Aqua Horizon',
      rating: 4.7,
      reviewCount: '740',
      price: 84.99,
      image: '../images/new-arrivals/aqua-horizon.jpg',
      alt: 'Aqua Horizon perfume in a deep cobalt blue glass bottle with a black cap and ocean water splash',
      bottleColor: '#1A3A6E',
      capColor: '#1C1C1C',
      backdropColors: ['#EFE6DC', '#C8D4E0'],
      botanicalType: 'ocean'
    },
    {
      id: 'amber-luxe',
      name: 'Amber Luxe',
      rating: 4.6,
      reviewCount: '690',
      price: 82.99,
      image: '../images/new-arrivals/amber-luxe.jpg',
      alt: 'Amber Luxe perfume in a warm golden-amber glass bottle with glowing amber resin',
      bottleColor: '#C57626',
      capColor: '#4C3320',
      backdropColors: ['#F2E6D6', '#DEC39E'],
      botanicalType: 'amber'
    },
    {
      id: 'verdant-muse',
      name: 'Verdant Muse',
      rating: 4.7,
      reviewCount: '860',
      price: 85.99,
      image: '../images/new-arrivals/verdant-muse.jpg',
      alt: 'Verdant Muse perfume in a deep olive-green glass bottle with white blossoms',
      bottleColor: '#3D5428',
      capColor: '#C5A263',
      backdropColors: ['#EFE6DA', '#D4D6C5'],
      botanicalType: 'moss'
    },
    {
      id: 'violet-dream',
      name: 'Violet Dream',
      rating: 4.6,
      reviewCount: '720',
      price: 87.99,
      image: '../images/new-arrivals/violet-dream.jpg',
      alt: 'Violet Dream perfume in a deep violet glass bottle with a bronze cap and purple flowers',
      bottleColor: '#4B2B6E',
      capColor: '#9E744B',
      backdropColors: ['#EFE5DA', '#D8C7D8'],
      botanicalType: 'violet'
    }
  ];

  /* Timer map to manage per-button reset timeouts */
  const buttonTimers = new Map();

  /* -------------------------------------------------------------------------
     SVG Fallbacks
     ---------------------------------------------------------------------- */

  /** Hero banner SVG fallback (draped silk with glass bottle & jasmine) */
  function createHeroSvgFallback() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
        <defs>
          <linearGradient id="na-silkBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#3E281B"/>
            <stop offset="55%" stop-color="#573927"/>
            <stop offset="100%" stop-color="#22140D"/>
          </linearGradient>
          <linearGradient id="na-goldCap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#9E7942"/>
            <stop offset="45%" stop-color="#E5C584"/>
            <stop offset="100%" stop-color="#8C6734"/>
          </linearGradient>
          <linearGradient id="na-glassBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.92"/>
            <stop offset="60%" stop-color="#D9B78C" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#A87F52" stop-opacity="0.88"/>
          </linearGradient>
        </defs>
        <rect width="640" height="420" fill="url(#na-silkBg)"/>
        <path d="M0 320 Q170 250 380 310 T640 270 L640 420 L0 420 Z" fill="#1C1009" opacity="0.55"/>
        <ellipse cx="330" cy="348" rx="145" ry="22" fill="#0E0805" opacity="0.5"/>
        <!-- Gold cap extends slightly above banner edge -->
        <rect x="292" y="8" width="76" height="62" rx="4" fill="url(#na-goldCap)"/>
        <rect x="308" y="70" width="44" height="16" fill="#C4A062"/>
        <rect x="240" y="86" width="180" height="232" rx="12" fill="url(#na-glassBody)" stroke="#D9BE9B" stroke-width="2"/>
        <rect x="266" y="136" width="128" height="122" rx="4" fill="#FAF6F0" stroke="#D8CBB9" stroke-width="1.5"/>
        <text x="330" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="21" fill="#141414">Notes &amp; Noir</text>
        <text x="330" y="216" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" letter-spacing="3" fill="#6E645A">FRAGRANCES</text>
        <g transform="translate(178 300)" fill="#FFFDFB" stroke="#E2D9CE" stroke-width="1">
          <ellipse cx="0" cy="-18" rx="9" ry="18"/>
          <ellipse cx="17" cy="-5" rx="9" ry="18" transform="rotate(72 17 -5)"/>
          <ellipse cx="11" cy="15" rx="9" ry="18" transform="rotate(144 11 15)"/>
          <ellipse cx="-11" cy="15" rx="9" ry="18" transform="rotate(216 -11 15)"/>
          <ellipse cx="-17" cy="-5" rx="9" ry="18" transform="rotate(288 -17 -5)"/>
          <circle cx="0" cy="0" r="6" fill="#E8C97A"/>
        </g>
        <g transform="translate(468 308) scale(0.92)" fill="#FFFDFB" stroke="#E2D9CE" stroke-width="1">
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

  /** Per-product SVG card fallback */
  function createProductSvgFallback(product) {
    const [bgLight, bgDark] = product.backdropColors;
    let accent = '';

    switch (product.botanicalType) {
      case 'oud':
        accent = `
          <rect x="52" y="232" width="66" height="22" rx="6" fill="#2A211B" transform="rotate(-14 85 243)"/>
          <rect x="192" y="226" width="58" height="20" rx="6" fill="#3B2E26" transform="rotate(16 220 236)"/>
        `;
        break;
      case 'roses':
        accent = `
          <circle cx="72" cy="236" r="24" fill="#DC8399"/>
          <circle cx="72" cy="236" r="13" fill="#F0B3C2"/>
          <circle cx="228" cy="234" r="22" fill="#D5738B"/>
          <circle cx="228" cy="234" r="11" fill="#F2BCC9"/>
        `;
        break;
      case 'ocean':
        accent = `
          <ellipse cx="76" cy="242" rx="30" ry="14" fill="#2A6098" opacity="0.75"/>
          <ellipse cx="226" cy="238" rx="26" ry="13" fill="#1A4A7A" opacity="0.75"/>
          <path d="M55 240 Q76 230 97 240 Q76 250 55 240 Z" fill="#6BB3D6" opacity="0.6"/>
        `;
        break;
      case 'amber':
        accent = `
          <ellipse cx="76" cy="238" rx="22" ry="18" fill="#EAA23D" opacity="0.9"/>
          <ellipse cx="228" cy="240" rx="20" ry="15" fill="#D47E1E" opacity="0.9"/>
        `;
        break;
      case 'moss':
        accent = `
          <circle cx="72" cy="240" r="22" fill="#637A48"/>
          <circle cx="228" cy="238" r="18" fill="#FFFDF9"/>
          <circle cx="228" cy="238" r="6" fill="#E3C36F"/>
        `;
        break;
      case 'violet':
        accent = `
          <circle cx="74" cy="238" r="21" fill="#8858B2"/>
          <circle cx="226" cy="236" r="20" fill="#9A6AC2"/>
          <circle cx="226" cy="236" r="7" fill="#E9D6F5"/>
        `;
        break;
      default:
        break;
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
        <defs>
          <radialGradient id="bg-${product.id}" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stop-color="${bgLight}"/>
            <stop offset="100%" stop-color="${bgDark}"/>
          </radialGradient>
        </defs>
        <rect width="300" height="300" fill="url(#bg-${product.id})"/>
        <ellipse cx="150" cy="252" rx="88" ry="14" fill="#3B2F26" opacity="0.18"/>
        ${accent}
        <rect x="128" y="48" width="44" height="30" rx="4" fill="${product.capColor}" stroke="#FFFFFF" stroke-opacity="0.3"/>
        <rect x="138" y="78" width="24" height="10" fill="#B5976E"/>
        <rect x="96" y="88" width="108" height="158" rx="10" fill="${product.bottleColor}" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="2"/>
        <rect x="112" y="122" width="76" height="86" rx="4" fill="#FAF6F0" fill-opacity="0.92"/>
        <text x="150" y="158" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#1A1A1A">${product.name}</text>
        <text x="150" y="176" text-anchor="middle" font-family="Arial, sans-serif" font-size="7" letter-spacing="1.8" fill="#6E645A">NOTES &amp; NOIR</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  /* -------------------------------------------------------------------------
     Image Fallback Helper
     ---------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------
     Cart Helpers
     ---------------------------------------------------------------------- */
  function addProductToCart(product) {
    if (window.NNShared && typeof window.NNShared.addToCart === 'function') {
      window.NNShared.addToCart(product);
      return;
    }

    // Fallback if shared_i263070.js is not loaded
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      const existing = cart.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity = (Number(existing.quantity) || 0) + 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      const count = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
      document.querySelectorAll('[data-cart-count]').forEach((el) => {
        el.textContent = String(count);
      });
    } catch {
      // Ignore storage access errors
    }
  }

  function announceCartUpdate(productName) {
    const statusEl = document.getElementById('na-live-status');
    if (!statusEl) return;
    const totalCount =
      window.NNShared && typeof window.NNShared.getCartCount === 'function'
        ? window.NNShared.getCartCount()
        : '';
    statusEl.textContent = totalCount
      ? `${productName} added to cart. Cart now has ${totalCount} item${totalCount === 1 ? '' : 's'}.`
      : `${productName} added to cart.`;
  }

  /* -------------------------------------------------------------------------
     Cart Icon SVG
     ---------------------------------------------------------------------- */
  function createCartIconSvg() {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    `.trim();
  }

  /* -------------------------------------------------------------------------
     Button Interaction Handler
     ---------------------------------------------------------------------- */
  function handleAddToCart(button, product) {
    addProductToCart(product);
    announceCartUpdate(product.name);

    const existingTimer = buttonTimers.get(product.id);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
    }

    button.classList.add('is-added');
    button.innerHTML = '<span>Added &#10003;</span>';

    const timer = window.setTimeout(() => {
      button.classList.remove('is-added');
      button.innerHTML = `${createCartIconSvg()}<span>Add to Cart</span>`;
      buttonTimers.delete(product.id);
    }, 1400);

    buttonTimers.set(product.id, timer);
  }

  /* -------------------------------------------------------------------------
     Render Product Grid
     ---------------------------------------------------------------------- */
  function renderNewArrivals() {
    const grid = document.getElementById('na-grid');
    if (!grid) return;

    grid.innerHTML = '';

    NEW_ARRIVALS.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'nn-na-card';
      card.setAttribute('role', 'listitem');
      card.dataset.productId = product.id;

      card.innerHTML = `
        <div class="nn-na-media">
          <span class="nn-na-badge" aria-label="New arrival">NEW</span>
          <img
            src="${product.image}"
            alt="${product.alt}"
            class="nn-na-img"
            loading="lazy"
          />
        </div>
        <div class="nn-na-body">
          <h2 class="nn-na-title">${product.name}</h2>
          <div
            class="nn-na-rating"
            aria-label="Rated ${product.rating} out of 5 based on ${product.reviewCount} reviews"
          >
            <span class="nn-na-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span class="nn-na-rating-text">${product.rating.toFixed(1)} (${product.reviewCount})</span>
          </div>
          <p class="nn-na-price">$${product.price.toFixed(2)}</p>
          <button
            type="button"
            class="nn-na-add-btn"
            aria-label="Add ${product.name} to cart for $${product.price.toFixed(2)}"
          >
            ${createCartIconSvg()}
            <span>Add to Cart</span>
          </button>
        </div>
      `;

      const img = card.querySelector('.nn-na-img');
      if (img) {
        attachImageFallback(img, () => createProductSvgFallback(product));
      }

      const addButton = card.querySelector('.nn-na-add-btn');
      if (addButton) {
        addButton.addEventListener('click', () => handleAddToCart(addButton, product));
      }

      grid.appendChild(card);
    });
  }

  /* -------------------------------------------------------------------------
     Init
     ---------------------------------------------------------------------- */
  function init() {
    const heroImg = document.querySelector('.nn-na-hero-image');
    if (heroImg) {
      attachImageFallback(heroImg, createHeroSvgFallback);
    }

    renderNewArrivals();

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
