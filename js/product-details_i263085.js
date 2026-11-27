/**
 * Notes & Noir Fragrances — Product Details Controller (product-details_i263085.js)
 * Roll Number: i263085
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const products = window.NN_PRODUCTS || [];
    const store = window.NNStore;
    if (!store) return;

    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get("id");
    const product = requestedId
      ? products.find(function (p) {
          return p.id === requestedId;
        })
      : products[0];

    const wrapperEl = document.getElementById("nn-product-wrapper");
    const tabsSectionEl = document.getElementById("nn-tabs-section");
    const notFoundEl = document.getElementById("nn-not-found");

    if (!product) {
      if (wrapperEl) wrapperEl.classList.add("d-none");
      if (tabsSectionEl) tabsSectionEl.classList.add("d-none");
      if (notFoundEl) {
        notFoundEl.classList.remove("d-none");
        const msgEl = document.getElementById("nn-not-found-msg");
        if (msgEl && requestedId) {
          msgEl.textContent =
            'We could not find a fragrance matching "' +
            requestedId +
            '". Explore our signature collection below.';
        }
      }
      renderRelatedProducts("noir-oud");
      return;
    }

    // Page state
    const state = {
      selectedVariantIndex: 0,
      quantity: 1,
      activeImageIndex: 0,
      selectedRating: 5
    };

    const maxStock = product.stockLimit || 10;

    // Elements
    const titleEl = document.getElementById("nn-product-title");
    const breadcrumbEl = document.getElementById("nn-breadcrumb-title");
    const familyEl = document.getElementById("nn-product-family");
    const priceEl = document.getElementById("nn-product-price");
    const lineTotalEl = document.getElementById("nn-line-total");
    const shortDescEl = document.getElementById("nn-product-short-desc");
    const mainImgEl = document.getElementById("nn-main-image");
    const thumbsEl = document.getElementById("nn-gallery-thumbs");
    const sizeGroupEl = document.getElementById("nn-size-group");
    const qtyValueEl = document.getElementById("nn-qty-value");
    const qtyDecBtn = document.getElementById("nn-qty-dec");
    const qtyIncBtn = document.getElementById("nn-qty-inc");
    const qtyNoticeEl = document.getElementById("nn-qty-notice");
    const addToCartBtn = document.getElementById("nn-add-to-cart-btn");
    const wishlistBtn = document.getElementById("nn-wishlist-btn");
    const wishlistLabelEl = document.getElementById("nn-wishlist-btn-label");
    const shippingBannerEl = document.getElementById("nn-product-shipping-banner");

    // Populate static product metadata
    document.title = product.title + " — Notes & Noir Fragrances";
    titleEl.textContent = product.title;
    breadcrumbEl.textContent = product.title;
    familyEl.textContent = product.familyTags;
    shortDescEl.textContent = product.shortDescription;

    document.getElementById("nn-editorial-desc").textContent =
      product.editorialDescription;
    document.getElementById("nn-editorial-tagline").innerHTML =
      "&mdash;&mdash;&mdash; " +
      store.escapeHTML(product.editorialTagline) +
      " &mdash;&mdash;&mdash;";
    document.getElementById("nn-spec-conc").textContent = product.concentration;
    document.getElementById("nn-spec-long").textContent = product.longevity;
    document.getElementById("nn-spec-sill").textContent = product.sillage;
    document.getElementById("nn-stock-hint").textContent =
      "In stock (limit " + maxStock + " per order)";

    /* ----------------------------------------------------------------------
       1. Image Gallery
       ---------------------------------------------------------------------- */
    function renderGallery() {
      const activeImg = product.gallery[state.activeImageIndex] || product.gallery[0];
      mainImgEl.src = store.resolveAssetPath(activeImg.src);
      mainImgEl.alt = activeImg.alt;

      thumbsEl.innerHTML = product.gallery
        .map(function (img, index) {
          const isActive = index === state.activeImageIndex;
          return (
            '<button type="button" class="nn-thumb-btn ' +
            (isActive ? "active" : "") +
            '" data-index="' +
            index +
            '" aria-label="View ' +
            store.escapeHTML(img.label) +
            '" aria-pressed="' +
            (isActive ? "true" : "false") +
            '">' +
            '<img src="' +
            store.escapeHTML(store.resolveAssetPath(img.src)) +
            '" alt="' +
            store.escapeHTML(img.label) +
            '">' +
            "</button>"
          );
        })
        .join("");

      thumbsEl.querySelectorAll(".nn-thumb-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          selectGalleryImage(Number(btn.dataset.index));
        });
        btn.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectGalleryImage(Number(btn.dataset.index));
          }
        });
      });
    }

    function selectGalleryImage(index) {
      if (index < 0 || index >= product.gallery.length) return;
      state.activeImageIndex = index;
      const chosen = product.gallery[index];
      mainImgEl.style.opacity = "0.55";
      window.setTimeout(function () {
        mainImgEl.src = store.resolveAssetPath(chosen.src);
        mainImgEl.alt = chosen.alt;
        mainImgEl.style.opacity = "1";
      }, 100);

      thumbsEl.querySelectorAll(".nn-thumb-btn").forEach(function (btn, idx) {
        const active = idx === index;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    /* ----------------------------------------------------------------------
       2. Size Variants, Price & Quantity Calculations
       ---------------------------------------------------------------------- */
    function getSelectedVariant() {
      return product.variants[state.selectedVariantIndex] || product.variants[0];
    }

    function renderSizes() {
      sizeGroupEl.innerHTML = product.variants
        .map(function (variant, index) {
          const active = index === state.selectedVariantIndex;
          return (
            '<button type="button" class="nn-size-btn ' +
            (active ? "active" : "") +
            '" data-index="' +
            index +
            '" aria-pressed="' +
            (active ? "true" : "false") +
            '">' +
            store.escapeHTML(variant.size) +
            "</button>"
          );
        })
        .join("");

      sizeGroupEl.querySelectorAll(".nn-size-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          state.selectedVariantIndex = Number(btn.dataset.index);
          renderSizes();
          updatePriceAndShipping();
        });
      });
    }

    function updatePriceAndShipping() {
      const variant = getSelectedVariant();
      const unitPrice = variant.price;
      const itemTotal = unitPrice * state.quantity;
      const threshold =
        (window.NN_CONFIG && window.NN_CONFIG.FREE_SHIPPING_THRESHOLD) || 75;

      priceEl.textContent = store.formatPrice(unitPrice);
      if (state.quantity > 1) {
        lineTotalEl.textContent =
          "Subtotal for " +
          state.quantity +
          " × " +
          variant.size +
          ": " +
          store.formatPrice(itemTotal);
      } else {
        lineTotalEl.textContent = "Selected size: " + variant.size;
      }

      qtyValueEl.textContent = String(state.quantity);
      qtyDecBtn.disabled = state.quantity <= 1;
      qtyIncBtn.disabled = state.quantity >= maxStock;

      const currentSubtotal = store.getCartSubtotal();
      const projectedSubtotal = currentSubtotal + itemTotal;
      const remaining = Math.max(0, threshold - projectedSubtotal);

      if (remaining === 0) {
        shippingBannerEl.innerHTML =
          '<strong class="text-dark">Complimentary Shipping:</strong> This selection qualifies your bag for free nationwide delivery.';
      } else {
        shippingBannerEl.innerHTML =
          "Add this item to reach <strong>" +
          store.formatPrice(projectedSubtotal) +
          "</strong> toward free shipping (just <strong>" +
          store.formatPrice(remaining) +
          "</strong> away from " +
          store.formatPrice(threshold) +
          ").";
      }
    }

    qtyDecBtn.addEventListener("click", function () {
      if (state.quantity <= 1) {
        qtyNoticeEl.textContent = "Minimum order quantity is 1 bottle.";
        return;
      }
      state.quantity -= 1;
      qtyNoticeEl.textContent = "";
      updatePriceAndShipping();
    });

    qtyIncBtn.addEventListener("click", function () {
      if (state.quantity >= maxStock) {
        qtyNoticeEl.textContent =
          "Stock limit reached: maximum " + maxStock + " bottles per order.";
        return;
      }
      state.quantity += 1;
      qtyNoticeEl.textContent =
        state.quantity === maxStock
          ? "Maximum stock limit (" + maxStock + ") selected."
          : "";
      updatePriceAndShipping();
    });

    /* ----------------------------------------------------------------------
       3. Cart & Wishlist Actions
       ---------------------------------------------------------------------- */
    function syncWishlistButton() {
      const saved = store.isWishlisted(product.id);
      wishlistBtn.classList.toggle("saved", saved);
      wishlistBtn.setAttribute("aria-pressed", saved ? "true" : "false");
      wishlistLabelEl.textContent = saved ? "Saved" : "Save";
    }

    addToCartBtn.addEventListener("click", function () {
      const variant = getSelectedVariant();
      const res = store.addToCart({
        id: product.id,
        title: product.title,
        size: variant.size,
        unitPrice: variant.price,
        quantity: state.quantity,
        image: product.gallery[0].src
      });

      if (res.capped) {
        store.showToast(
          "Updated " +
            product.title +
            " (" +
            variant.size +
            ") to max stock limit of " +
            maxStock +
            "."
        );
      } else {
        store.showToast(
          "Added " +
            state.quantity +
            " × " +
            product.title +
            " (" +
            variant.size +
            ") to your bag."
        );
      }

      updatePriceAndShipping();

      const cartEl = document.getElementById("nn-cart-offcanvas");
      if (cartEl && window.bootstrap && window.bootstrap.Offcanvas) {
        window.bootstrap.Offcanvas.getOrCreateInstance(cartEl).show();
      }
    });

    wishlistBtn.addEventListener("click", function () {
      const added = store.toggleWishlist(product.id);
      syncWishlistButton();
      store.showToast(
        added
          ? product.title + " saved to your wishlist."
          : product.title + " removed from your wishlist."
      );
    });

    window.addEventListener("nn:wishlist-updated", syncWishlistButton);

    /* ----------------------------------------------------------------------
       4. Accessible Bottom Tabs (Description / Fragrance Notes / Reviews)
       ---------------------------------------------------------------------- */
    const tabButtons = Array.from(document.querySelectorAll('.nn-tab-btn[role="tab"]'));
    const tabPanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

    function activateTab(targetBtn) {
      tabButtons.forEach(function (btn) {
        const selected = btn === targetBtn;
        btn.setAttribute("aria-selected", selected ? "true" : "false");
        btn.setAttribute("tabindex", selected ? "0" : "-1");
      });
      const panelId = targetBtn.getAttribute("aria-controls");
      tabPanels.forEach(function (panel) {
        panel.hidden = panel.id !== panelId;
      });
    }

    tabButtons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        activateTab(btn);
      });
      btn.addEventListener("keydown", function (e) {
        let nextIndex = null;
        if (e.key === "ArrowRight") {
          nextIndex = (idx + 1) % tabButtons.length;
        } else if (e.key === "ArrowLeft") {
          nextIndex = (idx - 1 + tabButtons.length) % tabButtons.length;
        }
        if (nextIndex !== null) {
          e.preventDefault();
          tabButtons[nextIndex].focus();
          activateTab(tabButtons[nextIndex]);
        }
      });
    });

    /* ----------------------------------------------------------------------
       5. Fragrance Notes Rendering
       ---------------------------------------------------------------------- */
    function renderFragranceNotes() {
      const notesGrid = document.getElementById("nn-notes-grid");
      const tiers = [
        {
          tier: "Opening",
          title: "Top Notes",
          desc: "First luminous impression upon application.",
          items: product.notes.top
        },
        {
          tier: "Core",
          title: "Heart Notes",
          desc: "The enduring character as the scent warms on skin.",
          items: product.notes.heart
        },
        {
          tier: "Dry-Down",
          title: "Base Notes",
          desc: "Deep, resinous foundation lasting through the evening.",
          items: product.notes.base
        }
      ];

      notesGrid.innerHTML = tiers
        .map(function (t) {
          const pills = t.items
            .map(function (n) {
              return '<span class="nn-note-pill">' + store.escapeHTML(n) + "</span>";
            })
            .join("");
          return (
            '<div class="col-md-4">' +
            '<div class="nn-note-tier-card">' +
            '<div class="nn-note-tier-label">' +
            store.escapeHTML(t.tier) +
            "</div>" +
            '<h3 class="nn-note-tier-title">' +
            store.escapeHTML(t.title) +
            "</h3>" +
            '<p class="small text-muted mb-3">' +
            store.escapeHTML(t.desc) +
            "</p>" +
            "<div>" +
            pills +
            "</div></div></div>"
          );
        })
        .join("");
    }

    /* ----------------------------------------------------------------------
       6. Reviews Rendering, Average Calculation & Form Validation
       ---------------------------------------------------------------------- */
    function renderStarsText(rating) {
      const full = Math.round(Number(rating) || 0);
      return "★".repeat(full) + "☆".repeat(Math.max(0, 5 - full));
    }

    function renderReviews() {
      const allReviews = store.getProductReviews(product.id, product.reviews);
      const stats = store.getAverageRating(allReviews);
      const listEl = document.getElementById("nn-reviews-list");
      const summaryEl = document.getElementById("nn-rating-summary");
      const tabCountEl = document.getElementById("nn-tab-review-count");
      const avgTextEl = document.getElementById("nn-reviews-avg-text");

      tabCountEl.textContent = String(stats.count);
      summaryEl.innerHTML =
        '<span class="nn-stars" aria-hidden="true">' +
        renderStarsText(stats.avg) +
        "</span><span>" +
        stats.avg +
        " (" +
        stats.count +
        (stats.count === 1 ? " review" : " reviews") +
        ")</span>";

      avgTextEl.textContent =
        "Average rating: " +
        stats.avg +
        " / 5 across " +
        stats.count +
        (stats.count === 1 ? " verified review" : " verified reviews");

      if (allReviews.length === 0) {
        listEl.innerHTML =
          '<p class="text-muted py-3">Be the first to review ' +
          store.escapeHTML(product.title) +
          ".</p>";
        return;
      }

      listEl.innerHTML = allReviews
        .map(function (r) {
          return (
            '<article class="nn-review-card">' +
            '<div class="d-flex justify-content-between align-items-center mb-1">' +
            '<strong class="small">' +
            store.escapeHTML(r.author) +
            "</strong>" +
            '<span class="small text-muted">' +
            store.escapeHTML(r.date) +
            "</span></div>" +
            '<div class="nn-stars small mb-1" aria-label="Rated ' +
            r.rating +
            ' out of 5 stars">' +
            renderStarsText(r.rating) +
            "</div>" +
            '<p class="mb-0 small text-muted">' +
            store.escapeHTML(r.comment) +
            "</p></article>"
          );
        })
        .join("");
    }

    // Star picker interaction
    const starBtns = Array.from(document.querySelectorAll(".nn-star-pick-btn"));
    const ratingHidden = document.getElementById("nn-review-rating");
    starBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const val = Number(btn.dataset.rating);
        state.selectedRating = val;
        ratingHidden.value = String(val);
        starBtns.forEach(function (b) {
          b.classList.toggle("active", Number(b.dataset.rating) <= val);
        });
      });
    });

    // Review form validation & submission
    const reviewForm = document.getElementById("nn-review-form");
    const nameInput = document.getElementById("nn-review-name");
    const commentInput = document.getElementById("nn-review-comment");
    const errName = document.getElementById("nn-err-name");
    const errRating = document.getElementById("nn-err-rating");
    const errComment = document.getElementById("nn-err-comment");

    function validateReviewFields() {
      const nameVal = nameInput.value.trim();
      const commentVal = commentInput.value.trim();
      const ratingVal = Number(ratingHidden.value);

      const validName = nameVal.length >= 2;
      const validRating = ratingVal >= 1 && ratingVal <= 5;
      const validComment = commentVal.length >= 10;

      errName.classList.toggle("visible", !validName);
      errRating.classList.toggle("visible", !validRating);
      errComment.classList.toggle("visible", !validComment);

      return validName && validRating && validComment;
    }

    nameInput.addEventListener("input", function () {
      if (nameInput.value.trim().length >= 2) errName.classList.remove("visible");
    });

    commentInput.addEventListener("input", function () {
      if (commentInput.value.trim().length >= 10)
        errComment.classList.remove("visible");
    });

    reviewForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateReviewFields()) {
        store.announce("Please correct the highlighted fields in your review.");
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      store.addProductReview(product.id, {
        id: "rev-user-" + Date.now(),
        author: nameInput.value.trim(),
        rating: Number(ratingHidden.value),
        date: today,
        comment: commentInput.value.trim()
      });

      reviewForm.reset();
      state.selectedRating = 5;
      ratingHidden.value = "5";
      starBtns.forEach(function (b) {
        b.classList.add("active");
      });
      renderReviews();
      store.showToast("Thank you! Your review has been published.");
    });

    /* ----------------------------------------------------------------------
       7. Related Scents Grid
       ---------------------------------------------------------------------- */
    function renderRelatedProducts(excludeId) {
      const grid = document.getElementById("nn-related-grid");
      if (!grid) return;
      const related = products
        .filter(function (p) {
          return p.id !== excludeId;
        })
        .slice(0, 4);

      grid.innerHTML = related
        .map(function (p) {
          const href = "product-details.html?id=" + encodeURIComponent(p.id);
          return (
            '<div class="col-sm-6 col-lg-3">' +
            '<article class="nn-product-card">' +
            '<a href="' +
            href +
            '" class="nn-product-card-img">' +
            '<img src="' +
            store.escapeHTML(store.resolveAssetPath(p.gallery[0].src)) +
            '" alt="' +
            store.escapeHTML(p.gallery[0].alt) +
            '">' +
            "</a>" +
            '<div class="nn-product-card-body">' +
            '<span class="small text-muted mb-1">' +
            store.escapeHTML(p.category) +
            "</span>" +
            '<h3 class="nn-serif fs-4 mb-1"><a href="' +
            href +
            '">' +
            store.escapeHTML(p.title) +
            "</a></h3>" +
            '<p class="small text-muted mb-3">' +
            store.escapeHTML(p.familyTags) +
            "</p>" +
            '<div class="mt-auto d-flex justify-content-between align-items-center">' +
            '<span class="fw-semibold small">' +
            store.formatPrice(p.variants[0].price) +
            "</span>" +
            '<a href="' +
            href +
            '" class="small text-decoration-underline">View Details</a>' +
            "</div></div></article></div>"
          );
        })
        .join("");
    }

    // Initial render
    renderGallery();
    renderSizes();
    updatePriceAndShipping();
    syncWishlistButton();
    renderFragranceNotes();
    renderReviews();
    renderRelatedProducts(product.id);
  });
})();
