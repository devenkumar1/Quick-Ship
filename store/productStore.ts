import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Define Product interface
export interface Product {
  id: number;
  name: string;
  price: number | string;
  shopId: number;
  shop: {
    name: string;
  };
  description?: string;
  category: string;
  reviews: Array<{
    rating: number;
  }>;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Define the Product Store State
interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
  searchProducts: (query: string) => Promise<void>;
  filterProductsByCategory: (category: string) => Product[];
  addToFavorites: (productId: number) => void;
}

// Create the store
const useProductStore = create<ProductState>()(
  (set, get) => ({
    // Initial state
    products: [],
    featuredProducts: [],
    isLoading: false,
    error: null,

    // Fetch all products
    fetchProducts: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await axios.get<{ products: Product[] }>('/api/products');
        
        if (response.data && response.data.products) {
          // Process products - ensure images is an array, add placeholder if needed
          const processedProducts = response.data.products.map((product: Product) => ({
            ...product,
            images: product.images && product.images.length > 0 
              ? product.images 
              : [`https://picsum.photos/seed/${product.id}/300/200`]
          }));
          
          // Sort by createdAt date (newest first)
          const sortedProducts = [...processedProducts].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          // Set featured products - just take the most recent 6 for now
          const featured = sortedProducts.slice(0, 6);
          
          set({ 
            products: sortedProducts,
            featuredProducts: featured,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        set({ 
          error: 'Failed to load products. Please try again.',
          isLoading: false 
        });
        
        // In development, generate mock data
        if (process.env.NODE_ENV === 'development') {
          const mockProducts = generateMockProducts();
          set({ 
            products: mockProducts,
            featuredProducts: mockProducts.slice(0, 6),
            isLoading: false
          });
        }
      }
    },

    // Fetch a single product by ID
    fetchProductById: async (id: number) => {
      try {
        // First check if we already have the product in our store
        const existingProduct = get().products.find(p => p.id === id);
        if (existingProduct) return existingProduct;
        
        // If not, fetch it from the API
        const response = await axios.get<{ product: Product }>(`/api/products/${id}`);
        if (response.data && response.data.product) {
          // Ensure images is an array
          const product = {
            ...response.data.product,
            images: response.data.product.images && response.data.product.images.length > 0 
              ? response.data.product.images 
              : [`https://picsum.photos/seed/${id}/300/200`]
          };
          return product;
        }
        return null;
      } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        return null;
      }
    },

    // Search products
    searchProducts: async (query: string) => {
      try {
        set({ isLoading: true, error: null });
        
        // This could be an API call to a search endpoint
        // For now, we'll just filter the existing products
        if (get().products.length === 0) {
          await get().fetchProducts();
        }
        
        const products = get().products;
        const filtered = products.filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        set({
          products: filtered,
          isLoading: false
        });
      } catch (error) {
        console.error('Error searching products:', error);
        set({ 
          error: 'Failed to search products. Please try again.',
          isLoading: false 
        });
      }
    },

    // Filter products by category
    filterProductsByCategory: (category: string) => {
      const allProducts = get().products;
      
      if (category === 'all') {
        return allProducts;
      }
      
      return allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    },

    // Add product to favorites (uses userStore)
    addToFavorites: (productId: number) => {
      // First find the product
      const product = get().products.find(p => p.id === productId);
      if (!product) return;
      
      // Here we would typically call another store function
      // We'll implement this integration later when connecting with userStore
      console.log(`Added product ${productId} to favorites`);
    }
  })
);

// Helper function to generate mock products for development
function generateMockProducts(): Product[] {
  const categories = ['Food', 'Clothing', 'Electronics', 'Books', 'Home'];
  const shops = [
    { id: 1, name: 'Foodie Paradise' },
    { id: 2, name: 'Tech Haven' },
    { id: 3, name: 'Book World' },
    { id: 4, name: 'Fashion Stop' },
    { id: 5, name: 'Home Essentials' }
  ];
  
  return Array.from({ length: 20 }, (_, i) => {
    const id = i + 1;
    const shopIndex = Math.floor(Math.random() * shops.length);
    const categoryIndex = Math.floor(Math.random() * categories.length);
    
    return {
      id,
      name: `Product ${id}`,
      price: Math.floor(Math.random() * 1000) + 99,
      shopId: shops[shopIndex].id,
      shop: shops[shopIndex],
      description: `This is a sample description for product ${id}. It's a great product!`,
      category: categories[categoryIndex],
      reviews: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
        rating: Math.floor(Math.random() * 5) + 1
      })),
      images: [`https://picsum.photos/seed/${id}/300/200`],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

export default useProductStore; 