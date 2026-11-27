/**
 * Notes & Noir Fragrances — Blog Journal Controller (blog_i263085.js)
 * Roll Number: i263085
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const posts = window.NN_BLOG_POSTS || [];
    const store = window.NNStore;
    const grid = document.getElementById("nn-blog-grid");
    if (!grid || !store) return;

    const filterBtns = Array.from(document.querySelectorAll(".nn-blog-filter"));
    let activeCat = "All";

    function renderPosts() {
      const filtered =
        activeCat === "All"
          ? posts
          : posts.filter(function (p) {
              return p.category === activeCat;
            });

      filterBtns.forEach(function (btn) {
        const match = btn.dataset.category === activeCat;
        btn.classList.toggle("active", match);
        btn.setAttribute("aria-pressed", match ? "true" : "false");
      });

      grid.innerHTML = filtered
        .map(function (post) {
          return (
            '<div class="col-md-4">' +
            '<article class="nn-product-card">' +
            '<div class="nn-product-card-img" style="aspect-ratio: 16 / 10;">' +
            '<img src="' +
            store.escapeHTML(store.resolveAssetPath(post.image)) +
            '" alt="' +
            store.escapeHTML(post.title) +
            '">' +
            "</div>" +
            '<div class="nn-product-card-body">' +
            '<div class="d-flex justify-content-between small text-muted mb-2">' +
            "<span>" +
            store.escapeHTML(post.category) +
            "</span><span>" +
            store.escapeHTML(post.readTime) +
            "</span></div>" +
            '<h2 class="nn-serif fs-3 mb-2">' +
            store.escapeHTML(post.title) +
            "</h2>" +
            '<p class="small text-muted mb-3">' +
            store.escapeHTML(post.excerpt) +
            "</p>" +
            '<div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top" style="border-color: var(--nn-taupe) !important;">' +
            '<span class="small text-muted">' +
            store.escapeHTML(post.date) +
            "</span>" +
            '<a href="product-details.html?id=noir-oud" class="small text-decoration-underline">Explore Noir Oud</a>' +
            "</div></div></article></div>"
          );
        })
        .join("");
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeCat = btn.dataset.category;
        renderPosts();
      });
    });

    renderPosts();
  });
})();
