import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackTitle: "",

          headerShown: false,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="login"
        options={({ navigation }) => ({
          headerBackTitle: "",
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerBlurEffect: "none",
        })}
      />

      <Stack.Screen
        name="forgotPassword"
        options={({ navigation }) => ({
          headerBackTitle: "",
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerBlurEffect: "none",
        })}
      />

      <Stack.Screen
        name="signup"
        options={({ navigation }) => ({
          headerBackTitle: "",
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerBlurEffect: "none",
        })}
      />
    </Stack>
  );
};

export default Layout;
