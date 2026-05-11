import { useRouter } from "expo-router";
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
import { validateEmail } from "../../../constants/functions";
import { supabase } from "../../../services/auth";

const ChangeEmail = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [emailWarning, setEmailWarning] = useState(false);

  const [emailIncorrectWarning, setEmailIncorrectWarning] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ email });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Check your email to confirm.");
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
            style={[
              styles.input,
              isDarkMode ? styles.darkField : styles.lightField,
            ]}
          />
        </View>

        {emailWarning && (
          <Text style={styles.warning}>* Field Missing Value</Text>
        )}
        {emailIncorrectWarning && (
          <Text style={styles.warning}>* Incorrect Email. Try again.</Text>
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
            Update Email
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

export default ChangeEmail;

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
