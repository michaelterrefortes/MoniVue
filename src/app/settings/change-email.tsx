import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { validateEmail } from "../../../constants/functions";
import { supabase } from "../../../services/auth";

const ChangeEmail = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);

  const [emailIncorrectWarning, setEmailIncorrectWarning] = useState(false);

  const handleUpdate = async () => {
    let warning = false;
    if (email.trim() === "") {
      setEmailWarning(true);
      warning = true;
    } else if (!validateEmail(email)) {
      setEmailIncorrectWarning(true);
      warning = true;
    }
    if (warning) return;

    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email to confirm.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <TextInput
          placeholder="New email"
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            if (val.trim() !== "") {
              (setEmailWarning(false), setEmailIncorrectWarning(false));
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      {emailWarning && (
        <Text style={styles.warning}>* Field Missing Value</Text>
      )}
      {emailIncorrectWarning && (
        <Text style={styles.warning}>* Incorrect Email. Try again.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonTextRegular}>Update Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(242, 242, 242)",
  },
  warning: {
    color: "red",
    //paddingLeft: 70,
    //paddingBottom: 10,
    textAlign: "left",
    marginBottom: 10,
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
});
