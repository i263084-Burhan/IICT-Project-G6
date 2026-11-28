/* ==========================================================================
   Notes & Noir — Perfume Finder Quiz Functionality (i263086)
   Flow: Category -> Fragrance Type -> Recommendation -> Added Confirmation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const openQuizBtn = document.getElementById("openQuizBtn");
  const quizModal = document.getElementById("quizModal");
  const quizBackdrop = document.getElementById("quizBackdrop");
  const closeQuizBtn = document.getElementById("closeQuizBtn");
  const quizProgressFill = document.getElementById("quizProgressFill");

  const screenCategory = document.getElementById("quizStepCategory");
  const screenType = document.getElementById("quizStepType");
  const screenResult = document.getElementById("quizStepResult");
  const screenConfirm = document.getElementById("quizStepConfirm");

  const categoryButtons = Array.from(document.querySelectorAll("[data-quiz-category]"));
  const typeButtons = Array.from(document.querySelectorAll("[data-quiz-type]"));
  const backToCategoryBtn = document.getElementById("quizBackToCategoryBtn");
  const retakeQuizBtn = document.getElementById("quizRetakeBtn");
  const quizAddToCartBtn = document.getElementById("quizAddToCartBtn");

  const resultSummaryEl = document.getElementById("quizChoiceSummary");
  const resultImgEl = document.getElementById("quizResultImg");
  const resultNameEl = document.getElementById("quizResultName");
  const resultNotesEl = document.getElementById("quizResultNotes");
  const resultPriceEl = document.getElementById("quizResultPrice");

  const confirmItemEl = document.getElementById("quizConfirmItem");
  const confirmBagEl = document.getElementById("quizConfirmBag");
  const viewBagBtn = document.getElementById("quizViewBagBtn");
  const continueBtn = document.getElementById("quizContinueBtn");

  if (!openQuizBtn || !quizModal) return;

  /* Curated Notes & Noir Recommendations */
  const RECOMMENDATIONS = {
    women: {
      floral: {
        name: "Rose Eternelle",
        type: "Velvet Rose",
        notes: "Damask rose, warm blush amber & soft cashmere musk",
        price: 4500,
        priceLabel: "Rs 4,500",
        image: "images/rose-eternelle-i263086.jpg"
      },
      fruity: {
        name: "Royal Blossom",
        type: "Golden Floral",
        notes: "Sunlit pear blossom, golden nectar & delicate jasmine",
        price: 5300,
        priceLabel: "Rs 5,300",
        image: "images/royal-blossom-i263086.jpg"
      },
      woody: {
        name: "Moonlight",
        type: "Nocturnal Musk",
        notes: "Midnight sandalwood, dark iris & velvety amber musk",
        price: 6300,
        priceLabel: "Rs 6,300",
        image: "images/moonlight-i263086.jpg"
      }
    },
    unisex: {
      floral: {
        name: "Pure Musk",
        type: "Floral Musk",
        notes: "White iris, creamy sandalwood & luminous silk musk",
        price: 4600,
        priceLabel: "Rs 4,600",
        image: "images/pure-musk-i263086.jpg"
      },
      fruity: {
        name: "Citrus Wave",
        type: "Citrus Fruity",
        notes: "Crisp bergamot, sunlit mandarin & golden cedar",
        price: 6000,
        priceLabel: "Rs 6,000",
        image: "images/citrus-wave-i263086.jpg"
      },
      woody: {
        name: "Sauvage",
        type: "Woody Amber",
        notes: "Smoked cedarwood, crisp spice & rich golden amber",
        price: 7000,
        priceLabel: "Rs 7,000",
        image: "images/sauvage-i263086.jpg"
      }
    }
  };

  const CATEGORY_LABELS = {
    women: "Women's Perfumes",
    unisex: "Unisex"
  };

  const TYPE_LABELS = {
    floral: "Floral",
    fruity: "Fruity",
    woody: "Woody"
  };

  const state = {
    category: null,
    fragranceType: null,
    recommendation: null
  };

  function showScreen(screenEl, progressPercent) {
    [screenCategory, screenType, screenResult, screenConfirm].forEach((el) => {
      if (el) el.hidden = el !== screenEl;
    });
    if (quizProgressFill) {
      quizProgressFill.style.width = `${progressPercent}%`;
    }
  }

  function renderRecommendation() {
    const categoryPool = RECOMMENDATIONS[state.category] || RECOMMENDATIONS.women;
    const match = categoryPool[state.fragranceType] || categoryPool.floral;
    state.recommendation = match;

    if (resultSummaryEl) {
      resultSummaryEl.textContent = `${CATEGORY_LABELS[state.category]} \u2022 ${TYPE_LABELS[state.fragranceType]}`;
    }
    if (resultImgEl) {
      resultImgEl.src = match.image;
      resultImgEl.alt = `${match.name} perfume bottle by Notes & Noir`;
    }
    if (resultNameEl) {
      resultNameEl.textContent = match.name;
    }
    if (resultNotesEl) {
      resultNotesEl.textContent = match.notes;
    }
    if (resultPriceEl) {
      resultPriceEl.textContent = match.priceLabel;
    }

    showScreen(screenResult, 75);
  }

  function openQuiz() {
    state.category = null;
    state.fragranceType = null;
    state.recommendation = null;
    showScreen(screenCategory, 25);
    quizModal.hidden = false;
    if (closeQuizBtn) closeQuizBtn.focus();
  }

  function closeQuiz() {
    quizModal.hidden = true;
  }

  openQuizBtn.addEventListener("click", openQuiz);
  if (closeQuizBtn) closeQuizBtn.addEventListener("click", closeQuiz);
  if (quizBackdrop) quizBackdrop.addEventListener("click", closeQuiz);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !quizModal.hidden) {
      closeQuiz();
    }
  });

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.quizCategory;
      showScreen(screenType, 50);
    });
  });

  typeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.fragranceType = btn.dataset.quizType;
      renderRecommendation();
    });
  });

  if (backToCategoryBtn) {
    backToCategoryBtn.addEventListener("click", () => {
      showScreen(screenCategory, 25);
    });
  }

  if (retakeQuizBtn) {
    retakeQuizBtn.addEventListener("click", () => {
      state.category = null;
      state.fragranceType = null;
      showScreen(screenCategory, 25);
    });
  }

  if (quizAddToCartBtn) {
    quizAddToCartBtn.addEventListener("click", () => {
      const item = state.recommendation;
      if (!item) return;

      document.dispatchEvent(
        new CustomEvent("notesnoir:add-to-cart", {
          detail: {
            name: item.name,
            type: item.type,
            price: item.price
          }
        })
      );

      if (confirmItemEl) {
        confirmItemEl.innerHTML = `<strong>${item.name}</strong> (${item.priceLabel}) is now in your Scent Bag.`;
      }
      if (confirmBagEl) {
        const count = document.getElementById("cartCount")?.textContent || "1";
        confirmBagEl.textContent = `Items in your Scent Bag: ${count}`;
      }

      showScreen(screenConfirm, 100);
    });
  }

  if (viewBagBtn) {
    viewBagBtn.addEventListener("click", () => {
      closeQuiz();
      const cartBtn = document.getElementById("cartBtn");
      if (cartBtn) cartBtn.click();
    });
  }

  if (continueBtn) {
    continueBtn.addEventListener("click", closeQuiz);
  }
});
