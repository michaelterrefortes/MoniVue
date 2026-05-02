import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { validateEmail } from "../../../constants/functions";
import { loginProcess } from "../../../services/api";

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

    const result = await loginProcess(email, password);

    if (result?.sucess) {
      console.log(result);

      router.replace("/(tabs)/(index)");
    } else {
      Alert.alert("Error", "Problem with login");
    }
  };

  return (
    <View style={styles.container}>
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
        style={styles.button}
        onPress={processButton} //router.replace("/(tabs)/(index)")}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    paddingLeft: 70,
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

    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  toggleButton: { padding: 8 },

  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
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
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#0095ff",

    width: "50%",
  },
});
