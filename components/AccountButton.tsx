import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { DebtContext } from "../context/DebtContext";

const AccountButton = () => {
  const { isDarkMode } = useContext(DebtContext);

  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/settings/account`)}>
      <SymbolView
        name={{ ios: "person.fill" }}
        tintColor={isDarkMode ? "#000" : "#fff"}
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
  fab: {
    position: "absolute",
    top: 6, // adjust if your tab bar is different
    right: 20,
    backgroundColor: "#0080FF",
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
