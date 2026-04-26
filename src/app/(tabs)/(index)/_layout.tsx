import { Stack } from "expo-router";
import React from "react";
import AccountButton from "../../../../components/AccountButton";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackTitle: "",

          headerShown: true,

          headerLargeTitle: true,
          //headerLargeTitleEnabled: true,
          headerTitle: "Budget",
          headerRight: () => <AccountButton />,
        }}
      />
    </Stack>
  );
};

export default Layout;
