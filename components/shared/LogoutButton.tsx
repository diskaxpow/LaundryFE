import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/authStore";

interface LogoutButtonProps {
  style?: any;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ style }) => {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin logout?", [
      {
        text: "Batal",
        onPress: () => {},
      },
      {
        text: "Ya, Logout",
        onPress: () => {
          logout();
          router.replace("/auth/login");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={[
        {
          backgroundColor: "#F44336",
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 12,
        },
        style,
      ]}
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
        🚪 Logout
      </Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
