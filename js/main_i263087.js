/**
 * Notes & Noir — Shared Catalog, Persistent Cart & Page Interactions
 * Script: js/main_i263087.js
 * Roll Number: i263087
 */

(() => {
  const CART_STORAGE_KEY = 'nn_cart_items_i263087';
  const LEGACY_COUNT_KEY = 'nn_cart_count_i263087';

  /**
   * Shared luxury perfume catalog (12 fragrances across Men, Women, Unisex, and Kids).
   * Uses all 10 real bottle photos (images/3.png through images/12.jpeg).
   * Image paths are stored relative to project root and resolved dynamically for subpages.
   */
  const NN_CATALOG = [
    {
      id: 'nn-01',
      name: 'Noir Oud Elixir',
      category: 'Men',
      price: 185,
      size: '100 ml',
      badge: 'Bestseller',
      notes: 'Smoky Agarwood • Black Amber • Roasted Tonka',
      image: 'images/4.png',
      imageClass: 'bottle-photo--amber',
      hasThirdPartyBrand: false,
      lightBackground: false,
      giftSet: false
    },
    {
      id: 'nn-02',
      name: 'Velvet Amber Rose',
      category: 'Women',
      price: 165,
      size: '100 ml',
      badge: 'Iconic',
      notes: 'Damask Rose • Golden Saffron • Cashmere Musk',
      image: 'images/7.png',
      imageClass: 'bottle-photo--light-blend',
      hasThirdPartyBrand: true,
      lightBackground: true,
      giftSet: false
    },
    {
      id: 'nn-03',
      name: 'Midnight Bergamot',
      category: 'Unisex',
      price: 150,
      size: '100 ml',
      badge: 'Unisex',
      notes: 'Calabrian Bergamot • Black Pepper • Cedarwood',
      image: 'images/3.png',
      imageClass: 'bottle-photo--blue',
      hasThirdPartyBrand: true,
      lightBackground: false,
      giftSet: false
    },
    {
      id: 'nn-04',
      name: 'Saffron & Smoke',
      category: 'Unisex',
      price: 210,
      size: '100 ml',
      badge: 'Reserve',
      notes: 'Red Saffron • Incense Resin • Smoked Vetiver',
      image: 'images/8.png',
      imageClass: 'bottle-photo--saffron',
      hasThirdPartyBrand: false,
      lightBackground: false,
      giftSet: false
    },
    {
      id: 'nn-05',
      name: 'Imperial Falcon Oud',
      category: 'Men',
      price: 225,
      size: '100 ml',
      badge: 'Signature',
      notes: 'Black Cardamom • Aged Oud • Smoked Leather',
      image: 'images/6.png',
      imageClass: 'bottle-photo--falcon',
      hasThirdPartyBrand: true,
      lightBackground: false,
      giftSet: true
    },
    {
      id: 'nn-06',
      name: 'Gilded Amber Vanilla',
      category: 'Women',
      price: 175,
      size: '100 ml',
      badge: 'Atelier',
      notes: 'Madagascar Vanilla • Warm Amber • White Orchid',
      image: 'images/5.png',
      imageClass: 'bottle-photo--story',
      hasThirdPartyBrand: true,
      lightBackground: false,
      giftSet: true
    },
    {
      id: 'nn-07',
      name: 'Obsidian Cedar',
      category: 'Men',
      price: 160,
      size: '100 ml',
      badge: 'Nocturne',
      notes: 'Atlas Cedar • Vetiver Root • Mineral Musk',
      image: 'images/10.png',
      imageClass: 'bottle-photo--obsidian',
      hasThirdPartyBrand: false,
      lightBackground: false,
      giftSet: false
    },
    {
      id: 'nn-08',
      name: 'Rose Nocturne',
      category: 'Women',
      price: 190,
      size: '100 ml',
      badge: 'Limited',
      notes: 'Midnight Rose • Pink Pepper • Creamy Sandalwood',
      image: 'images/12.jpeg',
      imageClass: 'bottle-photo--ruby',
      hasThirdPartyBrand: true,
      lightBackground: false,
      giftSet: true
    },
    {
      id: 'nn-09',
      name: 'Velvet Honey Reserve',
      category: 'Unisex',
      price: 195,
      size: '100 ml',
      badge: 'Extrait',
      notes: 'Wildflower Honey • Benzoin Resin • Roasted Almond',
      image: 'images/9.jpeg',
      imageClass: 'bottle-photo--honey',
      hasThirdPartyBrand: true,
      lightBackground: false,
      giftSet: true
    },
    {
      id: 'nn-10',
      name: 'Petit Citrus Cloud',
      category: 'Kids',
      price: 78,
      size: '50 ml',
      badge: 'Gentle',
      notes: 'Sweet Mandarin • Orange Blossom • Cotton Musk',
      image: 'images/11.jpeg',
      imageClass: 'bottle-photo--pink-blend',
      hasThirdPartyBrand: true,
      lightBackground: true,
      giftSet: false
    },
    {
      id: 'nn-11',
      name: 'Little Starlight Dew',
      category: 'Kids',
      price: 72,
      size: '50 ml',
      badge: 'Alcohol-Free',
      notes: 'White Peach • Chamomile Mist • Soft Vanilla',
      image: 'images/7.png',
      imageClass: 'bottle-photo--light-blend',
      hasThirdPartyBrand: true,
      lightBackground: true,
      giftSet: false
    },
    {
      id: 'nn-12',
      name: 'Junior Meadow Breeze',
      category: 'Kids',
      price: 75,
      size: '50 ml',
      badge: 'Soft Mist',
      notes: 'Crisp Pear • Neroli Blossom • Clean Cedar',
      image: 'images/9.jpeg',
      imageClass: 'bottle-photo--honey',
      hasThirdPartyBrand: true,
      lightBackground: false,
      giftSet: false
    }
  ];

  const getRootPrefix = () => (/\/pages(\/|\\)/i.test(window.location.pathname) ? '../' : '');

  const resolveAssetPath = (relativePath) => {
    if (!relativePath) return `${getRootPrefix()}images/4.png`;
    if (/^(https?:|\/|\.\.\/)/.test(relativePath)) return relativePath;
    return `${getRootPrefix()}${relativePath}`;
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const formatMoney = (amount) => `$${Number(amount || 0).toFixed(2)}`;

  const loadCart = () => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.name && item.quantity > 0) : [];
    } catch {
      return [];
    }
  };

  const saveCart = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    const totalCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    localStorage.setItem(LEGACY_COUNT_KEY, String(totalCount));
  };

  let toastTimer = null;

  const showToast = (message) => {
    let toastBanner = document.getElementById('toastBanner');
    if (!toastBanner) {
      toastBanner = document.createElement('div');
      toastBanner.id = 'toastBanner';
      toastBanner.className = 'toast-banner';
      toastBanner.setAttribute('role', 'status');
      toastBanner.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastBanner);
    }

    toastBanner.textContent = message;
    toastBanner.classList.add('visible');
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toastBanner.classList.remove('visible');
    }, 2600);
  };

  const updateCartBadge = () => {
    const cartBadge = document.getElementById('cartBadgeCount');
    if (!cartBadge) return;
    const totalCount = loadCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    cartBadge.textContent = String(totalCount);
  };

  const ensureCartDrawer = () => {
    let backdrop = document.getElementById('cartDrawerBackdrop');
    let drawer = document.getElementById('cartDrawer');
    if (backdrop && drawer) return { backdrop, drawer };

    backdrop = document.createElement('div');
    backdrop.id = 'cartDrawerBackdrop';
    backdrop.className = 'cart-drawer-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    drawer = document.createElement('aside');
    drawer.id = 'cartDrawer';
    drawer.className = 'cart-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-labelledby', 'cartDrawerTitle');
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <div>
          <h2 id="cartDrawerTitle" class="cart-drawer-title">Your Fragrance Bag</h2>
          <span class="cart-drawer-subtitle" id="cartDrawerCountLabel">0 items</span>
        </div>
        <button type="button" class="cart-drawer-close" id="cartDrawerClose" aria-label="Close shopping bag">&times;</button>
      </div>
      <div class="cart-drawer-items" id="cartDrawerItems"></div>
      <div class="cart-drawer-footer" id="cartDrawerFooter">
        <div class="cart-subtotal-row">
          <span>Subtotal</span>
          <span class="cart-subtotal-val" id="cartSubtotalValue">$0.00</span>
        </div>
        <p class="cart-drawer-note">Complimentary Notes &amp; Noir luxury gift wrapping included.</p>
        <div class="cart-drawer-actions">
          <button type="button" class="btn btn-gold" id="cartCheckoutBtn">Proceed to Checkout</button>
          <button type="button" class="cart-btn-clear" id="cartClearBtn">Clear</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    backdrop.addEventListener('click', closeCartDrawer);
    drawer.querySelector('#cartDrawerClose').addEventListener('click', closeCartDrawer);
    drawer.querySelector('#cartClearBtn').addEventListener('click', () => {
      saveCart([]);
      updateCartBadge();
      renderCartDrawer();
      showToast('Your fragrance bag has been cleared.');
    });

    drawer.querySelector('#cartCheckoutBtn').addEventListener('click', () => {
      const items = loadCart();
      if (!items.length) {
        showToast('Add a fragrance to your bag before checking out.');
        return;
      }
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      showToast(`Order reserved (${formatMoney(subtotal)}) — Thank you for choosing Notes & Noir.`);
    });

    drawer.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-cart-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-cart-action');
      const itemId = btn.getAttribute('data-cart-id');
      if (!itemId) return;

      if (action === 'inc') updateItemQuantity(itemId, 1);
      if (action === 'dec') updateItemQuantity(itemId, -1);
      if (action === 'remove') removeFromCart(itemId);
    });

    return { backdrop, drawer };
  };

  const renderCartDrawer = () => {
    const { drawer } = ensureCartDrawer();
    const items = loadCart();
    const itemsContainer = drawer.querySelector('#cartDrawerItems');
    const countLabel = drawer.querySelector('#cartDrawerCountLabel');
    const subtotalEl = drawer.querySelector('#cartSubtotalValue');
    const footerEl = drawer.querySelector('#cartDrawerFooter');

    const totalCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

    if (countLabel) {
      countLabel.textContent = `${totalCount} ${totalCount === 1 ? 'fragrance' : 'fragrances'}`;
    }
    if (subtotalEl) {
      subtotalEl.textContent = formatMoney(subtotal);
    }

    if (!items.length) {
      if (footerEl) footerEl.style.display = 'none';
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <p class="cart-empty-title">Your fragrance bag is empty</p>
          <p class="cart-empty-text">Explore our handcrafted extraits de parfum to begin your collection.</p>
          <a href="${getRootPrefix()}pages/shop-all.html" class="btn btn-outline-gold">Explore Collection</a>
        </div>
      `;
      return;
    }

    if (footerEl) footerEl.style.display = 'flex';
    itemsContainer.innerHTML = items
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-thumb">
              <img src="${escapeHtml(resolveAssetPath(item.image))}" alt="${escapeHtml(item.name)}" />
            </div>
            <div class="cart-item-info">
              <div class="cart-item-top">
                <h3 class="cart-item-name">${escapeHtml(item.name)}</h3>
                <button type="button" class="cart-item-remove" data-cart-action="remove" data-cart-id="${escapeHtml(item.id)}">Remove</button>
              </div>
              <p class="cart-item-meta">${escapeHtml(item.category || 'Extrait')} &bull; ${escapeHtml(item.size || '100 ml')}</p>
              <div class="cart-item-bottom">
                <div class="cart-qty-controls" aria-label="Quantity controls for ${escapeHtml(item.name)}">
                  <button type="button" class="cart-qty-btn" data-cart-action="dec" data-cart-id="${escapeHtml(item.id)}" aria-label="Decrease quantity">&minus;</button>
                  <span class="cart-qty-val">${item.quantity}</span>
                  <button type="button" class="cart-qty-btn" data-cart-action="inc" data-cart-id="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
                </div>
                <span class="cart-item-price">${formatMoney(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        `
      )
      .join('');
  };

  function openCartDrawer() {
    const { backdrop, drawer } = ensureCartDrawer();
    renderCartDrawer();
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open');
  }

  function closeCartDrawer() {
    const backdrop = document.getElementById('cartDrawerBackdrop');
    const drawer = document.getElementById('cartDrawer');
    if (backdrop) {
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
    }
    if (drawer) {
      drawer.classList.remove('open');
    }
  }

  const findCatalogProduct = (idOrName) => {
    if (!idOrName) return null;
    const key = String(idOrName).trim().toLowerCase();
    return (
      NN_CATALOG.find(
        (item) => item.id.toLowerCase() === key || item.name.toLowerCase() === key
      ) || null
    );
  };

  const addToCart = (productInput) => {
    const catalogMatch =
      findCatalogProduct(productInput?.id) || findCatalogProduct(productInput?.name);
    const product = catalogMatch || {
      id: productInput?.id || `nn-custom-${Date.now()}`,
      name: productInput?.name || 'Notes & Noir Fragrance',
      category: productInput?.category || 'Extrait',
      size: productInput?.size || '100 ml',
      price: Number(productInput?.price || 165),
      image: productInput?.image || 'images/4.png'
    };

    const items = loadCart();
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        category: product.category,
        size: product.size,
        price: Number(product.price),
        image: product.image,
        quantity: 1
      });
    }

    saveCart(items);
    updateCartBadge();
    renderCartDrawer();
    showToast(`${product.name} added to your bag.`);
    return items;
  };

  const updateItemQuantity = (itemId, delta) => {
    const items = loadCart();
    const index = items.findIndex((item) => item.id === itemId);
    if (index === -1) return;
    items[index].quantity += delta;
    if (items[index].quantity <= 0) {
      items.splice(index, 1);
    }
    saveCart(items);
    updateCartBadge();
    renderCartDrawer();
  };

  const removeFromCart = (itemId) => {
    const items = loadCart().filter((item) => item.id !== itemId);
    saveCart(items);
    updateCartBadge();
    renderCartDrawer();
  };

  // Expose shared catalog & cart API for all pages
  window.NN_CATALOG = NN_CATALOG;
  window.NotesAndNoir = {
    catalog: NN_CATALOG,
    getCart: loadCart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    openCartDrawer,
    closeCartDrawer,
    showToast,
    resolveAssetPath
  };

  const initShopAllCatalog = () => {
    const gridEl = document.getElementById('shopCatalogGrid');
    if (!gridEl) return;

    const filterButtons = Array.from(document.querySelectorAll('.filter-pill[data-category]'));
    const searchInput = document.getElementById('catalogSearchInput');
    const searchClearBtn = document.getElementById('catalogSearchClear');
    const sortSelect = document.getElementById('catalogSortSelect');
    const resultCountEl = document.getElementById('catalogResultCount');
    const emptyStateEl = document.getElementById('catalogEmptyState');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const headerSearchInput = document.getElementById('headerSearchInput');

    const VALID_CATEGORIES = new Set(['all', 'men', 'women', 'unisex', 'kids', 'gift-sets']);
    const CATEGORY_LABELS = {
      all: 'All',
      men: 'Men',
      women: 'Women',
      unisex: 'Unisex',
      kids: 'Kids',
      'gift-sets': 'Gift Sets'
    };

    const state = {
      category: 'all',
      search: '',
      sort: 'featured'
    };

    const readUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const rawCategory = (params.get('category') || '').trim().toLowerCase();
      const rawSearch = (params.get('search') || '').trim();

      if (VALID_CATEGORIES.has(rawCategory)) {
        state.category = rawCategory;
      }
      if (rawSearch) {
        state.search = rawSearch;
      }
    };

    const syncControlsFromState = () => {
      filterButtons.forEach((btn) => {
        const btnCat = (btn.getAttribute('data-category') || 'all').toLowerCase();
        const isActive = btnCat === state.category;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      if (searchInput && searchInput.value !== state.search) {
        searchInput.value = state.search;
      }
      if (headerSearchInput && headerSearchInput.value !== state.search) {
        headerSearchInput.value = state.search;
      }
      if (searchClearBtn) {
        searchClearBtn.hidden = !state.search.trim();
      }
      if (sortSelect && sortSelect.value !== state.sort) {
        sortSelect.value = state.sort;
      }
    };

    const syncUrlFromState = () => {
      try {
        const url = new URL(window.location.href);
        if (state.category && state.category !== 'all') {
          url.searchParams.set('category', state.category);
        } else {
          url.searchParams.delete('category');
        }
        if (state.search.trim()) {
          url.searchParams.set('search', state.search.trim());
        } else {
          url.searchParams.delete('search');
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // Ignore history API restrictions on file:// origins if any
      }
    };

    const formatProductTitleHtml = (name) =>
      escapeHtml(name).replace(/&amp;/g, '<span class="std-amp">&amp;</span>');

    const renderCard = (item) => {
      const mediaClasses = ['product-media'];
      if (item.lightBackground) mediaClasses.push('product-media--light-blend');

      const imgClasses = ['bottle-photo', 'bottle-photo--card'];
      if (item.imageClass) imgClasses.push(item.imageClass);

      const vignetteClass = item.lightBackground
        ? 'bottle-vignette bottle-vignette--strong'
        : 'bottle-vignette';

      const overlayHtml = item.hasThirdPartyBrand
        ? `
          <div class="bottle-brand-mask" aria-hidden="true">
            <div class="bottle-brand-plaque bottle-brand-plaque--compact">
              <span class="plaque-name">Notes <span class="std-amp">&amp;</span> Noir</span>
            </div>
          </div>
        `
        : '<div class="bottle-bottom-fade" aria-hidden="true"></div>';

      return `
        <article class="product-card" data-product-id="${escapeHtml(item.id)}" data-category="${escapeHtml(item.category.toLowerCase())}">
          <div class="${mediaClasses.join(' ')}">
            <span class="product-badge">${escapeHtml(item.category)}</span>
            <img
              src="${escapeHtml(resolveAssetPath(item.image))}"
              alt="${escapeHtml(item.name)} Perfume Bottle"
              class="${imgClasses.join(' ')}"
              loading="lazy"
            />
            <div class="${vignetteClass}" aria-hidden="true"></div>
            ${overlayHtml}
          </div>
          <div class="product-body">
            <div class="product-meta-row">
              <span class="product-edition">${escapeHtml(item.badge)}</span>
              <span class="product-size">${escapeHtml(item.size)}</span>
            </div>
            <h2 class="product-title">${formatProductTitleHtml(item.name)}</h2>
            <p class="product-notes">${escapeHtml(item.notes)}</p>
            <div class="product-footer">
              <span class="product-price">${formatMoney(item.price)}</span>
              <button
                type="button"
                class="btn-add-cart"
                data-id="${escapeHtml(item.id)}"
                data-product="${escapeHtml(item.name)}"
                data-price="${escapeHtml(item.price)}"
                data-image="${escapeHtml(item.image)}"
              >Add to Cart</button>
            </div>
          </div>
        </article>
      `;
    };

    const getFilteredCatalog = () => {
      const query = state.search.trim().toLowerCase();

      const filtered = NN_CATALOG.filter((item) => {
        if (state.category === 'gift-sets') {
          if (!item.giftSet) return false;
        } else if (state.category !== 'all') {
          if (item.category.toLowerCase() !== state.category) return false;
        }

        if (!query) return true;
        const searchable = `${item.name} ${item.notes} ${item.category} ${item.badge}`.toLowerCase();
        return searchable.includes(query);
      });

      if (state.sort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (state.sort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (state.sort === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }

      return filtered;
    };

    const renderCatalog = () => {
      syncControlsFromState();
      const items = getFilteredCatalog();
      const count = items.length;
      const noun = count === 1 ? 'fragrance' : 'fragrances';
      const activeParts = [];

      if (state.category !== 'all') {
        activeParts.push(`in ${CATEGORY_LABELS[state.category] || state.category}`);
      }
      if (state.search.trim()) {
        activeParts.push(`matching "${state.search.trim()}"`);
      }

      if (resultCountEl) {
        resultCountEl.textContent = activeParts.length
          ? `Showing ${count} ${noun} ${activeParts.join(' ')}`
          : `Showing ${count} ${noun}`;
      }

      // Show/hide the gold "Reset Filters" top-bar button
      if (resetBtn) {
        resetBtn.hidden = !(state.category !== 'all' || state.search.trim() !== '');
      }

      if (!count) {
        gridEl.innerHTML = '';
        gridEl.hidden = true;
        if (emptyStateEl) emptyStateEl.hidden = false;
        return;
      }

      if (emptyStateEl) emptyStateEl.hidden = true;
      gridEl.hidden = false;
      gridEl.innerHTML = items.map(renderCard).join('');
    };

    const resetAllFilters = () => {
      state.category = 'all';
      state.search = '';
      state.sort = 'featured';
      syncUrlFromState();
      renderCatalog();
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state.category = (btn.getAttribute('data-category') || 'all').toLowerCase();
        syncUrlFromState();
        renderCatalog();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.search = searchInput.value;
        syncUrlFromState();
        renderCatalog();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        state.search = '';
        syncUrlFromState();
        renderCatalog();
        if (searchInput) searchInput.focus();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        renderCatalog();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }

    // Also wire the empty-state inline reset button in shop-all.html
    const emptyResetBtn = document.getElementById('emptyResetBtn');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', resetAllFilters);
    }

    // Live-sync header search when user is already on Shop All
    if (headerSearchInput) {
      headerSearchInput.addEventListener('input', () => {
        state.search = headerSearchInput.value;
        syncUrlFromState();
        renderCatalog();
      });
    }

    readUrlParams();
    renderCatalog();
  };

  document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('headerSearchForm');
    const searchInput = document.getElementById('headerSearchInput');
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterStatus = document.getElementById('newsletterStatus');
    const headerCartBtn = document.getElementById('headerCartBtn');

    updateCartBadge();
    ensureCartDrawer();
    initShopAllCatalog();

    // Event delegation supports both static cards and dynamically rendered catalog cards
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-add-cart');
      if (!button) return;

      const productId = button.getAttribute('data-id');
      const productName = button.getAttribute('data-product') || 'Fragrance';
      const productPrice = button.getAttribute('data-price');
      const productImage = button.getAttribute('data-image');

      addToCart({
        id: productId,
        name: productName,
        price: productPrice ? Number(productPrice) : undefined,
        image: productImage || undefined
      });

      button.classList.add('added');
      const originalText = button.getAttribute('data-label') || button.textContent;
      button.setAttribute('data-label', originalText);
      button.textContent = 'Added';
      setTimeout(() => {
        button.classList.remove('added');
        button.textContent = originalText;
      }, 1100);
    });

    if (headerCartBtn) {
      headerCartBtn.addEventListener('click', () => {
        openCartDrawer();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeCartDrawer();
      }
    });

    // Header search redirect on Enter or form submit (or live-filter on Shop All)
    const submitHeaderSearch = () => {
      if (!searchInput) return;
      const query = searchInput.value.trim();
      const shopGrid = document.getElementById('shopCatalogGrid');
      if (shopGrid) {
        const catalogSearch = document.getElementById('catalogSearchInput');
        if (catalogSearch) {
          catalogSearch.value = query;
          catalogSearch.dispatchEvent(new Event('input', { bubbles: true }));
          catalogSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      if (!query) {
        showToast('Enter a scent or note to search Notes & Noir.');
        return;
      }
      const targetPage = /\/pages(\/|\\)/i.test(window.location.pathname)
        ? 'shop-all.html'
        : 'pages/shop-all.html';
      window.location.href = `${targetPage}?search=${encodeURIComponent(query)}`;
    };

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitHeaderSearch();
      });

      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitHeaderSearch();
        }
      });
    }

    // Footer newsletter email validation
    if (newsletterForm && newsletterEmail && newsletterStatus) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = newsletterEmail.value.trim();
        newsletterStatus.classList.remove('is-error', 'is-success');

        if (!email || !emailPattern.test(email)) {
          newsletterStatus.classList.add('is-error');
          newsletterStatus.textContent = 'Please enter a valid email address.';
          newsletterEmail.focus();
          return;
        }

        newsletterStatus.classList.add('is-success');
        newsletterStatus.textContent = 'Welcome to the Notes & Noir private list.';
        newsletterEmail.value = '';
        showToast('Subscribed to Notes & Noir private releases.');
      });
    }
  });
})();
