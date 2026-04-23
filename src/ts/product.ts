import { fetchProducts } from './catalog.js';
import { addToCart } from './store.js';

export async function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return;

  const products = await fetchProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    const container = document.querySelector('.product-details__container');
    if (container) container.innerHTML = '<h2 style="padding: 100px; text-align: center;">Product not found.</h2>';
    return;
  }

  
  const mainImg = document.getElementById('product-main-img') as HTMLImageElement;
  const title = document.getElementById('product-title');
  const price = document.getElementById('product-price');
  const ratingStars = document.getElementById('product-rating-stars');
  const thumbsContainer = document.getElementById('product-thumbnails');

  if (mainImg) mainImg.src = product.imageUrl;
  if (title) title.textContent = product.name;
  if (price) price.textContent = `$${product.price}`;
  
  if (ratingStars) {
    const ratingNum = Math.round(product.rating);
    ratingStars.textContent = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
  }

  if (thumbsContainer) {
    thumbsContainer.innerHTML = `
      <div class="thumb active"><img src="${product.imageUrl}" alt="Thumb 1"></div>
    `;
  }

  
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyInput = document.getElementById('qty-input') as HTMLInputElement;

  qtyMinus?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) qtyInput.value = (val - 1).toString();
  });

  qtyPlus?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    qtyInput.value = (val + 1).toString();
  });

  
  const addBtn = document.getElementById('add-to-cart-btn');
  addBtn?.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value) || 1;
    const sizeSelect = document.getElementById('size-select') as HTMLSelectElement;
    const colorSelect = document.getElementById('color-select') as HTMLSelectElement;
    
    const size = sizeSelect ? sizeSelect.value : '';
    const color = colorSelect ? colorSelect.value : '';
    const cartItemId = `${product.id}_${color}_${size}`;

    addToCart({
      id: product.id,
      cartItemId: cartItemId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: qty,
      size: size,
      color: color
    });
    
    const originalText = addBtn.textContent;
    addBtn.textContent = 'Added to Cart!';
    setTimeout(() => {
      addBtn.textContent = originalText;
    }, 2000);
  });

  
  const tabs = document.querySelectorAll('.tab-trigger');
  const panels = document.querySelectorAll('.content-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => {
        p.classList.remove('active');
        (p as HTMLElement).style.display = 'none';
      });

      
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      if (targetId) {
        const panel = document.getElementById(`tab-${targetId}`);
        if (panel) {
          panel.classList.add('active');
          panel.style.display = 'flex';
        }
      }
    });
  });

  
  const reviewForm = document.getElementById('review-form') as HTMLFormElement;
  const reviewSuccess = document.getElementById('review-success');
  
  reviewForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (reviewSuccess) {
      reviewSuccess.style.display = 'block';
      setTimeout(() => {
        reviewSuccess.style.display = 'none';
      }, 4000);
    }
    reviewForm.reset();
  });

  
  renderRecommended(products, id);
}

function renderRecommended(allProducts: any[], currentId: string) {
  const container = document.getElementById('recommended-products-grid');
  if (!container) return;

  const otherProducts = allProducts.filter(p => p.id !== currentId);
  for (let i = otherProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [otherProducts[i], otherProducts[j]] = [otherProducts[j], otherProducts[i]];
  }

  const selected = otherProducts.slice(0, 4);
  container.innerHTML = selected.map(product => {
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

  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const card = target.closest('.product-card');
    if (!card) return;
    
    const id = card.getAttribute('data-id');
    
    if (target.classList.contains('add-to-cart-btn')) {
      const product = allProducts.find(p => p.id === id);
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

    if (id) window.location.href = `./product.html?id=${id}`;
  });
}