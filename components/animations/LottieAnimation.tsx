import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";

interface LottieAnimationProps {
  type: "loading" | "success" | "error" | "empty" | "washing";
  width?: number;
  height?: number;
  message?: string;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  type,
  width = 200,
  height = 200,
  message,
}) => {
  // Using free Lottie animations from LottieFiles
  const animationSources: Record<string, string> = {
    loading:
      "https://lottie.host/4db41720-3b4c-4e4f-8200-5f87f40b6e4c/DFqEBwdP0H.json",
    success:
      "https://lottie.host/04867bef-92c8-40bc-a371-75c2883b7e27/RcHMy8nXrp.json",
    error:
      "https://lottie.host/f0d01e40-019a-4c01-97c0-b1f10b2dc533/mLEchvyl8I.json",
    empty:
      "https://lottie.host/d29f8fc0-2e4d-40f4-b7fb-9c8f23ce6b9e/zKysvNMz3c.json",
    washing:
      "https://lottie.host/3d4c5b6e-7f8a-9b0c-1d2e-3f4a5b6c7d8e/washing.json",
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <LottieView
        source={{ uri: animationSources[type] }}
        autoPlay
        loop
        style={{ width, height }}
      />
      {message && (
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            color: "#666",
            textAlign: "center",
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

export default LottieAnimation;
