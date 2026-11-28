/**
 * Notes & Noir Fragrances — Home & Shop Catalog Controller (shop_i263085.js)
 * Roll Number: i263085
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const products = window.NN_PRODUCTS || [];
    const store = window.NNStore;
    if (!store) return;

    function buildProductCard(p, inPages) {
      const href =
        (inPages ? "product-details.html" : "pages/product-details.html") +
        "?id=" +
        encodeURIComponent(p.id);
      const baseVariant = p.variants[0];
      const wishlisted = store.isWishlisted(p.id);

      return (
        '<div class="col-sm-6 col-lg-4">' +
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
        '<div class="d-flex justify-content-between align-items-center mb-1">' +
        '<span class="small text-muted">' +
        store.escapeHTML(p.category) +
        "</span>" +
        '<button type="button" class="btn btn-sm p-0 border-0 text-muted nn-card-wish" data-id="' +
        store.escapeHTML(p.id) +
        '" aria-label="Save ' +
        store.escapeHTML(p.title) +
        ' to wishlist" aria-pressed="' +
        (wishlisted ? "true" : "false") +
        '">' +
        (wishlisted ? "♥ Saved" : "♡ Save") +
        "</button>" +
        "</div>" +
        '<h3 class="nn-serif fs-3 mb-1"><a href="' +
        href +
        '">' +
        store.escapeHTML(p.title) +
        "</a></h3>" +
        '<p class="small text-muted mb-2">' +
        store.escapeHTML(p.familyTags) +
        "</p>" +
        '<p class="small text-muted mb-3">' +
        store.escapeHTML(p.shortDescription) +
        "</p>" +
        '<div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top" style="border-color: var(--nn-taupe) !important;">' +
        '<span class="fw-semibold">' +
        store.formatPrice(baseVariant.price) +
        "</span>" +
        '<div class="d-flex gap-2">' +
        '<button type="button" class="btn btn-sm btn-dark rounded-pill px-3 nn-card-add" data-id="' +
        store.escapeHTML(p.id) +
        '">Add 50 ml</button>' +
        '<a href="' +
        href +
        '" class="btn btn-sm btn-outline-dark rounded-pill px-3">Details</a>' +
        "</div></div></div></article></div>"
      );
    }

    function bindCardActions(container, rerender) {
      container.querySelectorAll(".nn-card-add").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const prod = products.find(function (p) {
            return p.id === btn.dataset.id;
          });
          if (!prod) return;
          store.addToCart({
            id: prod.id,
            title: prod.title,
            size: prod.variants[0].size,
            unitPrice: prod.variants[0].price,
            quantity: 1,
            image: prod.gallery[0].src
          });
          store.showToast(
            prod.title + " (" + prod.variants[0].size + ") added to your bag."
          );
        });
      });

      container.querySelectorAll(".nn-card-wish").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const added = store.toggleWishlist(btn.dataset.id);
          store.showToast(
            added ? "Saved to your wishlist." : "Removed from your wishlist."
          );
          rerender();
        });
      });
    }

    // Home Page Featured Grid
    const homeGrid = document.getElementById("nn-home-featured-grid");
    if (homeGrid) {
      function renderHomeGrid() {
        homeGrid.innerHTML = products
          .slice(0, 3)
          .map(function (p) {
            return buildProductCard(p, false);
          })
          .join("");
        bindCardActions(homeGrid, renderHomeGrid);
      }
      renderHomeGrid();
      window.addEventListener("nn:wishlist-updated", renderHomeGrid);
    }

    // Shop Page Filter & Sort Grid
    const shopGrid = document.getElementById("nn-shop-grid");
    if (shopGrid) {
      const params = new URLSearchParams(window.location.search);
      let activeCategory = params.get("category") || "All";
      let activeSort = "featured";

      const filterBtns = Array.from(document.querySelectorAll(".nn-filter-pill"));
      const sortSelect = document.getElementById("nn-shop-sort");
      const countLabel = document.getElementById("nn-shop-count");

      function renderShopGrid() {
        let list = products.slice();
        if (activeCategory !== "All") {
          list = list.filter(function (p) {
            return p.category.toLowerCase() === activeCategory.toLowerCase();
          });
        }

        if (activeSort === "price-asc") {
          list.sort(function (a, b) {
            return a.variants[0].price - b.variants[0].price;
          });
        } else if (activeSort === "price-desc") {
          list.sort(function (a, b) {
            return b.variants[0].price - a.variants[0].price;
          });
        }

        if (countLabel) {
          countLabel.textContent =
            "Showing " + list.length + (list.length === 1 ? " fragrance" : " fragrances");
        }

        filterBtns.forEach(function (btn) {
          const isMatch =
            btn.dataset.category.toLowerCase() === activeCategory.toLowerCase();
          btn.classList.toggle("active", isMatch);
          btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
        });

        if (list.length === 0) {
          shopGrid.innerHTML =
            '<div class="col-12 text-center py-5 text-muted">No fragrances found in this category.</div>';
          return;
        }

        shopGrid.innerHTML = list
          .map(function (p) {
            return buildProductCard(p, true);
          })
          .join("");
        bindCardActions(shopGrid, renderShopGrid);
      }

      filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          activeCategory = btn.dataset.category;
          renderShopGrid();
        });
      });

      if (sortSelect) {
        sortSelect.addEventListener("change", function () {
          activeSort = sortSelect.value;
          renderShopGrid();
        });
      }

      renderShopGrid();
      window.addEventListener("nn:wishlist-updated", renderShopGrid);
    }
  });
})();
