/**
 * Notes & Noir Fragrances — Shared Utilities (shared_i263070.js)
 * Manages cart & wishlist localStorage state, header counters, and
 * the dynamic free-shipping threshold banner ($75).
 */
'use strict';

(() => {
  const CART_STORAGE_KEY = 'notesNoir_cart';
  const WISHLIST_STORAGE_KEY = 'notesNoir_wishlist';
  const FREE_SHIPPING_THRESHOLD = 75;

  function safeParseJson(raw, fallback) {
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function getCart() {
    try {
      return safeParseJson(window.localStorage.getItem(CART_STORAGE_KEY), []);
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage access errors
    }
  }

  function getWishlist() {
    try {
      return safeParseJson(window.localStorage.getItem(WISHLIST_STORAGE_KEY), []);
    } catch {
      return [];
    }
  }

  function getCartCount(cart = getCart()) {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

  function getCartSubtotal(cart = getCart()) {
    return cart.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
  }

  function updateShippingBanner(subtotal = getCartSubtotal()) {
    const promoEl = document.querySelector('[data-shipping-promo]');
    if (!promoEl) return;

    if (subtotal <= 0) {
      promoEl.textContent = 'Free shipping on orders over $75';
      return;
    }

    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      promoEl.textContent = `Free shipping unlocked! (Cart: $${subtotal.toFixed(2)})`;
      return;
    }

    const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
    promoEl.textContent = `Add $${remaining.toFixed(2)} more for free shipping on orders over $75`;
  }

  function updateHeaderCounters() {
    const cart = getCart();
    const wishlist = getWishlist();
    const totalCartItems = getCartCount(cart);
    const totalWishlistItems = wishlist.length;

    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = String(totalCartItems);
    });

    document.querySelectorAll('[data-wishlist-count]').forEach((el) => {
      el.textContent = String(totalWishlistItems);
    });

    updateShippingBanner(getCartSubtotal(cart));
  }

  function addToCart(product) {
    if (!product || !product.id) return getCart();

    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 0) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image: product.image || '',
        quantity: 1
      });
    }

    saveCart(cart);
    updateHeaderCounters();

    document.dispatchEvent(
      new CustomEvent('nn:cartUpdated', {
        detail: {
          cart,
          totalItems: getCartCount(cart),
          subtotal: getCartSubtotal(cart)
        }
      })
    );

    return cart;
  }

  window.NNShared = {
    FREE_SHIPPING_THRESHOLD,
    getCart,
    saveCart,
    getWishlist,
    getCartCount,
    getCartSubtotal,
    addToCart,
    updateHeaderCounters,
    updateShippingBanner
  };

  window.updateHeaderCounters = updateHeaderCounters;

  document.addEventListener('DOMContentLoaded', updateHeaderCounters);
  window.addEventListener('storage', (event) => {
    if (event.key === CART_STORAGE_KEY || event.key === WISHLIST_STORAGE_KEY) {
      updateHeaderCounters();
    }
  });
})();
