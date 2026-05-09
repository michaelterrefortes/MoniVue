import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useContext, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

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
  const [limitWarningNumber, setLimitWarningNumber] = useState(false);
  const [warningMinimumLow, setWarningMinimumLow] = useState(false);
  //const [dateWarning, setDateWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
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

    if (limit === 0) {
      setLimitWarningNumber(true);
      hasError = true;
    }

    if (hasError) return;

    if (Number(minimum) < Number(balance) * (Number(apr) / 100 / 12)) {
      setWarningMinimumLow(true);

      return;
    }

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
      Alert.alert("Error", result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      //keyboardVerticalOffset={90} // adjust if header overlaps
    >
      <ScrollView style={isDarkMode ? styles.darkBg : styles.lightBg}>
        <View style={{ height: 100, width: "100%" }} />
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
              Processing editing ...
            </Text>
            <ActivityIndicator size={20} color="gray" />
          </View>
        ) : null}
        {balance === null || balance === null ? (
          <Text
            style={[
              styles.numberBalance,

              isDarkMode ? styles.darkField : styles.lightField,
            ]}
          >
            {formatMoney(0)}
          </Text>
        ) : (
          <Text
            style={[
              styles.numberBalance,

              isDarkMode ? styles.darkField : styles.lightField,
            ]}
          >
            {formatMoney(balance)}
          </Text>
        )}

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Credit Card Name
        </Text>
        <TextInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
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

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Credit Balance
        </Text>
        <CurrencyInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
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

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Credit Limit
        </Text>
        <CurrencyInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
          value={limit}
          onChangeValue={(val) => {
            setLimitWarningNumber(false);
            setLimit(val);
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
        {limitWarning ? (
          <Text style={styles.warning}>*Field value missing</Text>
        ) : null}

        {limitWarningNumber ? (
          <Text style={styles.warning}>*Limit cannot be zero. Try again</Text>
        ) : null}

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          APR
        </Text>
        <CurrencyInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
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

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Minimum Payment
        </Text>
        <CurrencyInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
          value={minimum}
          onChangeValue={(val) => {
            (setMinimum(val), setWarningMinimumLow(false));
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
        {minimumWarning ? (
          <Text style={styles.warning}>*Field value missing</Text>
        ) : null}

        {warningMinimumLow ? (
          <Text style={styles.warning}>
            *Minimum needs to be $
            {Math.ceil(Number(balance) * (Number(apr) / 100 / 12))} or higher
          </Text>
        ) : null}

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Due Date for Payment
        </Text>

        <View
          style={[
            styles.input2,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
        >
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
    </KeyboardAvoidingView>
  );
};

export default EditDebt;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#1d1d1d" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

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
