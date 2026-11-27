/**
 * Notes & Noir Fragrances — Scent Finder Controller (scent-finder_i263085.js)
 * Roll Number: i263085
 *
 * Implements:
 * - 4-Column visual card selection (Floral, Woody, Fresh, Sweet)
 * - Immediate calculation of matched signature fragrance
 * - Displays match score badge (96% Match), price (Rs. 8,500), flacon image, and notes
 * - Actions: "View Product Details" and "Add to Cart" with header badge synchronization
 * - LocalStorage state persistence (nn_scent_finder_i263085)
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "nn_scent_finder_i263085";

  // Signature match mapping per scent family
  const SCENT_MATCHES = {
    Woody: {
      productId: "noir-oud",
      matchScore: 96,
      whyMatched: "Noir Oud is our definitive woody masterpiece. A rich architecture of aged agarwood, warm amber resin, and spicy saffron crafted for bold, timeless elegance."
    },
    Floral: {
      productId: "velvet-rose",
      matchScore: 94,
      whyMatched: "Velvet Rose captures crimson Damascus rose petals layered over cashmere woods and soft white musk, offering a poetic and radiant floral signature."
    },
    Fresh: {
      productId: "neroli-blanc",
      matchScore: 97,
      whyMatched: "Neroli Blanc brings sun-drenched Mediterranean neroli and crisp citrus leaves into harmony with serene white cedar for an uplifting, effortless presence."
    },
    Sweet: {
      productId: "amber-solstice",
      matchScore: 95,
      whyMatched: "Amber Solstice envelops you in roasted Madagascar vanilla bean, golden benzoin resin, and spiced labdanum for a glowing, comforting signature."
    }
  };

  function getStoredFamily() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SCENT_MATCHES[saved]) return saved;
    } catch (e) {}
    return "Woody";
  }

  function saveFamily(family) {
    try {
      localStorage.setItem(STORAGE_KEY, family);
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    const store = global.NNStore;
    const products = global.NN_PRODUCTS || [];
    const grid = document.getElementById("nn-sf-family-grid");
    const resultContainer = document.getElementById("nn-sf-match-result");

    if (!grid || !resultContainer) return;

    let selectedFamily = getStoredFamily();

    function renderMatch(family) {
      const match = SCENT_MATCHES[family] || SCENT_MATCHES.Woody;
      const product = products.find(function (p) { return p.id === match.productId; }) || products[0];

      const priceDisplay = product.pricePKR || "Rs. 8,500";
      const baseVariant = product.variants ? product.variants[0] : { price: product.price || 45, size: "50 ml" };
      const detailsHref = "product-details.html?id=" + encodeURIComponent(product.id);
      const imgSrc = store ? store.resolveAssetPath(product.gallery ? product.gallery[0].src : product.image) : product.image;

      let html = "";
      html += '<div class="nn-sf-result-card">';
      html += '  <div class="row g-0 align-items-center">';

      // Left Column: Bottle Image with Match Score Badge
      html += '    <div class="col-md-5">';
      html += '      <div class="nn-sf-result-img-wrap">';
      html += '        <img src="' + imgSrc + '" alt="' + (store ? store.escapeHTML(product.title) : product.title) + '" class="nn-sf-result-img">';
      html += '        <div class="nn-sf-match-badge" aria-label="' + match.matchScore + '% Match">';
      html += '          <span class="fs-6 fw-bold">' + match.matchScore + '%</span> Match';
      html += '        </div>';
      html += '      </div>';
      html += '    </div>';

      // Right Column: Match Details & Actions
      html += '    <div class="col-md-7 p-4 p-lg-5">';
      html += '      <p class="text-uppercase small mb-1" style="letter-spacing: 0.18em; color: var(--nn-muted);">Curated Scent Recommendation</p>';
      html += '      <h3 class="nn-sf-result-name" id="nn-match-title">' + (store ? store.escapeHTML(product.title) : product.title) + '</h3>';
      html += '      <p class="text-muted small mb-2">' + (store ? store.escapeHTML(product.familyTags || product.category) : product.category) + '</p>';

      // Price Display
      html += '      <div class="nn-sf-result-price mb-3">';
      html += '        <span>' + (store ? store.escapeHTML(priceDisplay) : priceDisplay) + '</span>';
      html += '        <span class="text-muted fs-6 fw-normal ms-2">(' + (store ? store.formatPrice(baseVariant.price) : "$" + baseVariant.price) + ' &bull; ' + (store ? store.escapeHTML(baseVariant.size) : baseVariant.size) + ')</span>';
      html += '      </div>';

      // Editorial Why It Matched Note
      html += '      <div class="p-3 mb-4 rounded" style="background-color: var(--nn-cream-soft); border-left: 3px solid var(--nn-obsidian);">';
      html += '        <p class="small text-uppercase fw-semibold mb-1" style="letter-spacing: 0.08em; color: var(--nn-muted);">Why This Matched Your Taste</p>';
      html += '        <p class="small mb-0" style="color: var(--nn-charcoal); line-height: 1.55;">' + (store ? store.escapeHTML(match.whyMatched) : match.whyMatched) + '</p>';
      html += '      </div>';

      // Key Fragrance Notes
      if (product.notes) {
        html += '      <div class="mb-4 small">';
        html += '        <span class="fw-semibold me-2 d-inline-block">Key Notes:</span>';
        if (product.notes.top) {
          html += '        <span class="badge bg-white text-dark border px-2 py-1 me-1 mb-1">Top: ' + product.notes.top.join(", ") + '</span>';
        }
        if (product.notes.heart) {
          html += '        <span class="badge bg-white text-dark border px-2 py-1 me-1 mb-1">Heart: ' + product.notes.heart.join(", ") + '</span>';
        }
        if (product.notes.base) {
          html += '        <span class="badge bg-white text-dark border px-2 py-1 me-1 mb-1">Base: ' + product.notes.base.join(", ") + '</span>';
        }
        html += '      </div>';
      }

      // Actions: View Details & Add to Cart
      html += '      <div class="nn-sf-result-actions">';
      html += '        <a href="' + detailsHref + '" class="nn-btn-primary rounded-pill">View Product Details</a>';
      html += '        <button type="button" class="nn-btn-outline rounded-pill" id="nn-sf-add-cart-btn">';
      html += '          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">';
      html += '            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>';
      html += '            <line x1="3" y1="6" x2="21" y2="6"></line>';
      html += '            <path d="M16 10a4 4 0 0 1-8 0"></path>';
      html += '          </svg>';
      html += '          <span>Add to Cart</span>';
      html += '        </button>';
      html += '      </div>';

      html += '    </div>';
      html += '  </div>';
      html += '</div>';

      resultContainer.innerHTML = html;

      // Bind Add to Cart button
      const addCartBtn = document.getElementById("nn-sf-add-cart-btn");
      if (addCartBtn && store) {
        addCartBtn.addEventListener("click", function () {
          store.addToCart({
            id: product.id,
            title: product.title,
            size: baseVariant.size,
            unitPrice: baseVariant.price,
            quantity: 1,
            image: product.gallery ? product.gallery[0].src : product.image
          });
          store.showToast(product.title + " (" + baseVariant.size + ") added to your bag.");
        });
      }
    }

    // Bind 4-column card selection interactions
    const cards = grid.querySelectorAll(".nn-sf-card");
    cards.forEach(function (card) {
      const radio = card.querySelector('input[type="radio"]');
      const family = card.dataset.family;

      function selectThisCard() {
        cards.forEach(function (c) {
          c.classList.remove("selected");
          const r = c.querySelector('input[type="radio"]');
          if (r) r.checked = false;
        });
        card.classList.add("selected");
        if (radio) radio.checked = true;
        selectedFamily = family;
        saveFamily(family);
        renderMatch(family);
      }

      card.addEventListener("click", function () {
        selectThisCard();
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectThisCard();
        }
      });

      if (radio) {
        radio.addEventListener("change", function () {
          if (radio.checked) selectThisCard();
        });
      }
    });

    // Initialize with stored or default card
    const initialCard = grid.querySelector('.nn-sf-card[data-family="' + selectedFamily + '"]');
    if (initialCard) {
      cards.forEach(function (c) { c.classList.remove("selected"); });
      initialCard.classList.add("selected");
      const r = initialCard.querySelector('input[type="radio"]');
      if (r) r.checked = true;
    }

    renderMatch(selectedFamily);
  });
})(window);