import { Order, PaymentMethod, User, Voucher, UserVoucher } from "../types";

// Mock Users
export const MOCK_USERS = {
  admin: {
    id: "admin-001",
    email: "admin@laundry.com",
    name: "Admin Laundry",
    role: "admin" as const,
  } as User,
  client: {
    id: "client-001",
    email: "client@laundry.com",
    name: "Budi Santoso",
    role: "client" as const,
  } as User,
};

// Mock Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: "order-001",
    clientId: "client-001",
    clientName: "Budi Santoso",
    clientEmail: "client@laundry.com",
    clientPhone: "08123456789",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    packages: [
      {
        id: "pkg-001",
        type: "kiloan",
        weight: 5,
        price: 50000,
        quantity: 1,
      },
    ],
    totalPrice: 50000,
    originalPrice: 50000,
    status: "washing",
    paymentMethod: "manual",
    paymentStatus: "paid",
    pickupDate: new Date().toISOString(),
    notes: "Hati-hati dengan warna",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-002",
    clientId: "client-002",
    clientName: "Siti Nurhayati",
    clientEmail: "siti@example.com",
    clientPhone: "08987654321",
    address: "Jl. Sudirman No. 456, Jakarta Selatan",
    packages: [
      {
        id: "pkg-002",
        type: "satuan",
        items: [
          {
            id: "item-001",
            name: "Kemeja Putih",
            quantity: 2,
            category: "shirt",
          },
          {
            id: "item-002",
            name: "Celana Panjang",
            quantity: 1,
            category: "pants",
          },
        ],
        price: 35000,
        quantity: 1,
      },
    ],
    totalPrice: 35000,
    originalPrice: 35000,
    status: "ready",
    paymentMethod: "manual",
    paymentStatus: "paid",
    pickupDate: new Date(Date.now() - 7200000).toISOString(),
    notes: "",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-003",
    clientId: "client-003",
    clientName: "Ahmad Wijaya",
    clientEmail: "ahmad@example.com",
    clientPhone: "08765432109",
    address: "Jl. Gatot Subroto No. 789, Jakarta Timur",
    packages: [
      {
        id: "pkg-003",
        type: "kiloan",
        weight: 3,
        price: 30000,
        quantity: 1,
      },
    ],
    totalPrice: 30000,
    originalPrice: 30000,
    status: "pending",
    paymentMethod: "qris",
    paymentStatus: "unpaid",
    pickupDate: new Date().toISOString(),
    notes: "",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-004",
    clientId: "client-004",
    clientName: "Habib Mahaasin",
    clientEmail: "habib@laundry.com",
    clientPhone: "08123456789",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    packages: [
      {
        id: "pkg-004",
        type: "kiloan",
        weight: 5,
        price: 50000,
        quantity: 1,
      },
    ],
    totalPrice: 50000,
    originalPrice: 50000,
    status: "washing",
    paymentMethod: "manual",
    paymentStatus: "paid",
    pickupDate: new Date().toISOString(),
    notes: "Hati-hati dengan warna",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-005",
    clientId: "client-005",
    clientName: "Alpin Mobile",
    clientEmail: "alpin@laundry.com",
    clientPhone: "08987654321",
    address: "Jl. Sudirman No. 456, Jakarta Selatan",
    packages: [
      {
        id: "pkg-005",
        type: "satuan",
        items: [
          {
            id: "item-001",
            name: "Kemeja Putih",
            quantity: 2,
            category: "shirt",
          },
          {
            id: "item-002",
            name: "Celana Panjang",
            quantity: 1,
            category: "pants",
          },
        ],
        price: 35000,
        quantity: 1,
      },
    ],
    totalPrice: 35000,
    originalPrice: 35000,
    status: "ready",
    paymentMethod: "manual",
    paymentStatus: "paid",
    pickupDate: new Date(Date.now() - 7200000).toISOString(),
    notes: "",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-006",
    clientId: "client-006",
    clientName: "Ifan",
    clientEmail: "ifan@laundry.com",
    clientPhone: "08765432109",
    address: "Jl. Gatot Subroto No. 789, Jakarta Timur",
    packages: [
      {
        id: "pkg-003",
        type: "kiloan",
        weight: 3,
        price: 30000,
        quantity: 1,
      },
    ],
    totalPrice: 30000,
    originalPrice: 30000,
    status: "pending",
    paymentMethod: "qris",
    paymentStatus: "unpaid",
    pickupDate: new Date().toISOString(),
    notes: "",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Payment Methods
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "manual",
    type: "manual",
    name: "Transfer Manual",
    icon: "💳",
    description: "Transfer ke rekening kami",
    isAvailable: true,
  },
  {
    id: "qris",
    type: "qris",
    name: "QRIS",
    icon: "📱",
    description: "Scan code pembayaran",
    isAvailable: false,
  },
  {
    id: "va",
    type: "va",
    name: "Virtual Account",
    icon: "🏦",
    description: "Nomor rekening virtual unik",
    isAvailable: false,
  },
];

// Order Status Info
export const ORDER_STATUS_INFO = {
  pending: { label: "Tertunda", color: "#FFA500", bgColor: "#FFF3E0" },
  washing: { label: "Mencuci", color: "#2196F3", bgColor: "#E3F2FD" },
  ironing: { label: "Menyetrika", color: "#9C27B0", bgColor: "#F3E5F5" },
  ready: { label: "Siap Diambil", color: "#4CAF50", bgColor: "#E8F5E9" },
  done: { label: "Selesai", color: "#4CAF50", bgColor: "#E8F5E9" },
  cancelled: { label: "Dibatalkan", color: "#F44336", bgColor: "#FFEBEE" },
};

// Price List
export const PRICE_LIST = {
  kiloan: 10000, // per kg
  satuan: {
    shirt: 15000,
    pants: 20000,
    jacket: 30000,
    dress: 25000,
    others: 20000,
  },
};
// Mock Vouchers
export const MOCK_VOUCHERS: Voucher[] = [
  {
    id: "voucher-001",
    code: "LAUNDRY20",
    type: "discount",
    discountType: "percentage",
    discountValue: 20, // 20% discount
    minimumOrder: 50000,
    maxUsage: 100,
    usedCount: 5,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari dari sekarang
    isActive: true,
    description: "Diskon 20% untuk semua pesanan minimal Rp 50.000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "voucher-002",
    code: "HEMAT5K",
    type: "discount",
    discountType: "fixed",
    discountValue: 5000, // Rp 5.000 discount
    minimumOrder: 30000,
    maxUsage: 50,
    usedCount: 12,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 hari
    isActive: true,
    description: "Hemat Rp 5.000 untuk pesanan minimal Rp 30.000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "voucher-003",
    code: "GRATIS2KG",
    type: "free_laundry",
    freeWeight: 2, // 2 kg gratis
    minimumOrder: 100000,
    maxUsage: 20,
    usedCount: 3,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 hari
    isActive: true,
    description: "Gratis 2kg cuci untuk pembelian minimal Rp 100.000",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "voucher-004",
    code: "WELCOME30",
    type: "discount",
    discountType: "percentage",
    discountValue: 30, // 30% untuk member baru
    minimumOrder: 0,
    maxUsage: 200,
    usedCount: 45,
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 hari
    isActive: true,
    description: "Diskon 30% untuk member baru (tanpa minimum pembelian)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock User Vouchers (voucher yang sudah di-claim oleh user)
export const MOCK_USER_VOUCHERS: UserVoucher[] = [
  {
    id: "uv-001",
    userId: "client-001",
    voucherId: "voucher-001",
    voucher: MOCK_VOUCHERS[0],
    claimedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 hari lalu
    isUsed: false,
  },
  {
    id: "uv-002",
    userId: "client-001",
    voucherId: "voucher-004",
    voucher: MOCK_VOUCHERS[3],
    claimedAt: new Date().toISOString(),
    usedAt: new Date().toISOString(),
    isUsed: true,
  },
];