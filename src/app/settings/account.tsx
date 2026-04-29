import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Account = () => {
  return (
    <View style={[styles.container, { backgroundColor: "rgb(242, 242, 242)" }]}>
      <Text style={{ color: "#000" }}>Account</Text>
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
