import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

const AccountButton = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/settings/account`)}>
      <SymbolView
        name={{ ios: "person.fill" }}
        tintColor={isDarkMode ? "#fff" : "#000"}
        size={20}
      />
    </TouchableOpacity>
  );
};

export default AccountButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
