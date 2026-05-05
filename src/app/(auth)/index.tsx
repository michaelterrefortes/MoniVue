import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { validateEmail } from "../../../constants/functions";
import { supabase } from "../../../services/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const [emailWarning, setEmailWarning] = useState(false);

  const [passwordWarning, setPasswordWarning] = useState(false);
  const [emailIncorrectWarning, setEmailIncorrectWarning] = useState(false);

  const processButton = async () => {
    let warning = false;

    if (email.trim() === "") {
      setEmailWarning(true);
      warning = true;
    } else if (!validateEmail(email)) {
      setEmailIncorrectWarning(true);
      warning = true;
    }

    if (password.trim() === "") {
      setPasswordWarning(true);
      warning = true;
    }

    if (warning) return;

    //const result = await loginProcess(email, password);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    else router.replace("/(tabs)/(index)");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: "30%" }} />

      <Image
        source={require("../../../assets/images/icon-zerodebt.png")}
        style={{ width: 100, height: 100, alignSelf: "center" }}
      />

      <Text style={{ fontWeight: "700", fontSize: 32, textAlign: "center" }}>
        Welcome Back
      </Text>
      <Text style={{ textAlign: "center", marginTop: 10 }}>
        Sign in to manage your budget
      </Text>
      {/* Email Input */}
      <Text style={styles.title}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          if (val.trim() !== "") {
            (setEmailWarning(false), setEmailIncorrectWarning(false));
          }
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailWarning && (
        <Text style={styles.warning}>* Field Missing Value</Text>
      )}
      {emailIncorrectWarning && (
        <Text style={styles.warning}>* Incorrect Email. Try again.</Text>
      )}

      {/* Password Input with Toggle */}

      <View>
        <Text style={styles.title}>Password</Text>
        <View
          style={[
            styles.input,
            { flexDirection: "row", justifyContent: "space-between" },
          ]}
        >
          <TextInput
            //style={styles.input}
            style={{ width: "90%" }}
            placeholder="Password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (val.trim() !== "") {
                setPasswordWarning(false);
              }
            }}
            secureTextEntry={!isPasswordVisible} // Toggles visibility
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <SymbolView
                name={{ ios: "eye.slash" }}
                tintColor={"#000"}
                size={20}
              />
            ) : (
              <SymbolView name={{ ios: "eye" }} tintColor={"#000"} size={20} />
            )}
          </TouchableOpacity>
        </View>
        {passwordWarning && (
          <Text style={styles.warning}>* Field Missing Value</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={processButton} //router.replace("/(tabs)/(index)")}
      >
        <LinearGradient
          colors={["#2b5bfc", "#921ffa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
            Sign in
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <Text style={{ marginTop: 20, textAlign: "center", fontSize: 15 }}>
          Don't have an account?{"   "}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={{ flexDirection: "row", alignSelf: "center" }}
        >
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 15,
              color: "blue",
              fontWeight: "600",
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    paddingLeft: 45,
    paddingBottom: 10,
    marginTop: 30,
  },
  warning: {
    color: "red",
    paddingLeft: 70,
    //paddingBottom: 10,
    marginTop: 5,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    //color: "gray",

    //marginBottom: 30,

    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  toggleButton: { padding: 8 },

  container: {
    padding: 20,
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    //borderBottomWidth: 1,
    alignItems: "center",
  },

  button: {
    marginTop: 30,
    alignSelf: "center",
    padding: 15,
    borderRadius: 50,
    backgroundColor: "#0095ff",

    width: "80%",
  },
});

/*import { useRouter } from "expo-router";
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
*/
