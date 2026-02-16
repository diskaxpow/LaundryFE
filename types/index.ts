// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "client";
}

// Voucher Types
export interface Voucher {
  id: string;
  code: string;
  type: "discount" | "free_laundry"; // discount = potongan harga, free_laundry = gratis
  discountType?: "percentage" | "fixed"; // untuk discount: persen atau nominal
  discountValue?: number; // nilai potongan (persen atau rupiah)
  freeWeight?: number; // untuk free_laundry: kg yang gratis
  minimumOrder?: number; // minimum pesanan untuk menggunakan voucher
  maxUsage?: number; // jumlah maksimal penggunaan
  usedCount?: number; // sudah digunakan berapa kali
  expiryDate: string; // tanggal expired
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserVoucher {
  id: string;
  userId: string;
  voucherId: string;
  voucher: Voucher;
  claimedAt: string;
  usedAt?: string;
  isUsed: boolean;
}

// Order Types
export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: string;
  latitude?: number;
  longitude?: number;
  packages: OrderPackage[];
  totalPrice: number;
  originalPrice: number; // harga sebelum diskon
  voucherId?: string; // voucher yang digunakan
  discountAmount?: number; // jumlah potongan
  status: "pending" | "washing" | "ironing" | "ready" | "done" | "cancelled";
  paymentMethod: "manual" | "qris" | "va";
  paymentStatus: "unpaid" | "pending" | "paid";
  pickupDate: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPackage {
  id: string;
  type: "kiloan" | "satuan";
  weight?: number; // for kiloan
  items?: OrderItem[]; // for satuan
  price: number;
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  category: "shirt" | "pants" | "jacket" | "dress" | "others";
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: "manual" | "qris" | "va";
  name: string;
  icon: string;
  description: string;
  isAvailable: boolean;
}

// Dashboard Stats
export interface AdminStats {
  totalOrdersToday: number;
  totalRevenueToday: number;
  activeOrders: number;
  completedOrders: number;
}

export interface ClientStats {
  totalOrders: number;
  activeOrders: number;
  balance: number;
  lastOrderDate?: string;
}
