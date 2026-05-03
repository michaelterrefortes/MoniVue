import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../services/auth";

const Account = () => {
  const router = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: "rgb(242, 242, 242)" }]}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          (supabase.auth.signOut(), router.replace("/(auth)"));
        }}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
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

  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    //color: "gray",

    //marginBottom: 30,

    width: "70%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",
  },

  buttonText: {
    fontSize: 14,
    color: "red",
    textAlign: "left",
  },
});
