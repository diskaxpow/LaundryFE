import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuthStore } from "../store/authStore";

// Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import ClientDashboardScreen from "../screens/client/ClientDashboardScreen";
import OrderFormScreen from "../screens/client/OrderFormScreen";
import PaymentScreen from "../screens/shared/PaymentScreen";

const Stack = createNativeStackNavigator();

export const Navigation = () => {
  const { isLoggedIn, user } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
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
        {!isLoggedIn || !user ? (
          // Auth Stack - Login
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animationTypeForReplace: isLoggedIn ? "pop" : undefined,
              }}
            />
          </Stack.Group>
        ) : user.role === "admin" ? (
          // Admin Stack
          <Stack.Group
            screenOptions={{
              headerStyle: {
                backgroundColor: "#52C41A",
              },
            }}
          >
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{
                title: "🔧 Admin Dashboard",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                title: "💳 Pembayaran",
                headerBackTitle: "Kembali",
              }}
            />
          </Stack.Group>
        ) : (
          // Client Stack
          <Stack.Group
            screenOptions={{
              headerStyle: {
                backgroundColor: "#4577C3",
              },
            }}
          >
            <Stack.Screen
              name="ClientDashboard"
              component={ClientDashboardScreen}
              options={{
                title: "🏠 Dashboard",
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="OrderForm"
              component={OrderFormScreen}
              options={{
                title: "📦 Pesan Baru",
                headerBackTitle: "Kembali",
              }}
            />
            <Stack.Screen
              name="Payment"
              component={PaymentScreen}
              options={{
                title: "💳 Pembayaran",
                headerBackTitle: "Kembali",
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
