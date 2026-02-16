import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#52C41A",
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
          title: "🔧 Admin Dashboard",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "💳 Pembayaran",
          headerBackTitle: "Kembali",
        }}
      />
    </Stack>
  );
}
