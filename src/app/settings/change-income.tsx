import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { DebtContext } from "../../../context/DebtContext";
import { updateProfile } from "../../../services/api";

const ChangeIncome = () => {
  const router = useRouter();
  const { income, setIncome } = useContext(DebtContext);
  const [localIncome, setLocalIncome] = useState(null);
  const [incomeWarning, setIncomeWarning] = useState(false);

  const handleUpdate = async () => {
    let warning = false;

    if (localIncome === null) {
      setIncomeWarning(true);
      warning = true;
    }
    if (warning) return;

    const result = await updateProfile(localIncome);

    //console.log(result);

    if (result?.success) {
      setIncome(result.data.income);
      router.back();
    } else {
      Alert.alert("Problem", "Error updating income");
    }

    //alert("Check your email to confirm.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <CurrencyInput
          style={[styles.input, { backgroundColor: "#fff" }]}
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
          placeholderTextColor={"lightgrey"}
          //showPositiveSign
          //onChangeText={(formattedValue) => {
          //  console.log(formattedValue);
          //}}
        />
      </View>
      {incomeWarning && (
        <Text style={styles.warning}>* Field Missing Value</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonTextRegular}>Update Income</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeIncome;

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
