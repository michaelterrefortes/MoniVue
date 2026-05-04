import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const AccountButton = () => {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/settings/account`)}>
      <SymbolView name={{ ios: "person.fill" }} tintColor={"#000"} size={20} />
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
