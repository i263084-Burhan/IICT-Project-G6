/**
 * Notes & Noir Fragrances — Scent Finder Quiz Controller (scent-finder_i263085.js)
 * Roll Number: i263085
 *
 * Implements:
 * - 3-step interactive horizontal progress stepper
 * - Dynamic data-driven question rendering from data_i263085.js
 * - 4-column responsive visual option cards with real radio inputs & keyboard accessibility
 * - Multi-factor weighted scoring algorithm for primary match & secondary runner-up
 * - Inline validation error alert with role="alert" preventing unselected advance
 * - Persistent quiz state via localStorage (nn_quiz_state_i263085)
 * - Direct Add to Cart & View Product Details actions with header badge synchronization
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "nn_quiz_state_i263085";

  // Default empty state
  const defaultState = {
    currentStep: 1,
    answers: {
      family: null,
      occasion: null
    },
    result: {
      primaryId: null,
      primaryScore: null,
      runnerId: null,
      runnerScore: null
    }
  };

  let state = Object.assign({}, defaultState, { answers: Object.assign({}, defaultState.answers) });

  /* ------------------------------------------------------------------------
     Storage Helpers
     ------------------------------------------------------------------------ */
  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch (e) {
      // Storage unavailable or corrupted
    }
    return null;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Silently fail quota exceeded
    }
  }

  function clearState() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    state = {
      currentStep: 1,
      answers: { family: null, occasion: null },
      result: { primaryId: null, primaryScore: null, runnerId: null, runnerScore: null }
    };
  }

  /* ------------------------------------------------------------------------
     Weighted Scoring Algorithm
     ------------------------------------------------------------------------ */
  function calculateScentMatch(selectedFamily, selectedOccasion) {
    const products = global.NN_PRODUCTS || [];
    const matrix = global.NN_SCENT_MATCH_MATRIX || {};

    // 1. Check pre-calibrated matrix
    let matrixEntry = null;
    if (matrix[selectedFamily] && matrix[selectedFamily][selectedOccasion]) {
      matrixEntry = matrix[selectedFamily][selectedOccasion];
    }

    // 2. Compute individual weighted score for every product
    const scoredProducts = products.map(function (prod) {
      let score = 0;

      // Family match weight (up to 45 pts)
      const prodFamily = (prod.family || "").toLowerCase();
      const selFam = (selectedFamily || "").toLowerCase();
      const tags = (prod.familyTags || "").toLowerCase();
      const cat = (prod.category || "").toLowerCase();

      if (prodFamily === selFam) {
        score += 45;
      } else if (tags.includes(selFam) || cat.includes(selFam)) {
        score += 32;
      } else {
        // Partial botanical / notes overlap
        const allNotes = []
          .concat(prod.notes && prod.notes.top || [])
          .concat(prod.notes && prod.notes.heart || [])
          .concat(prod.notes && prod.notes.base || [])
          .join(" ")
          .toLowerCase();

        if (selFam === "floral" && (allNotes.includes("rose") || allNotes.includes("peony") || allNotes.includes("lily") || allNotes.includes("blossom"))) {
          score += 20;
        } else if (selFam === "woody" && (allNotes.includes("oud") || allNotes.includes("sandalwood") || allNotes.includes("cedar") || allNotes.includes("wood"))) {
          score += 20;
        } else if (selFam === "fresh" && (allNotes.includes("citrus") || allNotes.includes("neroli") || allNotes.includes("bergamot") || allNotes.includes("tea"))) {
          score += 20;
        } else if (selFam === "sweet" && (allNotes.includes("vanilla") || allNotes.includes("amber") || allNotes.includes("tonka") || allNotes.includes("cinnamon"))) {
          score += 20;
        } else {
          score += 10;
        }
      }

      // Occasion match weight (up to 35 pts)
      const prodOccasions = Array.isArray(prod.occasion) ? prod.occasion.map(function (o) { return o.toLowerCase(); }) : [];
      const selOcc = (selectedOccasion || "").toLowerCase();

      if (prodOccasions.includes(selOcc)) {
        score += 35;
      } else {
        // Fallback occasion affinity based on concentration and longevity
        const conc = (prod.concentration || "").toLowerCase();
        if ((selOcc === "evening" || selOcc === "cozy") && (conc.includes("extrait") || prod.price >= 42)) {
          score += 24;
        } else if ((selOcc === "daily" || selOcc === "outdoor") && (prod.price <= 40 || conc.includes("18%"))) {
          score += 24;
        } else {
          score += 12;
        }
      }

      // Intensity & Sillage synergy (up to 20 pts)
      const longevity = parseInt(prod.longevity, 10) || 8;
      if (selOcc === "evening" && longevity >= 10) {
        score += 18;
      } else if (selOcc === "daily" && longevity <= 10) {
        score += 18;
      } else {
        score += 14;
      }

      // Cap and calibration with matrix
      let finalScore = Math.min(score, 98);
      if (matrixEntry) {
        if (prod.id === matrixEntry.primaryId) {
          finalScore = Math.max(finalScore, matrixEntry.score);
        } else if (prod.id === matrixEntry.runnerId) {
          finalScore = Math.max(finalScore, matrixEntry.runnerScore);
        }
      }

      return {
        product: prod,
        score: finalScore
      };
    });

    // Sort descending by score
    scoredProducts.sort(function (a, b) {
      return b.score - a.score;
    });

    const top = scoredProducts[0];
    const runner = scoredProducts[1] || scoredProducts[0];

    return {
      primary: top.product,
      primaryScore: top.score,
      runner: runner.product,
      runnerScore: runner.score
    };
  }

  function getMatchReason(product, selectedOccasion, selectedFamily) {
    const reasons = global.NN_MATCH_REASONS || {};
    const key = product.id + "-" + selectedOccasion;
    if (reasons[key]) {
      return reasons[key];
    }
    return product.title + " blends " + (product.familyTags || product.category) +
      " crafted for " + (selectedOccasion ? selectedOccasion.replace("-", " ") : "everyday") +
      " elegance. Its exquisite balance of top and base notes complements your preference for " +
      selectedFamily + " fragrances.";
  }

  /* ------------------------------------------------------------------------
     DOM Controller
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    const store = global.NNStore;
    const questions = global.NN_QUIZ_QUESTIONS || [];

    // Main DOM elements
    const stepperItem1 = document.getElementById("nn-step-indicator-1");
    const stepperItem2 = document.getElementById("nn-step-indicator-2");
    const stepperItem3 = document.getElementById("nn-step-indicator-3");
    const connector1 = document.getElementById("nn-connector-1");
    const connector2 = document.getElementById("nn-connector-2");

    const alertEl = document.getElementById("nn-sf-alert");
    const alertMsg = document.getElementById("nn-sf-alert-msg");
    const quizPanel = document.getElementById("nn-sf-quiz-panel");
    const navBar = document.getElementById("nn-sf-nav-bar");
    const backBtn = document.getElementById("nn-sf-back-btn");
    const nextBtn = document.getElementById("nn-sf-next-btn");
    const nextText = document.getElementById("nn-sf-next-text");
    const resultPanel = document.getElementById("nn-sf-result-panel");

    if (!quizPanel || !resultPanel) return;

    /* ---- Restore saved state if exists ---- */
    const saved = loadSavedState();
    if (saved) {
      state = saved;
    }

    /* ---- Stepper Synchronizer ---- */
    function updateStepperUI(currentStep) {
      // Step 1
      if (currentStep === 1) {
        stepperItem1.className = "nn-stepper-item active";
        stepperItem1.querySelector(".nn-stepper-num").classList.remove("d-none");
        stepperItem1.querySelector(".nn-stepper-check").classList.add("d-none");

        connector1.classList.remove("completed");

        stepperItem2.className = "nn-stepper-item";
        stepperItem2.querySelector(".nn-stepper-num").classList.remove("d-none");
        stepperItem2.querySelector(".nn-stepper-check").classList.add("d-none");

        connector2.classList.remove("completed");

        stepperItem3.className = "nn-stepper-item";
        stepperItem3.querySelector(".nn-stepper-num").classList.remove("d-none");
        stepperItem3.querySelector(".nn-stepper-check").classList.add("d-none");
      } else if (currentStep === 2) {
        stepperItem1.className = "nn-stepper-item completed";
        stepperItem1.querySelector(".nn-stepper-num").classList.add("d-none");
        stepperItem1.querySelector(".nn-stepper-check").classList.remove("d-none");

        connector1.classList.add("completed");

        stepperItem2.className = "nn-stepper-item active";
        stepperItem2.querySelector(".nn-stepper-num").classList.remove("d-none");
        stepperItem2.querySelector(".nn-stepper-check").classList.add("d-none");

        connector2.classList.remove("completed");

        stepperItem3.className = "nn-stepper-item";
        stepperItem3.querySelector(".nn-stepper-num").classList.remove("d-none");
        stepperItem3.querySelector(".nn-stepper-check").classList.add("d-none");
      } else if (currentStep === 3) {
        stepperItem1.className = "nn-stepper-item completed";
        stepperItem1.querySelector(".nn-stepper-num").classList.add("d-none");
        stepperItem1.querySelector(".nn-stepper-check").classList.remove("d-none");

        connector1.classList.add("completed");

        stepperItem2.className = "nn-stepper-item completed";
        stepperItem2.querySelector(".nn-stepper-num").classList.add("d-none");
        stepperItem2.querySelector(".nn-stepper-check").classList.remove("d-none");

        connector2.classList.add("completed");

        stepperItem3.className = "nn-stepper-item active completed";
        stepperItem3.querySelector(".nn-stepper-num").classList.remove("d-none");
        stepperItem3.querySelector(".nn-stepper-check").classList.add("d-none");
      }
    }

    /* ---- Validation Alert Controller ---- */
    function showAlert(message) {
      if (!alertEl) return;
      alertMsg.textContent = message || "Please select a scent option before continuing.";
      alertEl.classList.remove("d-none");
      alertEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      if (store && store.announce) {
        store.announce(message);
      }
    }

    function hideAlert() {
      if (!alertEl) return;
      alertEl.classList.add("d-none");
    }

    /* ---- Render Quiz Step (Step 1 or Step 2) ---- */
    function renderStep(stepNumber) {
      hideAlert();
      updateStepperUI(stepNumber);

      const qIndex = stepNumber - 1;
      const question = questions[qIndex];
      if (!question) return;

      quizPanel.classList.remove("d-none");
      resultPanel.classList.add("d-none");
      navBar.classList.remove("d-none");

      // Update Next button label
      if (stepNumber === 1) {
        nextText.textContent = "Next";
        backBtn.setAttribute("aria-label", "Reset selection or go back");
      } else {
        nextText.textContent = "See My Scent";
        backBtn.setAttribute("aria-label", "Go back to Question 1");
      }

      const currentSelected = state.answers[question.id];

      // Build 4-Column Card Grid HTML
      let html = "";
      html += '<h2 class="nn-sf-question" id="quiz-question-heading">' + store.escapeHTML(question.question) + '</h2>';
      html += '<fieldset class="nn-sf-fieldset" role="radiogroup" aria-labelledby="quiz-question-heading">';
      html += '<legend class="visually-hidden">' + store.escapeHTML(question.question) + '</legend>';
      html += '<div class="nn-sf-card-grid">';

      question.options.forEach(function (opt, idx) {
        const isChecked = currentSelected === opt.value;
        const cardId = "quiz-opt-" + stepNumber + "-" + idx;
        const descId = "desc-" + stepNumber + "-" + idx;

        html += '<label class="nn-sf-card ' + (isChecked ? 'selected' : '') + '" for="' + cardId + '" data-value="' + store.escapeHTML(opt.value) + '">';
        html += '  <input type="radio" id="' + cardId + '" name="nn-quiz-radio-' + stepNumber + '" value="' + store.escapeHTML(opt.value) + '" class="visually-hidden" ' + (isChecked ? 'checked' : '') + ' aria-describedby="' + descId + '">';
        html += '  <div class="nn-sf-card-img-wrap">';
        html += '    <img src="' + store.resolveAssetPath(opt.image) + '" alt="' + store.escapeHTML(opt.alt) + '" class="nn-sf-card-img" loading="lazy">';
        html += '  </div>';
        html += '  <div class="nn-sf-card-label">';
        html += '    <span class="nn-sf-card-radio-dot" aria-hidden="true"></span>';
        html += '    <span class="nn-sf-card-name">' + store.escapeHTML(opt.label) + '</span>';
        html += '    <span class="nn-sf-card-desc" id="' + descId + '">' + store.escapeHTML(opt.description || '') + '</span>';
        html += '  </div>';
        html += '</label>';
      });

      html += '</div>';
      html += '</fieldset>';

      quizPanel.innerHTML = html;

      // Bind selection interactions
      const cards = quizPanel.querySelectorAll(".nn-sf-card");
      cards.forEach(function (card) {
        const radio = card.querySelector('input[type="radio"]');

        // Selection via click / change
        card.addEventListener("click", function () {
          selectOption(question.id, radio.value, cards, card, radio);
        });

        // Accessible Keyboard: Enter / Space triggers selection
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            radio.checked = true;
            selectOption(question.id, radio.value, cards, card, radio);
          }
        });

        radio.addEventListener("change", function () {
          if (radio.checked) {
            selectOption(question.id, radio.value, cards, card, radio);
          }
        });
      });
    }

    function selectOption(questionKey, val, allCards, activeCard, radioInput) {
      state.answers[questionKey] = val;
      allCards.forEach(function (c) {
        c.classList.remove("selected");
        const r = c.querySelector('input[type="radio"]');
        if (r && r !== radioInput) r.checked = false;
      });
      activeCard.classList.add("selected");
      radioInput.checked = true;
      hideAlert();
      saveState();
    }

    /* ---- Render Step 3: Result View ---- */
    function renderResult(matchResult) {
      hideAlert();
      updateStepperUI(3);

      quizPanel.classList.add("d-none");
      navBar.classList.add("d-none");
      resultPanel.classList.remove("d-none");

      const primary = matchResult.primary;
      const primaryScore = matchResult.primaryScore;
      const runner = matchResult.runner;
      const runnerScore = matchResult.runnerScore;

      const occasion = state.answers.occasion || "daily";
      const family = state.answers.family || "Floral";
      const whyMatched = getMatchReason(primary, occasion, family);

      // Price formatted: display Rs. 8,500 along with international price
      const pricePKR = primary.pricePKR || "Rs. 8,500";
      const baseVariant = primary.variants ? primary.variants[0] : { price: primary.price || 45, size: "50 ml" };
      const formattedBase = store ? store.formatPrice(baseVariant.price) : "$" + baseVariant.price;

      const detailsHref = "product-details.html?id=" + encodeURIComponent(primary.id);
      const runnerHref = "product-details.html?id=" + encodeURIComponent(runner.id);

      let html = "";
      html += '<div class="nn-sf-result-card">';
      html += '  <div class="row g-0 align-items-center">';

      // Left Column: Bottle Image with Match Score Badge
      html += '    <div class="col-md-5">';
      html += '      <div class="nn-sf-result-img-wrap">';
      html += '        <img src="' + store.resolveAssetPath(primary.gallery ? primary.gallery[0].src : primary.image) + '" alt="' + store.escapeHTML(primary.gallery ? primary.gallery[0].alt : primary.title) + '" class="nn-sf-result-img">';
      html += '        <div class="nn-sf-match-badge" aria-label="' + primaryScore + '% Match">';
      html += '          <span class="fs-6 fw-bold">' + primaryScore + '%</span> Match';
      html += '        </div>';
      html += '      </div>';
      html += '    </div>';

      // Right Column: Scent Details & Actions
      html += '    <div class="col-md-7 p-4 p-lg-5">';
      html += '      <p class="text-uppercase small mb-1" style="letter-spacing: 0.18em; color: var(--nn-muted);">Your Curated Match</p>';
      html += '      <h2 class="nn-sf-result-name" id="nn-result-title">' + store.escapeHTML(primary.title) + '</h2>';
      html += '      <p class="text-muted small mb-2">' + store.escapeHTML(primary.familyTags || primary.category) + '</p>';

      // Price Display
      html += '      <div class="nn-sf-result-price mb-3">';
      html += '        <span>' + store.escapeHTML(pricePKR) + '</span>';
      html += '        <span class="text-muted fs-6 fw-normal ms-2">(' + formattedBase + ' &bull; ' + store.escapeHTML(baseVariant.size) + ')</span>';
      html += '      </div>';

      // Why it matched editorial quote
      html += '      <div class="p-3 mb-4 rounded" style="background-color: var(--nn-cream-soft); border-left: 3px solid var(--nn-obsidian);">';
      html += '        <p class="small text-uppercase fw-semibold mb-1" style="letter-spacing: 0.08em; color: var(--nn-muted);">Why This Matched Your Taste</p>';
      html += '        <p class="small mb-0" style="color: var(--nn-charcoal); line-height: 1.55;">' + store.escapeHTML(whyMatched) + '</p>';
      html += '      </div>';

      // Fragrance Notes Highlights
      if (primary.notes) {
        html += '      <div class="mb-4 small">';
        html += '        <span class="fw-semibold me-2 d-inline-block">Key Notes:</span>';
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

      // 3 Action Buttons (View Product Details, Add to Cart, Retake Quiz)
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
      html += '        <button type="button" class="nn-btn-ghost rounded-pill" id="nn-sf-retake-btn">';
      html += '          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
      html += '            <polyline points="1 4 1 10 7 10"></polyline>';
      html += '            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>';
      html += '          </svg>';
      html += '          <span>Retake Quiz</span>';
      html += '        </button>';
      html += '      </div>';

      html += '    </div>';
      html += '  </div>';
      html += '</div>';

      // Secondary Runner-Up Recommendation Card
      if (runner && runner.id !== primary.id) {
        const runnerPricePKR = runner.pricePKR || "Rs. 7,500";
        html += '<div class="nn-sf-runner-wrap">';
        html += '  <h3 class="nn-serif fs-4 mb-3">Runner-Up Recommendation</h3>';
        html += '  <div class="nn-sf-runner-card d-flex align-items-center justify-content-between flex-wrap gap-3">';
        html += '    <div class="d-flex align-items-center gap-3">';
        html += '      <img src="' + store.resolveAssetPath(runner.gallery ? runner.gallery[0].src : runner.image) + '" alt="' + store.escapeHTML(runner.title) + '" class="nn-sf-runner-img rounded">';
        html += '      <div>';
        html += '        <div class="d-flex align-items-center gap-2 mb-1">';
        html += '          <h4 class="nn-serif fs-5 mb-0"><a href="' + runnerHref + '">' + store.escapeHTML(runner.title) + '</a></h4>';
        html += '          <span class="nn-sf-runner-score">' + runnerScore + '% Match</span>';
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

      resultPanel.innerHTML = html;
      resultPanel.focus();

      // Bind Action: Add to Cart (Primary)
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

      // Bind Action: Add to Cart (Runner-up)
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

      // Bind Action: Retake Quiz
      const retakeBtn = document.getElementById("nn-sf-retake-btn");
      if (retakeBtn) {
        retakeBtn.addEventListener("click", function () {
          clearState();
          renderStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    }

    /* ---- Next Button Handler ---- */
    nextBtn.addEventListener("click", function () {
      const qIndex = state.currentStep - 1;
      const question = questions[qIndex];
      if (!question) return;

      const chosenVal = state.answers[question.id];

      // Edge case validation: require an answer before advancing
      if (!chosenVal) {
        showAlert("Please select a scent option before continuing.");
        return;
      }

      hideAlert();

      if (state.currentStep === 1) {
        state.currentStep = 2;
        saveState();
        renderStep(2);
        window.scrollTo({ top: 200, behavior: "smooth" });
      } else if (state.currentStep === 2) {
        // Calculate result
        const matchResult = calculateScentMatch(state.answers.family, state.answers.occasion);
        state.currentStep = 3;
        state.result = {
          primaryId: matchResult.primary.id,
          primaryScore: matchResult.primaryScore,
          runnerId: matchResult.runner.id,
          runnerScore: matchResult.runnerScore
        };
        saveState();
        renderResult(matchResult);
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
    });

    /* ---- Back Button Handler ---- */
    backBtn.addEventListener("click", function () {
      hideAlert();
      if (state.currentStep === 2) {
        state.currentStep = 1;
        saveState();
        renderStep(1);
        window.scrollTo({ top: 200, behavior: "smooth" });
      } else if (state.currentStep === 1) {
        // If selection exists, reset selection cleanly; else navigate back
        if (state.answers.family) {
          state.answers.family = null;
          saveState();
          renderStep(1);
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "shop.html";
        }
      }
    });

    /* ---- Initial Page Load Router ---- */
    if (state.currentStep === 3 && state.result && state.result.primaryId) {
      const products = global.NN_PRODUCTS || [];
      const primary = products.find(function (p) { return p.id === state.result.primaryId; });
      const runner = products.find(function (p) { return p.id === state.result.runnerId; }) || primary;
      if (primary) {
        renderResult({
          primary: primary,
          primaryScore: state.result.primaryScore || 96,
          runner: runner,
          runnerScore: state.result.runnerScore || 80
        });
      } else {
        renderStep(1);
      }
    } else if (state.currentStep === 2) {
      renderStep(2);
    } else {
      renderStep(1);
    }
  });
})(window);