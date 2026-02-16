import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LottieAnimation from "../../components/animations/LottieAnimation";
import LogoutButton from "../../components/shared/LogoutButton";
import { ORDER_STATUS_INFO } from "../../constants/mockData";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";
import { useVoucherStore } from "../../store/voucherStore";

export const ClientDashboardScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, getClientOrders } = useOrderStore();
  const { getUserVouchers } = useVoucherStore();
  const router = useRouter();

  const clientOrders = user ? getClientOrders(user.id) : [];
  const activeOrders = clientOrders.filter(
    (o) => !["done", "cancelled"].includes(o.status),
  );
  const userVouchers = user ? getUserVouchers(user.id) : [];
  const availableVouchers = userVouchers.filter((v) => !v.isUsed);

  const renderOrderCard = ({ item }: { item: any }) => {
    const status =
      ORDER_STATUS_INFO[item.status as keyof typeof ORDER_STATUS_INFO];

    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderLeftWidth: 4,
          borderLeftColor: status.color,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
            Order #{item.id.substring(6, 10)}
          </Text>
          <View
            style={{
              backgroundColor: status.bgColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{ fontSize: 12, fontWeight: "600", color: status.color }}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          {item.address}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: "#999" }}>
            {new Date(item.pickupDate).toLocaleDateString("id-ID")}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#4577C3" }}>
            Rp {item.totalPrice.toLocaleString("id-ID")}
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            marginTop: 12,
            height: 6,
            backgroundColor: "#f0f0f0",
            borderRadius: 3,
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${getProgressPercentage(item.status)}%`,
              backgroundColor: status.color,
              borderRadius: 3,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const getProgressPercentage = (status: string): number => {
    const statuses = ["pending", "washing", "ironing", "ready", "done"];
    const index = statuses.indexOf(status);
    return ((index + 1) / statuses.length) * 100;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#4577C3",
          paddingTop: 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#fff",
                marginBottom: 4,
              }}
            >
              Halo, {user?.name}! 👋
            </Text>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              Selamat datang di aplikasi laundry
            </Text>
          </View>
          <LogoutButton style={{ marginLeft: 12 }} />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: -16 }}>
        {/* Stats Cards */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>💰</Text>
            <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              Saldo
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#4577C3" }}>
              Rp 500k
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>📦</Text>
            <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              Aktif
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#FF7A45" }}>
              {activeOrders.length}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 4 }}>✓</Text>
            <Text style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
              Selesai
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#52C41A" }}>
              {clientOrders.filter((o) => o.status === "done").length}
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/client/order-form")}
            style={{
              flex: 1,
              backgroundColor: "#4577C3",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              + Pesan Baru
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/client/voucher")}
            style={{
              flex: 1,
              backgroundColor: "#FF7A45",
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>🎁 Promo</Text>
          </TouchableOpacity>
        </View>

        {/* Available Vouchers Section */}
        {availableVouchers.length > 0 && (
          <View
            style={{
              backgroundColor: "#FFF3E0",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              borderLeftWidth: 4,
              borderLeftColor: "#FF7A45",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#333",
                }}
              >
                💳 Voucher Tersedia ({availableVouchers.length})
              </Text>
              <TouchableOpacity onPress={() => router.push("/client/voucher")}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#FF7A45",
                  }}
                >
                  Lihat &gt;
                </Text>
              </TouchableOpacity>
            </View>
            {availableVouchers.slice(0, 2).map((uv) => (
              <View
                key={uv.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: 2,
                  }}
                >
                  {uv.voucher.code}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#666",
                  }}
                >
                  {uv.voucher.description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Active Orders */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#333" }}>
              Pesanan Aktif
            </Text>
            {activeOrders.length > 0 && (
              <Text style={{ fontSize: 12, color: "#999" }}>
                {activeOrders.length} pesanan
              </Text>
            )}
          </View>

          {activeOrders.length > 0 ? (
            <FlatList
              data={activeOrders}
              renderItem={renderOrderCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <LottieAnimation
                type="empty"
                width={150}
                height={150}
                message="Tidak ada pesanan aktif"
              />
            </View>
          )}
        </View>

        {/* Completed Orders */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#333",
              marginBottom: 12,
            }}
          >
            Riwayat Pesanan
          </Text>

          {clientOrders.filter((o) => o.status === "done").length > 0 ? (
            <FlatList
              data={clientOrders.filter((o) => o.status === "done").slice(0, 3)}
              renderItem={renderOrderCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text
              style={{
                fontSize: 12,
                color: "#999",
                textAlign: "center",
                paddingVertical: 20,
              }}
            >
              Belum ada riwayat pesanan
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ClientDashboardScreen;
