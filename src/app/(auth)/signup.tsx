import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { validateEmail, validatePassword } from "../../../constants/functions";
import { profileProcess } from "../../../services/api";
import { supabase } from "../../../services/auth";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [income, setIncome] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [emailWarning, setEmailWarning] = useState(false);
  const [incomeWarning, setIncomeWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);

  const [emailIncorrectWarning, setEmailIncorrectWarning] = useState(false);
  const [passwordIncorrectWarning, setPasswordIncorrectWarning] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const processButton = async () => {
    let warning = false;

    if (income === null) {
      setIncomeWarning(true);
      warning = true;
    }
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
    } else if (!validatePassword(password)) {
      setPasswordIncorrectWarning(true);
      warning = true;
    }

    if (warning) return;

    //const result = await signupProcess(name, lastname, income, email, password);

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    setLoading(false);
    if (error) Alert.alert(error.message);
    else {
      const response = await profileProcess(income);

      if (response?.success) router.replace("/(tabs)/(index)");
      else Alert.alert("Error", "Error signing up");
    }
  };

  const handleLink = useCallback(async () => {
    // Check if the link is supported
    const linkUrl = `https://monivue.onrender.com/privacy-policy`;
    const supported = await Linking.canOpenURL(linkUrl);

    if (supported) {
      // Open the URL
      await Linking.openURL(linkUrl);
    } else {
      Alert.alert(`Don't know how to open this URL: ${linkUrl}`);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, isDarkMode ? styles.darkBg : styles.lightBg]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      //keyboardVerticalOffset={90} // adjust if header overlaps
    >
      <ScrollView
        style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}
      >
        <View style={{ height: "20%" }} />

        <Image
          source={require("../../../assets/images/icon-monivue.png")}
          style={{ width: 100, height: 100, alignSelf: "center" }}
        />

        <Text
          style={[
            { fontWeight: "700", fontSize: 32, textAlign: "center" },
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Create Account
        </Text>
        <Text
          style={[
            { textAlign: "center", marginTop: 10 },
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Start managing your budget today
        </Text>

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Monthly Income
        </Text>
        <CurrencyInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
          value={income}
          //onChangeValue={setIncome}
          onChangeValue={(val) => {
            setIncome(val);
            if (val !== null) setIncomeWarning(false);
          }}
          prefix="$"
          delimiter=","
          separator="."
          precision={2}
          minValue={0}
          placeholder="$0.00"
          placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
          //showPositiveSign
          //onChangeText={(formattedValue) => {
          //  console.log(formattedValue);
          //}}
        />
        {incomeWarning && (
          <Text style={styles.warning}>* Field Missing Value</Text>
        )}

        {/* Email Input */}
        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
          placeholder="Email"
          value={email}
          placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
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
          <Text
            style={[
              styles.title,
              isDarkMode ? styles.lightText : styles.darkText,
            ]}
          >
            Password
          </Text>
          <View
            style={[
              styles.input,
              { flexDirection: "row", justifyContent: "space-between" },
              isDarkMode ? styles.darkField : styles.lightField,
            ]}
          >
            <TextInput
              //style={styles.input}
              style={[
                { width: "90%" },
                isDarkMode ? styles.darkField : styles.lightField,
              ]}
              placeholder="Password"
              value={password}
              placeholderTextColor={isDarkMode ? "lightgray" : "gray"}
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
                  tintColor={isDarkMode ? "white" : "black"}
                  size={20}
                />
              ) : (
                <SymbolView
                  name={{ ios: "eye" }}
                  tintColor={isDarkMode ? "white" : "black"}
                  size={20}
                />
              )}
            </TouchableOpacity>
          </View>
          {passwordWarning && (
            <Text style={styles.warning}>* Field Missing Value</Text>
          )}
          {passwordIncorrectWarning && (
            <Text style={[styles.warning, { width: "90%" }]}>
              * Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={processButton} //router.replace("/(tabs)/(index)")}
        >
          <LinearGradient
            colors={["#00a440", "#007e53"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            {!loading ? (
              <Text
                style={{ color: "#fff", textAlign: "center", fontSize: 18 }}
              >
                Sign up
              </Text>
            ) : (
              <ActivityIndicator size={20} color="lightgray" />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 15,
              color: "gray",
            }}
          >
            Already have an account?{"   "}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignSelf: "center" }}
          >
            <Text
              style={{
                marginTop: 20,
                textAlign: "center",
                fontSize: 15,
                color: "green",
                fontWeight: "600",
              }}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[{ flexDirection: "row", alignSelf: "center" }]}
          onPress={handleLink}
        >
          <Text
            style={{
              marginTop: 20,
              textAlign: "center",
              fontSize: 15,
              color: "green",
              fontWeight: "600",
            }}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#000" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

  title: {
    fontWeight: "bold",
    paddingLeft: 45,
    paddingBottom: 10,
    marginTop: 20,
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

    //flex: 1,
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
