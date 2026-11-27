/**
 * Notes & Noir Fragrances — Scent Finder Controller (scent-finder_i263085.js)
 * Roll Number: i263085
 *
 * Implements:
 * - 4-Column visual card selection (Floral, Woody, Fresh, Sweet)
 * - Accessible keyboard navigation & radio synchronization
 * - Dynamic category link updating for the Explore button
 * - LocalStorage preference persistence (nn_scent_finder_i263085)
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "nn_scent_finder_i263085";

  const CATEGORY_MAP = {
    Woody: "shop.html?category=Woody%20%26%20Oud",
    Floral: "shop.html?category=Floral%20%26%20Musk",
    Fresh: "shop.html?category=Floral%20%26%20Musk",
    Sweet: "shop.html?category=Amber%20%26%20Spice"
  };

  function getStoredFamily() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CATEGORY_MAP[saved]) return saved;
    } catch (e) {}
    return "Woody";
  }

  function saveFamily(family) {
    try {
      localStorage.setItem(STORAGE_KEY, family);
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById("nn-sf-family-grid");
    const exploreBtn = document.getElementById("nn-sf-explore-btn");

    if (!grid) return;

    let selectedFamily = getStoredFamily();

    function updateSelection(family) {
      selectedFamily = family;
      saveFamily(family);

      const cards = grid.querySelectorAll(".nn-sf-card");
      cards.forEach(function (c) {
        const isMatch = c.dataset.family === family;
        c.classList.toggle("selected", isMatch);
        const radio = c.querySelector('input[type="radio"]');
        if (radio) radio.checked = isMatch;
      });

      if (exploreBtn && CATEGORY_MAP[family]) {
        exploreBtn.setAttribute("href", CATEGORY_MAP[family]);
      }
    }

    // Bind cards
    const cards = grid.querySelectorAll(".nn-sf-card");
    cards.forEach(function (card) {
      const family = card.dataset.family;
      const radio = card.querySelector('input[type="radio"]');

      card.addEventListener("click", function () {
        updateSelection(family);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          updateSelection(family);
        }
      });

      if (radio) {
        radio.addEventListener("change", function () {
          if (radio.checked) updateSelection(family);
        });
      }
    });

    // Initialize
    updateSelection(selectedFamily);
  });
})(window);