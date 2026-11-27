/**
 * Notes & Noir Fragrances — Scent Finder Controller (scent-finder_i263085.js)
 * Roll Number: i263085
 *
 * Implements direct curated signature fragrance discovery:
 * - 1-Click Scent Family exploration (Woody, Floral, Fresh, Sweet)
 * - Personalized Signature Result Card with Match Score (97%), price (Rs. 8,500), notes, and imagery
 * - Action buttons: View Product Details, Add to Cart (with live badge updates), and Explore All Fragrances
 * - Secondary Runner-Up Recommendation card
 * - Interactive visual fragrance family cards
 * - State persistence via localStorage (nn_scent_finder_i263085)
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "nn_scent_finder_i263085";

  // Pre-configured matches per scent family
  const FAMILY_MATCHES = {
    Woody: {
      primaryId: "noir-oud",
      score: 97,
      runnerId: "santal-fumee",
      runnerScore: 84,
      whyMatched: "Noir Oud's blend of rich agarwood, warm amber, and spicy saffron creates a bold, timeless signature for those drawn to deep, enveloping woody profiles."
    },
    Floral: {
      primaryId: "velvet-rose",
      score: 96,
      runnerId: "neroli-blanc",
      runnerScore: 82,
      whyMatched: "Velvet Rose layers hand-harvested Damascus rose petals over cashmere woods and soft white musk, offering a romantic and poetic floral aura."
    },
    Fresh: {
      primaryId: "neroli-blanc",
      score: 98,
      runnerId: "velvet-rose",
      runnerScore: 80,
      whyMatched: "Neroli Blanc pairs sun-drenched Tunisian neroli and crisp petitgrain with creamy white cedar, creating an airy, uplifting signature for lovers of clean botanicals."
    },
    Sweet: {
      primaryId: "amber-solstice",
      score: 97,
      runnerId: "noir-oud",
      runnerScore: 83,
      whyMatched: "Amber Solstice combines golden benzoin resin, roasted vanilla bean, and spiced labdanum to deliver an intoxicating, luminous warmth."
    }
  };

  const FAMILY_CARDS_DATA = [
    {
      family: "Woody",
      label: "Woody & Oud",
      image: "images/quiz-woody.svg",
      alt: "Textured dark wood bark — woody scent family",
      desc: "Agarwood, Mysore sandalwood & smoked cedar"
    },
    {
      family: "Floral",
      label: "Floral & Rose",
      image: "images/quiz-floral.svg",
      alt: "Pink roses in soft bloom — floral scent family",
      desc: "Damascus rose, white lily & airy musk"
    },
    {
      family: "Fresh",
      label: "Fresh & Neroli",
      image: "images/quiz-fresh.svg",
      alt: "Vibrant green botanical leaves — fresh scent family",
      desc: "Citrus leaves, neroli blossom & morning dew"
    },
    {
      family: "Sweet",
      label: "Sweet & Amber",
      image: "images/quiz-sweet.svg",
      alt: "Vanilla flower and vanilla beans — sweet scent family",
      desc: "Madagascar vanilla, golden amber & resins"
    }
  ];

  function getStoredFamily() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && FAMILY_MATCHES[saved]) {
        return saved;
      }
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
    const resultPanel = document.getElementById("nn-sf-result-panel");
    const pillsContainer = document.getElementById("nn-sf-family-pills");

    if (!resultPanel) return;

    let activeFamily = getStoredFamily();

    function updatePills(family) {
      if (!pillsContainer) return;
      const pills = pillsContainer.querySelectorAll(".nn-filter-pill");
      pills.forEach(function (pill) {
        const isMatch = pill.dataset.family === family;
        pill.classList.toggle("active", isMatch);
        pill.setAttribute("aria-selected", isMatch ? "true" : "false");
      });
    }

    function renderMatch(family) {
      activeFamily = family;
      saveFamily(family);
      updatePills(family);

      const config = FAMILY_MATCHES[family] || FAMILY_MATCHES.Woody;
      const primary = products.find(function (p) { return p.id === config.primaryId; }) || products[0];
      const runner = products.find(function (p) { return p.id === config.runnerId; }) || products[1];

      const pricePKR = primary.pricePKR || "Rs. 8,500";
      const baseVariant = primary.variants ? primary.variants[0] : { price: primary.price || 45, size: "50 ml" };
      const formattedBase = store ? store.formatPrice(baseVariant.price) : "$" + baseVariant.price;
      const detailsHref = "product-details.html?id=" + encodeURIComponent(primary.id);
      const runnerHref = "product-details.html?id=" + encodeURIComponent(runner.id);

      let html = "";

      // 1. Main Signature Result Card
      html += '<div class="nn-sf-result-card">';
      html += '  <div class="row g-0 align-items-center">';

      // Left Column: Bottle Image with Match Score Badge
      html += '    <div class="col-md-5">';
      html += '      <div class="nn-sf-result-img-wrap">';
      html += '        <img src="' + store.resolveAssetPath(primary.gallery ? primary.gallery[0].src : primary.image) + '" alt="' + store.escapeHTML(primary.gallery ? primary.gallery[0].alt : primary.title) + '" class="nn-sf-result-img">';
      html += '        <div class="nn-sf-match-badge" aria-label="' + config.score + '% Match">';
      html += '          <span class="fs-6 fw-bold">' + config.score + '%</span> Match';
      html += '        </div>';
      html += '      </div>';
      html += '    </div>';

      // Right Column: Scent Details & Actions
      html += '    <div class="col-md-7 p-4 p-lg-5">';
      html += '      <p class="text-uppercase small mb-1" style="letter-spacing: 0.18em; color: var(--nn-muted);">Curated Signature Scent</p>';
      html += '      <h2 class="nn-sf-result-name" id="nn-result-title">' + store.escapeHTML(primary.title) + '</h2>';
      html += '      <p class="text-muted small mb-2">' + store.escapeHTML(primary.familyTags || primary.category) + '</p>';

      // Price Display
      html += '      <div class="nn-sf-result-price mb-3">';
      html += '        <span>' + store.escapeHTML(pricePKR) + '</span>';
      html += '        <span class="text-muted fs-6 fw-normal ms-2">(' + formattedBase + ' &bull; ' + store.escapeHTML(baseVariant.size) + ')</span>';
      html += '      </div>';

      // Why this matched editorial quote
      html += '      <div class="p-3 mb-4 rounded" style="background-color: var(--nn-cream-soft); border-left: 3px solid var(--nn-obsidian);">';
      html += '        <p class="small text-uppercase fw-semibold mb-1" style="letter-spacing: 0.08em; color: var(--nn-muted);">Atelier Match Note</p>';
      html += '        <p class="small mb-0" style="color: var(--nn-charcoal); line-height: 1.55;">' + store.escapeHTML(config.whyMatched) + '</p>';
      html += '      </div>';

      // Fragrance Notes Highlights
      if (primary.notes) {
        html += '      <div class="mb-4 small">';
        html += '        <span class="fw-semibold me-2 d-inline-block">Fragrance Notes:</span>';
        if (primary.notes.top) {
          html += '        <span class="badge bg-white text-dark border px-2 py-1 me-1 mb-1">Top: ' + store.escapeHTML(primary.notes.top.join(", ")) + '</span>';
        }
        if (primary.notes.heart) {
          html += '        <span class="badge bg-white text-dark border px-2 py-1 me-1 mb-1">Heart: ' + store.escapeHTML(primary.notes.heart.join(", ")) + '</span>';
        }
        if (primary.notes.base) {
          html += '        <span class="badge bg-white text-dark border px-2 py-1 me-1 mb-1">Base: ' + store.escapeHTML(primary.notes.base.join(", ")) + '</span>';
        }
        html += '      </div>';
      }

      // Action Buttons
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
      html += '        <a href="shop.html" class="nn-btn-ghost rounded-pill">';
      html += '          <span>Explore All Fragrances &rarr;</span>';
      html += '        </a>';
      html += '      </div>';

      html += '    </div>';
      html += '  </div>';
      html += '</div>';

      // 2. Secondary Runner-Up Recommendation Card
      if (runner && runner.id !== primary.id) {
        const runnerPricePKR = runner.pricePKR || "Rs. 7,500";
        html += '<div class="nn-sf-runner-wrap mb-5">';
        html += '  <h3 class="nn-serif fs-4 mb-3">Runner-Up Recommendation</h3>';
        html += '  <div class="nn-sf-runner-card d-flex align-items-center justify-content-between flex-wrap gap-3">';
        html += '    <div class="d-flex align-items-center gap-3">';
        html += '      <img src="' + store.resolveAssetPath(runner.gallery ? runner.gallery[0].src : runner.image) + '" alt="' + store.escapeHTML(runner.title) + '" class="nn-sf-runner-img rounded">';
        html += '      <div>';
        html += '        <div class="d-flex align-items-center gap-2 mb-1">';
        html += '          <h4 class="nn-serif fs-5 mb-0"><a href="' + runnerHref + '">' + store.escapeHTML(runner.title) + '</a></h4>';
        html += '          <span class="nn-sf-runner-score">' + config.runnerScore + '% Match</span>';
        html += '        </div>';
        html += '        <p class="small text-muted mb-1">' + store.escapeHTML(runner.familyTags || runner.category) + ' &bull; ' + store.escapeHTML(runnerPricePKR) + '</p>';
        html += '        <p class="small text-muted mb-0 d-none d-sm-block">' + store.escapeHTML(runner.shortDescription || '') + '</p>';
        html += '      </div>';
        html += '    </div>';
        html += '    <div class="d-flex gap-2">';
        html += '      <a href="' + runnerHref + '" class="btn btn-sm btn-outline-dark rounded-pill px-3">View Details</a>';
        html += '      <button type="button" class="btn btn-sm btn-dark rounded-pill px-3" id="nn-sf-add-runner-btn">Add to Cart</button>';
        html += '    </div>';
        html += '  </div>';
        html += '</div>';
      }

      // 3. Visual Scent Family Gallery (4 Visual Selection Cards)
      html += '<div class="pt-4 border-top" style="border-color: var(--nn-taupe) !important;">';
      html += '  <div class="text-center mb-4">';
      html += '    <h3 class="nn-serif fs-3 mb-1">Select a Scent Palette</h3>';
      html += '    <p class="text-muted small mb-0">Switch between signature botanical profiles to view instant recommendations.</p>';
      html += '  </div>';
      html += '  <div class="nn-sf-card-grid">';

      FAMILY_CARDS_DATA.forEach(function (card) {
        const isSelected = card.family === family;
        html += '    <div class="nn-sf-card ' + (isSelected ? 'selected' : '') + '" data-family="' + card.family + '" role="button" tabindex="0" aria-label="Select ' + card.label + '">';
        html += '      <div class="nn-sf-card-img-wrap">';
        html += '        <img src="' + store.resolveAssetPath(card.image) + '" alt="' + store.escapeHTML(card.alt) + '" class="nn-sf-card-img" loading="lazy">';
        html += '      </div>';
        html += '      <div class="nn-sf-card-label">';
        html += '        <span class="nn-sf-card-radio-dot" aria-hidden="true"></span>';
        html += '        <span class="nn-sf-card-name">' + store.escapeHTML(card.label) + '</span>';
        html += '        <span class="nn-sf-card-desc">' + store.escapeHTML(card.desc) + '</span>';
        html += '      </div>';
        html += '    </div>';
      });

      html += '  </div>';
      html += '</div>';

      resultPanel.innerHTML = html;

      // Bind Primary Add to Cart
      const addCartBtn = document.getElementById("nn-sf-add-cart-btn");
      if (addCartBtn) {
        addCartBtn.addEventListener("click", function () {
          store.addToCart({
            id: primary.id,
            title: primary.title,
            size: baseVariant.size,
            unitPrice: baseVariant.price,
            quantity: 1,
            image: primary.gallery ? primary.gallery[0].src : primary.image
          });
          store.showToast(primary.title + " (" + baseVariant.size + ") added to your bag.");
        });
      }

      // Bind Runner-Up Add to Cart
      const addRunnerBtn = document.getElementById("nn-sf-add-runner-btn");
      if (addRunnerBtn && runner) {
        const runnerVariant = runner.variants ? runner.variants[0] : { price: runner.price || 39, size: "50 ml" };
        addRunnerBtn.addEventListener("click", function () {
          store.addToCart({
            id: runner.id,
            title: runner.title,
            size: runnerVariant.size,
            unitPrice: runnerVariant.price,
            quantity: 1,
            image: runner.gallery ? runner.gallery[0].src : runner.image
          });
          store.showToast(runner.title + " (" + runnerVariant.size + ") added to your bag.");
        });
      }

      // Bind Visual Cards click/keyboard
      const cards = resultPanel.querySelectorAll(".nn-sf-card");
      cards.forEach(function (card) {
        card.addEventListener("click", function () {
          const fam = card.dataset.family;
          if (fam && fam !== activeFamily) {
            renderMatch(fam);
            resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const fam = card.dataset.family;
            if (fam && fam !== activeFamily) {
              renderMatch(fam);
              resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        });
      });
    }

    // Bind Top Pills click
    if (pillsContainer) {
      const pills = pillsContainer.querySelectorAll(".nn-filter-pill");
      pills.forEach(function (pill) {
        pill.addEventListener("click", function () {
          const fam = pill.dataset.family;
          if (fam && fam !== activeFamily) {
            renderMatch(fam);
          }
        });
      });
    }

    // Initial render
    renderMatch(activeFamily);
  });
})(window);