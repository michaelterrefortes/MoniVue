import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { DebtContext } from "../../../context/DebtContext";
import { updateProfile } from "../../../services/api";

const ChangeIncome = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { income, setIncome } = useContext(DebtContext);
  const [localIncome, setLocalIncome] = useState(null);
  const [incomeWarning, setIncomeWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    let warning = false;

    if (localIncome === null) {
      setIncomeWarning(true);
      warning = true;
    }
    if (warning) return;

    setLoading(true);

    const result = await updateProfile(localIncome);

    setLoading(false);

    //console.log(result);

    if (result?.success) {
      setIncome(result.data.income);
      router.back();
    } else {
      Alert.alert("Error", result.error);
    }

    //alert("Check your email to confirm.");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
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
          <CurrencyInput
            style={[
              styles.input,
              isDarkMode ? styles.darkField : styles.lightField,
            ]}
            value={localIncome}
            //onChangeValue={setIncome}
            onChangeValue={(val) => {
              setLocalIncome(val);
              if (val !== null) setIncomeWarning(false);
            }}
            prefix="$"
            delimiter=","
            separator="."
            precision={2}
            minValue={0}
            placeholder="$0.00"
            placeholderTextColor={"grey"}
            //showPositiveSign
            //onChangeText={(formattedValue) => {
            //  console.log(formattedValue);
            //}}
          />
        </View>
        {incomeWarning && (
          <Text style={styles.warning}>* Field Missing Value</Text>
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
            Update Income
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
              Processing update ...
            </Text>
            <ActivityIndicator size={20} color="gray" />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangeIncome;

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
