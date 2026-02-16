import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useVoucherStore } from "../../store/voucherStore";
import { useAuthStore } from "../../store/authStore";

export const ClaimVoucherScreen: React.FC = () => {
  const { user } = useAuthStore();
  const {
    vouchers,
    userVouchers,
    claimVoucher,
    getUserVouchers,
    setError,
    error,
    isLoading,
  } = useVoucherStore();

  const [tabActive, setTabActive] = useState<"available" | "claimed">(
    "available"
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const userClaimed = user ? getUserVouchers(user.id) : [];

  const handleClaimByCode = () => {
    if (!voucherCode.trim()) {
      Alert.alert("Validasi", "Masukkan kode voucher");
      return;
    }

    if (!user) {
      Alert.alert("Error", "User tidak ditemukan");
      return;
    }

    try {
      claimVoucher(user.id, voucherCode.toUpperCase());
      Alert.alert("✅ Berhasil", "Voucher berhasil di-claim!");
      setVoucherCode("");
      setShowCodeModal(false);
    } catch (err) {
      Alert.alert("❌ Gagal", (err as Error).message);
    }
  };

  const handleClaimVoucher = (voucherId: string) => {
    if (!user) {
      Alert.alert("Error", "User tidak ditemukan");
      return;
    }

    try {
      claimVoucher(user.id, voucherId);
      Alert.alert("✅ Berhasil", "Voucher berhasil di-claim!");
    } catch (err) {
      Alert.alert("❌ Gagal", (err as Error).message);
    }
  };

  const renderVoucherCard = ({
    item,
    showClaimButton = true,
  }: {
    item: any;
    showClaimButton?: boolean;
  }) => {
    const isPercentage = item.discountType === "percentage";
    const discountDisplay =
      item.type === "discount"
        ? isPercentage
          ? `${item.discountValue}%`
          : `Rp ${item.discountValue?.toLocaleString("id-ID")}`
        : `${item.freeWeight}kg Gratis`;

    const isExpired = new Date(item.expiryDate) < new Date();

    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: isExpired ? "#ccc" : "#4577C3",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          opacity: isExpired ? 0.6 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#333",
                marginBottom: 4,
              }}
            >
              {item.code}
            </Text>
            <Text style={{ fontSize: 12, color: "#999" }}>
              {item.description}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: item.type === "discount" ? "#E3F2FD" : "#F3E5F5",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: item.type === "discount" ? "#2196F3" : "#9C27B0",
              }}
            >
              {discountDisplay}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 11, color: "#999" }}>
            Min: Rp {(item.minimumOrder || 0).toLocaleString("id-ID")}
          </Text>
          <Text style={{ fontSize: 11, color: "#999" }}>
            Berakhir:{" "}
            {new Date(item.expiryDate).toLocaleDateString("id-ID", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>

        {showClaimButton && (
          <TouchableOpacity
            onPress={() => handleClaimVoucher(item.id)}
            disabled={
              isExpired || userClaimed.some((uv) => uv.voucherId === item.id)
            }
            style={{
              backgroundColor:
                isExpired || userClaimed.some((uv) => uv.voucherId === item.id)
                  ? "#ccc"
                  : "#4577C3",
              borderRadius: 8,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}>
              {isExpired
                ? "Expired"
                : userClaimed.some((uv) => uv.voucherId === item.id)
                ? "Sudah Di-Claim"
                : "Claim Sekarang"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

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
              fontSize: 18,
              fontWeight: "600",
              color: "#fff",
              marginBottom: 4,
            }}
          >
            🎁 Voucher & Promo
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Dapatkan diskon dengan berbagai promo menarik
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Tabs */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setTabActive("available")}
              style={{
                flex: 1,
                backgroundColor: tabActive === "available" ? "#4577C3" : "#fff",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: tabActive === "available" ? "#4577C3" : "#ddd",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: tabActive === "available" ? "#fff" : "#333",
                }}
              >
                📚 Tersedia ({vouchers.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTabActive("claimed")}
              style={{
                flex: 1,
                backgroundColor: tabActive === "claimed" ? "#4577C3" : "#fff",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: tabActive === "claimed" ? "#4577C3" : "#ddd",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: tabActive === "claimed" ? "#fff" : "#333",
                }}
              >
                ✓ Ku-Punya ({userClaimed.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Claim Button */}
          <TouchableOpacity
            onPress={() => setShowCodeModal(true)}
            style={{
              backgroundColor: "#52C41A",
              borderRadius: 8,
              paddingVertical: 12,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Input Kode Voucher
            </Text>
          </TouchableOpacity>

          {/* Available Vouchers */}
          {tabActive === "available" && (
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#333",
                  marginBottom: 12,
                }}
              >
                Promo Terbaru
              </Text>

              {vouchers.length > 0 ? (
                <FlatList
                  data={vouchers}
                  renderItem={({ item }) =>
                    renderVoucherCard({ item, showClaimButton: true })
                  }
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#999" }}>
                    Tidak ada voucher tersedia
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Claimed Vouchers */}
          {tabActive === "claimed" && (
            <View style={{ marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#333",
                  marginBottom: 12,
                }}
              >
                Voucher Saya
              </Text>

              {userClaimed.length > 0 ? (
                <FlatList
                  data={userClaimed}
                  renderItem={({ item }) =>
                    renderVoucherCard({
                      item: item.voucher,
                      showClaimButton: false,
                    })
                  }
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 20,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#999" }}>
                    Belum ada voucher yang di-claim
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Code Modal */}
      <Modal visible={showCodeModal} transparent animationType="fade">
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
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
              Input Kode Voucher
            </Text>

            <TextInput
              placeholder="Contoh: LAUNDRY20"
              value={voucherCode}
              onChangeText={(text) => setVoucherCode(text.toUpperCase())}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                marginBottom: 16,
                fontSize: 14,
                fontWeight: "600",
              }}
              placeholderTextColor="#999"
              maxLength={20}
            />

            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setShowCodeModal(false);
                  setVoucherCode("");
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#999" }}>
                  Batal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleClaimByCode}
                disabled={isLoading}
                style={{
                  flex: 1,
                  backgroundColor: "#4577C3",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>
                  {isLoading ? "⏳ Proses..." : "Claim"}
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View
                style={{
                  backgroundColor: "#FFEBEE",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                }}
              >
                <Text style={{ fontSize: 12, color: "#F44336" }}>
                  ⚠️ {error}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ClaimVoucherScreen;
