import { fetchProducts } from "./catalog.js";
import { addToCart } from "./store.js";

export function initCarousel() {

  
  const container = document.querySelector('.travel-suitcases__grid') as HTMLElement;
  const prevBtn = document.querySelector('.prev-btn') as HTMLButtonElement;
  const nextBtn = document.querySelector('.next-btn') as HTMLButtonElement;

  
  if (!container || !prevBtn || !nextBtn) {
    
    return;
  }

  
  nextBtn.addEventListener('click', () => {
    const firstCard = container.querySelector('.travel-suitcases__item') as HTMLElement;
    if (!firstCard) return;

    
    const gap = parseInt(window.getComputedStyle(container).gap) || 0;
    const scrollStep = firstCard.offsetWidth + gap;

    
    container.scrollBy({ left: scrollStep, behavior: 'smooth' });
  });

  
  prevBtn.addEventListener('click', () => {
    const firstCard = container.querySelector('.travel-suitcases__item') as HTMLElement;
    if (!firstCard) return;

    const gap = parseInt(window.getComputedStyle(container).gap) || 0;
    const scrollStep = firstCard.offsetWidth + gap;

    
    container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
  });
}

export function initHamburger() {
  const hamburgerBtn = document.querySelector('.header__hamburger-btn') as HTMLButtonElement;
  const mobileNav = document.querySelector('.header__mobile-nav') as HTMLElement;

  hamburgerBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
  });
}


export async function renderSelectedProducts() {
  const grid = document.getElementById('selected-products-grid');
  if (!grid) return;

  const products = await fetchProducts();

  
  const selectedProducts = products.filter((product) => 
    product.blocks.indexOf("Selected Products") !== -1
  );

  const htmlString = selectedProducts.map((product) => {
    const badgeHtml = product.salesStatus ? `<span class="badge">SALE</span>` : '';
    return `
      <div class="product-card" data-id="${product.id}">
        ${badgeHtml}
        <div class="product-card__image">
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-card__info">
          <h4>${product.name}</h4>
          <p class="price">$${product.price}</p>
          <button class="main-btn add-to-cart-btn">Add To Cart</button>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = htmlString;

  grid.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.product-card');
    if (!card) return;
    
    const id = card.getAttribute('data-id');
    
    if (target.classList.contains('add-to-cart-btn')) {
      const product = products.find(p => p.id === id);
      if (product) {
        addToCart({
          id: product.id,
          cartItemId: `${product.id}_${product.color}_${product.size}`,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          color: product.color,
          size: product.size
        });
        const originalText = target.textContent;
        target.textContent = 'Added to Cart!';
        setTimeout(() => { if (target) target.textContent = originalText; }, 2000);
      }
      return;
    }

    if (id) window.location.href = `./html/product.html?id=${id}`;
  });
}

export async function renderNewArrivals() {
  const grid = document.getElementById('new-arrivals-grid');
  if (!grid) return;

  const products = await fetchProducts();

  
  const newArrivals = products.filter((product) => 
    product.blocks.indexOf("New Products Arrival") !== -1
  );

  const htmlString = newArrivals.map((product) => {
    const badgeHtml = product.salesStatus ? `<span class="badge">SALE</span>` : '';
    return `
      <div class="product-card" data-id="${product.id}">
        ${badgeHtml}
        <div class="product-card__image">
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-card__info">
          <h4>${product.name}</h4>
          <p class="price">$${product.price}</p>
          <button class="main-btn add-to-cart-btn">Add To Cart</button>
        </div>
      </div>
    `;
  }).join('');

  grid.innerHTML = htmlString;

  grid.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.product-card');
    if (!card) return;
    
    const id = card.getAttribute('data-id');
    
    if (target.classList.contains('add-to-cart-btn')) {
      const product = products.find(p => p.id === id);
      if (product) {
        addToCart({
          id: product.id,
          cartItemId: `${product.id}_${product.color}_${product.size}`,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
          color: product.color,
          size: product.size
        });
        const originalText = target.textContent;
        target.textContent = 'Added to Cart!';
        setTimeout(() => { if (target) target.textContent = originalText; }, 2000);
      }
      return;
    }

    if (id) window.location.href = `./html/product.html?id=${id}`;
  });
}