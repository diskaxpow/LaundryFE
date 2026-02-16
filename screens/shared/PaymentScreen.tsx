import React, { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PAYMENT_METHODS } from "../../constants/mockData";

interface PaymentScreenProps {
  orderId?: string;
  orderAmount?: number;
  originalAmount?: number;
  discountAmount?: number;
  onPaymentSuccess?: () => void;
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  orderId,
  orderAmount = 50000,
  originalAmount,
  discountAmount = 0,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodSelect = (
    methodId: string,
    isAvailable: boolean,
  ) => {
    if (!isAvailable) {
      Alert.alert(
        "❌ Segera Hadir",
        "Metode pembayaran ini akan segera tersedia. Silakan gunakan Transfer Manual untuk saat ini.",
      );
      return;
    }
    setSelectedMethod(methodId);
  };

  const handleConfirmPayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Validasi", "Silakan pilih metode pembayaran");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      Alert.alert(
        "✅ Pembayaran Berhasil",
        `Pembayaran sebesar Rp ${orderAmount.toLocaleString("id-ID")} telah diterima.\n\nNomor pesanan: ${orderId}`,
        [
          {
            text: "OK",
            onPress: () => {
              setIsProcessing(false);
              onPaymentSuccess?.();
            },
          },
        ],
      );
    }, 2000);
  };

  const renderPaymentMethod = ({
    item,
  }: {
    item: (typeof PAYMENT_METHODS)[0];
  }) => {
    const isSelected = selectedMethod === item.id;
    const opacity = item.isAvailable ? 1 : 0.5;

    return (
      <TouchableOpacity
        onPress={() => handlePaymentMethodSelect(item.id, item.isAvailable)}
        disabled={!item.isAvailable}
        style={{
          backgroundColor: isSelected ? "#E8EEF5" : "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? "#4577C3" : "#ddd",
          opacity: opacity,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 24, marginRight: 12 }}>{item.icon}</Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#333" }}>
                {item.name}
              </Text>
              {!item.isAvailable && (
                <Text style={{ fontSize: 11, color: "#FF7A45", marginTop: 2 }}>
                  Coming Soon 🔜
                </Text>
              )}
            </View>
          </View>
          <Text style={{ fontSize: 12, color: "#666", marginLeft: 36 }}>
            {item.description}
          </Text>
        </View>

        {isSelected && (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "#4577C3",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#4577C3",
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
          💳 Pembayaran
        </Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
          Pilih metode pembayaran Anda
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        {/* Order Summary */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderLeftWidth: 4,
            borderLeftColor: "#52C41A",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
            Pesanan #{orderId || "Baru"}
          </Text>

          {discountAmount > 0 && originalAmount ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: "#999" }}>Harga Awal</Text>
                <Text style={{ fontSize: 12, color: "#999" }}>
                  Rp {originalAmount.toLocaleString("id-ID")}
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
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#22C55E",
                  }}
                >
                  -Rp {discountAmount.toLocaleString("id-ID")}
                </Text>
              </View>
            </>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: "#666" }}>
              Total Pembayaran
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#52C41A" }}>
              Rp {orderAmount.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#333",
              marginBottom: 12,
            }}
          >
            Metode Pembayaran
          </Text>

          <FlatList
            data={PAYMENT_METHODS}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Info Box */}
        <View
          style={{
            backgroundColor: "#FFF3E0",
            borderRadius: 12,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: "#FF7A45",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#FF7A45",
              marginBottom: 8,
            }}
          >
            ℹ️ Informasi Penting
          </Text>
          <Text style={{ fontSize: 11, color: "#666", lineHeight: 18 }}>
            • Transfer manual dapat diverifikasi dalam 5-10 menit{"\n"}•
            Pastikan data pesanan sesuai sebelum melakukan pembayaran{"\n"}•
            Simpan bukti pembayaran untuk keperluan referensi
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={handleConfirmPayment}
          disabled={!selectedMethod || isProcessing}
          style={{
            backgroundColor:
              selectedMethod && !isProcessing ? "#4577C3" : "#ccc",
            borderRadius: 8,
            paddingVertical: 14,
            marginBottom: 32,
            opacity: selectedMethod && !isProcessing ? 1 : 0.6,
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
            {isProcessing ? "⏳ Memproses..." : "✓ Konfirmasi Pembayaran"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;
