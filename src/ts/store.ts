
export interface CartItem {
  id: string;
  cartItemId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color?: string;
  size?: string;
}

const CART_KEY = 'best_shop_cart';

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find(x => x.cartItemId === item.cartItemId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function updateQuantity(cartItemId: string, newQty: number): void {
  let cart = getCart();
  if (newQty <= 0) {
    cart = cart.filter(x => x.cartItemId !== cartItemId);
  } else {
    const existing = cart.find(x => x.cartItemId === cartItemId);
    if (existing) existing.quantity = newQty;
  }
  saveCart(cart);
}

export function removeFromCart(cartItemId: string): void {
  let cart = getCart();
  cart = cart.filter(x => x.cartItemId !== cartItemId);
  saveCart(cart);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}


export function getCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  cart.forEach(item => subtotal += item.price * item.quantity);
  
  const shipping = subtotal > 0 ? 30 : 0; 
  let discount = 0;
  if (subtotal > 3000) {
    discount = subtotal * 0.10; 
  }
  
  return {
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount
  };
}

export function updateCartBadge(): void {
  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const badges = document.querySelectorAll('.header-cart-badge') as NodeListOf<HTMLElement>;
  badges.forEach(badge => {
    badge.textContent = totalItems.toString();
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  });
}
