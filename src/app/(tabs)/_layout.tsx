import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { withLayoutContext } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Platform } from "react-native";

const Icons = ({ focused, title }) => {
  //console.log(focused);
  if (focused) {
    return (
      <SymbolView
        name={{ ios: `${title}.fill` }}
        tintColor={"#000"}
        size={30}
      />
    );
  } else {
    return (
      <SymbolView name={{ ios: `${title}` }} tintColor={"#000"} size={30} />
    );
  }
};

const Tab = createNativeBottomTabNavigator();
const Tabs = withLayoutContext(Tab.Navigator);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        /*tabBarItemStyle: {
          width: "100%",
          height: "100%",
          //justifyContent: "center",
          //alignItems: "center",
          //alignSelf: "center",
        },
        tabBarStyle: {
          //backgroundColor: "#0f0d23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 25,
          //marginTop: 10,
          height: 60,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          //width: "95%",
          //justifyContent: "center",
          //alignItems: "center",

          //borderColor: "#0f0d23",
        },*/

        tabBarStyle: {
          backgroundColor: "#fff",
          borderColor: "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          title: "Home",
          //tabBarActiveTintColor: "#2f95dc",

          //headerTitle: "as",

          /*tabBarIcon: ({ focused }) => (
            <Icons focused={focused} title={"house"} />
          ),*/
          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: {
                type: "sfSymbol",
                name: focused ? "house.fill" : "house",
              },
            }),
        }}
      />
      <Tabs.Screen
        name="spendingTab"
        options={{
          title: "Spending",
          //tabBarActiveTintColor: "#2f95dc",

          /*tabBarIcon: ({ focused }) => (
            <Icons focused={focused} title={"cart"} />
          ),*/

          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: {
                type: "sfSymbol",
                name: focused ? "cart.fill" : "cart",
              },
            }),
        }}
      />
      <Tabs.Screen
        name="billsTab"
        options={{
          title: "Bills",
          //tabBarActiveTintColor: "#2f95dc",

          /*tabBarIcon: ({ focused }) => (
            <Icons focused={focused} title={"tray"} />
          ),*/

          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: {
                type: "sfSymbol",
                name: focused ? "tray.fill" : "tray",
              },
            }),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Credit",
          //tabBarActiveTintColor: "#2f95dc",
          /*tabBarIcon: ({ focused }) => (
            <Icons focused={focused} title={"creditcard"} />
          ),*/

          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: {
                type: "sfSymbol",

                name: focused ? "creditcard.fill" : "creditcard",
              },
            }),
        }}
      />
      <Tabs.Screen
        name="savingsTab"
        options={{
          title: "Savings",
          //tabBarActiveTintColor: "#2f95dc",
          /*tabBarIcon: ({ focused }) => (
            <Icons focused={focused} title={"dollarsign.bank.building"} />
          ),*/

          tabBarIcon: ({ focused }) =>
            Platform.select({
              ios: {
                type: "sfSymbol",
                name: focused
                  ? "dollarsign.bank.building.fill"
                  : "dollarsign.bank.building",
              },
            }),
        }}
      />
    </Tabs>
  );
}
