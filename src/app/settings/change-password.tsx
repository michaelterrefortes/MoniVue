import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { validatePassword } from "../../../constants/functions";
import { supabase } from "../../../services/auth";

const ChangePassword = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [password, setPassword] = useState("");
  const [passwordWarning, setPasswordWarning] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [passwordIncorrectWarning, setPasswordIncorrectWarning] =
    useState(false);

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, isDarkMode ? styles.darkBg : styles.lightBg]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      //keyboardVerticalOffset={90} // adjust if header overlaps
    >
      <ScrollView
        style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}
      >
        <View style={{ height: 250 }} />
        <View
          style={[
            styles.button,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <TextInput
              //style={styles.input}
              style={{ width: "90%" }}
              placeholder="New Password"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (val.trim() !== "") {
                  (setPasswordWarning(false),
                    setPasswordIncorrectWarning(false));
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
                  tintColor={isDarkMode ? "white" : "#000"}
                  size={20}
                />
              ) : (
                <SymbolView
                  name={{ ios: "eye" }}
                  tintColor={isDarkMode ? "white" : "#000"}
                  size={20}
                />
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

        <TouchableOpacity
          style={[
            styles.button,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
          onPress={handleUpdate}
        >
          <Text
            style={[
              styles.buttonTextRegular,
              { color: isDarkMode ? "lightblue" : "blue" },
            ]}
          >
            Update Password
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              //marginTop: 10,
              marginBottom: 10,
              flexDirection: "row",
            }}
          >
            <Text
              style={[
                { marginRight: 5 },
                isDarkMode ? styles.lightText : styles.darkText,
              ]}
            >
              Processing request ...
            </Text>
            <ActivityIndicator size={20} color="gray" />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#000" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

  container: {
    flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
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
