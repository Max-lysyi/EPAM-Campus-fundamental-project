var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchProducts } from "./catalog.js";
import { addToCart } from "./store.js";
export function initCarousel() {
    console.log('Карусель ініціалізовано: старий автоскрол видалено!');
    const container = document.querySelector('.travel-suitcases__grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (!container || !prevBtn || !nextBtn) {
        return;
    }
    nextBtn.addEventListener('click', () => {
        const firstCard = container.querySelector('.travel-suitcases__item');
        if (!firstCard)
            return;
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const scrollStep = firstCard.offsetWidth + gap;
        container.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
        const firstCard = container.querySelector('.travel-suitcases__item');
        if (!firstCard)
            return;
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const scrollStep = firstCard.offsetWidth + gap;
        container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
}
export function initHamburger() {
    const hamburgerBtn = document.querySelector('.header__hamburger-btn');
    const mobileNav = document.querySelector('.header__mobile-nav');
    hamburgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
}
export function renderSelectedProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const grid = document.getElementById('selected-products-grid');
        if (!grid)
            return;
        const products = yield fetchProducts();
        const selectedProducts = products.filter((product) => product.blocks.indexOf("Selected Products") !== -1);
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
            const target = e.target;
            const card = target.closest('.product-card');
            if (!card)
                return;
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
                    setTimeout(() => { if (target)
                        target.textContent = originalText; }, 2000);
                }
                return;
            }
            if (id)
                window.location.href = `./html/product.html?id=${id}`;
        });
    });
}
export function renderNewArrivals() {
    return __awaiter(this, void 0, void 0, function* () {
        const grid = document.getElementById('new-arrivals-grid');
        if (!grid)
            return;
        const products = yield fetchProducts();
        const newArrivals = products.filter((product) => product.blocks.indexOf("New Products Arrival") !== -1);
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
            const target = e.target;
            const card = target.closest('.product-card');
            if (!card)
                return;
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
                    setTimeout(() => { if (target)
                        target.textContent = originalText; }, 2000);
                }
                return;
            }
            if (id)
                window.location.href = `./html/product.html?id=${id}`;
        });
    });
}
