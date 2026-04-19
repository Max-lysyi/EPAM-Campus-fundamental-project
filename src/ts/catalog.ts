interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    color: string;
    size: string;
    salesStatus: boolean;
    rating: number;
    popularity: number;
    blocks: string[];
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('../assets/data.json'); 
    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error('Помилка завантаження товарів:', error);
    return [];
  }
}

export async function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  
  if (!grid) return; 

  const products = await fetchProducts();

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
}

