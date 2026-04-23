import { initCarousel } from './home.js';
import { renderCatalog } from './catalog.js';
import { initModal } from './modal.js';
import { updateCartBadge } from './store.js';
import { initCartPage } from './cart.js';
import { initHamburger } from './home.js';
import { renderSelectedProducts } from './home.js';
import { renderNewArrivals } from './home.js';
import { initProductPage } from './product.js';

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  renderCatalog();
  initModal();
  updateCartBadge();
  initCartPage();
  initHamburger();
  renderSelectedProducts();
  renderNewArrivals();

  if (window.location.pathname.includes('product.html')) {
    initProductPage();
  }
});