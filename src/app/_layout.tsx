import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { TouchableOpacity, useColorScheme } from "react-native";
import { DebtProvider } from "../../context/DebtContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  return (
    <DebtProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(auth)"
          options={{
            headerBackTitle: "",

            headerShown: false,
            headerTitle: "",
            //headerLargeTitle: true,
            //headerLargeTitleEnabled: true,
            //headerRight: () => <AccountButton />,
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            headerBackTitle: "",

            headerShown: false,
            headerTitle: "",
            //headerLargeTitle: true,
            //headerLargeTitleEnabled: true,
            //headerRight: () => <AccountButton />,
          }}
        />

        <Stack.Screen
          name="settings/account"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Account",
            headerShadowVisible: false,
            headerBlurEffect: "none",
            headerLargeTitleEnabled: true,

            //presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="settings/change-income"
          options={({ navigation }) => ({
            headerBackTitle: "",

            headerShown: true,
            headerTransparent: true,
            headerTitle: "Change Income",
            headerShadowVisible: false,
            headerBlurEffect: "none",
            headerLargeTitleEnabled: true,

            //presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="settings/change-email"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Change Email",
            headerShadowVisible: false,
            headerBlurEffect: "none",
            headerLargeTitleEnabled: true,

            //presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="settings/change-password"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Change Password",
            headerShadowVisible: false,
            headerBlurEffect: "none",
            headerLargeTitleEnabled: true,

            //presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="debts/addDebt"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Add Credit Card",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            //navigationBarHidden: false,

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="debts/[debtId]"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            //navigationBarHidden: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),
          })}
        />

        <Stack.Screen
          name="debts/editDebt"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Edit Credit Card",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="bills/[billId]"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "formSheet",

            sheetGrabberVisible: true,
            sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="bills/addBill"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Add Bill",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="bills/editBill"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Edit Bill",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="spending/[spendingId]"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "formSheet",

            sheetGrabberVisible: true,
            sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),

            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="spending/addSpending"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Add Expense",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),
            //navigationBarHidden: false,
          })}
        />

        <Stack.Screen
          name="spending/editSpending"
          options={({ navigation }) => ({
            headerBackTitle: "",
            headerShown: true,
            headerTransparent: true,
            headerTitle: "Edit Expense",
            headerShadowVisible: false,
            headerBlurEffect: "none",

            presentation: "modal",

            //sheetGrabberVisible: true,
            //sheetAllowedDetents: "all",

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  //backgroundColor: "grey",
                  width: 35,
                  height: 35,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SymbolView
                  name={{ ios: "xmark" }}
                  tintColor={isDarkMode ? "#fff" : "#000"}
                  size={20}
                />
              </TouchableOpacity>
            ),

            //navigationBarHidden: false,
          })}
        />
      </Stack>
    </DebtProvider>
  );
}
