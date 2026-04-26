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

          //headerLargeTitle: true,
          //headerLargeTitleEnabled: true,
          //headerTitle: "as",
          //headerRight: () => <AccountButton />,
        }}
      />
    </Stack>
  );
};

export default Layout;
