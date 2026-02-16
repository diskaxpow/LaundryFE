import { Stack } from "expo-router";

export default function ClientLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#4577C3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: "🏠 Dashboard",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="order-form"
        options={{
          title: "📦 Pesan Baru",
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "💳 Pembayaran",
          headerBackTitle: "Kembali",
        }}
      />
      <Stack.Screen
        name="voucher"
        options={{
          title: "🎁 Voucher & Promo",
          headerBackTitle: "Kembali",
        }}
      />
    </Stack>
  );
}
