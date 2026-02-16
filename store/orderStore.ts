import { create } from "zustand";
import { MOCK_ORDERS } from "../constants/mockData";
import { Order } from "../types";

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;

  // Queries
  getAllOrders: () => void;
  getOrderById: (id: string) => void;
  getClientOrders: (clientId: string) => Order[];
  getOrdersByStatus: (status: Order["status"]) => Order[];

  // Mutations
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderPaymentStatus: (
    orderId: string,
    paymentStatus: Order["paymentStatus"],
  ) => void;
  deleteOrder: (orderId: string) => void;

  // Utils
  setSelectedOrder: (order: Order | null) => void;
  setError: (error: string | null) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: MOCK_ORDERS,
  selectedOrder: null,
  isLoading: false,
  error: null,

  getAllOrders: () => {
    set({ isLoading: true });
    try {
      // Simulate API call
      const orders = get().orders;
      set({ orders, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil data pesanan";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getOrderById: (id: string) => {
    set({ isLoading: true });
    try {
      const order = get().orders.find((o) => o.id === id);
      set({ selectedOrder: order || null, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil data pesanan";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getClientOrders: (clientId: string) => {
    return get().orders.filter((o) => o.clientId === clientId);
  },

  getOrdersByStatus: (status: Order["status"]) => {
    return get().orders.filter((o) => o.status === status);
  },

  createOrder: (orderData) => {
    set({ isLoading: true });
    try {
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        orders: [...state.orders, newOrder],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal membuat pesanan";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateOrderStatus: (orderId: string, status: Order["status"]) => {
    set({ isLoading: true });
    try {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order,
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengubah status pesanan";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateOrderPaymentStatus: (
    orderId: string,
    paymentStatus: Order["paymentStatus"],
  ) => {
    set({ isLoading: true });
    try {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId
            ? { ...order, paymentStatus, updatedAt: new Date().toISOString() }
            : order,
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal mengubah status pembayaran";
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteOrder: (orderId: string) => {
    set({ isLoading: true });
    try {
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus pesanan";
      set({ error: errorMessage, isLoading: false });
    }
  },

  setSelectedOrder: (order: Order | null) => {
    set({ selectedOrder: order });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
