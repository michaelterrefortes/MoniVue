import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { TouchableOpacity } from "react-native";
import AccountButton from "../../../../components/AccountButton";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackTitle: "",

          headerShown: true,

          //headerLargeTitle: true,
          headerLargeTitleEnabled: true,
          headerTitle: "Bills & Utilities",
          //headerRight: () => <AccountButton />,

          unstable_headerRightItems: () => [
            {
              type: "custom",
              element: (
                <TouchableOpacity onPress={() => router.push(`/bills/addBill`)}>
                  <SymbolView
                    name={{ ios: "plus" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              ),
            },
            { type: "custom", element: <AccountButton /> },
          ],
        }}
      />
    </Stack>
  );
};

export default Layout;
