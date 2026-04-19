var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('../assets/data.json');
            const data = yield response.json();
            return data.data;
        }
        catch (error) {
            console.error('Помилка завантаження товарів:', error);
            return [];
        }
    });
}
export function renderCatalog() {
    return __awaiter(this, void 0, void 0, function* () {
        const grid = document.getElementById('catalog-grid');
        if (!grid)
            return;
        const products = yield fetchProducts();
        const htmlString = products.map((product) => {
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
    });
}
