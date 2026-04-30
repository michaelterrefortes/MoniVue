import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import CurrencyInput from "react-native-currency-input";
import { formatMoney } from "../../../constants/functions";
import { DebtContext } from "../../../context/DebtContext";
import { editCreditCard } from "../../../services/api";

const EditDebt = () => {
  //console.log(params.setData);
  const params = useLocalSearchParams();

  const { debts, setDebts } = useContext(DebtContext);

  const [name, setName] = useState(params.name);
  const [balance, setBalance] = useState(params.balance);
  const [limit, setLimit] = useState(params.limit);
  const [apr, setApr] = useState(params.apr);
  const [minimum, setMinimum] = useState(params.minimum);
  const [date, setDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      Number(params.date),
    ),
  );

  const [aprWarning, setAprWarning] = useState(false);
  const [nameWarning, setNameWarning] = useState(false);
  const [balanceWarning, setBalanceWarning] = useState(false);
  const [limitWarning, setLimitWarning] = useState(false);
  const [minimumWarning, setMinimumWarning] = useState(false);
  //const [dateWarning, setDateWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const cond =
      name.trim() === "" ||
      balance === null ||
      limit === null ||
      apr === null ||
      minimum === null;
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          type: "button",
          label: "Add",
          variant: "done",
          disabled: cond,
          //hidesSharedBackground: true,
          icon: {
            type: "sfSymbol",
            name: "checkmark",
          },
          onPress: () => {
            // Do something
            processForm();
          },
        },
      ],
    });
  }, [navigation, name, balance, limit, apr, date, minimum]);

  const processForm = async () => {
    let hasError = false;

    if (name.trim() === "") {
      setNameWarning(true);
      hasError = true;
    }
    if (balance === null) {
      setBalanceWarning(true);
      hasError = true;
    }
    if (limit === null) {
      setLimitWarning(true);
      hasError = true;
    }
    if (apr === null) {
      setAprWarning(true);
      hasError = true;
    }

    if (minimum === null) {
      setMinimumWarning(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const result = await editCreditCard(
      params.id,
      name,
      balance,
      limit,
      apr,
      minimum,
      date,
    );

    setLoading(false);

    if (result?.success) {
      setDebts((prevDebt) =>
        prevDebt.map((debt) =>
          debt.id === result.data.id ? result.data : debt,
        ),
      );

      router.dismissAll();
    } else {
      Alert.alert("Problem", result.wrong);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "rgb(242, 242, 242)" }}>
      <View style={{ height: 100, width: "100%" }} />
      {balance === null || balance === null ? (
        <Text
          style={[
            styles.numberBalance,
            {
              backgroundColor: "#fff",
              color: "#000",
            },
          ]}
        >
          {formatMoney(0)}
        </Text>
      ) : (
        <Text
          style={[
            styles.numberBalance,
            {
              backgroundColor: "#fff",
              color: "#000",
            },
          ]}
        >
          {formatMoney(balance)}
        </Text>
      )}

      <Text style={[styles.title, { color: "#000" }]}>Credit Card Name</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        onChangeText={(val) => {
          setName(val);
          if (val.trim() !== "") setNameWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={name}
        placeholder="Name"
        //keyboardType="numeric"
      />
      {nameWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: "#000" }]}>Credit Balance</Text>
      <CurrencyInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        value={balance}
        onChangeValue={setBalance}
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
      {balanceWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: "#000" }]}>Credit Limit</Text>
      <CurrencyInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        value={limit}
        onChangeValue={setLimit}
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
      {limitWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: "#000" }]}>APR</Text>
      <CurrencyInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        value={apr}
        onChangeValue={setApr}
        prefix=""
        delimiter=","
        separator="."
        precision={2}
        minValue={0}
        placeholder="21.99"
        placeholderTextColor={"grey"}
        //showPositiveSign
        //onChangeText={(formattedValue) => {
        //  console.log(formattedValue);
        //}}
      />
      {aprWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: "#000" }]}>Minimum Payment</Text>
      <CurrencyInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        value={minimum}
        onChangeValue={setMinimum}
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
      {minimumWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: "#000" }]}>
        Due Date for Payment
      </Text>

      <View style={[styles.input2, { backgroundColor: "#fff" }]}>
        <Text style={{ color: "grey" }}>Due Date:</Text>
        <View style={{ transform: [{ scale: 0.85 }] }}>
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            textColor="#fff"
            onValueChange={(event, selectedDate) => setDate(selectedDate)}
          />
        </View>
      </View>
      <View style={{ height: 70 }} />
    </ScrollView>
  );
};

export default EditDebt;

const styles = StyleSheet.create({
  numberBalance: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    //marginBottom: 30,
    fontSize: 38,

    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",
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
  input2: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
    //color: "gray",

    //marginBottom: 30,

    alignSelf: "center", // center the whole container
    width: "70%", // 👈 important so spacing works
    flexDirection: "row", // items side-by-side
    justifyContent: "space-between", // 👈 left & right
    alignItems: "center",
  },
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
});
