
import { getCart, getCartTotals, updateQuantity, removeFromCart, clearCart, updateCartBadge } from './store.js';

export function initCartPage() {
  const cartContainerSection = document.getElementById('cart-container-section');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  if (!cartContainerSection || !emptyCartMessage) return; 

  renderCart();

  const clearBtn = document.getElementById('btn-clear-cart');
  clearBtn?.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      renderCart();
    }
  });
  
  const checkoutBtn = document.getElementById('btn-checkout');
  checkoutBtn?.addEventListener('click', () => {
    const total = getCartTotals().total;
    if (total > 0) {
      alert('Thank you for your purchase.');
      clearCart();
      renderCart();
    }
  });
}

function renderCart() {
  const cartContainerSection = document.getElementById('cart-container-section');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const itemsWrapper = document.getElementById('cart-items-wrapper');
  
  if (!cartContainerSection || !emptyCartMessage || !itemsWrapper) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartContainerSection.style.display = 'none';
    emptyCartMessage.style.display = 'block';
    updateCartBadge();
    return;
  }
  
  cartContainerSection.style.display = 'block';
  emptyCartMessage.style.display = 'none';
  
  let html = '';
  cart.forEach(item => {
    html += `
      <div class="cart-item-row" data-id="${item.cartItemId}">
        <div class="item-img"><img src="${item.imageUrl}" alt="${item.name}"></div>
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>Color: ${item.color || 'Default'} | Size: ${item.size || 'Standard'}</p>
        </div>
        <div class="item-price">$${item.price}</div>
        <div class="item-qty">
          <button class="qty-btn btn-minus">-</button>
          <input type="text" value="${item.quantity}" class="qty-val" readonly>
          <button class="qty-btn btn-plus">+</button>
        </div>
        <div class="item-total">$${item.price * item.quantity}</div>
        <div class="item-delete">
          <button class="btn-delete" title="Remove Item">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
  });
  
  itemsWrapper.innerHTML = html;
  
  bindCartEvents();
  updateTotalsUi();
  updateCartBadge();
}

function bindCartEvents() {
  const wrapper = document.getElementById('cart-items-wrapper');
  if(!wrapper) return;
  
  wrapper.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest('.cart-item-row') as HTMLElement;
    if(!row) return;
    
    const id = row.getAttribute('data-id');
    if(!id) return;
    
    if (target.closest('.btn-plus')) {
      const currentQty = parseInt((row.querySelector('.qty-val') as HTMLInputElement).value);
      updateQuantity(id, currentQty + 1);
      renderCart();
    } 
    else if (target.closest('.btn-minus')) {
      const currentQty = parseInt((row.querySelector('.qty-val') as HTMLInputElement).value);
      updateQuantity(id, currentQty - 1);
      renderCart();
    }
    else if (target.closest('.btn-delete')) {
      removeFromCart(id);
      renderCart();
    }
  });
}

function updateTotalsUi() {
  const totals = getCartTotals();
  
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');
  const discountRow = document.getElementById('discount-row');
  
  if (subtotalEl) subtotalEl.textContent = '$' + totals.subtotal.toFixed(2);
  if (shippingEl) shippingEl.textContent = totals.shipping > 0 ? '$' + totals.shipping : 'Free';
  if (totalEl) totalEl.textContent = '$' + totals.total.toFixed(2);
  
  if (totals.discount > 0 && discountEl && discountRow) {
    discountRow.style.display = 'flex';
    discountEl.textContent = '-$' + totals.discount.toFixed(2);
  } else if (discountRow) {
    discountRow.style.display = 'none';
  }
}
