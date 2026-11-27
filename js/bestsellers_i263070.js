/**
 * Notes & Noir Fragrances — Bestsellers Page (bestsellers_i263070.js)
 * Dynamically renders the 6 bestseller product cards from a JS data array,
 * wires Add to Cart to localStorage, updates header Cart (X) & free-shipping
 * progress in real time, and provides brief button & screen-reader feedback.
 */
'use strict';

(() => {
  const CART_STORAGE_KEY = 'notesNoir_cart';

  const BESTSELLERS = [
    {
      id: 'midnight-oud',
      name: 'Midnight Oud',
      rating: 4.8,
      reviewCount: '2.4k',
      price: 89.99,
      image: '../images/bestsellers/midnight-oud.svg',
      alt: 'Midnight Oud perfume in a dark obsidian square glass bottle surrounded by black oud wood',
      bottleColor: '#1E1D20',
      capColor: '#484440',
      backdropColors: ['#EFE5DA', '#D6C6B4'],
      botanicalType: 'oud'
    },
    {
      id: 'blush-bloom',
      name: 'Blush Bloom',
      rating: 4.7,
      reviewCount: '1.8k',
      price: 79.99,
      image: '../images/bestsellers/blush-bloom.jpg',
      alt: 'Blush Bloom perfume in a blush pink glass bottle with a crystal cap and pink roses',
      bottleColor: '#E5B2BC',
      capColor: '#F5EFEF',
      backdropColors: ['#F3E6DF', '#E1C5BC'],
      botanicalType: 'roses'
    },
    {
      id: 'ocean-breeze',
      name: 'Ocean Breeze',
      rating: 4.8,
      reviewCount: '1.6k',
      price: 84.99,
      image: '../images/bestsellers/ocean-breeze.jpg',
      alt: 'Ocean Breeze perfume in a deep cobalt blue glass bottle with a silver cap and coastal stones',
      bottleColor: '#1E4C8A',
      capColor: '#CFD5DC',
      backdropColors: ['#EFE6DC', '#D4CFC8'],
      botanicalType: 'stones'
    },
    {
      id: 'amber-touch',
      name: 'Amber Touch',
      rating: 4.7,
      reviewCount: '1.2k',
      price: 82.99,
      image: '../images/bestsellers/amber-touch.jpg',
      alt: 'Amber Touch perfume in a warm golden-amber glass bottle beside glowing amber resin',
      bottleColor: '#C57626',
      capColor: '#4C3320',
      backdropColors: ['#F2E6D6', '#DEC39E'],
      botanicalType: 'amber'
    },
    {
      id: 'velvet-musk',
      name: 'Velvet Musk',
      rating: 4.8,
      reviewCount: '1.1k',
      price: 85.99,
      image: '../images/bestsellers/velvet-musk.jpg',
      alt: 'Velvet Musk perfume in a deep olive-green glass bottle with white blossoms and forest moss',
      bottleColor: '#455731',
      capColor: '#C5A263',
      backdropColors: ['#EFE6DA', '#D4D6C5'],
      botanicalType: 'moss'
    },
    {
      id: 'royal-essence',
      name: 'Royal Essence',
      rating: 4.7,
      reviewCount: '980',
      price: 87.99,
      image: '../images/bestsellers/royal-essence.jpg',
      alt: 'Royal Essence perfume in a deep violet glass bottle with a bronze cap and purple flowers',
      bottleColor: '#4B2B6E',
      capColor: '#9E744B',
      backdropColors: ['#EFE5DA', '#D8C7D8'],
      botanicalType: 'violet'
    }
  ];

  const buttonTimers = new Map();

  function createHeroSvgFallback() {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
        <defs>
          <linearGradient id="silkBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#3E281B"/>
            <stop offset="55%" stop-color="#573927"/>
            <stop offset="100%" stop-color="#22140D"/>
          </linearGradient>
          <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#9E7942"/>
            <stop offset="45%" stop-color="#E5C584"/>
            <stop offset="100%" stop-color="#8C6734"/>
          </linearGradient>
          <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FFFDF9" stop-opacity="0.92"/>
            <stop offset="60%" stop-color="#D9B78C" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#A87F52" stop-opacity="0.88"/>
          </linearGradient>
        </defs>
        <rect width="640" height="420" fill="url(#silkBg)"/>
        <path d="M0 320 Q170 250 380 310 T640 270 L640 420 L0 420 Z" fill="#1C1009" opacity="0.55"/>
        <ellipse cx="330" cy="348" rx="145" ry="22" fill="#0E0805" opacity="0.5"/>
        <rect x="292" y="24" width="76" height="62" rx="4" fill="url(#goldCap)"/>
        <rect x="308" y="86" width="44" height="16" fill="#C4A062"/>
        <rect x="240" y="102" width="180" height="232" rx="12" fill="url(#glassBody)" stroke="#D9BE9B" stroke-width="2"/>
        <rect x="266" y="152" width="128" height="122" rx="4" fill="#FAF6F0" stroke="#D8CBB9" stroke-width="1.5"/>
        <text x="330" y="206" text-anchor="middle" font-family="Georgia, serif" font-size="21" fill="#141414">Notes &amp; Noir</text>
        <text x="330" y="232" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" letter-spacing="3" fill="#6E645A">FRAGRANCES</text>
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
      case 'stones':
        accent = `
          <ellipse cx="76" cy="242" rx="28" ry="16" fill="#8A96A3"/>
          <ellipse cx="226" cy="238" rx="24" ry="15" fill="#6F7D8C"/>
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

  function addProductToCart(product) {
    if (window.NNShared && typeof window.NNShared.addToCart === 'function') {
      window.NNShared.addToCart(product);
      return;
    }

    // Fallback if shared_i263070.js was not loaded
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
    const statusEl = document.getElementById('bestsellers-live-status');
    if (!statusEl) return;
    const totalCount =
      window.NNShared && typeof window.NNShared.getCartCount === 'function'
        ? window.NNShared.getCartCount()
        : '';
    statusEl.textContent = totalCount
      ? `${productName} added to cart. Cart now has ${totalCount} item${totalCount === 1 ? '' : 's'}.`
      : `${productName} added to cart.`;
  }

  function createCartIconSvg() {
    return `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    `.trim();
  }

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

  function renderBestsellers() {
    const grid = document.getElementById('bestsellers-grid');
    if (!grid) return;

    grid.innerHTML = '';

    BESTSELLERS.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'nn-product-card';
      card.setAttribute('role', 'listitem');
      card.dataset.productId = product.id;

      card.innerHTML = `
        <div class="nn-product-media">
          <img
            src="${product.image}"
            alt="${product.alt}"
            class="nn-product-img"
            loading="lazy"
          />
        </div>
        <div class="nn-product-body">
          <h2 class="nn-product-title">${product.name}</h2>
          <div
            class="nn-product-rating"
            aria-label="Rated ${product.rating} out of 5 based on ${product.reviewCount} reviews"
          >
            <span class="nn-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span class="nn-rating-text">${product.rating.toFixed(1)} (${product.reviewCount})</span>
          </div>
          <p class="nn-product-price">$${product.price.toFixed(2)}</p>
          <button
            type="button"
            class="nn-add-cart-btn"
            aria-label="Add ${product.name} to cart for $${product.price.toFixed(2)}"
          >
            ${createCartIconSvg()}
            <span>Add to Cart</span>
          </button>
        </div>
      `;

      const img = card.querySelector('.nn-product-img');
      if (img) {
        attachImageFallback(img, () => createProductSvgFallback(product));
      }

      const addButton = card.querySelector('.nn-add-cart-btn');
      if (addButton) {
        addButton.addEventListener('click', () => handleAddToCart(addButton, product));
      }

      grid.appendChild(card);
    });
  }

  function init() {
    const heroImg = document.querySelector('.nn-hero-image');
    if (heroImg) {
      attachImageFallback(heroImg, createHeroSvgFallback);
    }

    renderBestsellers();

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
