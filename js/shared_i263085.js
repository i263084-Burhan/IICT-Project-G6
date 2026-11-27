/**
 * Notes & Noir Fragrances — Shared State, Drawers & Utilities (shared_i263085.js)
 * Roll Number: i263085
 */
(function (global) {
  "use strict";

  const STORAGE_KEYS = {
    CART: "nn_cart_i263085",
    WISHLIST: "nn_wishlist_i263085",
    REVIEWS: "nn_reviews_i263085",
    ACCOUNT: "nn_account_i263085"
  };

  function getBasePrefix() {
    const path = window.location.pathname.replace(/\\/g, "/");
    return path.includes("/pages/") ? "../" : "";
  }

  function resolveAssetPath(relPath) {
    if (!relPath) return "";
    if (/^(https?:)?\//.test(relPath) || relPath.startsWith("../")) {
      return relPath;
    }
    return getBasePrefix() + relPath;
  }

  function getPageHref(target) {
    const inPages = window.location.pathname.replace(/\\/g, "/").includes("/pages/");
    if (target === "index.html") {
      return inPages ? "../index.html" : "index.html";
    }
    return inPages ? target : "pages/" + target;
  }

  function safeReadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function safeWriteJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Ignore storage quota errors gracefully
    }
  }

  function formatPrice(amount) {
    if (typeof amount === "number" && amount >= 500) {
      return "Rs. " + amount.toLocaleString("en-US");
    }
    const prefix = (global.NN_CONFIG && global.NN_CONFIG.CURRENCY_SYMBOL) || "$";
    return prefix + Number(amount || 0).toLocaleString("en-US");
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ------------------------------------------------------------------------
     Cart State Management
     ------------------------------------------------------------------------ */
  function getCart() {
    const items = safeReadJSON(STORAGE_KEYS.CART, []);
    if (!Array.isArray(items)) return [];
    const products = global.NN_PRODUCTS || [];
    return items.map(function (item) {
      const prod = products.find(function (p) { return p.id === item.id; });
      const variant = prod && prod.variants.find(function (v) { return v.size === item.size; });
      return (variant && (typeof item.unitPrice === "undefined" || item.unitPrice === null))
        ? Object.assign({}, item, { unitPrice: variant.price })
        : item;
    });
  }

  function saveCart(items) {
    safeWriteJSON(STORAGE_KEYS.CART, items);
    updateHeaderBadges();
    renderCartDrawer();
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

  function getCartSubtotal() {
    return getCart().reduce(
      (sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0),
      0
    );
  }

  function addToCart(payload) {
    const maxStock = (global.NN_CONFIG && global.NN_CONFIG.MAX_STOCK_PER_ITEM) || 10;
    const cart = getCart();
    const existingIndex = cart.findIndex(
      (item) => item.id === payload.id && item.size === payload.size
    );

    let capped = false;
    if (existingIndex >= 0) {
      const nextQty = cart[existingIndex].quantity + Number(payload.quantity || 1);
      if (nextQty > maxStock) {
        cart[existingIndex].quantity = maxStock;
        capped = true;
      } else {
        cart[existingIndex].quantity = nextQty;
      }
      cart[existingIndex].unitPrice = Number(payload.unitPrice);
    } else {
      cart.push({
        id: payload.id,
        title: payload.title,
        size: payload.size,
        unitPrice: Number(payload.unitPrice),
        quantity: Math.min(Math.max(1, Number(payload.quantity || 1)), maxStock),
        image: payload.image
      });
    }

    saveCart(cart);
    return { cart: cart, capped: capped };
  }

  function updateCartQuantity(id, size, delta) {
    const maxStock = (global.NN_CONFIG && global.NN_CONFIG.MAX_STOCK_PER_ITEM) || 10;
    const cart = getCart();
    const idx = cart.findIndex((item) => item.id === id && item.size === size);
    if (idx < 0) return;

    const next = cart[idx].quantity + delta;
    if (next <= 0) {
      cart.splice(idx, 1);
      showToast("Item removed from your bag.");
    } else if (next > maxStock) {
      showToast("Maximum " + maxStock + " bottles per fragrance size.");
      return;
    } else {
      cart[idx].quantity = next;
    }
    saveCart(cart);
  }

  function removeFromCart(id, size) {
    const cart = getCart().filter((item) => !(item.id === id && item.size === size));
    saveCart(cart);
    showToast("Item removed from your bag.");
  }

  /* ------------------------------------------------------------------------
     Wishlist State Management
     ------------------------------------------------------------------------ */
  function getWishlist() {
    const ids = safeReadJSON(STORAGE_KEYS.WISHLIST, []);
    return Array.isArray(ids) ? ids : [];
  }

  function isWishlisted(productId) {
    return getWishlist().includes(productId);
  }

  function toggleWishlist(productId) {
    const list = getWishlist();
    const idx = list.indexOf(productId);
    let added = false;
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(productId);
      added = true;
    }
    safeWriteJSON(STORAGE_KEYS.WISHLIST, list);
    updateHeaderBadges();
    renderWishlistDrawer();
    return added;
  }

  /* ------------------------------------------------------------------------
     Reviews Persistence
     ------------------------------------------------------------------------ */
  function getStoredReviewsMap() {
    const map = safeReadJSON(STORAGE_KEYS.REVIEWS, {});
    return map && typeof map === "object" && !Array.isArray(map) ? map : {};
  }

  function getProductReviews(productId, baseReviews) {
    const map = getStoredReviewsMap();
    const custom = Array.isArray(map[productId]) ? map[productId] : [];
    const base = Array.isArray(baseReviews) ? baseReviews : [];
    return custom.concat(base);
  }

  function addProductReview(productId, review) {
    const map = getStoredReviewsMap();
    if (!Array.isArray(map[productId])) {
      map[productId] = [];
    }
    map[productId].unshift(review);
    safeWriteJSON(STORAGE_KEYS.REVIEWS, map);
  }

  function getAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    return {
      avg: (total / reviews.length).toFixed(1),
      count: reviews.length
    };
  }

  /* ------------------------------------------------------------------------
     Live Announcements & Toast Notifications
     ------------------------------------------------------------------------ */
  function announce(message) {
    const region = document.getElementById("nn-aria-live");
    if (region) {
      region.textContent = "";
      window.setTimeout(function () {
        region.textContent = message;
      }, 30);
    }
  }

  function showToast(message) {
    let container = document.getElementById("nn-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "nn-toast-container";
      container.className = "nn-toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "nn-toast";
    toast.innerHTML =
      "<span>" +
      escapeHTML(message) +
      '</span><button type="button" class="btn-close btn-close-white btn-sm" aria-label="Dismiss notification"></button>';

    toast.querySelector("button").addEventListener("click", function () {
      toast.remove();
    });

    container.appendChild(toast);
    announce(message);

    window.setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 3600);
  }

  /* ------------------------------------------------------------------------
     Header Badges & Offcanvas / Modal Rendering
     ------------------------------------------------------------------------ */
  function updateHeaderBadges() {
    const cartCountEl = document.getElementById("nn-cart-count");
    const wishCountEl = document.getElementById("nn-wishlist-count");
    if (cartCountEl) cartCountEl.textContent = String(getCartCount());
    if (wishCountEl) wishCountEl.textContent = String(getWishlist().length);
  }

  function renderCartDrawer() {
    const bodyEl = document.getElementById("nn-cart-drawer-body");
    const footerEl = document.getElementById("nn-cart-drawer-footer");
    if (!bodyEl || !footerEl) return;

    const cart = getCart();
    const subtotal = getCartSubtotal();
    const threshold =
      (global.NN_CONFIG && global.NN_CONFIG.FREE_SHIPPING_THRESHOLD) || 75;
    const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
    const remaining = Math.max(0, threshold - subtotal);

    const shippingHtml =
      '<div class="p-3 mb-3 rounded border" style="border-color: var(--nn-taupe); background: #fff;">' +
      '<div class="d-flex justify-content-between small mb-2">' +
      (remaining === 0
        ? '<span class="fw-medium text-success">Complimentary shipping unlocked!</span>'
        : '<span>Add <strong>' +
          formatPrice(remaining) +
          "</strong> for free shipping</span>") +
      "<span>" +
      progress +
      "%</span></div>" +
      '<div class="nn-progress-track"><div class="nn-progress-fill" style="width:' +
      progress +
      '%"></div></div></div>';

    if (cart.length === 0) {
      bodyEl.innerHTML =
        shippingHtml +
        '<div class="text-center py-5">' +
        '<p class="nn-serif fs-4 mb-2">Your bag is currently empty</p>' +
        '<p class="text-muted small mb-4">Explore our small-batch extraits to begin your collection.</p>' +
        '<a href="' +
        getPageHref("shop.html") +
        '" class="nn-btn-primary">Browse Fragrances</a>' +
        "</div>";
      footerEl.innerHTML = "";
      return;
    }

    const itemsHtml = cart
      .map(function (item) {
        const lineTotal = item.unitPrice * item.quantity;
        const imgSrc = resolveAssetPath(item.image);
        const href =
          getPageHref("product-details.html") +
          "?id=" +
          encodeURIComponent(item.id);
        return (
          '<div class="d-flex gap-3 py-3 border-bottom" style="border-color: var(--nn-taupe) !important;">' +
          '<a href="' +
          href +
          '" class="flex-shrink-0">' +
          '<img src="' +
          escapeHTML(imgSrc) +
          '" alt="' +
          escapeHTML(item.title) +
          '" width="68" height="82" class="rounded object-fit-cover border">' +
          "</a>" +
          '<div class="flex-grow-1">' +
          '<div class="d-flex justify-content-between align-items-start gap-2">' +
          '<div><a href="' +
          href +
          '" class="nn-serif fs-5 fw-semibold d-block lh-sm">' +
          escapeHTML(item.title) +
          "</a>" +
          '<span class="small text-muted">' +
          escapeHTML(item.size) +
          " • " +
          formatPrice(item.unitPrice) +
          "</span></div>" +
          '<button type="button" class="btn btn-sm text-muted p-0 border-0 nn-cart-remove" data-id="' +
          escapeHTML(item.id) +
          '" data-size="' +
          escapeHTML(item.size) +
          '" aria-label="Remove ' +
          escapeHTML(item.title) +
          '">&times;</button>' +
          "</div>" +
          '<div class="d-flex justify-content-between align-items-center mt-2">' +
          '<div class="nn-qty-stepper" style="transform: scale(0.9); transform-origin: left;">' +
          '<button type="button" class="nn-qty-btn nn-cart-dec" data-id="' +
          escapeHTML(item.id) +
          '" data-size="' +
          escapeHTML(item.size) +
          '" aria-label="Decrease quantity">&minus;</button>' +
          '<span class="nn-qty-value">' +
          item.quantity +
          "</span>" +
          '<button type="button" class="nn-qty-btn nn-cart-inc" data-id="' +
          escapeHTML(item.id) +
          '" data-size="' +
          escapeHTML(item.size) +
          '" aria-label="Increase quantity">+</button>' +
          "</div>" +
          '<span class="fw-semibold small">' +
          formatPrice(lineTotal) +
          "</span>" +
          "</div></div></div>"
        );
      })
      .join("");

    bodyEl.innerHTML = shippingHtml + itemsHtml;

    const shippingCost = remaining === 0 ? 0 : 8;
    const orderTotal = subtotal + shippingCost;

    footerEl.innerHTML =
      '<div class="w-100 border-top pt-3" style="border-color: var(--nn-taupe) !important;">' +
      '<div class="d-flex justify-content-between small mb-1"><span class="text-muted">Subtotal</span><span>' +
      formatPrice(subtotal) +
      "</span></div>" +
      '<div class="d-flex justify-content-between small mb-2"><span class="text-muted">Estimated Shipping</span><span>' +
      (shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)) +
      "</span></div>" +
      '<div class="d-flex justify-content-between fw-semibold mb-3"><span>Total</span><span>' +
      formatPrice(orderTotal) +
      "</span></div>" +
      '<a href="' + getPageHref("shopping-bag.html") + '" class="btn btn-outline-dark btn-sm rounded-pill w-100 mb-2">View Full Shopping Bag</a>' +
      '<button type="button" id="nn-checkout-btn" class="nn-btn-primary w-100 mb-2">Proceed to Checkout</button>' +
      '<button type="button" id="nn-clear-cart-btn" class="btn btn-link btn-sm text-muted w-100 text-decoration-none">Clear Bag</button>' +
      "</div>";

    bodyEl.querySelectorAll(".nn-cart-inc").forEach(function (btn) {
      btn.addEventListener("click", function () {
        updateCartQuantity(btn.dataset.id, btn.dataset.size, 1);
      });
    });
    bodyEl.querySelectorAll(".nn-cart-dec").forEach(function (btn) {
      btn.addEventListener("click", function () {
        updateCartQuantity(btn.dataset.id, btn.dataset.size, -1);
      });
    });
    bodyEl.querySelectorAll(".nn-cart-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeFromCart(btn.dataset.id, btn.dataset.size);
      });
    });

    const checkoutBtn = document.getElementById("nn-checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        const orderCode = "NN-" + Math.floor(100000 + Math.random() * 900000);
        saveCart([]);
        showToast("Order " + orderCode + " confirmed! Thank you for choosing Notes & Noir.");
      });
    }

    const clearBtn = document.getElementById("nn-clear-cart-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        saveCart([]);
        showToast("Shopping bag cleared.");
      });
    }
  }

  function renderWishlistDrawer() {
    const bodyEl = document.getElementById("nn-wishlist-drawer-body");
    if (!bodyEl) return;

    const wishlistIds = getWishlist();
    const products = global.NN_PRODUCTS || [];
    const savedProducts = products.filter(function (p) {
      return wishlistIds.includes(p.id);
    });

    if (savedProducts.length === 0) {
      bodyEl.innerHTML =
        '<div class="text-center py-5">' +
        '<p class="nn-serif fs-4 mb-2">No saved fragrances yet</p>' +
        '<p class="text-muted small mb-4">Tap Save on any bottle to curate your personal scent wardrobe.</p>' +
        '<a href="' +
        getPageHref("shop.html") +
        '" class="nn-btn-outline">Discover Collection</a>' +
        "</div>";
      return;
    }

    bodyEl.innerHTML = savedProducts
      .map(function (p) {
        const baseVariant = p.variants[0];
        const imgSrc = resolveAssetPath(p.gallery[0].src);
        const href =
          getPageHref("product-details.html") +
          "?id=" +
          encodeURIComponent(p.id);
        return (
          '<div class="d-flex gap-3 py-3 border-bottom" style="border-color: var(--nn-taupe) !important;">' +
          '<a href="' +
          href +
          '" class="flex-shrink-0">' +
          '<img src="' +
          escapeHTML(imgSrc) +
          '" alt="' +
          escapeHTML(p.title) +
          '" width="68" height="82" class="rounded object-fit-cover border">' +
          "</a>" +
          '<div class="flex-grow-1">' +
          '<a href="' +
          href +
          '" class="nn-serif fs-5 fw-semibold d-block lh-sm">' +
          escapeHTML(p.title) +
          "</a>" +
          '<div class="small text-muted mb-2">' +
          escapeHTML(p.familyTags) +
          " • " +
          formatPrice(baseVariant.price) +
          "</div>" +
          '<div class="d-flex gap-2">' +
          '<button type="button" class="btn btn-sm btn-dark rounded-pill px-3 nn-wish-add-cart" data-id="' +
          escapeHTML(p.id) +
          '">Add 50 ml</button>' +
          '<button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 nn-wish-remove" data-id="' +
          escapeHTML(p.id) +
          '">Remove</button>' +
          "</div></div></div>"
        );
      })
      .join("");

    bodyEl.querySelectorAll(".nn-wish-add-cart").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const prod = products.find(function (item) {
          return item.id === btn.dataset.id;
        });
        if (!prod) return;
        addToCart({
          id: prod.id,
          title: prod.title,
          size: prod.variants[0].size,
          unitPrice: prod.variants[0].price,
          quantity: 1,
          image: prod.gallery[0].src
        });
        showToast(prod.title + " (" + prod.variants[0].size + ") added to bag.");
      });
    });

    bodyEl.querySelectorAll(".nn-wish-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        toggleWishlist(btn.dataset.id);
        global.dispatchEvent(new CustomEvent("nn:wishlist-updated"));
        showToast("Removed from wishlist.");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Inject Shared Utility Modals & Offcanvas Drawers
     ------------------------------------------------------------------------ */
  function injectSharedOverlays() {
    if (document.getElementById("nn-cart-offcanvas")) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML =
      '<div id="nn-aria-live" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>' +
      // Cart Offcanvas
      '<div class="offcanvas offcanvas-end nn-offcanvas" tabindex="-1" id="nn-cart-offcanvas" aria-labelledby="nn-cart-label">' +
      '  <div class="offcanvas-header">' +
      '    <h2 class="offcanvas-title nn-serif fs-3" id="nn-cart-label">Your Shopping Bag</h2>' +
      '    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close bag"></button>' +
      "  </div>" +
      '  <div class="offcanvas-body d-flex flex-column">' +
      '    <div id="nn-cart-drawer-body" class="flex-grow-1 overflow-auto pe-1"></div>' +
      '    <div id="nn-cart-drawer-footer" class="mt-3"></div>' +
      "  </div>" +
      "</div>" +
      // Wishlist Offcanvas
      '<div class="offcanvas offcanvas-end nn-offcanvas" tabindex="-1" id="nn-wishlist-offcanvas" aria-labelledby="nn-wishlist-label">' +
      '  <div class="offcanvas-header">' +
      '    <h2 class="offcanvas-title nn-serif fs-3" id="nn-wishlist-label">Saved Wishlist</h2>' +
      '    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close wishlist"></button>' +
      "  </div>" +
      '  <div class="offcanvas-body" id="nn-wishlist-drawer-body"></div>' +
      "</div>" +
      // Search Modal
      '<div class="modal fade" id="nn-search-modal" tabindex="-1" aria-labelledby="nn-search-label" aria-hidden="true">' +
      '  <div class="modal-dialog modal-dialog-centered modal-lg">' +
      '    <div class="modal-content" style="background: var(--nn-cream); border: 1px solid var(--nn-taupe);">' +
      '      <div class="modal-header border-bottom" style="border-color: var(--nn-taupe) !important;">' +
      '        <h2 class="modal-title nn-serif fs-3" id="nn-search-label">Search Fragrances</h2>' +
      '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close search"></button>' +
      "      </div>" +
      '      <div class="modal-body p-4">' +
      '        <label for="nn-search-input" class="visually-hidden">Search by fragrance name or note</label>' +
      '        <input type="search" id="nn-search-input" class="form-control nn-form-control mb-3" placeholder="Search by scent name or note (e.g. Oud, Rose, Amber, Saffron)...">' +
      '        <div id="nn-search-results" class="row g-3"></div>' +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>" +
      // Account Modal
      '<div class="modal fade" id="nn-account-modal" tabindex="-1" aria-labelledby="nn-account-label" aria-hidden="true">' +
      '  <div class="modal-dialog modal-dialog-centered">' +
      '    <div class="modal-content" style="background: var(--nn-cream); border: 1px solid var(--nn-taupe);">' +
      '      <div class="modal-header border-bottom" style="border-color: var(--nn-taupe) !important;">' +
      '        <h2 class="modal-title nn-serif fs-3" id="nn-account-label">Atelier Member Account</h2>' +
      '        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close account modal"></button>' +
      "      </div>" +
      '      <div class="modal-body p-4" id="nn-account-body"></div>' +
      "    </div>" +
      "  </div>" +
      "</div>";

    document.body.appendChild(wrapper);
    bindSearchModal();
    bindAccountModal();
  }

  function bindSearchModal() {
    const input = document.getElementById("nn-search-input");
    const resultsEl = document.getElementById("nn-search-results");
    if (!input || !resultsEl) return;

    function renderResults(query) {
      const q = (query || "").trim().toLowerCase();
      const products = global.NN_PRODUCTS || [];
      const matches = products.filter(function (p) {
        if (!q) return true;
        const notesAll = []
          .concat(p.notes.top, p.notes.heart, p.notes.base)
          .join(" ")
          .toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.familyTags.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          notesAll.includes(q)
        );
      });

      if (matches.length === 0) {
        resultsEl.innerHTML =
          '<div class="col-12 text-center py-4 text-muted">No fragrances matched "' +
          escapeHTML(query) +
          '". Try Oud, Rose, Amber, or Neroli.</div>';
        return;
      }

      resultsEl.innerHTML = matches
        .map(function (p) {
          const href =
            getPageHref("product-details.html") +
            "?id=" +
            encodeURIComponent(p.id);
          return (
            '<div class="col-md-6">' +
            '<a href="' +
            href +
            '" class="d-flex gap-3 p-2 rounded border bg-white align-items-center text-decoration-none" style="border-color: var(--nn-taupe) !important;">' +
            '<img src="' +
            escapeHTML(resolveAssetPath(p.gallery[0].src)) +
            '" alt="' +
            escapeHTML(p.title) +
            '" width="56" height="68" class="rounded object-fit-cover">' +
            '<div><div class="nn-serif fs-5 fw-semibold text-dark">' +
            escapeHTML(p.title) +
            "</div>" +
            '<div class="small text-muted">' +
            escapeHTML(p.familyTags) +
            "</div>" +
            '<div class="small fw-medium text-dark">' +
            formatPrice(p.variants[0].price) +
            "</div></div></a></div>"
          );
        })
        .join("");
    }

    renderResults("");
    input.addEventListener("input", function () {
      renderResults(input.value);
    });
  }

  function bindAccountModal() {
    const body = document.getElementById("nn-account-body");
    if (!body) return;

    function renderAccount() {
      const account = safeReadJSON(STORAGE_KEYS.ACCOUNT, null);
      if (account && account.email) {
        body.innerHTML =
          '<p class="mb-1 small text-muted text-uppercase">Signed in as</p>' +
          '<h3 class="nn-serif fs-3 mb-1">' +
          escapeHTML(account.name) +
          "</h3>" +
          '<p class="small text-muted mb-3">' +
          escapeHTML(account.email) +
          "</p>" +
          '<div class="p-3 rounded border bg-white mb-3" style="border-color: var(--nn-taupe) !important;">' +
          '<div class="small fw-medium mb-1">Atelier Member Benefits</div>' +
          '<div class="small text-muted">Complimentary gift wrapping and priority small-batch releases enabled.</div>' +
          "</div>" +
          '<button type="button" id="nn-signout-btn" class="nn-btn-outline w-100">Sign Out</button>';
        document.getElementById("nn-signout-btn").addEventListener("click", function () {
          localStorage.removeItem(STORAGE_KEYS.ACCOUNT);
          renderAccount();
          showToast("Signed out of your Notes & Noir account.");
        });
      } else {
        body.innerHTML =
          '<form id="nn-account-form" novalidate>' +
          '<div class="mb-3"><label for="nn-acc-name" class="form-label small fw-medium">Full Name</label>' +
          '<input type="text" id="nn-acc-name" class="form-control nn-form-control" placeholder="e.g. Ayesha Khan" required></div>' +
          '<div class="mb-3"><label for="nn-acc-email" class="form-label small fw-medium">Email Address</label>' +
          '<input type="email" id="nn-acc-email" class="form-control nn-form-control" placeholder="name@example.com" required></div>' +
          '<div id="nn-acc-error" class="nn-field-error mb-2">Please enter a valid name and email address.</div>' +
          '<button type="submit" class="nn-btn-primary w-100">Sign In / Join Atelier</button>' +
          "</form>";

        document.getElementById("nn-account-form").addEventListener("submit", function (e) {
          e.preventDefault();
          const nameVal = document.getElementById("nn-acc-name").value.trim();
          const emailVal = document.getElementById("nn-acc-email").value.trim();
          const errEl = document.getElementById("nn-acc-error");
          if (nameVal.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            errEl.classList.add("visible");
            return;
          }
          errEl.classList.remove("visible");
          safeWriteJSON(STORAGE_KEYS.ACCOUNT, { name: nameVal, email: emailVal });
          renderAccount();
          showToast("Welcome to Notes & Noir, " + nameVal + ".");
        });
      }
    }

    renderAccount();
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectSharedOverlays();
    updateHeaderBadges();
    renderCartDrawer();
    renderWishlistDrawer();
  });

  global.NNStore = {
    formatPrice: formatPrice,
    escapeHTML: escapeHTML,
    resolveAssetPath: resolveAssetPath,
    getPageHref: getPageHref,
    getCart: getCart,
    addToCart: addToCart,
    updateCartQuantity: updateCartQuantity,
    removeFromCart: removeFromCart,
    getCartCount: getCartCount,
    getCartSubtotal: getCartSubtotal,
    getWishlist: getWishlist,
    isWishlisted: isWishlisted,
    toggleWishlist: toggleWishlist,
    getProductReviews: getProductReviews,
    addProductReview: addProductReview,
    getAverageRating: getAverageRating,
    showToast: showToast,
    announce: announce,
    updateHeaderBadges: updateHeaderBadges
  };
})(window);
