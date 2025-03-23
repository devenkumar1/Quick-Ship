# QuickShip

![QuickShip Logo](public/logo.svg)

## 🚀 Overview

QuickShip is a modern e-commerce platform built with Next.js, Prisma, PostgreSQL, and NextAuth. It provides a seamless shopping experience for users and robust management tools for administrators and sellers. The platform connects buyers with sellers, enabling fast delivery of products with intuitive user interfaces and secure authentication.

## ✨ Features

### For Customers
- **User Authentication**: Secure login and registration with email/password, Google, and GitHub providers
- **Product Browsing**: Browse and search through a variety of products by category
- **Order Management**: Track orders, view order history, and delivery status
- **User Profiles**: Manage personal information, view past orders, and save favorite products
- **Reviews and Ratings**: Rate and review products after purchase

### For Sellers
- **Seller Registration**: Apply to become a seller on the platform
- **Shop Management**: Create and manage a shop with custom branding
- **Product Management**: Add, edit, and manage product listings
- **Order Fulfillment**: Manage incoming orders and update their status
- **Performance Analytics**: Track sales and customer reviews

### For Administrators
- **User Management**: Manage user accounts and permissions
- **Seller Approval**: Review and approve seller applications
- **Shop Oversight**: Monitor all shops on the platform
- **Product Moderation**: Review and moderate product listings
- **Order Management**: Overview of all orders in the system
- **Platform Analytics**: Track key performance metrics

## 🛠️ Tech Stack

- **Frontend**: 
  - Next.js 15 (React 19)
  - TailwindCSS for styling
  - React Icons for UI icons
  - Zustand for state management
  - React Hot Toast for notifications

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL database
  - NextAuth.js for authentication
  - Cloudinary for image uploads

- **DevOps**:
  - TypeScript for type safety
  - ESLint and Prettier for code quality
  - Vercel for deployment

## 📋 Database Models

```prisma
model User {
  id          String    @id @default(cuid())
  email       String    @unique
  password    String?
  name        String
  role        Role      @default(USER)
  provider    String?
  providerId  String?   
  orders      Order[]
  reviews     Review[]
  seller      Seller? 
  phoneNumber String?
  isVerified  Boolean   @default(false)
  image       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Shop {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  logo        String?
  sellerId    Int       @unique
  seller      Seller    @relation(fields: [sellerId], references: [id])
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Product {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  price       Decimal
  category    String    @default(" ")
  shopId      Int
  shop        Shop      @relation(fields: [shopId], references: [id])
  images      String[]  @default([])
  orderItems  OrderItem[]
  reviews     Review[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Order {
  id            Int           @id @default(autoincrement())
  userId        String
  user          User          @relation(fields: [userId], references: [id])
  items         OrderItem[]
  totalAmount   Decimal
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  payment       Payment?
  reviews       Review[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}
```

## 🔐 API Routes

### Authentication
- `POST /api/auth/signup` - Register a new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth authentication endpoints

### User Management
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile

### Product Management
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` (seller/admin) - Create a new product
- `PUT /api/products/:id` (seller/admin) - Update a product
- `DELETE /api/products/:id` (seller/admin) - Delete a product

### Order Management
- `GET /api/user/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` (seller/admin) - Update order status

### Admin Routes
- `GET /api/admin/users` - Get all users
- `GET /api/admin/sellers` - Get all sellers
- `GET /api/admin/seller-requests` - Get pending seller requests
- `PUT /api/admin/seller-requests/:id/approve` - Approve seller request
- `PUT /api/admin/seller-requests/:id/reject` - Reject seller request
- `GET /api/admin/dashboard/stats` - Get admin dashboard statistics

## 📊 State Management

QuickShip uses Zustand for state management. The main store includes:

### User Store
```typescript
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
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/quickship.git
cd quickship
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/quickship"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_I="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser and navigate to http://localhost:3000

## 📱 Screenshots

[Add screenshots of your application here]

## 🧪 Testing

```bash
# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Icons](https://react-icons.github.io/react-icons/)
