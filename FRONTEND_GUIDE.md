# 🧺 Laundry Mobile App - Frontend-First Development

Frontend mobile app untuk layanan laundry yang dibangun dengan **React Native Expo**, **Zustand**, **Gluestack UI**, dan **Lottie Animations**.

## 🎯 Fitur Utama

### 👥 Role-Based Navigation

- **Client Role**: Dashboard, Order Form, Order History, Payment
- **Admin Role**: Dashboard dengan Statistics, Order Management, Status Update

### 🎨 UI/UX

- Design modern dengan Gluestack UI Components
- Styling dengan Tailwind (via NativeWind)
- Lottie animations untuk loading, success, error states
- Responsive layout untuk berbagai ukuran layar

### 📊 Mock Data

Semua data menggunakan mock/dummy data dengan Zustand untuk state management:

- User Authentication (hardcoded: admin@laundry.com & client@laundry.com)
- Order Management (Create, Read, Update, Delete)
- Real-time status updates

### 💳 Payment System UI

- 3 pilihan metode: Transfer Manual (active), QRIS (disabled), VA (disabled)
- QRIS dan VA menampilkan "Coming Soon" dengan disabled state
- Toast alerts untuk user feedback

## 📁 Folder Structure

```
LaundryFE/
├── app/
│   └── _layout.tsx                 # Main layout dengan Navigation
├── navigation/
│   └── Navigation.tsx              # Role-based routing logic
├── screens/
│   ├── auth/
│   │   └── LoginScreen.tsx
│   ├── client/
│   │   ├── ClientDashboardScreen.tsx
│   │   └── OrderFormScreen.tsx
│   ├── admin/
│   │   └── AdminDashboardScreen.tsx
│   └── shared/
│       └── PaymentScreen.tsx
├── components/
│   ├── animations/
│   │   └── LottieAnimation.tsx     # Reusable Lottie component
│   ├── payment/
│   ├── admin/
│   ├── client/
│   └── shared/
│       └── LogoutButton.tsx
├── store/
│   ├── authStore.ts               # Zustand auth state
│   └── orderStore.ts              # Zustand order state
├── types/
│   └── index.ts                   # TypeScript interfaces
├── constants/
│   ├── mockData.ts                # Dummy data
│   └── theme.ts
├── config/
│   └── gluestack.config.ts        # Gluestack configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm atau yarn
- Expo CLI (opsional untuk development)

### Installation

```bash
# Install dependencies
npm install

# atau dengan yarn
yarn install
```

### Development

```bash
# Start Expo development server
npm start

# Untuk Android Emulator
npm run android

# Untuk iOS Simulator (macOS only)
npm run ios

# Untuk Web
npm run web
```

## 🔐 Hardcoded Login Credentials

### Admin Account

- **Email**: admin@laundry.com
- **Password**: admin123

### Client Account

- **Email**: client@laundry.com
- **Password**: client123

## 📱 Screens Overview

### Login Screen

- Email & password input
- Demo buttons untuk quick login
- Credentials reference

### Client Dashboard

```
- Stats cards (Saldo, Pesanan Aktif, Selesai)
- Quick action buttons (Pesan Baru, Promo)
- Pesanan Aktif dengan progress bar
- Riwayat pesanan
- Logout button
```

### Order Form Screen

- Pilih layanan: Kiloan / Satuan
- Input berat (kiloan) atau daftar barang (satuan)
- Alamat pengiriman
- Catatan khusus
- Pilih metode pembayaran
- Total harga dinamis

### Admin Dashboard

```
- Stats cards (Pesanan Hari Ini, Pendapatan, Proses, Selesai)
- Filter status pesanan
- Semua pesanan dengan aksi update status
- Modal untuk mengubah status
- Logout button
```

### Payment Screen

- Ringkasan pesanan
- Pilihan metode pembayaran
- Info penting untuk user
- Konfirmasi pembayaran dengan alert success

## 🎯 State Management (Zustand)

### Auth Store

```typescript
useAuthStore:
- user: User | null
- isLoggedIn: boolean
- isLoading: boolean
- login(email, password)
- logout()
- setUser(user)
```

### Order Store

```typescript
useOrderStore:
- orders: Order[]
- selectedOrder: Order | null
- getAllOrders()
- getOrderById(id)
- getClientOrders(clientId)
- getOrdersByStatus(status)
- createOrder(order)
- updateOrderStatus(orderId, status)
- updateOrderPaymentStatus(orderId, status)
- deleteOrder(orderId)
```

## 🎨 Design System

### Colors

- **Primary**: #4577C3 (Blue)
- **Secondary**: #FF7A45 (Orange)
- **Success**: #52C41A (Green)
- **Warning**: #FAAD14 (Amber)
- **Error**: #F44336 (Red)
- **Neutral**: Gray scale

### Order Status Colors

- Pending: Orange
- Washing: Blue
- Ironing: Purple
- Ready: Green
- Done: Green
- Cancelled: Red

## 🎬 Lottie Animations

Menggunakan free animations dari Lottie:

- Loading animation
- Success animation
- Error animation
- Empty state animation
- Washing animation

## 📦 Dependencies

Utama:

- `react-native` - Mobile framework
- `expo` - Managed React Native service
- `zustand` - State management
- `@react-navigation/native-stack` - Navigation
- `@gluestack-ui/themed` - UI Components
- `nativewind` - Tailwind CSS for React Native
- `lottie-react-native` - Animations

## 🔄 Data Flow

1. **Login** → Zustand Auth Store → Role check
2. **Role-based Navigation** → Client/Admin screens
3. **Order Operations** → Zustand Order Store → UI update (real-time)
4. **Payment** → Simulated processing → Alert confirmation

## 🚨 Backend-Ready Structure

Meskipun menggunakan mock data sekarang, struktur sudah siap untuk integrasi backend:

- Types sudah defined untuk API responses
- Stores bisa langsung diganti dengan API calls
- Error handling sudah ter-setup
- Loading states sudah ter-implement

## 📝 Testing Mock Data

Untuk test berbagai skenario, edit `constants/mockData.ts`:

```typescript
// Add more mock orders
export const MOCK_ORDERS: Order[] = [
  // ...existing orders
  // Add your test orders here
];
```

## 🛠️ Development Tips

### Disable Payment Methods

Ubah `isAvailable` di `constants/mockData.ts`:

```typescript
{
  id: 'qris',
  isAvailable: false, // Disable QRIS
  // ...
}
```

### Update Order Prices

Edit di `PRICE_LIST`:

```typescript
const PRICE_LIST = {
  kiloan: 10000, // per kg
  satuan: {
    shirt: 15000,
    // ...
  },
};
```

## 🔗 Next Steps untuk Backend Integration

1. Setup API client (fetch/axios)
2. Replace Zustand mock actions dengan API calls
3. Add error handling dengan retry logic
4. Add validation dari API responses
5. Implement real authentication dengan tokens
6. Setup push notifications

## 📱 Supported Platforms

- ✅ Android (melalui Expo Go atau APK)
- ✅ iOS (melalui Expo Go atau TestFlight)
- ✅ Web (experimental)

## 🐛 Known Limitations

1. Data persists hanya dalam memory - refresh akan reset
2. Tidak ada real database integration
3. Payment adalah dummy flow
4. No offline support yet
5. No push notifications

## 🎓 Educational Value

Project ini mendemonstrasikan:

- Mobile app architecture patterns
- State management dengan Zustand
- Navigation patterns (role-based)
- Component composition
- Mock data patterns
- TypeScript best practices
- UI/UX dengan modern stack

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for laundry service mobile app

---

**Ready to connect backend?** Setiap store dan screen sudah structured untuk mudah integration dengan actual API endpoints! 🚀
