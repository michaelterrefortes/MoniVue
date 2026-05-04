import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { validatePassword } from "../../../constants/functions";
import { supabase } from "../../../services/auth";

const ChangePassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordWarning, setPasswordWarning] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [passwordIncorrectWarning, setPasswordIncorrectWarning] =
    useState(false);

  const handleUpdate = async () => {
    let warning = false;
    if (password.trim() === "") {
      setPasswordWarning(true);
      warning = true;
    } else if (!validatePassword(password)) {
      setPasswordIncorrectWarning(true);
      warning = true;
    }

    if (warning) return;

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated");
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            //style={styles.input}
            style={{ width: "90%" }}
            placeholder="New Password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              if (val.trim() !== "") {
                (setPasswordWarning(false), setPasswordIncorrectWarning(false));
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
      </View>

      {passwordWarning && (
        <Text style={styles.warning}>* Field Missing Value</Text>
      )}
      {passwordIncorrectWarning && (
        <Text style={[styles.warning, { width: "90%" }]}>
          * Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonTextRegular}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "rgb(242, 242, 242)",
  },

  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    width: "70%",
    alignSelf: "center",
    marginBottom: 15, // ⬅️ spacing between items
  },

  label: {
    fontSize: 12,
    color: "gray",
  },

  value: {
    fontSize: 14,
    color: "#000",
    marginTop: 4,
  },

  input: {
    fontSize: 14,
  },

  buttonText: {
    fontSize: 14,
    color: "red",
    textAlign: "left",
  },

  buttonTextRegular: {
    fontSize: 14,
    color: "blue",
    textAlign: "left",
  },
  warning: {
    color: "red",
    //spaddingLeft: 70,
    //paddingBottom: 10
    textAlign: "left",

    //marginTop: 5,
    marginBottom: 10,
  },
});
