import { create } from "zustand";
import { Voucher, UserVoucher } from "../types";
import { MOCK_VOUCHERS, MOCK_USER_VOUCHERS } from "../constants/mockData";

interface VoucherState {
  vouchers: Voucher[];
  userVouchers: UserVoucher[];
  selectedVoucher: UserVoucher | null;
  isLoading: boolean;
  error: string | null;

  // Queries
  getAllVouchers: () => void;
  getUserVouchers: (userId: string) => UserVoucher[];
  getAvailableVouchers: (userId: string) => UserVoucher[]; // belum digunakan
  getVoucherByCode: (code: string) => Voucher | undefined;
  validateVoucher: (
    voucherId: string,
    orderAmount: number
  ) => { isValid: boolean; message: string };

  // Mutations
  claimVoucher: (userId: string, voucherId: string) => void;
  useVoucher: (userVoucherId: string) => void;
  selectVoucher: (userVoucher: UserVoucher | null) => void;

  // Utils
  calculateDiscount: (
    voucherId: string,
    orderAmount: number
  ) => { discountAmount: number; finalAmount: number };
  setError: (error: string | null) => void;
}

export const useVoucherStore = create<VoucherState>((set, get) => ({
  vouchers: MOCK_VOUCHERS,
  userVouchers: MOCK_USER_VOUCHERS,
  selectedVoucher: null,
  isLoading: false,
  error: null,

  getAllVouchers: () => {
    set({ isLoading: true });
    try {
      const vouchers = get().vouchers.filter((v) => v.isActive);
      set({ vouchers, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal mengambil voucher";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getUserVouchers: (userId: string) => {
    return get().userVouchers.filter((uv) => uv.userId === userId);
  },

  getAvailableVouchers: (userId: string) => {
    const now = new Date();
    return get()
      .userVouchers.filter(
        (uv) =>
          uv.userId === userId &&
          !uv.isUsed &&
          new Date(uv.voucher.expiryDate) > now
      );
  },

  getVoucherByCode: (code: string) => {
    return get().vouchers.find((v) => v.code === code && v.isActive);
  },

  validateVoucher: (voucherId: string, orderAmount: number) => {
    const userVoucher = get().userVouchers.find((uv) => uv.id === voucherId);

    if (!userVoucher) {
      return { isValid: false, message: "Voucher tidak ditemukan" };
    }

    if (userVoucher.isUsed) {
      return { isValid: false, message: "Voucher sudah digunakan" };
    }

    const expiryDate = new Date(userVoucher.voucher.expiryDate);
    if (expiryDate < new Date()) {
      return { isValid: false, message: "Voucher sudah expired" };
    }

    const minimumOrder = userVoucher.voucher.minimumOrder || 0;
    if (orderAmount < minimumOrder) {
      return {
        isValid: false,
        message: `Minimum pembelian Rp ${minimumOrder.toLocaleString("id-ID")}`,
      };
    }

    return { isValid: true, message: "Voucher valid" };
  },

  claimVoucher: (userId: string, voucherId: string) => {
    set({ isLoading: true });
    try {
      const voucher = get().vouchers.find((v) => v.id === voucherId);

      if (!voucher) {
        throw new Error("Voucher tidak ditemukan");
      }

      if (!voucher.isActive) {
        throw new Error("Voucher tidak aktif");
      }

      if (
        voucher.maxUsage &&
        voucher.usedCount &&
        voucher.usedCount >= voucher.maxUsage
      ) {
        throw new Error("Voucher sudah mencapai batas penggunaan");
      }

      // Check if already claimed
      const alreadyClaimed = get().userVouchers.find(
        (uv) => uv.userId === userId && uv.voucherId === voucherId
      );

      if (alreadyClaimed) {
        throw new Error("Anda sudah claim voucher ini");
      }

      const newUserVoucher: UserVoucher = {
        id: `uv-${Date.now()}`,
        userId,
        voucherId,
        voucher,
        claimedAt: new Date().toISOString(),
        isUsed: false,
      };

      set((state) => ({
        userVouchers: [...state.userVouchers, newUserVoucher],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal claim voucher";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  useVoucher: (userVoucherId: string) => {
    set({ isLoading: true });
    try {
      set((state) => ({
        userVouchers: state.userVouchers.map((uv) =>
          uv.id === userVoucherId ? { ...uv, isUsed: true, usedAt: new Date().toISOString() } : uv
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menggunakan voucher";
      set({ error: errorMessage, isLoading: false });
    }
  },

  selectVoucher: (userVoucher: UserVoucher | null) => {
    set({ selectedVoucher: userVoucher });
  },

  calculateDiscount: (voucherId: string, orderAmount: number) => {
    const userVoucher = get().userVouchers.find((uv) => uv.id === voucherId);

    if (!userVoucher) {
      return { discountAmount: 0, finalAmount: orderAmount };
    }

    const voucher = userVoucher.voucher;

    if (voucher.type === "discount") {
      let discountAmount = 0;

      if (voucher.discountType === "percentage") {
        discountAmount = Math.floor(
          orderAmount * ((voucher.discountValue || 0) / 100)
        );
      } else if (voucher.discountType === "fixed") {
        discountAmount = voucher.discountValue || 0;
      }

      const finalAmount = Math.max(0, orderAmount - discountAmount);
      return { discountAmount, finalAmount };
    } else if (voucher.type === "free_laundry") {
      // For free laundry, calculate based on weight
      const freeWeight = voucher.freeWeight || 0;
      const discountAmount = freeWeight * 10000; // Assuming Rp 10k per kg
      const finalAmount = Math.max(0, orderAmount - discountAmount);
      return { discountAmount, finalAmount };
    }

    return { discountAmount: 0, finalAmount: orderAmount };
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
