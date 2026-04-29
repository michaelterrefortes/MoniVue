import { Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Alert, TouchableOpacity, View } from "react-native";
import { DebtProvider } from "../../context/DebtContext";

export default function RootLayout() {
  return (
    <DebtProvider>
      <Stack>
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
            headerTitle: "Settings",
            headerShadowVisible: false,
            headerBlurEffect: "none",

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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />

                  <SymbolView
                    name={{ ios: "xmark" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
                  tintColor="black"
                  size={20}
                />
              </TouchableOpacity>
            ),

            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => Alert.alert("EDIT", "PRESSED EDIT")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10, // space between buttons
                  }}
                >
                  <SymbolView
                    name={{ ios: "pencil" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => Alert.alert("DELETE", "PRESSED DELETE")}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SymbolView
                    name={{ ios: "trash" }}
                    tintColor="black"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            ),

            //navigationBarHidden: false,
          })}
        />
      </Stack>
    </DebtProvider>
  );
}
