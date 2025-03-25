# State Management with Zustand in QuickShip

This document explains how we've implemented global state management in QuickShip using Zustand.

## Overview

Zustand is a small, fast, and scalable state management solution for React. It uses a simple and intuitive API based on hooks, making it easy to implement and use throughout the application.

## Why Zustand?

- **Simplicity**: Simple API that's easy to learn and use
- **Performance**: Minimal re-renders with fine-grained updates
- **TypeScript Support**: Full TypeScript support with minimal boilerplate
- **Persistence**: Built-in persistence middleware
- **Size**: Very small bundle size (less than 1KB)
- **No Provider Required**: Unlike Context, no need to wrap your app with providers

## Store Structure

### User Profile Store

Location: `store/userStore.ts`

This store manages the user profile data including:
- User information (name, email, avatar, etc.)
- Recent orders
- Favorite products
- Loading states and error handling

```typescript
// Interface structure
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

interface UserState {
  user: UserProfile | null;
  recentOrders: Order[];
  favorites: FavoriteProduct[];
  isLoading: boolean;
  error: string | null;
  // Actions...
}
```

#### User Store Actions

The user store provides the following actions:

- `fetchProfileData()`: Fetches user profile data from the API
- `setUser(user)`: Updates user information
- `resetProfileData()`: Resets the store to its initial state
- `addToFavorites(product)`: Adds a product to favorites
- `removeFromFavorites(productId)`: Removes a product from favorites
- `clearFavorites()`: Clears all favorites
- `isFavorite(productId)`: Checks if a product is in favorites

### Product Store

Location: `store/productStore.ts`

This store manages the product data including:
- List of all products
- Featured products
- Product search and filtering
- Loading states and error handling

```typescript
// Interface structure
interface Product {
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

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  // Actions...
}
```

#### Product Store Actions

The product store provides the following actions:

- `fetchProducts()`: Fetches all products from the API
- `fetchFeaturedProducts()`: Fetches featured products from the API
- `searchProducts(query)`: Searches products based on a query string
- `filterProducts(category)`: Filters products by category
- `getProductById(id)`: Retrieves a specific product by ID

### Cart Store

Location: `store/cartStore.ts`

This store manages the shopping cart functionality including:
- Cart items with quantities
- Cart calculations (total, items count)
- Cart operations (add, remove, update quantity)

```typescript
// Interface structure
interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number | string;
  quantity: number;
  image: string;
  shopName: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  // Actions...
}
```

#### Cart Store Actions

The cart store provides the following actions:

- `addToCart(product)`: Adds a product to the cart
- `removeFromCart(id)`: Removes an item from the cart
- `updateQuantity(id, quantity)`: Updates the quantity of an item
- `clearCart()`: Removes all items from the cart
- `getCartTotal()`: Calculates the total price of all items
- `getItemsCount()`: Counts the total number of items in the cart
- `getCartItemById(id)`: Retrieves a specific cart item by ID

## Integration Between Stores

The stores are designed to work together to enhance the user experience:

### Product and Cart Integration
- The `ProductCard` component uses the product store to display product data and the cart store to add products to the cart.
- The `CartPage` component uses the cart store to display cart items and manage cart operations.

### User and Cart Integration
- The user's cart state persists across sessions using Zustand's `persist` middleware.
- The `Navbar` component displays the cart count from the cart store.

### User and Product Integration
- The `ProductCard` component checks if a product is in the user's favorites using the user store's `isFavorite` method.
- The user can add products to favorites from the product pages, which updates the user store.
- The `WishlistPage` component displays the user's favorites from the user store.

## Usage Example

Here's an example of how to use the product and user stores in a component:

```tsx
import React from 'react';
import useProductStore from '@/store/productStore';
import useUserStore from '@/store/userStore';
import useCartStore from '@/store/cartStore';

const ProductPage = ({ id }) => {
  const { getProductById } = useProductStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useUserStore();
  const { addToCart } = useCartStore();
  
  const product = getProductById(id);
  const productIsFavorite = isFavorite(id);
  
  const handleToggleFavorite = () => {
    if (productIsFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        image: product.images[0],
        shopName: product.shop.name
      });
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
      <button onClick={handleToggleFavorite}>
        {productIsFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

## Persistence

Zustand's `persist` middleware is used to persist store state in localStorage:

- **User Store**: Persists user information and favorites
- **Cart Store**: Persists cart items
- **Product Store**: Does not persist (fetched fresh each session)

## Best Practices

- **Avoid Prop Drilling**: Use store hooks directly in components that need them
- **Keep Actions in the Store**: Put all logic for state changes inside store actions
- **Use TypeScript**: Define interfaces for store state and actions
- **Memoize Selectors**: For complex data transformations, use memoized selectors

## Adding New Stores

To add a new store:

1. Create a new file in the `store` directory
2. Define the state interface
3. Create the store using `create` from Zustand
4. Define actions to modify the state
5. Add persistence if needed using `persist` middleware
6. Export the store as a default export

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand Persistence](https://github.com/pmndrs/zustand#persist-middleware)
- [TypeScript Usage](https://github.com/pmndrs/zustand#typescript-usage) 