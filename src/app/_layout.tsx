import { Stack } from "expo-router";
import { Button } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      {" "}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerBackTitle: "",
          headerShown: false,
          headerTitle: "",
        }}
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
          headerLeft: () => (
            <Button title="Cancel" onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <Button title="✓" onPress={() => alert("Done pressed!")} />
          ),
          //navigationBarHidden: false,
        })}
      />
    </Stack>
  );
}
