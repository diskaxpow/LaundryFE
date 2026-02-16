import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
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

const ORDER_STATUSES: Array<
  "pending" | "washing" | "ironing" | "ready" | "done"
> = ["pending", "washing", "ironing", "ready", "done"];

export const AdminDashboardScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString(),
  );

  const totalRevenueToday = todayOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const activeOrders = orders.filter(
    (o) => !["done", "cancelled"].includes(o.status),
  );

  const handleStatusUpdate = (newStatus: (typeof ORDER_STATUSES)[number]) => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus);
      Alert.alert(
        "Berhasil",
        `Status pesanan diubah menjadi ${ORDER_STATUS_INFO[newStatus].label}`,
      );
      setShowStatusModal(false);
      setSelectedOrder(null);
    }
  };

  const renderOrderCard = ({ item }: { item: any }) => {
    const status =
      ORDER_STATUS_INFO[item.status as keyof typeof ORDER_STATUS_INFO];

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedOrder(item);
          setShowStatusModal(true);
        }}
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
            marginBottom: 8,
          }}
        >
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
              {item.clientName}
            </Text>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
              Order #{item.id.substring(6, 10)}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: status.bgColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{ fontSize: 11, fontWeight: "600", color: status.color }}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          📍 {item.address}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 12, color: "#999" }}>
            ☎️ {item.clientPhone}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#4577C3" }}>
            Rp {item.totalPrice.toLocaleString("id-ID")}
          </Text>
        </View>

        {item.notes && (
          <Text
            style={{
              fontSize: 11,
              color: "#FF7A45",
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            📝 {item.notes}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#52C41A",
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
                Dashboard Admin 🔧
              </Text>
              <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                Kelola semua pesanan laundry
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
              flexWrap: "wrap",
            }}
          >
            <View
              style={{
                flex: 1,
                minWidth: "48%",
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
              <Text style={{ fontSize: 24, marginBottom: 4 }}>📊</Text>
              <Text style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                Hari Ini
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#52C41A" }}
              >
                {todayOrders.length}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                minWidth: "48%",
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
              <Text style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                Pendapatan
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#4577C3" }}
              >
                Rp {Math.floor(totalRevenueToday / 1000)}k
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                minWidth: "48%",
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
              <Text style={{ fontSize: 24, marginBottom: 4 }}>⚙️</Text>
              <Text style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                Proses
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#FF7A45" }}
              >
                {activeOrders.length}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                minWidth: "48%",
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
              <Text style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>
                Selesai
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#52C41A" }}
              >
                {orders.filter((o) => o.status === "done").length}
              </Text>
            </View>
          </View>

          {/* Status Filters */}
          <View style={{ marginBottom: 20 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20, paddingHorizontal: 20 }}
            >
              {ORDER_STATUSES.map((status) => {
                const statusInfo = ORDER_STATUS_INFO[status];
                const count = orders.filter((o) => o.status === status).length;

                return (
                  <View
                    key={status}
                    style={{
                      backgroundColor: statusInfo.bgColor,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      marginRight: 8,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label} ({count})
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* All Orders */}
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#333" }}>
                Semua Pesanan
              </Text>
              <Text style={{ fontSize: 12, color: "#999" }}>
                {orders.length} pesanan
              </Text>
            </View>

            {orders.length > 0 ? (
              <FlatList
                data={orders}
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
                  message="Tidak ada pesanan"
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
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
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 20 }}>
              Ubah Status Pesanan
            </Text>

            {ORDER_STATUSES.map((status) => {
              const statusInfo = ORDER_STATUS_INFO[status];
              const isCurrentStatus = selectedOrder?.status === status;

              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusUpdate(status)}
                  style={{
                    backgroundColor: isCurrentStatus
                      ? statusInfo.bgColor
                      : "#f5f5f5",
                    borderRadius: 8,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginBottom: 8,
                    borderWidth: isCurrentStatus ? 2 : 0,
                    borderColor: statusInfo.color,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: isCurrentStatus ? statusInfo.color : "#666",
                    }}
                  >
                    {statusInfo.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
              }}
              style={{
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                paddingVertical: 12,
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#999",
                  textAlign: "center",
                }}
              >
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AdminDashboardScreen;
