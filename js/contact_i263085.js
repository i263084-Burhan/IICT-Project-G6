/**
 * Notes & Noir Fragrances — Contact & Order Tracking Controller (contact_i263085.js)
 * Roll Number: i263085
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const store = window.NNStore;
    if (!store) return;

    const contactForm = document.getElementById("nn-contact-form");
    if (contactForm) {
      const nameEl = document.getElementById("nn-contact-name");
      const emailEl = document.getElementById("nn-contact-email");
      const msgEl = document.getElementById("nn-contact-message");
      const errEl = document.getElementById("nn-contact-error");
      const successEl = document.getElementById("nn-contact-success");

      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const nameVal = nameEl.value.trim();
        const emailVal = emailEl.value.trim();
        const msgVal = msgEl.value.trim();

        const valid =
          nameVal.length >= 2 &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) &&
          msgVal.length >= 10;

        errEl.classList.toggle("visible", !valid);
        if (!valid) return;

        contactForm.reset();
        successEl.classList.remove("d-none");
        store.showToast("Message received. Our concierge will reply within 24 hours.");
      });
    }

    const trackForm = document.getElementById("nn-track-form");
    if (trackForm) {
      const inputEl = document.getElementById("nn-track-id");
      const resultEl = document.getElementById("nn-track-result");

      trackForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const code = inputEl.value.trim().toUpperCase();
        if (code.length < 4) {
          resultEl.innerHTML =
            '<span class="text-danger small">Please enter a valid order reference (e.g., NN-482910).</span>';
          return;
        }
        resultEl.innerHTML =
          '<div class="p-3 rounded border bg-white mt-2" style="border-color: var(--nn-taupe) !important;">' +
          '<div class="small fw-semibold">Order ' +
          store.escapeHTML(code) +
          "</div>" +
          '<div class="small text-muted">Status: Dispatched from Lahore Atelier — Estimated delivery within 2–3 business days.</div>' +
          "</div>";
      });
    }
  });
})();
