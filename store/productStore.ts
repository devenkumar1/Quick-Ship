import { create } from 'zustand';
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
    id: number;
    text: string;
    rating: number;
    createdAt: string;
    userId: string;
  }>;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Define the Product Store State
interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  selectedCategory: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
  searchProducts: (query: string) => Promise<void>;
  filterProductsByCategory: (category: string) => Product[];
  setSelectedCategory: (category: string | null) => void;
  addToFavorites: (productId: number) => void;
  getCategories: () => string[];
}

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes in milliseconds

// Create the store
const useProductStore = create<ProductState>()((set, get) => ({
  // Initial state
  products: [],
  featuredProducts: [],
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  // Fetch all products
  fetchProducts: async () => {
    const now = Date.now();
    const lastFetched = get().lastFetched;

    // Return cached data if within 5 minutes
    if (lastFetched && now - lastFetched < CACHE_DURATION && get().products.length > 0) {
      return;
    }

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
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(sortedProducts.map(product => product.category))
        ).sort();
        
        // Set featured products - just take the most recent 6 for now
        const featured = sortedProducts.slice(0, 6);
        
        set({ 
          products: sortedProducts,
          featuredProducts: featured,
          categories: uniqueCategories,
          isLoading: false,
          lastFetched: now
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
        const uniqueCategories = Array.from(
          new Set(mockProducts.map(product => product.category))
        ).sort();
        
        set({ 
          products: mockProducts,
          featuredProducts: mockProducts.slice(0, 6),
          categories: uniqueCategories,
          isLoading: false,
          lastFetched: now
        });
      }
    }
  },

  // Get all categories
  getCategories: () => {
    return get().categories;
  },

  // Set selected category
  setSelectedCategory: (category: string | null) => {
    set({ selectedCategory: category });
  },

  // Fetch a single product by ID
  fetchProductById: async (id: number) => {
    try {
      // First check if we already have the product in our store and the cache is fresh
      const now = Date.now();
      const lastFetched = get().lastFetched;
      const existingProduct = get().products.find(p => p.id === id);
      
      if (existingProduct && lastFetched && now - lastFetched < CACHE_DURATION) {
        return existingProduct;
      }
      
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
      // Check if we need to refresh the data
      const now = Date.now();
      const lastFetched = get().lastFetched;
      
      if (!lastFetched || now - lastFetched >= CACHE_DURATION || get().products.length === 0) {
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
    
    if (category.toLowerCase() === 'all') {
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
}));

// Helper function to generate mock products for development
function generateMockProducts(): Product[] {
  const categories = ['Stationery', 'Food', 'Clothing', 'Electronics', 'Books', 'Home'];
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
        id: Math.floor(Math.random() * 1000),
        text: `This is a sample review for product ${id}. It's a great product!`,
        rating: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date().toISOString(),
        userId: Math.random().toString(36).substring(7)
      })),
      images: [`https://picsum.photos/seed/${id}/300/200`],
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
}

export default useProductStore; 