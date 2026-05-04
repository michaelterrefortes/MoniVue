import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AuthScreen = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        style={styles.button}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          Log in
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/signup")}
        style={{ flexDirection: "row" }}
      >
        <Text style={{ marginTop: 20, textAlign: "center", fontSize: 15 }}>
          Don't have an account? Sign up
        </Text>
        {/*<Text
          style={{
            marginTop: 20,
            textAlign: "center",
            fontSize: 15,
            color: "blue",
          }}
        >
          Sign up
        </Text>*/}
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    alignSelf: "center",
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#0095ff",

    width: "50%",
  },
});
