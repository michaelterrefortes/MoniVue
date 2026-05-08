import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { validateEmail } from "../../../constants/functions";
import { supabase } from "../../../services/auth";

const forgotPassword = () => {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const [emailWarning, setEmailWarning] = useState(false);

  const [emailIncorrectWarning, setEmailIncorrectWarning] = useState(false);

  const [loading, setLoading] = useState(false);

  const processButton = async () => {
    let warning = false;

    if (email.trim() === "") {
      setEmailWarning(true);
      warning = true;
    } else if (!validateEmail(email)) {
      setEmailIncorrectWarning(true);
      warning = true;
    }

    if (warning) return;

    //const result = await loginProcess(email, password);

    setLoading(true);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      // This URL must be added to your Redirect URLs in the Supabase Dashboard
      redirectTo: "https://monivue.onrender.com/restore-password",
    });
    setLoading(false);
    if (error) Alert.alert(error.message);
    else {
      Alert.alert("Reset Password", "Password reset email sent!");
      router.back();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 150 }} />

      <Text style={{ fontWeight: "700", fontSize: 32, textAlign: "center" }}>
        Reset Password
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

      <TouchableOpacity
        onPress={processButton} //router.replace("/(tabs)/(index)")}
      >
        <LinearGradient
          colors={["#2b5bfc", "#921ffa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {!loading ? (
            <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
              Reset Password
            </Text>
          ) : (
            <ActivityIndicator size={20} color="lightgray" />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default forgotPassword;

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
