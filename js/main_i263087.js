/**
 * Notes & Noir — Home Page Interactions
 * Script: js/main_i263087.js
 * Roll Number: i263087
 */

document.addEventListener('DOMContentLoaded', () => {
  const cartBadge = document.getElementById('cartBadgeCount');
  const addCartButtons = document.querySelectorAll('.btn-add-cart');
  const searchForm = document.getElementById('headerSearchForm');
  const searchInput = document.getElementById('headerSearchInput');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  const newsletterStatus = document.getElementById('newsletterStatus');
  const toastBanner = document.getElementById('toastBanner');
  const headerCartBtn = document.getElementById('headerCartBtn');

  let cartCount = Number(localStorage.getItem('nn_cart_count_i263087') || '0');
  let toastTimer = null;

  const updateCartBadge = () => {
    if (cartBadge) {
      cartBadge.textContent = String(cartCount);
    }
  };

  const showToast = (message) => {
    if (!toastBanner) return;
    toastBanner.textContent = message;
    toastBanner.classList.add('visible');
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toastBanner.classList.remove('visible');
    }, 2600);
  };

  updateCartBadge();

  addCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.getAttribute('data-product') || 'Fragrance';
      cartCount += 1;
      localStorage.setItem('nn_cart_count_i263087', String(cartCount));
      updateCartBadge();

      button.classList.add('added');
      const originalText = button.textContent;
      button.textContent = 'Added';
      setTimeout(() => {
        button.classList.remove('added');
        button.textContent = originalText;
      }, 1100);

      showToast(`${productName} added to your bag.`);
    });
  });

  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', () => {
      showToast(
        cartCount === 0
          ? 'Your fragrance bag is currently empty.'
          : `You have ${cartCount} fragrance${cartCount === 1 ? '' : 's'} in your bag.`
      );
    });
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = searchInput.value.trim();
      if (!query) {
        showToast('Enter a scent or note to search Notes & Noir.');
        return;
      }
      window.location.href = `pages/shop-all.html?search=${encodeURIComponent(query)}`;
    });
  }

  if (newsletterForm && newsletterEmail && newsletterStatus) {
    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = newsletterEmail.value.trim();
      if (!email || !email.includes('@')) {
        newsletterStatus.textContent = 'Please enter a valid email address.';
        return;
      }
      newsletterStatus.textContent = 'Welcome to the Notes & Noir private list.';
      newsletterEmail.value = '';
    });
  }
});
