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

interface ProfileState {
  user: UserProfile | null;
  recentOrders: Order[];
  favorites: FavoriteProduct[];
  isLoading: boolean;
  error: string | null;
  // Actions...
}
```

### Actions

The user store provides the following actions:

- `fetchProfileData()`: Fetches user profile data from the API
- `setUser(user)`: Updates user information
- `resetProfileData()`: Resets the store to its initial state
- `addToFavorites(product)`: Adds a product to favorites
- `removeFromFavorites(productId)`: Removes a product from favorites

## Usage Example

```tsx
import useUserStore from '@/store/userStore';

function ProfilePage() {
  const { 
    user, 
    recentOrders, 
    favorites, 
    isLoading, 
    error, 
    fetchProfileData,
    removeFromFavorites
  } = useUserStore();

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Use the state and actions in your component
}
```

## Persistence

The user store is configured to persist certain data in localStorage using Zustand's persist middleware. This allows user preferences and data to survive page refreshes.

## Best Practices

1. **Avoid Prop Drilling**: Use Zustand to access global state directly in components
2. **Keep Actions in the Store**: Define all actions that modify state within the store
3. **Use TypeScript**: Always define interfaces for your state
4. **Selective Updates**: Only update the specific parts of state that change
5. **Memoize Selectors**: For complex state derivation, memoize selectors

## Adding New Stores

To add a new store:

1. Create a new file in the `store/` directory
2. Define your state interface
3. Create your store using `create`
4. Export your store hook
5. Import and use in your components

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript with Zustand](https://github.com/pmndrs/zustand#typescript-usage)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware) 