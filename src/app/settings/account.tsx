import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DebtContext } from "../../../context/DebtContext";

const Account = () => {
  const { isDarkMode } = useContext(DebtContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#000" },
      ]}
    >
      <Text style={{ color: isDarkMode ? "#000" : "#fff" }}>Account</Text>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
