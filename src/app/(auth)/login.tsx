import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Login = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/(index)")}>
        <Text>HomeSreen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
