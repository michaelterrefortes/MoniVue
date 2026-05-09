import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, useColorScheme } from "react-native";
import AccountButton from "../../../../components/AccountButton";

const Layout = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerBackTitle: "",

          headerShown: true,

          //headerLargeTitle: true,
          headerLargeTitleEnabled: true,
          headerTitle: "Bills",
          //headerRight: () => <AccountButton />,

          unstable_headerRightItems: () => [
            {
              type: "custom",
              element: (
                <TouchableOpacity onPress={() => router.push(`/bills/addBill`)}>
                  <SymbolView
                    name={{ ios: "plus" }}
                    tintColor={isDarkMode ? "#fff" : "#000"}
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
