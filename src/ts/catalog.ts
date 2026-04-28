import { addToCart } from './store.js';

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

interface FilterState {
  category: string | null;
  color: string | null;
  size: string | null;
  salesStatus: boolean | null;
}

let allProducts: Product[] = [];
let filteredProducts: Product[] = [];
let currentPage = 1;
const itemsPerPage = 12;
let currentSort = 'default';

let filters: FilterState = {
  category: null,
  color: null,
  size: null,
  salesStatus: null
};

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/src/assets/data.json'); 
    const data = await response.json();
    return data.data; 
  } catch {
  
    return [];
  }
}

export async function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return; 

  allProducts = await fetchProducts();
  filteredProducts = [...allProducts];

  
  grid.addEventListener('click', (e) => {
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

  setupFilters();
  setupSorting();
  setupSearch();
  
  renderTopBestSets();
  applyState();
}

function setupFilters() {
  const filterMenus = document.querySelectorAll('.filter-menu');
  const resetBtn = document.getElementById('reset-filters');

  filterMenus.forEach(menu => {
    menu.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'li') {
        const filterType = target.getAttribute('data-filter') as keyof FilterState;
        let filterValue: string | boolean = target.getAttribute('data-value')!;

        
        if (filterType === 'salesStatus') {
          filterValue = filterValue === 'true';
        }

        
        const allLis = menu.querySelectorAll('li');
        allLis.forEach(li => li.classList.remove('selected'));
        target.classList.add('selected');

        
        (filters as Record<keyof FilterState, string | boolean | null>)[filterType] = filterValue;
        
        currentPage = 1; 
        applyState();
      }
    });
  });

  resetBtn?.addEventListener('click', () => {
    filters = { category: null, color: null, size: null, salesStatus: null };
    document.querySelectorAll('.filter-menu li').forEach(li => li.classList.remove('selected'));
    currentPage = 1;
    applyState();
  });
}

function setupSorting() {
  const sortSelect = document.querySelector('.sort-box select') as HTMLSelectElement;
  sortSelect?.addEventListener('change', (e) => {
    currentSort = (e.target as HTMLSelectElement).value;
    currentPage = 1;
    applyState();
  });
}

function setupSearch() {
  const searchInput = document.querySelector('.sidebar-search input') as HTMLInputElement;
  const searchBtn = document.querySelector('.sidebar-search button');
  const modal = document.getElementById('not-found-modal');
  const closeModalBtn = document.querySelector('.close-modal');

  const executeSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    const matchedProducts = allProducts.filter(p => p.name.toLowerCase().includes(query));
    if (matchedProducts.length > 0) {
      window.location.href = `./product.html?id=${matchedProducts[0].id}`;
    } else if(modal) {
      modal.style.display = 'flex';
    }
  };

  searchBtn?.addEventListener('click', executeSearch);
  searchInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') executeSearch();
  });

  closeModalBtn?.addEventListener('click', () => {
    if(modal) modal.style.display = 'none';
  });
  
  
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function applyState() {
  
  filteredProducts = allProducts.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.color && p.color !== filters.color) return false;
    if (filters.size && p.size !== filters.size) return false;
    if (filters.salesStatus !== null && p.salesStatus !== filters.salesStatus) return false;
    return true;
  });

  
  filteredProducts = filteredProducts.sort((a, b) => {
    switch (currentSort) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'popular': return b.popularity - a.popularity;
      case 'rating': return b.rating - a.rating;
      default: return 0; 
    }
  });

  
  renderGrid();
  updatePagination();
  updateResultsText();
}

function renderGrid() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productsToRender = filteredProducts.slice(startIndex, endIndex);

  if (productsToRender.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products match your criteria.</p>';
    return;
  }

  grid.innerHTML = productsToRender.map((product) => {
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
}

function updatePagination() {
  const paginationContainer = document.getElementById('catalog-pagination');
  if (!paginationContainer) return;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let html = '';
  
  if (currentPage > 1) {
    html += `<a href="#" class="page-prev" data-page="${currentPage - 1}"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg> PREV</a>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    html += `<a href="#" class="page-link ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</a>`;
  }

  
  if (currentPage < totalPages) {
    html += `<a href="#" class="page-next" data-page="${currentPage + 1}">NEXT <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></a>`;
  }

  paginationContainer.innerHTML = html;

  
  paginationContainer.querySelectorAll('a').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const page = parseInt(btn.getAttribute('data-page')!);
      if (!isNaN(page)) {
        currentPage = page;
        applyState();
        document.querySelector('.catalog-main')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function updateResultsText() {
  const resultsText = document.getElementById('catalog-results-text');
  if (!resultsText) return;

  const total = filteredProducts.length;
  if (total === 0) {
    resultsText.textContent = `Showing 0 Results`;
    return;
  }

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, total);
  
  resultsText.textContent = `Showing ${start}-${end} Of ${total} Results`;
}

function renderTopBestSets() {
  const topSetsList = document.getElementById('top-sets-list'); 
  if (!topSetsList) return;

  const setsProducts = allProducts.filter(p => p.category === 'luggage sets' || p.category === 'suitcases');
  
  
  for (let i = setsProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [setsProducts[i], setsProducts[j]] = [setsProducts[j], setsProducts[i]];
  }
  
  const randomSets = setsProducts.slice(0, 5);

  if (randomSets.length === 0) {
    topSetsList.innerHTML = '<p>No sets available.</p>';
    return;
  }

  const setsHtmlString = randomSets.map((product) => {
    const ratingNum = Math.round(product.rating);
    const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);
    
    return `
      <div class="best-set-item">
        <div class="img-wrap">
          <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="info">
          <p>${product.name}</p>
          <div class="rating">${stars}</div>
          <span class="price">$${product.price}</span>
        </div>
      </div>
    `;
  }).join('');
  
  topSetsList.innerHTML = setsHtmlString;
}