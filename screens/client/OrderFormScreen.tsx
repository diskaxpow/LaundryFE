import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PRICE_LIST } from "../../constants/mockData";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";
import { useVoucherStore } from "../../store/voucherStore";

interface OrderItem {
  id: string;
  name: string;
  category: "shirt" | "pants" | "jacket" | "dress" | "others";
  quantity: number;
}

export const OrderFormScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  const {
    getUserVouchers,
    calculateDiscount,
    validateVoucher,
    useVoucher,
  } = useVoucherStore();

  const [orderType, setOrderType] = useState<"kiloan" | "satuan">("kiloan");
  const [weight, setWeight] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<
    "manual" | "qris" | "va"
  >("manual");
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [newItem, setNewItem] = useState<OrderItem>({
    id: "",
    name: "",
    category: "shirt",
    quantity: 0,
  });
  const [showItemModal, setShowItemModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userVouchers = user ? getUserVouchers(user.id) : [];
  const availableVouchers = userVouchers.filter((v) => !v.isUsed);

  const calculateTotal = (): number => {
    if (orderType === "kiloan") {
      const w = parseFloat(weight) || 0;
      return w * PRICE_LIST.kiloan;
    } else {
      return items.reduce((total, item) => {
        return total + PRICE_LIST.satuan[item.category] * item.quantity;
      }, 0);
    }
  };

  const getCalculatedPrice = () => {
    const baseTotal = calculateTotal();

    if (selectedVoucher) {
      const validation = validateVoucher(selectedVoucher, baseTotal);
      if (validation.isValid) {
        const { discountAmount, finalAmount } = calculateDiscount(
          selectedVoucher,
          baseTotal
        );
        return {
          baseTotal,
          discountAmount,
          finalAmount,
        };
      }
    }

    return {
      baseTotal,
      discountAmount: 0,
      finalAmount: baseTotal,
    };
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity <= 0) {
      Alert.alert("Validasi", "Nama dan jumlah barang harus diisi");
      return;
    }

    const item: OrderItem = {
      ...newItem,
      id: `item-${Date.now()}`,
    };

    setItems([...items, item]);
    setNewItem({ id: "", name: "", category: "shirt", quantity: 0 });
    setShowItemModal(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleSubmitOrder = async () => {
    if (!address) {
      Alert.alert("Validasi", "Alamat pengiriman harus diisi");
      return;
    }

    if (orderType === "kiloan" && !weight) {
      Alert.alert("Validasi", "Berat barang harus diisi");
      return;
    }

    if (orderType === "satuan" && items.length === 0) {
      Alert.alert("Validasi", "Tambahkan minimal satu barang");
      return;
    }

    setIsSubmitting(true);

    // Get price calculation with voucher
    const priceData = getCalculatedPrice();
    const { baseTotal, discountAmount, finalAmount } = priceData;

    const orderData = {
      clientId: user?.id || "client-001",
      clientName: user?.name || "Guest",
      clientEmail: user?.email || "guest@laundry.com",
      clientPhone: "081234567890",
      address,
      packages:
        orderType === "kiloan"
          ? [
              {
                id: `pkg-${Date.now()}`,
                type: "kiloan" as const,
                weight: parseFloat(weight),
                price: PRICE_LIST.kiloan,
                quantity: parseFloat(weight),
              },
            ]
          : [
              {
                id: `pkg-${Date.now()}`,
                type: "satuan" as const,
                items,
                price: calculateTotal(),
                quantity: items.length,
              },
            ],
      totalPrice: finalAmount,
      originalPrice: baseTotal,
      voucherId: selectedVoucher || undefined,
      discountAmount: discountAmount,
      status: "pending" as const,
      paymentMethod: selectedPayment,
      paymentStatus: "unpaid" as const,
      pickupDate: new Date().toISOString(),
      notes: note,
    };

    try {
      createOrder(orderData);

      // Mark voucher as used if one was selected
      if (selectedVoucher) {
        useVoucher(selectedVoucher);
      }

      const discountText =
        discountAmount > 0
          ? `\nPotongan: -Rp ${discountAmount.toLocaleString("id-ID")}`
          : "";
      const finalText = `Rp ${finalAmount.toLocaleString("id-ID")}`;

      Alert.alert(
        "✅ Pesanan Berhasil Dibuat",
        `Total: ${finalText}${discountText}\n\nSilakan lanjut ke pembayaran`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setOrderType("kiloan");
              setWeight("");
              setItems([]);
              setAddress("");
              setNote("");
              setSelectedPayment("manual");
              setSelectedVoucher(null);
              setIsSubmitting(false);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Gagal membuat pesanan");
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: OrderItem }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderLeftWidth: 3,
        borderLeftColor: "#4577C3",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#333" }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
          {item.category} × {item.quantity}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        style={{
          backgroundColor: "#FFEBEE",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}
      >
        <Text style={{ color: "#F44336", fontSize: 12, fontWeight: "600" }}>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#FF7A45",
            paddingTop: 20,
            paddingBottom: 24,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#fff",
              marginBottom: 4,
            }}
          >
            📦 Pesan Laundry Baru
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Isi detail pesanan Anda
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          {/* Order Type Selection */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 12,
                color: "#333",
              }}
            >
              Jenis Layanan
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setOrderType("kiloan")}
                style={{
                  flex: 1,
                  backgroundColor: orderType === "kiloan" ? "#4577C3" : "#fff",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  borderWidth: orderType === "kiloan" ? 0 : 1,
                  borderColor: "#ddd",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: orderType === "kiloan" ? "#fff" : "#333",
                  }}
                >
                  📊 Kiloan
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOrderType("satuan")}
                style={{
                  flex: 1,
                  backgroundColor: orderType === "satuan" ? "#4577C3" : "#fff",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  borderWidth: orderType === "satuan" ? 0 : 1,
                  borderColor: "#ddd",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: orderType === "satuan" ? "#fff" : "#333",
                  }}
                >
                  👕 Satuan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Kiloan Input */}
          {orderType === "kiloan" && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: "#333",
                }}
              >
                Berat Barang (kg)
              </Text>
              <TextInput
                placeholder="Contoh: 5"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 14,
                  backgroundColor: "#fff",
                }}
              />
              <Text style={{ fontSize: 11, color: "#999", marginTop: 8 }}>
                Harga: Rp {PRICE_LIST.kiloan.toLocaleString("id-ID")}/kg
              </Text>
            </View>
          )}

          {/* Satuan Items */}
          {orderType === "satuan" && (
            <View style={{ marginBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#333" }}
                >
                  Daftar Barang
                </Text>
                <TouchableOpacity
                  onPress={() => setShowItemModal(true)}
                  style={{
                    backgroundColor: "#4577C3",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{ fontSize: 12, fontWeight: "600", color: "#fff" }}
                  >
                    + Tambah
                  </Text>
                </TouchableOpacity>
              </View>

              {items.length > 0 ? (
                <FlatList
                  data={items}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: "#E3F2FD",
                    borderRadius: 8,
                    padding: 16,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#2196F3",
                      textAlign: "center",
                    }}
                  >
                    Belum ada barang. Klik "Tambah" untuk menambahkan barang.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Address Input */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Alamat Pengiriman
            </Text>
            <TextInput
              placeholder="Masukkan alamat lengkap"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: "#fff",
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Notes */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Catatan Khusus (Opsional)
            </Text>
            <TextInput
              placeholder="Contoh: Hati-hati warna, jangan diputihkan"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: "#fff",
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Payment Method */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Metode Pembayaran
            </Text>

            {["manual", "qris", "va"].map((method) => (
              <TouchableOpacity
                key={method}
                onPress={() => setSelectedPayment(method as any)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 8,
                  backgroundColor:
                    selectedPayment === method ? "#E8EEF5" : "#fff",
                  borderWidth: selectedPayment === method ? 2 : 1,
                  borderColor: selectedPayment === method ? "#4577C3" : "#ddd",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor:
                      selectedPayment === method ? "#4577C3" : "#ddd",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  {selectedPayment === method && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#4577C3",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#333" }}
                >
                  {method === "manual"
                    ? "Transfer Manual"
                    : method === "qris"
                      ? "QRIS"
                      : "Virtual Account"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Voucher Section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              🎁 Voucher / Promo
            </Text>

            {selectedVoucher ? (
              <View
                style={{
                  backgroundColor: "#FFF3E0",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: "#FF9800",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={{ fontSize: 13, fontWeight: "700", color: "#333" }}
                  >
                    ✓ Voucher Terpilih
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedVoucher(null)}
                    style={{ padding: 4 }}
                  >
                    <Text style={{ fontSize: 16, color: "#FF9800" }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: "600", color: "#666" }}
                >
                  {selectedVoucher.substr(0, 20)}
                  {selectedVoucher.length > 20 ? "..." : ""}
                </Text>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowVoucherModal(true)}
                style={{
                  flex: 1,
                  backgroundColor: "#FFF",
                  borderWidth: 1,
                  borderColor: "#FF9800",
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#FF9800",
                  }}
                >
                  Pilih Voucher ({availableVouchers.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Total with Price Breakdown */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderTopWidth: 2,
              borderTopColor: "#4577C3",
            }}
          >
            {selectedVoucher && getCalculatedPrice().discountAmount > 0 ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#999" }}>
                    Harga Awal
                  </Text>
                  <Text style={{ fontSize: 12, color: "#999" }}>
                    Rp{" "}
                    {getCalculatedPrice()
                      .baseTotal.toLocaleString("id-ID")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#22C55E" }}>
                    Potongan Voucher
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#22C55E" }}>
                    -Rp{" "}
                    {getCalculatedPrice()
                      .discountAmount.toLocaleString("id-ID")}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Total Pembayaran
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#4577C3",
                    }}
                  >
                    Rp{" "}
                    {getCalculatedPrice()
                      .finalAmount.toLocaleString("id-ID")}
                  </Text>
                </View>
              </>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 13, color: "#666" }}>Total Harga</Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#4577C3",
                  }}
                >
                  Rp {calculateTotal().toLocaleString("id-ID")}
                </Text>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmitOrder}
            disabled={isSubmitting}
            style={{
              backgroundColor: "#4577C3",
              borderRadius: 8,
              paddingVertical: 14,
              marginBottom: 32,
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {isSubmitting ? "⏳ Membuat Pesanan..." : "✓ Buat Pesanan"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal visible={showItemModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 32,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 20 }}>
              Tambah Barang
            </Text>

            <TextInput
              placeholder="Nama barang"
              value={newItem.name}
              onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 12,
              }}
            />

            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Kategori
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 12,
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {(
                Object.keys(PRICE_LIST.satuan) as Array<
                  keyof typeof PRICE_LIST.satuan
                >
              ).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setNewItem({ ...newItem, category: cat })}
                  style={{
                    backgroundColor:
                      newItem.category === cat ? "#4577C3" : "#f0f0f0",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: newItem.category === cat ? "#fff" : "#333",
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Jumlah"
              value={newItem.quantity.toString()}
              onChangeText={(text) =>
                setNewItem({ ...newItem, quantity: parseInt(text) || 0 })
              }
              keyboardType="number-pad"
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 16,
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowItemModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#999" }}
                >
                  Batal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddItem}
                style={{
                  flex: 1,
                  backgroundColor: "#4577C3",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}
                >
                  Tambah
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Voucher Modal */}
      <Modal visible={showVoucherModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 32,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>
                🎁 Pilih Voucher
              </Text>
              <TouchableOpacity onPress={() => setShowVoucherModal(false)}>
                <Text style={{ fontSize: 20, color: "#999" }}>✕</Text>
              </TouchableOpacity>
            </View>

            {availableVouchers.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 32 }}>
                <Text style={{ fontSize: 14, color: "#999", marginBottom: 8 }}>
                  Belum ada voucher yang diklaim
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  Klaim voucher di halaman Promo terlebih dahulu
                </Text>
              </View>
            ) : (
              <ScrollView
                style={{ maxHeight: 300, marginBottom: 16 }}
                showsVerticalScrollIndicator={false}
              >
                {availableVouchers.map((userVoucher) => {
                  const voucher = userVoucher.voucher;
                  const isSelected = selectedVoucher === userVoucher.id;

                  return (
                    <TouchableOpacity
                      key={userVoucher.id}
                      onPress={() => {
                        setSelectedVoucher(userVoucher.id);
                        setShowVoucherModal(false);
                      }}
                      style={{
                        backgroundColor: isSelected ? "#E8EEF5" : "#f9f9f9",
                        borderWidth: isSelected ? 2 : 1,
                        borderColor: isSelected ? "#4577C3" : "#eee",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: "#333",
                          }}
                        >
                          {voucher.code}
                        </Text>
                        {isSelected && (
                          <View
                            style={{
                              backgroundColor: "#4577C3",
                              borderRadius: 50,
                              width: 20,
                              height: 20,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>
                              ✓
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={{
                          fontSize: 11,
                          color: "#666",
                          marginBottom: 6,
                        }}
                      >
                        {voucher.description}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor:
                              voucher.type === "discount"
                                ? "#E3F2FD"
                                : "#E8F5E9",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 10,
                              fontWeight: "600",
                              color:
                                voucher.type === "discount"
                                  ? "#1976D2"
                                  : "#388E3C",
                            }}
                          >
                            {voucher.type === "discount"
                              ? voucher.discountType === "percentage"
                                ? `${voucher.discountValue}%`
                                : `Rp ${(voucher.discountValue || 0).toLocaleString(
                                    "id-ID"
                                  )}`
                              : `${voucher.freeWeight}kg Gratis`}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 10,
                            color: "#999",
                          }}
                        >
                          Min. Rp{" "}
                          {(voucher.minimumOrder || 0).toLocaleString("id-ID")}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {availableVouchers.length > 0 && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVoucher(null);
                    setShowVoucherModal(false);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#999",
                    }}
                  >
                    Tidak Pakai
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowVoucherModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: "#4577C3",
                    borderRadius: 8,
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Terapkan
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OrderFormScreen;
