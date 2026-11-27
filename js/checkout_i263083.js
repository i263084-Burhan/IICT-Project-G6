/**
 * Notes & Noir Fragrances — Checkout Controller (i263083)
 * Pure Vanilla JavaScript (ES6+) managing:
 * 1. Dynamic Catalog & Live Header Search Overlay
 * 2. Live Form Validation & Edge-Case Handling
 * 3. localStorage Persistence (Cart, Wishlist, Form Draft, Completed Orders)
 * 4. Interactive Payment Accordion, Modals & Accessible Keyboard Support
 * 5. Real-Time Pricing Calculations & Conditional Free Shipping
 */

'use strict';

/* ==========================================================================
   1. Configuration & Catalog Data
   ========================================================================== */

const STORAGE_KEYS = {
  CART: 'notesAndNoir_cart',
  WISHLIST: 'notesAndNoir_wishlist',
  DRAFT: 'notesAndNoir_checkout_draft',
  ORDERS: 'notesAndNoir_orders'
};

const FREE_SHIPPING_THRESHOLD = 75;
const STANDARD_SHIPPING_FEE = 10;

/**
 * Fallback inline SVG placeholder data URI used automatically if an image
 * fails to load, ensuring broken-image icons never appear in the UI.
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

const FRAGRANCE_CATALOG = [
  {
    id: 'noir-essence',
    name: 'Noir Essence',
    size: '100 ml',
    price: 95,
    notes: 'Jasmine, Smoked Amber, Cedarwood',
    image: '../images/hero-bestsellers-noir.jpg'
  },
  {
    id: 'royal-essence',
    name: 'Royal Essence',
    size: '100 ml',
    price: 88,
    notes: 'Lavender, Bergamot, Royal Iris',
    image: '../images/bestsellers/royal-essence.jpg'
  },
  {
    id: 'midnight-oud',
    name: 'Midnight Oud',
    size: '100 ml',
    price: 115,
    notes: 'Black Oud, Saffron, Smoked Leather',
    image: '../images/bestsellers/midnight-oud.svg'
  },
  {
    id: 'amber-touch',
    name: 'Amber Touch',
    size: '50 ml',
    price: 65,
    notes: 'Warm Amber, Madagascar Vanilla, Tonka',
    image: '../images/bestsellers/amber-touch.jpg'
  },
  {
    id: 'velvet-musk',
    name: 'Velvet Musk',
    size: '100 ml',
    price: 72,
    notes: 'White Musk, Sandalwood, Cashmere',
    image: '../images/bestsellers/velvet-musk.jpg'
  },
  {
    id: 'blush-bloom',
    name: 'Blush Bloom',
    size: '50 ml',
    price: 58,
    notes: 'Damask Rose, Peony, Pink Pepper',
    image: '../images/bestsellers/blush-bloom.jpg'
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    size: '100 ml',
    price: 68,
    notes: 'Sea Salt, Neroli, White Driftwood',
    image: '../images/bestsellers/ocean-breeze.jpg'
  }
];

const DEFAULT_CART_ITEM = {
  id: 'noir-essence',
  name: 'Noir Essence',
  size: '100 ml',
  price: 95,
  quantity: 1,
  image: '../images/hero-bestsellers-noir.jpg'
};

/* ==========================================================================
   2. Application State
   ========================================================================== */

const state = {
  cart: [],
  wishlist: [],
  pendingRemoveId: null,
  lastFocusedElement: null
};

/* ==========================================================================
   3. Utility & Formatting Helpers
   ========================================================================== */

function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function readJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode restriction errors gracefully
  }
}

function announceStatus(message) {
  const liveRegion = document.getElementById('checkout-status-live');
  if (liveRegion) {
    liveRegion.textContent = '';
    window.setTimeout(() => {
      liveRegion.textContent = message;
    }, 30);
  }
}

function attachImageFallback(imgElement) {
  imgElement.addEventListener('error', () => {
    if (imgElement.src !== FALLBACK_BOTTLE_SVG) {
      imgElement.src = FALLBACK_BOTTLE_SVG;
    }
  });
}

function generateOrderId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `#NN-2026-${randomDigits}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/* ==========================================================================
   4. State Initialization & Persistence
   ========================================================================== */

function initializeState() {
  const storedCart = readJsonStorage(STORAGE_KEYS.CART, null);

  if (storedCart === null) {
    // First visit: seed Noir Essence so checkout previews with the prototype item
    state.cart = [{ ...DEFAULT_CART_ITEM }];
    writeJsonStorage(STORAGE_KEYS.CART, state.cart);
  } else if (Array.isArray(storedCart)) {
    state.cart = storedCart
      .filter((item) => item && typeof item.id === 'string' && Number(item.quantity) > 0)
      .map((item) => {
        const catalogItem = FRAGRANCE_CATALOG.find((p) => p.id === item.id);
        return catalogItem
          ? { ...item, price: catalogItem.price, name: catalogItem.name, size: catalogItem.size }
          : item;
      });
    saveCart();
  } else {
    state.cart = [];
  }

  const storedWishlist = readJsonStorage(STORAGE_KEYS.WISHLIST, []);
  state.wishlist = Array.isArray(storedWishlist) ? storedWishlist : [];
}

function saveCart() {
  writeJsonStorage(STORAGE_KEYS.CART, state.cart);
}

function saveWishlist() {
  writeJsonStorage(STORAGE_KEYS.WISHLIST, state.wishlist);
}

function saveFormDraft() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const selectedMethod =
    form.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';

  const draft = {
    fullName: document.getElementById('fullName')?.value || '',
    email: document.getElementById('email')?.value || '',
    address: document.getElementById('address')?.value || '',
    city: document.getElementById('city')?.value || '',
    postalCode: document.getElementById('postalCode')?.value || '',
    paymentMethod: selectedMethod
  };

  // Security best practice: never persist card number, expiry, or CVV in localStorage
  writeJsonStorage(STORAGE_KEYS.DRAFT, draft);
}

function restoreFormDraft() {
  const draft = readJsonStorage(STORAGE_KEYS.DRAFT, null);
  if (!draft || typeof draft !== 'object') return;

  const fieldIds = ['fullName', 'email', 'address', 'city', 'postalCode'];
  fieldIds.forEach((id) => {
    const input = document.getElementById(id);
    if (input && typeof draft[id] === 'string') {
      input.value = draft[id];
    }
  });

  if (draft.paymentMethod) {
    const radio = document.querySelector(
      `input[name="paymentMethod"][value="${draft.paymentMethod}"]`
    );
    if (radio) {
      radio.checked = true;
      updatePaymentDrawer(draft.paymentMethod);
    }
  }
}

/* ==========================================================================
   5. Pricing Calculation & Order Summary Rendering
   ========================================================================== */

function calculateTotals() {
  const subtotal = state.cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const totalCount = state.cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  const shipping =
    state.cart.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;

  return { subtotal, shipping, total, totalCount };
}

function updateHeaderCounters() {
  const { totalCount } = calculateTotals();
  const cartCounter = document.getElementById('header-cart-count');
  const wishlistCounter = document.getElementById('header-wishlist-count');

  if (cartCounter) cartCounter.textContent = String(totalCount);
  if (wishlistCounter) wishlistCounter.textContent = String(state.wishlist.length);
}

function renderOrderSummary() {
  const container = document.getElementById('order-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const shippingHintEl = document.getElementById('shipping-hint');
  const totalEl = document.getElementById('summary-total');
  const placeOrderBtn = document.getElementById('place-order-btn');

  if (!container) return;

  container.innerHTML = '';

  if (state.cart.length === 0) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'cart-empty';
    emptyBox.innerHTML = `
      <p class="cart-empty__title">Your cart is empty</p>
      <p class="cart-empty__text">Explore our signature Eau de Parfum collection to begin your order.</p>
      <button type="button" class="btn-secondary" id="empty-browse-btn">Browse Fragrances</button>
    `;
    container.appendChild(emptyBox);

    const browseBtn = document.getElementById('empty-browse-btn');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => openSearchOverlay());
    }
  } else {
    state.cart.forEach((item) => {
      const lineTotal = Number(item.price) * Number(item.quantity);
      const itemEl = document.createElement('article');
      itemEl.className = 'order-item';
      itemEl.setAttribute('data-item-id', item.id);

      const isConfirming = state.pendingRemoveId === item.id;

      itemEl.innerHTML = `
        <div class="order-item__thumb">
          <img
            src="${escapeHtml(item.image || FALLBACK_BOTTLE_SVG)}"
            alt="${escapeHtml(item.name)} fragrance bottle"
            class="order-item__img"
          >
        </div>
        <div class="order-item__details">
          <div class="order-item__top">
            <h3 class="order-item__name">${escapeHtml(item.name)}</h3>
            <span class="order-item__price">${formatCurrency(lineTotal)}</span>
          </div>
          <p class="order-item__size">${escapeHtml(item.size || '100 ml')}</p>
          <div class="order-item__controls">
            <div class="qty-stepper" role="group" aria-label="Quantity for ${escapeHtml(item.name)}">
              <button
                type="button"
                class="qty-stepper__btn"
                data-action="decrease"
                data-id="${escapeHtml(item.id)}"
                aria-label="Decrease quantity of ${escapeHtml(item.name)}"
              >&minus;</button>
              <span class="qty-stepper__value" aria-live="polite">${item.quantity}</span>
              <button
                type="button"
                class="qty-stepper__btn"
                data-action="increase"
                data-id="${escapeHtml(item.id)}"
                aria-label="Increase quantity of ${escapeHtml(item.name)}"
              >+</button>
            </div>
            ${
              isConfirming
                ? `<div class="remove-confirm" role="alert">
                    <span>Remove item?</span>
                    <button type="button" class="remove-confirm__btn remove-confirm__btn--danger" data-action="confirm-remove" data-id="${escapeHtml(item.id)}">Remove</button>
                    <button type="button" class="remove-confirm__btn" data-action="cancel-remove" data-id="${escapeHtml(item.id)}">Keep</button>
                  </div>`
                : ''
            }
          </div>
        </div>
      `;

      const img = itemEl.querySelector('.order-item__img');
      if (img) attachImageFallback(img);

      container.appendChild(itemEl);
    });
  }

  const { subtotal, shipping, total } = calculateTotals();

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (shippingEl) shippingEl.textContent = formatCurrency(shipping);
  if (totalEl) totalEl.textContent = formatCurrency(total);

  if (shippingHintEl) {
    if (state.cart.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD) {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      shippingHintEl.textContent = `Add ${formatCurrency(remaining)} more to unlock free shipping.`;
    } else {
      shippingHintEl.textContent = '';
    }
  }

  if (placeOrderBtn) {
    placeOrderBtn.disabled = state.cart.length === 0;
  }

  updateHeaderCounters();
}

function handleCartAction(action, itemId) {
  const index = state.cart.findIndex((item) => item.id === itemId);
  if (index === -1) return;

  const item = state.cart[index];

  if (action === 'increase') {
    state.pendingRemoveId = null;
    item.quantity += 1;
    saveCart();
    renderOrderSummary();
    announceStatus(`Updated ${item.name} quantity to ${item.quantity}.`);
  } else if (action === 'decrease') {
    if (item.quantity > 1) {
      state.pendingRemoveId = null;
      item.quantity -= 1;
      saveCart();
      renderOrderSummary();
      announceStatus(`Updated ${item.name} quantity to ${item.quantity}.`);
    } else {
      // Edge case: ask confirmation before removing the last unit
      state.pendingRemoveId = item.id;
      renderOrderSummary();
      announceStatus(`Confirm removing ${item.name} from your order.`);
    }
  } else if (action === 'confirm-remove') {
    state.cart.splice(index, 1);
    state.pendingRemoveId = null;
    saveCart();
    renderOrderSummary();
    announceStatus(`${item.name} removed from your cart.`);
  } else if (action === 'cancel-remove') {
    state.pendingRemoveId = null;
    renderOrderSummary();
    announceStatus(`Kept ${item.name} in your cart.`);
  }
}

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

  state.pendingRemoveId = null;
  saveCart();
  renderOrderSummary();
  announceStatus(`Added ${product.name} to your cart.`);
}

/* ==========================================================================
   6. Payment Method Accordion & Input Formatting
   ========================================================================== */

function updatePaymentDrawer(selectedMethod) {
  const options = document.querySelectorAll('.payment-option');
  const cardFields = ['cardNumber', 'cardExpiry', 'cardCvv'];

  options.forEach((optionEl) => {
    const method = optionEl.getAttribute('data-payment-option');
    const isSelected = method === selectedMethod;
    const radio = optionEl.querySelector('.payment-radio');
    const drawer = optionEl.querySelector('.payment-drawer');

    optionEl.classList.toggle('is-selected', isSelected);

    if (radio) {
      radio.setAttribute('aria-expanded', isSelected ? 'true' : 'false');
    }

    if (drawer) {
      if (isSelected) {
        drawer.hidden = false;
        // Allow browser paint before adding .is-open for smooth CSS transition
        window.requestAnimationFrame(() => drawer.classList.add('is-open'));
      } else {
        drawer.classList.remove('is-open');
        drawer.hidden = true;
      }
    }
  });

  // Enable card fields only when Credit / Debit Card is active
  const isCardActive = selectedMethod === 'card';
  cardFields.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.disabled = !isCardActive;
    if (!isCardActive) {
      clearFieldError(input);
    }
  });
}

function formatCardNumberValue(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiryValue(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/* ==========================================================================
   7. Live Form Validation & Submission
   ========================================================================== */

const validators = {
  fullName(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your full name.';
    const letterCount = (trimmed.match(/[A-Za-z]/g) || []).length;
    if (letterCount < 3 || !/^[A-Za-z\s'.-]+$/.test(trimmed)) {
      return 'Full name must contain at least 3 alphabetic characters.';
    }
    return '';
  },

  email(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return 'Enter a valid email address (e.g. you@example.com).';
    }
    return '';
  },

  address(value) {
    if (!value.trim()) return 'Please enter your street address.';
    return '';
  },

  city(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your city.';
    if (!/^[A-Za-z\s'.-]{2,}$/.test(trimmed)) {
      return 'Please enter a valid city name.';
    }
    return '';
  },

  postalCode(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Postal code is required.';
    if (!/^\d{5}$/.test(trimmed)) {
      return 'Postal code must be exactly 5 numeric digits (e.g. 12345).';
    }
    return '';
  },

  cardNumber(value) {
    const digits = value.replace(/\s+/g, '');
    if (!digits) return 'Please enter your card number.';
    const isAmex = /^3[47]/.test(digits);
    const requiredLength = isAmex ? 15 : 16;
    if (!/^\d+$/.test(digits) || digits.length !== requiredLength) {
      return isAmex
        ? 'AMEX card number must be 15 digits.'
        : 'Card number must be 16 digits.';
    }
    return '';
  },

  cardExpiry(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Enter expiry date (MM/YY).';
    const match = trimmed.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return 'Use MM/YY format.';

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return 'Month must be between 01 and 12.';

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'Card expiry date cannot be in the past.';
    }
    return '';
  },

  cardCvv(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'CVV is required.';
    if (!/^\d{3,4}$/.test(trimmed)) {
      return 'CVV must be 3 or 4 digits.';
    }
    return '';
  }
};

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

function clearFieldError(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  input.classList.remove('is-invalid', 'is-valid');
  input.removeAttribute('aria-invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  }
}

function validateSingleField(input) {
  const validator = validators[input.id];
  if (!validator || input.disabled) return true;
  const errorMessage = validator(input.value);
  setFieldError(input, errorMessage);
  return errorMessage === '';
}

function validateCheckoutForm() {
  const form = document.getElementById('checkout-form');
  const selectedMethod =
    form.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';

  const fieldsToValidate = ['fullName', 'email', 'address', 'city', 'postalCode'];
  if (selectedMethod === 'card') {
    fieldsToValidate.push('cardNumber', 'cardExpiry', 'cardCvv');
  }

  let firstInvalidInput = null;
  let allValid = true;

  fieldsToValidate.forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (!input) return;
    const isValid = validateSingleField(input);
    if (!isValid) {
      allValid = false;
      if (!firstInvalidInput) firstInvalidInput = input;
    }
  });

  if (firstInvalidInput) {
    firstInvalidInput.focus();
  }

  return allValid;
}

function handleFormSubmit(event) {
  event.preventDefault();

  if (state.cart.length === 0) {
    announceStatus('Your cart is empty. Please add a fragrance before placing an order.');
    const browseBtn = document.getElementById('empty-browse-btn');
    if (browseBtn) browseBtn.focus();
    return;
  }

  const isValid = validateCheckoutForm();
  if (!isValid) {
    announceStatus('Please fix the highlighted fields before placing your order.');
    return;
  }

  const form = event.currentTarget;
  const paymentMethod =
    form.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';

  const { subtotal, shipping, total } = calculateTotals();
  const cardDigits = (document.getElementById('cardNumber')?.value || '').replace(/\s+/g, '');

  const orderRecord = {
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
    customer: {
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      postalCode: document.getElementById('postalCode').value.trim()
    },
    paymentMethod,
    paymentLabel:
      paymentMethod === 'card'
        ? `Credit / Debit Card (ending in ${cardDigits.slice(-4) || '****'})`
        : paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : 'Bank Transfer (Chase USD)',
    items: state.cart.map((item) => ({ ...item })),
    subtotal,
    shipping,
    total
  };

  // Persist completed order in localStorage
  const existingOrders = readJsonStorage(STORAGE_KEYS.ORDERS, []);
  const updatedOrders = Array.isArray(existingOrders)
    ? [orderRecord, ...existingOrders]
    : [orderRecord];
  writeJsonStorage(STORAGE_KEYS.ORDERS, updatedOrders);

  showOrderConfirmationModal(orderRecord);
  announceStatus(`Order ${orderRecord.orderId} confirmed.`);
}

/* ==========================================================================
   8. Modals, Search Overlay & Navigation Interactions
   ========================================================================== */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  state.lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const focusTarget = modal.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
  if (focusTarget) {
    window.setTimeout(() => focusTarget.focus(), 20);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.style.overflow = '';

  if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
    state.lastFocusedElement.focus();
  }
}

function showOrderConfirmationModal(order) {
  const body = document.getElementById('confirmation-modal-body');
  if (!body) return;

  const itemsHtml = order.items
    .map(
      (item) => `
      <li>
        <span>${escapeHtml(item.name)} (${escapeHtml(item.size)}) &times; ${item.quantity}</span>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      </li>`
    )
    .join('');

  body.innerHTML = `
    <div class="receipt-box">
      <div class="receipt-id">
        <span>Order ID</span>
        <span class="receipt-id__code">${escapeHtml(order.orderId)}</span>
      </div>
      <ul class="receipt-items">${itemsHtml}</ul>
      <div class="receipt-meta">
        <div>Subtotal: <strong>${formatCurrency(order.subtotal)}</strong></div>
        <div>Shipping: <strong>${formatCurrency(order.shipping)}</strong></div>
        <div>Total Paid / Due: <strong>${formatCurrency(order.total)}</strong></div>
      </div>
      <div class="receipt-meta">
        <strong>Shipping To:</strong><br>
        ${escapeHtml(order.customer.fullName)}<br>
        ${escapeHtml(order.customer.address)}, ${escapeHtml(order.customer.city)} ${escapeHtml(order.customer.postalCode)}<br>
        <span>${escapeHtml(order.customer.email)}</span><br>
        <span>Payment: ${escapeHtml(order.paymentLabel)}</span>
      </div>
    </div>
  `;

  openModal('order-confirmation-modal');
}

function resetCheckoutAfterOrder() {
  state.cart = [];
  state.pendingRemoveId = null;
  saveCart();
  localStorage.removeItem(STORAGE_KEYS.DRAFT);

  const form = document.getElementById('checkout-form');
  if (form) {
    form.reset();
    form.querySelectorAll('.form-input').forEach((input) => clearFieldError(input));
    const defaultRadio = document.getElementById('payment-card');
    if (defaultRadio) {
      defaultRadio.checked = true;
      updatePaymentDrawer('card');
    }
  }

  renderOrderSummary();
  closeModal('order-confirmation-modal');
  announceStatus('Order completed and checkout has been reset.');
}

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

  if (state.lastFocusedElement && typeof state.lastFocusedElement.focus === 'function') {
    state.lastFocusedElement.focus();
  }
}

function renderSearchResults(query) {
  const resultsEl = document.getElementById('search-results');
  if (!resultsEl) return;

  const q = query.trim().toLowerCase();
  const filtered = FRAGRANCE_CATALOG.filter((item) => {
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q) ||
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
      <p class="payment-note">No completed orders found on this browser yet. Once you place an order, its receipt and Order ID will appear here.</p>
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
          ${escapeHtml(order.customer.fullName)} &middot; ${escapeHtml(order.customer.city)}<br>
          ${escapeHtml(order.paymentLabel)} &middot; ${new Date(order.createdAt).toLocaleDateString()}
        </div>
      </div>
    `
    )
    .join('');
}

/* ==========================================================================
   9. Event Binding & Bootstrapping
   ========================================================================== */

function bindEvents() {
  // Hero fallback handler
  const heroImg = document.getElementById('hero-banner-img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
    });
  }

  // Order Summary quantity stepper & remove confirmation delegation
  const orderItemsEl = document.getElementById('order-items');
  if (orderItemsEl) {
    orderItemsEl.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-action][data-id]');
      if (!btn) return;
      handleCartAction(btn.getAttribute('data-action'), btn.getAttribute('data-id'));
    });
  }

  // Payment method radio switching
  document.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener('change', (event) => {
      updatePaymentDrawer(event.target.value);
      saveFormDraft();
    });
  });

  // Card input auto-formatting (XXXX XXXX XXXX XXXX & MM/YY)
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (event) => {
      const formatted = formatCardNumberValue(event.target.value);
      event.target.value = formatted;
      if (event.target.classList.contains('is-invalid')) {
        validateSingleField(event.target);
      }
    });
  }

  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (event) => {
      event.target.value = formatExpiryValue(event.target.value);
      if (event.target.classList.contains('is-invalid')) {
        validateSingleField(event.target);
      }
    });
  }

  const postalInput = document.getElementById('postalCode');
  if (postalInput) {
    postalInput.addEventListener('input', (event) => {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 5);
    });
  }

  const cvvInput = document.getElementById('cardCvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', (event) => {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  // Live validation on input/blur + auto-saving draft
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.querySelectorAll('.form-input').forEach((input) => {
      input.addEventListener('blur', () => {
        if (input.value.trim() !== '' || input.classList.contains('is-invalid')) {
          validateSingleField(input);
        }
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) {
          validateSingleField(input);
        }
        saveFormDraft();
      });
    });

    checkoutForm.addEventListener('submit', handleFormSubmit);
  }

  // Copy Bank IBAN helper
  const copyIbanBtn = document.getElementById('copy-iban-btn');
  if (copyIbanBtn) {
    copyIbanBtn.addEventListener('click', async () => {
      const iban = document.getElementById('bank-iban-text')?.textContent?.trim() || '';
      try {
        await navigator.clipboard.writeText(iban);
        copyIbanBtn.textContent = 'Copied';
        window.setTimeout(() => {
          copyIbanBtn.textContent = 'Copy';
        }, 1800);
      } catch {
        copyIbanBtn.textContent = iban;
      }
    });
  }

  // Mobile hamburger menu
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('primary-nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Shop dropdown toggle
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
      if (!shopMenu.hidden && !event.target.closest('.nav-links__item--dropdown')) {
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

  // Search overlay
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchInput = document.getElementById('catalog-search-input');
  const searchResults = document.getElementById('search-results');

  if (openSearchBtn) openSearchBtn.addEventListener('click', openSearchOverlay);
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchOverlay);
  document.querySelectorAll('[data-close-overlay="search-overlay"]').forEach((el) => {
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

  // Wishlist modal
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
      const addId = event.target.closest('[data-wish-add]')?.getAttribute('data-wish-add');
      if (addId) {
        addFragranceToCart(addId);
        closeModal('wishlist-modal');
        return;
      }
      const removeId = event.target.closest('[data-wish-remove]')?.getAttribute('data-wish-remove');
      if (removeId) {
        toggleWishlistItem(removeId);
        renderWishlistModal();
      }
    });
  }

  // Account & Track Order modals
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

  // Generic modal close triggers
  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', () => {
      closeModal(el.getAttribute('data-close-modal'));
    });
  });

  // Confirmation modal Continue Shopping reset
  const continueBtn = document.getElementById('continue-shopping-btn');
  if (continueBtn) {
    continueBtn.addEventListener('click', resetCheckoutAfterOrder);
  }

  // Escape key closes open overlays, dropdowns, mobile menu, and modals
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    closeSearchOverlay();
    closeModal('order-confirmation-modal');
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

document.addEventListener('DOMContentLoaded', () => {
  initializeState();
  restoreFormDraft();
  renderOrderSummary();
  bindEvents();
});
