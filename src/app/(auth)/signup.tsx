import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { validateEmail, validatePassword } from "../../../constants/functions";
import { signupProcess } from "../../../services/api";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [income, setIncome] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [nameWarning, setNameWarning] = useState(false);
  const [lastnameWarning, setLastnameWarning] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [incomeWarning, setIncomeWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);

  const [emailIncorrectWarning, setEmailIncorrectWarning] = useState(false);
  const [passwordIncorrectWarning, setPasswordIncorrectWarning] =
    useState(false);

  const router = useRouter();

  const processButton = async () => {
    let warning = false;

    if (name.trim() === "") {
      setNameWarning(true);
      warning = true;
    }
    if (lastname.trim() === "") {
      setLastnameWarning(true);
      warning = true;
    }
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

    const result = await signupProcess(name, lastname, income, email, password);

    if (result?.sucess) {
      console.log(result);

      router.replace("/(tabs)/(index)");
    } else {
      Alert.alert("Error", "Problem with login");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 100 }} />
      <Text style={styles.title}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={name}
        onChangeText={(val) => {
          setName(val);
          if (val.trim() !== "") setNameWarning(false);
        }}
        keyboardType="default"
        autoCapitalize="none"
      />
      {nameWarning && <Text style={styles.warning}>* Field Missing Value</Text>}

      <Text style={styles.title}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastname}
        onChangeText={(val) => {
          setLastname(val);
          if (val.trim() !== "") setLastnameWarning(false);
        }}
        keyboardType="default"
        autoCapitalize="none"
      />
      {lastnameWarning && (
        <Text style={styles.warning}>* Field Missing Value</Text>
      )}

      <Text style={styles.title}>Monthly Income</Text>
      <CurrencyInput
        style={[styles.input, { backgroundColor: "#fff" }]}
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
        placeholderTextColor={"lightgrey"}
        //showPositiveSign
        //onChangeText={(formattedValue) => {
        //  console.log(formattedValue);
        //}}
      />
      {incomeWarning && (
        <Text style={styles.warning}>* Field Missing Value</Text>
      )}

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
        style={styles.button}
        onPress={processButton} //router.replace("/(tabs)/(index)")}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
          Sign up
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    paddingLeft: 70,
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

    width: "70%",
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
    padding: 20,
    borderRadius: 50,
    backgroundColor: "#0095ff",

    width: "50%",
  },
});
