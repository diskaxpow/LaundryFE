import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LottieAnimation from "../../components/animations/LottieAnimation";
import { useAuthStore } from "../../store/authStore";

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoMode, setDemoMode] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validasi", "Email dan password harus diisi");
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Login Gagal", "Email atau password salah");
    }
  };

  const handleDemoLogin = async (role: "admin" | "client") => {
    const credentials =
      role === "admin"
        ? { email: "admin@laundry.com", password: "admin123" }
        : { email: "client@laundry.com", password: "client123" };

    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      Alert.alert("Login Gagal", "Terjadi kesalahan");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieAnimation type="loading" message="Sedang login..." />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "#f5f5f5" }}
      >
        <View
          style={{ flex: 1, paddingHorizontal: 20, justifyContent: "center" }}
        >
          {/* Header */}
          <View style={{ marginBottom: 40, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#4577C3",
                marginBottom: 8,
              }}
            >
              🧺 Laundry
            </Text>
            <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
              Layanan Cucian Berkualitas Terbaik
            </Text>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Email
            </Text>
            <TextInput
              placeholder="Masukkan email"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: "#fff",
              }}
              placeholderTextColor="#999"
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Password
            </Text>
            <TextInput
              placeholder="Masukkan password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: "#fff",
              }}
              placeholderTextColor="#999"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={{
              backgroundColor: "#4577C3",
              borderRadius: 8,
              paddingVertical: 14,
              marginBottom: 24,
              opacity: isLoading ? 0.6 : 1,
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
              Login
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
            <Text style={{ marginHorizontal: 12, color: "#999", fontSize: 12 }}>
              Demo
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
          </View>

          {/* Demo Buttons */}
          <TouchableOpacity
            onPress={() => handleDemoLogin("client")}
            disabled={isLoading}
            style={{
              borderWidth: 2,
              borderColor: "#FF7A45",
              borderRadius: 8,
              paddingVertical: 12,
              marginBottom: 12,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                color: "#FF7A45",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Demo Client
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDemoLogin("admin")}
            disabled={isLoading}
            style={{
              borderWidth: 2,
              borderColor: "#52C41A",
              borderRadius: 8,
              paddingVertical: 12,
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                color: "#52C41A",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Demo Admin
            </Text>
          </TouchableOpacity>

          {/* Info */}
          <View
            style={{
              marginTop: 32,
              padding: 16,
              backgroundColor: "#E8EEF5",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#4577C3",
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Demo Credentials:
            </Text>
            <Text style={{ fontSize: 11, color: "#666", lineHeight: 18 }}>
              Admin: admin@laundry.com / admin123 {"\n"}
              Client: client@laundry.com / client123
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
