/* ==========================================================================
   Notes & Noir — Unisex Perfumes Webpage Functionality (i263086)
   Handles: Add to Cart & cart count, Perfume search, Email validation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const cartCountEl = document.getElementById("cartCount");
  const cartBtn = document.getElementById("cartBtn");
  const profileBtn = document.getElementById("profileBtn");
  const productCards = Array.from(document.querySelectorAll(".product-card"));

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchStatus = document.getElementById("searchStatus");
  const searchEmpty = document.getElementById("searchEmpty");
  const resetSearchBtn = document.getElementById("resetSearchBtn");

  const subscribeForm = document.getElementById("subscribeForm");
  const subscribeEmail = document.getElementById("subscribeEmail");
  const subscribeMessage = document.getElementById("subscribeMessage");

  const cartModal = document.getElementById("cartModal");
  const cartBackdrop = document.getElementById("cartBackdrop");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotalAmount = document.getElementById("cartTotalAmount");
  const toastBanner = document.getElementById("toastBanner");

  const cart = [];
  let toastTimer = null;

  /* ------------------------------------------------------------------------
     Utility: Format PKR Currency & Show Luxury Toast
     ------------------------------------------------------------------------ */
  function formatPrice(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-US");
  }

  function showToast(message) {
    if (!toastBanner) return;
    toastBanner.textContent = message;
    toastBanner.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastBanner.classList.remove("visible");
    }, 2600);
  }

  /* ------------------------------------------------------------------------
     1. Add to Cart & Cart Count
     ------------------------------------------------------------------------ */
  function updateCartUI() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartCountEl) {
      cartCountEl.textContent = String(totalQty);
    }

    if (cartTotalAmount) {
      cartTotalAmount.textContent = formatPrice(totalPrice);
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty-text">Your bag is currently empty.</p>';
      return;
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item-row">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-meta">${item.type} &bull; ${formatPrice(item.price)} &times; ${item.qty}</div>
            </div>
            <button type="button" class="cart-remove-btn" data-remove-index="${index}">Remove</button>
          </div>
        `
      )
      .join("");
  }

  function addToCart(name, type, price, buttonEl) {
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, type, price: Number(price), qty: 1 });
    }

    updateCartUI();
    showToast(`${name} added to your scent bag.`);

    if (buttonEl) {
      buttonEl.textContent = "Added \u2713";
      buttonEl.classList.add("added");
      setTimeout(() => {
        buttonEl.textContent = "Add to Cart";
        buttonEl.classList.remove("added");
      }, 1200);
    }
  }

  productCards.forEach((card) => {
    const addBtn = card.querySelector(".card-btn");
    if (!addBtn) return;

    addBtn.addEventListener("click", () => {
      const name = card.dataset.name || "Perfume";
      const type = card.dataset.type || "Unisex";
      const price = card.dataset.price || 0;
      addToCart(name, type, price, addBtn);
    });
  });

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target.closest("[data-remove-index]");
      if (!target) return;
      const index = Number(target.dataset.removeIndex);
      if (!Number.isNaN(index)) {
        const removed = cart.splice(index, 1)[0];
        updateCartUI();
        if (removed) {
          showToast(`${removed.name} removed from bag.`);
        }
      }
    });
  }

  function openCartModal() {
    if (!cartModal) return;
    cartModal.hidden = false;
  }

  function closeCartModal() {
    if (!cartModal) return;
    cartModal.hidden = true;
  }

  if (cartBtn) cartBtn.addEventListener("click", openCartModal);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartModal);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCartModal);

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart.length = 0;
      updateCartUI();
      showToast("Your scent bag has been cleared.");
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      showToast("Notes & Noir Atelier Member access coming soon.");
    });
  }

  document.querySelectorAll("[data-support]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(`${link.dataset.support} details available via Notes & Noir concierge.`);
    });
  });

  /* ------------------------------------------------------------------------
     2. Perfume Search
     ------------------------------------------------------------------------ */
  function filterPerfumes(queryText) {
    const query = queryText.trim().toLowerCase();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const name = (card.dataset.name || "").toLowerCase();
      const type = (card.dataset.type || "").toLowerCase();
      const priceText = (card.querySelector(".product-price")?.textContent || "").toLowerCase();
      const matches = !query || name.includes(query) || type.includes(query) || priceText.includes(query);

      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (searchStatus) {
      if (!query) {
        searchStatus.textContent = "";
      } else {
        searchStatus.textContent = `Showing ${visibleCount} result${visibleCount === 1 ? "" : "s"} for "${queryText.trim()}"`;
      }
    }

    if (searchEmpty) {
      searchEmpty.hidden = visibleCount > 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterPerfumes(searchInput.value);
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      filterPerfumes(searchInput ? searchInput.value : "");
      const collectionSection = document.getElementById("collection");
      if (collectionSection) {
        collectionSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      filterPerfumes("");
    });
  }

  /* ------------------------------------------------------------------------
     3. Email Subscription Validation
     ------------------------------------------------------------------------ */
  if (subscribeForm && subscribeEmail && subscribeMessage) {
    subscribeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = subscribeEmail.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      subscribeMessage.classList.remove("error", "success");

      if (!email) {
        subscribeMessage.textContent = "Please enter your email address.";
        subscribeMessage.classList.add("error");
        subscribeEmail.focus();
        return;
      }

      if (!emailPattern.test(email)) {
        subscribeMessage.textContent = "Please enter a valid email address (e.g., name@example.com).";
        subscribeMessage.classList.add("error");
        subscribeEmail.focus();
        return;
      }

      subscribeMessage.textContent = "Thank you for subscribing to Notes & Noir.";
      subscribeMessage.classList.add("success");
      subscribeForm.reset();
    });
  }

  updateCartUI();
});
