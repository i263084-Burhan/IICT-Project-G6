/**
 * Notes & Noir Fragrances — Shopping Bag Controller (shopping-bag_i263085.js)
 * Roll Number: i263085
 * Strictly semantic Vanilla JavaScript (ES6+), no frameworks or external dependencies.
 */
(function (global) {
  "use strict";

  // Storage keys & thresholds
  const STORAGE_KEYS = {
    CART: "nn_cart_i263085",
    WISHLIST: "nn_wishlist_i263085"
  };

  const SHIPPING_CONFIG = {
    FLAT_RATE_PKR: 250,
    FREE_THRESHOLD_PKR: 15000,
    MAX_QTY_PER_ITEM: 10
  };

  // Valid promo codes map
  const PROMO_CODES = {
    NOIR10: { rate: 0.10, description: "10% off entire bag" },
    ATELIER15: { rate: 0.15, description: "15% Atelier member discount" }
  };

  // Default seed items used ONLY if the user has NEVER initialized the cart key in localStorage
  const DEFAULT_SEED_ITEMS = [
    {
      id: "noir-oud",
      title: "Noir Oud",
      scentFamily: "Woody • Amber • Spicy",
      size: "50 ml",
      unitPrice: 8500,
      quantity: 1,
      image: "images/noir-oud-main.svg"
    },
    {
      id: "rose-mist",
      title: "Rose Mist",
      scentFamily: "Floral • Fresh • Elegant",
      size: "50 ml",
      unitPrice: 4200,
      quantity: 1,
      image: "images/rose-mist-main.svg"
    }
  ];

  // State object
  const state = {
    appliedPromo: null, // { code: 'NOIR10', rate: 0.10 }
    cart: []
  };

  /* ------------------------------------------------------------------------
     Format & Path Utilities
     ------------------------------------------------------------------------ */
  function formatPKR(amount) {
    const num = Math.round(Number(amount) || 0);
    return "Rs. " + num.toLocaleString("en-US");
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function resolveImgPath(relPath) {
    if (!relPath) return "../images/noir-oud-main.svg";
    if (relPath.startsWith("http") || relPath.startsWith("../")) return relPath;
    return "../" + relPath.replace(/^\/+/, "");
  }

  function announceStatus(message) {
    const liveRegion = document.getElementById("nn-bag-live-region");
    if (liveRegion) {
      liveRegion.textContent = "";
      window.setTimeout(function () {
        liveRegion.textContent = message;
      }, 30);
    }
  }

  /* ------------------------------------------------------------------------
     Cart Storage Persistence & Initialization
     ------------------------------------------------------------------------ */
  function initializeCartData() {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (raw === null) {
      // Key has never been initialized: seed default items
      state.cart = JSON.parse(JSON.stringify(DEFAULT_SEED_ITEMS));
      saveCartData(state.cart, false);
    } else {
      try {
        const parsed = JSON.parse(raw);
        state.cart = Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        state.cart = [];
      }
    }
  }

  function saveCartData(items, updateBadge = true) {
    state.cart = items;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    } catch (err) {
      console.warn("Storage quota exceeded or storage disabled:", err);
    }
    if (updateBadge) {
      syncHeaderCartBadge();
    }
  }

  function getCartItemCount() {
    return state.cart.reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }

  function syncHeaderCartBadge() {
    const count = getCartItemCount();
    const countEl = document.getElementById("nn-cart-count");
    if (countEl) {
      countEl.textContent = String(count);
    }
    // Also trigger custom event for shared components
    global.dispatchEvent(new CustomEvent("nn:cart-updated", { detail: { count: count } }));
  }

  /* ------------------------------------------------------------------------
     Calculations
     ------------------------------------------------------------------------ */
  function calculateOrderSummary() {
    const subtotal = state.cart.reduce(function (sum, item) {
      const price = Number(item.unitPrice) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);

    let discount = 0;
    if (state.appliedPromo && subtotal > 0) {
      discount = Math.round(subtotal * state.appliedPromo.rate);
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);

    let delivery = 0;
    let isFreeDelivery = false;

    if (subtotal === 0) {
      delivery = 0;
      isFreeDelivery = true;
    } else if (subtotal >= SHIPPING_CONFIG.FREE_THRESHOLD_PKR) {
      delivery = 0;
      isFreeDelivery = true;
    } else {
      delivery = SHIPPING_CONFIG.FLAT_RATE_PKR;
      isFreeDelivery = false;
    }

    const grandTotal = subtotal === 0 ? 0 : discountedSubtotal + delivery;

    return {
      subtotal: subtotal,
      discount: discount,
      delivery: delivery,
      isFreeDelivery: isFreeDelivery,
      grandTotal: grandTotal,
      itemCount: getCartItemCount()
    };
  }

  /* ------------------------------------------------------------------------
     DOM Rendering: Cart Rows & Order Summary
     ------------------------------------------------------------------------ */
  function renderShoppingBag() {
    const activeViewEl = document.getElementById("nn-cart-active-view");
    const emptyViewEl = document.getElementById("nn-cart-empty-view");
    const containerEl = document.getElementById("nn-cart-items-card");
    const checkoutBtn = document.getElementById("nn-proceed-checkout-btn");
    const clearBtn = document.getElementById("nn-clear-bag-btn");

    if (!activeViewEl || !emptyViewEl || !containerEl) return;

    // Check if cart is empty
    if (state.cart.length === 0) {
      activeViewEl.classList.add("d-none");
      emptyViewEl.classList.remove("d-none");
      if (checkoutBtn) checkoutBtn.disabled = true;
      if (clearBtn) clearBtn.disabled = true;
      renderSummarySection();
      syncHeaderCartBadge();
      return;
    }

    // Active state with items
    activeViewEl.classList.remove("d-none");
    emptyViewEl.classList.add("d-none");
    if (checkoutBtn) checkoutBtn.disabled = false;
    if (clearBtn) clearBtn.disabled = false;

    // Render items
    containerEl.innerHTML = state.cart
      .map(function (item, index) {
        const unitPrice = Number(item.unitPrice) || 0;
        const qty = Number(item.quantity) || 1;
        const lineTotal = unitPrice * qty;
        const imgSrc = resolveImgPath(item.image);
        const itemFamily = item.scentFamily || "Notes &amp; Noir Signature Extrait";
        const itemSize = item.size || "50 ml";
        const isMaxQty = qty >= SHIPPING_CONFIG.MAX_QTY_PER_ITEM;
        const isMinQty = qty <= 1;

        return (
          '<div class="nn-cart-row" data-id="' + escapeHTML(item.id) + '" data-size="' + escapeHTML(itemSize) + '">' +
            // Product info & thumbnail
            '<div class="nn-cart-product-cell">' +
              '<a href="product-details.html?id=' + encodeURIComponent(item.id) + '" class="flex-shrink-0" tabindex="-1" aria-hidden="true">' +
                '<img src="' + escapeHTML(imgSrc) + '" alt="' + escapeHTML(item.title) + ' perfume bottle" class="nn-cart-thumb" width="76" height="92" loading="lazy">' +
              '</a>' +
              '<div>' +
                '<a href="product-details.html?id=' + encodeURIComponent(item.id) + '" class="nn-cart-item-title">' +
                  escapeHTML(item.title) +
                '</a>' +
                '<div class="nn-cart-item-family">' + escapeHTML(itemFamily) + '</div>' +
                '<span class="nn-size-pill">' + escapeHTML(itemSize) + '</span>' +
              '</div>' +
            '</div>' +

            // Unit Price
            '<div class="nn-cart-price-cell">' +
              '<span class="d-md-none text-muted small me-1">Unit Price: </span>' +
              '<span class="fw-medium">' + formatPKR(unitPrice) + '</span>' +
            '</div>' +

            // Pill Quantity Stepper
            '<div class="nn-cart-qty-cell">' +
              '<div class="nn-pill-stepper" role="group" aria-label="Quantity for ' + escapeHTML(item.title) + '">' +
                '<button type="button" class="nn-pill-stepper-btn nn-qty-dec" data-id="' + escapeHTML(item.id) + '" data-size="' + escapeHTML(itemSize) + '" aria-label="Decrease quantity of ' + escapeHTML(item.title) + '" ' + (isMinQty ? "disabled" : "") + '>&minus;</button>' +
                '<span class="nn-pill-stepper-val" aria-live="polite">' + qty + '</span>' +
                '<button type="button" class="nn-pill-stepper-btn nn-qty-inc" data-id="' + escapeHTML(item.id) + '" data-size="' + escapeHTML(itemSize) + '" aria-label="Increase quantity of ' + escapeHTML(item.title) + '" ' + (isMaxQty ? "disabled" : "") + '>+</button>' +
              '</div>' +
            '</div>' +

            // Line Total
            '<div class="nn-cart-total-cell">' +
              '<span class="d-md-none text-muted small me-1">Total: </span>' +
              '<span class="fw-semibold">' + formatPKR(lineTotal) + '</span>' +
            '</div>' +

            // Remove/Delete Action
            '<div class="nn-cart-action-cell">' +
              '<button type="button" class="nn-trash-btn nn-cart-remove" data-id="' + escapeHTML(item.id) + '" data-size="' + escapeHTML(itemSize) + '" data-title="' + escapeHTML(item.title) + '" aria-label="Remove ' + escapeHTML(item.title) + ' from shopping bag" title="Remove fragrance">' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                  '<polyline points="3 6 5 6 21 6"></polyline>' +
                  '<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>' +
                  '<line x1="10" y1="11" x2="10" y2="17"></line>' +
                  '<line x1="14" y1="11" x2="14" y2="17"></line>' +
                '</svg>' +
              '</button>' +
            '</div>' +
          '</div>'
        );
      })
      .join("");

    bindCartItemEvents(containerEl);
    renderSummarySection();
    syncHeaderCartBadge();
  }

  function bindCartItemEvents(containerEl) {
    // Increase quantity
    containerEl.querySelectorAll(".nn-qty-inc").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.dataset.id;
        const size = btn.dataset.size;
        updateItemQuantity(id, size, 1);
      });
    });

    // Decrease quantity
    containerEl.querySelectorAll(".nn-qty-dec").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.dataset.id;
        const size = btn.dataset.size;
        updateItemQuantity(id, size, -1);
      });
    });

    // Delete item
    containerEl.querySelectorAll(".nn-cart-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const id = btn.dataset.id;
        const size = btn.dataset.size;
        const title = btn.dataset.title || "Item";
        removeCartItem(id, size, title);
      });
    });
  }

  function renderSummarySection() {
    const summary = calculateOrderSummary();

    const subtotalEl = document.getElementById("nn-summary-subtotal");
    const deliveryEl = document.getElementById("nn-summary-delivery");
    const totalEl = document.getElementById("nn-summary-total");
    const discountRowEl = document.getElementById("nn-summary-discount-row");
    const discountValEl = document.getElementById("nn-summary-discount-val");
    const codeLabelEl = document.getElementById("nn-summary-code-label");
    const shippingProgressEl = document.getElementById("nn-summary-shipping-progress");
    const hintTextEl = document.getElementById("nn-shipping-hint-text");
    const percentTextEl = document.getElementById("nn-shipping-percent-text");
    const progressFillEl = document.getElementById("nn-shipping-progress-fill");
    const modalItemsCountEl = document.getElementById("nn-modal-items-count");
    const modalTotalAmountEl = document.getElementById("nn-modal-total-amount");
    const submitOrderLabelEl = document.getElementById("nn-submit-order-label");

    if (subtotalEl) subtotalEl.textContent = formatPKR(summary.subtotal);

    if (deliveryEl) {
      if (summary.subtotal === 0) {
        deliveryEl.textContent = "Rs. 0";
      } else if (summary.isFreeDelivery) {
        deliveryEl.innerHTML = '<span class="text-success fw-semibold">Free</span>';
      } else {
        deliveryEl.textContent = formatPKR(summary.delivery);
      }
    }

    // Promo discount line
    if (discountRowEl && discountValEl) {
      if (summary.discount > 0 && state.appliedPromo) {
        discountRowEl.classList.remove("d-none");
        if (codeLabelEl) codeLabelEl.textContent = state.appliedPromo.code;
        discountValEl.textContent = "-" + formatPKR(summary.discount);
      } else {
        discountRowEl.classList.add("d-none");
      }
    }

    if (totalEl) totalEl.textContent = formatPKR(summary.grandTotal);

    // Free Shipping Progress
    if (shippingProgressEl && hintTextEl && percentTextEl && progressFillEl) {
      if (summary.subtotal === 0) {
        hintTextEl.textContent = "Add fragrances to unlock free delivery.";
        percentTextEl.textContent = "0%";
        progressFillEl.style.width = "0%";
      } else if (summary.isFreeDelivery) {
        hintTextEl.innerHTML = '<span class="text-success">Complimentary Nationwide Delivery Unlocked!</span>';
        percentTextEl.textContent = "100%";
        progressFillEl.style.width = "100%";
      } else {
        const remaining = SHIPPING_CONFIG.FREE_THRESHOLD_PKR - summary.subtotal;
        const percent = Math.min(100, Math.round((summary.subtotal / SHIPPING_CONFIG.FREE_THRESHOLD_PKR) * 100));
        hintTextEl.innerHTML = 'Add <strong>' + formatPKR(remaining) + '</strong> more for free delivery';
        percentTextEl.textContent = percent + "%";
        progressFillEl.style.width = percent + "%";
      }
    }

    // Modal preview updates
    if (modalItemsCountEl) {
      modalItemsCountEl.textContent = summary.itemCount + (summary.itemCount === 1 ? " fragrance" : " fragrances");
    }
    if (modalTotalAmountEl) {
      modalTotalAmountEl.textContent = formatPKR(summary.grandTotal);
    }
    if (submitOrderLabelEl) {
      submitOrderLabelEl.textContent = "Place Order • " + formatPKR(summary.grandTotal);
    }
  }

  /* ------------------------------------------------------------------------
     Quantity, Remove & Clear Actions
     ------------------------------------------------------------------------ */
  function updateItemQuantity(id, size, delta) {
    const itemIndex = state.cart.findIndex(function (item) {
      return item.id === id && (item.size || "50 ml") === size;
    });

    if (itemIndex < 0) return;

    const currentItem = state.cart[itemIndex];
    const newQty = (Number(currentItem.quantity) || 1) + delta;

    if (newQty < 1) {
      removeCartItem(id, size, currentItem.title);
      return;
    }

    if (newQty > SHIPPING_CONFIG.MAX_QTY_PER_ITEM) {
      if (global.NNStore && global.NNStore.showToast) {
        global.NNStore.showToast("Limit reached: maximum " + SHIPPING_CONFIG.MAX_QTY_PER_ITEM + " bottles per order.");
      }
      return;
    }

    currentItem.quantity = newQty;
    saveCartData(state.cart);
    renderShoppingBag();
    announceStatus(currentItem.title + " quantity updated to " + newQty + ".");
  }

  function removeCartItem(id, size, title) {
    const updated = state.cart.filter(function (item) {
      return !(item.id === id && (item.size || "50 ml") === size);
    });

    saveCartData(updated);
    renderShoppingBag();

    const msg = (title || "Item") + " removed from your shopping bag.";
    announceStatus(msg);
    if (global.NNStore && global.NNStore.showToast) {
      global.NNStore.showToast(msg);
    }
  }

  function clearAllCart() {
    if (state.cart.length === 0) return;

    saveCartData([]);
    state.appliedPromo = null;
    renderShoppingBag();

    const msg = "Shopping bag cleared.";
    announceStatus(msg);
    if (global.NNStore && global.NNStore.showToast) {
      global.NNStore.showToast(msg);
    }
  }

  /* ------------------------------------------------------------------------
     Promo Code Handling
     ------------------------------------------------------------------------ */
  function applyPromoCode() {
    const inputEl = document.getElementById("nn-promo-input");
    const feedbackEl = document.getElementById("nn-promo-feedback");
    if (!inputEl || !feedbackEl) return;

    const code = inputEl.value.trim().toUpperCase();
    feedbackEl.className = "nn-promo-feedback is-visible";

    if (!code) {
      feedbackEl.classList.add("is-error");
      feedbackEl.textContent = "Please enter a promotional code.";
      return;
    }

    if (state.cart.length === 0) {
      feedbackEl.classList.add("is-error");
      feedbackEl.textContent = "Your shopping bag is empty. Add fragrances first.";
      return;
    }

    if (PROMO_CODES[code]) {
      state.appliedPromo = {
        code: code,
        rate: PROMO_CODES[code].rate
      };
      feedbackEl.classList.remove("is-error");
      feedbackEl.classList.add("is-success");
      feedbackEl.textContent = 'Promo code "' + code + '" applied! ' + Math.round(PROMO_CODES[code].rate * 100) + "% discount subtracted from subtotal.";
      renderSummarySection();
      announceStatus("Promo code applied: " + code);
    } else {
      feedbackEl.classList.remove("is-success");
      feedbackEl.classList.add("is-error");
      feedbackEl.textContent = 'Invalid promo code. Try "NOIR10" for 10% off.';
    }
  }

  /* ------------------------------------------------------------------------
     Checkout Modal Form & Live Field Validation
     ------------------------------------------------------------------------ */
  function setupCheckoutModal() {
    const proceedBtn = document.getElementById("nn-proceed-checkout-btn");
    const checkoutModalEl = document.getElementById("nn-checkout-modal");
    const formEl = document.getElementById("nn-checkout-form");
    const formContainer = document.getElementById("nn-checkout-form-container");
    const successContainer = document.getElementById("nn-checkout-success-container");

    if (!proceedBtn || !checkoutModalEl || !formEl) return;

    // Open Modal
    proceedBtn.addEventListener("click", function () {
      if (state.cart.length === 0) {
        if (global.NNStore && global.NNStore.showToast) {
          global.NNStore.showToast("Your shopping bag is currently empty.");
        }
        return;
      }

      // Reset modal views to form
      formContainer.classList.remove("d-none");
      successContainer.classList.add("d-none");
      renderSummarySection();

      if (global.bootstrap && global.bootstrap.Modal) {
        global.bootstrap.Modal.getOrCreateInstance(checkoutModalEl).show();
      }
    });

    // Live Field Validation Definitions
    const fields = {
      name: {
        el: document.getElementById("nn-field-name"),
        err: document.getElementById("nn-err-name"),
        validate: function (val) {
          return /^[a-zA-Z\s]{2,50}$/.test(val.trim());
        }
      },
      email: {
        el: document.getElementById("nn-field-email"),
        err: document.getElementById("nn-err-email"),
        validate: function (val) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
        }
      },
      phone: {
        el: document.getElementById("nn-field-phone"),
        err: document.getElementById("nn-err-phone"),
        validate: function (val) {
          // Allows Pakistani standard formats e.g. 03001234567, 0300-1234567, +923001234567, or 10-14 digits
          const cleaned = val.replace(/[\s\-\(\)]/g, "");
          return /^(\+92|0)?3[0-9]{9}$/.test(cleaned) || /^[0-9]{10,14}$/.test(cleaned);
        }
      },
      city: {
        el: document.getElementById("nn-field-city"),
        err: document.getElementById("nn-err-city"),
        validate: function (val) {
          return val.trim() !== "";
        }
      },
      address: {
        el: document.getElementById("nn-field-address"),
        err: document.getElementById("nn-err-address"),
        validate: function (val) {
          return val.trim().length >= 8;
        }
      }
    };

    function validateField(fieldKey) {
      const field = fields[fieldKey];
      if (!field || !field.el) return true;
      const isValid = field.validate(field.el.value);
      if (isValid) {
        field.el.classList.remove("is-invalid");
        field.el.classList.add("is-valid");
        if (field.err) field.err.classList.remove("visible");
      } else {
        field.el.classList.remove("is-valid");
        field.el.classList.add("is-invalid");
        if (field.err) field.err.classList.add("visible");
      }
      return isValid;
    }

    // Attach live validation events (input & blur)
    Object.keys(fields).forEach(function (key) {
      const field = fields[key];
      if (field && field.el) {
        field.el.addEventListener("input", function () {
          if (field.el.classList.contains("is-invalid")) {
            validateField(key);
          }
        });
        field.el.addEventListener("blur", function () {
          validateField(key);
        });
      }
    });

    // Form Submission
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();

      let isAllValid = true;
      let firstInvalidEl = null;

      Object.keys(fields).forEach(function (key) {
        const valid = validateField(key);
        if (!valid) {
          isAllValid = false;
          if (!firstInvalidEl) firstInvalidEl = fields[key].el;
        }
      });

      if (!isAllValid) {
        if (firstInvalidEl) firstInvalidEl.focus();
        announceStatus("Please complete all required fields with valid details.");
        return;
      }

      // Collect values
      const orderSummary = calculateOrderSummary();
      const customerName = fields.name.el.value.trim();
      const customerAddress = fields.address.el.value.trim() + ", " + fields.city.el.value.trim();
      const selectedPaymentEl = document.querySelector('input[name="nnPaymentMethod"]:checked');
      const paymentMethod = selectedPaymentEl ? selectedPaymentEl.value : "Cash on Delivery";
      const orderCode = "NN-" + Math.floor(100000 + Math.random() * 900000);

      // Populate Confirmation View
      document.getElementById("nn-confirm-order-id").textContent = orderCode;
      document.getElementById("nn-confirm-customer").textContent = customerName;
      document.getElementById("nn-confirm-address").textContent = customerAddress;
      document.getElementById("nn-confirm-payment").textContent = paymentMethod;
      document.getElementById("nn-confirm-total").textContent = formatPKR(orderSummary.grandTotal);

      // Switch View
      formContainer.classList.add("d-none");
      successContainer.classList.remove("d-none");

      // Clear the Cart permanently from localStorage & state
      saveCartData([]);
      state.appliedPromo = null;
      renderShoppingBag();

      announceStatus("Order placed successfully. Order reference: " + orderCode);
      if (global.NNStore && global.NNStore.showToast) {
        global.NNStore.showToast("Order " + orderCode + " confirmed! Thank you for choosing Notes & Noir.");
      }

      // Reset form
      formEl.reset();
      Object.keys(fields).forEach(function (key) {
        if (fields[key].el) {
          fields[key].el.classList.remove("is-valid", "is-invalid");
        }
        if (fields[key].err) {
          fields[key].err.classList.remove("visible");
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Initialization
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initializeCartData();
    renderShoppingBag();
    setupCheckoutModal();

    // Clear cart button in order summary
    const clearBagBtn = document.getElementById("nn-clear-bag-btn");
    if (clearBagBtn) {
      clearBagBtn.addEventListener("click", function () {
        if (window.confirm("Are you sure you want to clear all items from your shopping bag?")) {
          clearAllCart();
        }
      });
    }

    // Promo code button
    const promoApplyBtn = document.getElementById("nn-promo-apply-btn");
    if (promoApplyBtn) {
      promoApplyBtn.addEventListener("click", applyPromoCode);
    }

    const promoInputEl = document.getElementById("nn-promo-input");
    if (promoInputEl) {
      promoInputEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          applyPromoCode();
        }
      });
    }

    // Listen to external cart update events (e.g. from shared drawers)
    global.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEYS.CART) {
        initializeCartData();
        renderShoppingBag();
      }
    });
  });

  // Export for testing or global inspection
  global.NNShoppingBag = {
    getState: function () { return state; },
    calculateSummary: calculateOrderSummary,
    updateItemQuantity: updateItemQuantity,
    removeCartItem: removeCartItem,
    clearAllCart: clearAllCart
  };
})(window);
