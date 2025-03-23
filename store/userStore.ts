import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Define types for our data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  shopName: string;
}

export interface Order {
  id: number;
  date: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

export interface FavoriteProduct {
  id: number;
  name: string;
  image: string;
  shopName: string;
}

interface UserState {
  user: UserProfile | null;
  recentOrders: Order[];
  favorites: FavoriteProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProfileData: () => Promise<void>;
  resetProfileData: () => void;
  setUser: (user: UserProfile) => void;
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (productId: number) => void;
}

// Create the store
const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      recentOrders: [],
      favorites: [],
      isLoading: false,
      error: null,

      // Fetch profile data from API
      fetchProfileData: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await axios.get('/api/user/profile');
          const data = response.data;
          
          set({
            user: data.user,
            recentOrders: data.recentOrders,
            favorites: data.favorites,
            isLoading: false
          });
        } catch (err: any) {
          console.error('Failed to fetch profile data:', err);
          const errorMessage = 'Failed to load profile data. Please try again.';
          set({ error: errorMessage, isLoading: false });
          
          // If API not available, use dummy data in development
          if (process.env.NODE_ENV === 'development') {
            set({
              user: {
                id: 'user-1',
                name: 'Demo User',
                email: 'demo@example.com',
                phone: '+919999999999',
                avatarUrl: '/default-avatar.svg',
                role: 'USER'
              },
              recentOrders: [
                {
                  id: 1234,
                  date: new Date().toISOString(),
                  status: 'DELIVERED',
                  totalAmount: 199,
                  items: [
                    {
                      id: 1,
                      productId: 1,
                      productName: 'Burger Deluxe',
                      quantity: 1,
                      price: 199,
                      image: '/burger.svg',
                      shopName: 'Delicious Restaurant'
                    }
                  ]
                },
                {
                  id: 1233,
                  date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                  status: 'DELIVERED',
                  totalAmount: 299,
                  items: [
                    {
                      id: 2,
                      productId: 2,
                      productName: 'Margherita Pizza',
                      quantity: 1,
                      price: 299,
                      image: '/pizza.svg',
                      shopName: 'Pizza Paradise'
                    }
                  ]
                }
              ],
              favorites: [
                {
                  id: 1,
                  name: 'Spicy Chicken Burger',
                  image: '/burger.svg',
                  shopName: 'Burger King'
                },
                {
                  id: 2,
                  name: 'Pepperoni Pizza',
                  image: '/pizza.svg',
                  shopName: 'Pizza Hut'
                }
              ]
            });
          }
        }
      },

      // Reset profile data
      resetProfileData: () => {
        set({
          user: null,
          recentOrders: [],
          favorites: [],
          isLoading: false,
          error: null
        });
      },

      // Set user information
      setUser: (user) => {
        set({ user });
      },

      // Add product to favorites
      addToFavorites: (product) => {
        const currentFavorites = get().favorites;
        // Check if product already exists in favorites
        if (!currentFavorites.some(fav => fav.id === product.id)) {
          set({ favorites: [...currentFavorites, product] });
        }
      },

      // Remove product from favorites
      removeFromFavorites: (productId) => {
        const currentFavorites = get().favorites;
        set({
          favorites: currentFavorites.filter(fav => fav.id !== productId)
        });
      }
    }),
    {
      name: 'user-storage',
      // Only persist user and favorites
      partialize: (state) => ({
        user: state.user,
        favorites: state.favorites
      })
    }
  )
);

export default useUserStore; 