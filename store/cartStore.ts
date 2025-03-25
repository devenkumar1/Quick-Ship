import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './productStore';
import toast from 'react-hot-toast';

// Define cart item interface
export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shopName: string;
}

// Define cart state
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
  getCartItemById: (productId: number) => CartItem | undefined;
}

// Create cart store
const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      
      // Add item to cart
      addToCart: (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.productId === product.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          get().updateQuantity(product.id, existingItem.quantity + quantity);
          toast.success(`Updated quantity for ${product.name}`);
        } else {
          // Add new item
          const productPrice = typeof product.price === 'string' 
            ? parseFloat(product.price) 
            : product.price;
            
          const newItem: CartItem = {
            id: Date.now(), // Unique ID for the cart item
            productId: product.id,
            name: product.name,
            price: productPrice,
            quantity: quantity,
            image: product.images[0] || `https://picsum.photos/seed/${product.id}/300/200`,
            shopName: product.shop.name
          };
          
          set({ items: [...currentItems, newItem] });
          toast.success(`${product.name} added to cart`);
        }
      },
      
      // Remove item from cart
      removeFromCart: (productId: number) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(item => item.productId === productId);
        
        if (itemToRemove) {
          set({ 
            items: currentItems.filter(item => item.productId !== productId) 
          });
          toast.success(`Removed from cart`);
        }
      },
      
      // Update item quantity
      updateQuantity: (productId: number, quantity: number) => {
        const currentItems = get().items;
        
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          get().removeFromCart(productId);
          return;
        }
        
        const updatedItems = currentItems.map(item => 
          item.productId === productId 
            ? { ...item, quantity } 
            : item
        );
        
        set({ items: updatedItems });
      },
      
      // Clear cart
      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },
      
      // Calculate cart total
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.price * item.quantity), 
          0
        );
      },
      
      // Get total number of items in cart
      getItemsCount: () => {
        return get().items.reduce(
          (count, item) => count + item.quantity, 
          0
        );
      },
      
      // Get cart item by product ID
      getCartItemById: (productId: number) => {
        return get().items.find(item => item.productId === productId);
      }
    }),
    {
      name: 'cart-storage',
      // Persist entire cart state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore; 