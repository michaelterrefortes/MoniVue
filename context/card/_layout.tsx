import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackTitle: "",
          //headerShown: true,
          headerTitle: "Total Balance",
          headerLargeTitleEnabled: true,
        }}
      />
    </Stack>
  );
};

export default Layout;
