import { router, useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { SymbolView } from "expo-symbols";
import { DebtContext } from "../../../context/DebtContext";
import { addCreditCard } from "../../../services/api";

const DebtInfo = () => {
  //console.log(params.setData);

  const { debts, setDebts, isDarkMode } = useContext(DebtContext);

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [limit, setLimit] = useState("");
  const [apr, setApr] = useState("");
  const [minimum, setMinimum] = useState("");
  const [date, setDate] = useState(new Date());

  const [aprWarning, setAprWarning] = useState(false);
  const [nameWarning, setNameWarning] = useState(false);
  const [balanceWarning, setBalanceWarning] = useState(false);
  const [limitWarning, setLimitWarning] = useState(false);
  const [minimumWarning, setMinimumWarning] = useState(false);
  //const [dateWarning, setDateWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={processForm}
          style={{
            width: 35,
            height: 35,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",

            //borderColor: "blue",
          }}
        >
          {loading ? (
            <ActivityIndicator size={10} />
          ) : (
            <SymbolView
              name={{ ios: "checkmark" }}
              tintColor={isDarkMode ? "#000" : "#fff"}
              size={20}
            />
          )}
        </TouchableOpacity>
      ),

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            //backgroundColor: "grey",
            width: 35,
            height: 35,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SymbolView
            name={{ ios: "xmark" }}
            tintColor={isDarkMode ? "#000" : "#fff"}
            size={20}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, balance, limit, apr, date, minimum]);

  const processForm = async () => {
    let hasError = false;

    if (name.trim() === "") {
      setNameWarning(true);
      hasError = true;
    }
    if (balance.trim() === "") {
      setBalanceWarning(true);
      hasError = true;
    }
    if (limit.trim() === "") {
      setLimitWarning(true);
      hasError = true;
    }
    if (apr.trim() === "") {
      setAprWarning(true);
      hasError = true;
    }

    if (minimum.trim() === "") {
      setMinimumWarning(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const result = await addCreditCard(
      name,
      balance,
      limit,
      apr,
      minimum,
      date,
    );

    setLoading(false);

    if (result?.message) {
      //console.log(result.message);
      //router.setParams(result.data);
      setDebts((prevCards) => [...prevCards, result.data]);
      //router.setParams({ refreshed: "true" });
      router.back();
    } else {
      Alert.alert("Problem", result.wrong);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#141414" }}
    >
      <View style={{ height: 100, width: "100%" }} />
      {balance === null || balance.trim() === "" ? (
        <Text
          style={[
            styles.numberBalance,
            {
              backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
              color: isDarkMode ? "#000" : "#fff",
            },
          ]}
        >
          ${0}
        </Text>
      ) : (
        <Text
          style={[
            styles.numberBalance,
            {
              backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
              color: isDarkMode ? "#000" : "#fff",
            },
          ]}
        >
          ${balance}
        </Text>
      )}

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Credit Card Name
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
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

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Credit Balance
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
        onChangeText={(val) => {
          setBalance(val);
          if (val.trim() !== "") setBalanceWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={balance}
        placeholder="Balance: 0.00"
        keyboardType="numeric"
      />
      {balanceWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Credit Limit
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
        onChangeText={(val) => {
          setLimit(val);
          if (val.trim() !== "") setLimitWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={limit}
        placeholder="Limit: 0.00"
        keyboardType="numeric"
      />
      {limitWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        APR
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
        onChangeText={(val) => {
          setApr(val);
          if (val.trim() !== "") setAprWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={apr}
        placeholder="APR: 28.99"
        keyboardType="numeric"
      />
      {aprWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Minimum Payment
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
        onChangeText={(val) => {
          setMinimum(val);
          if (val.trim() !== "") setMinimumWarning(false); // Clear error while typing
        }}
        value={minimum}
        placeholderTextColor={"gray"}
        placeholder="Minimum: 30"
        keyboardType="numeric"
      />
      {minimumWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Due Date for Payment
      </Text>

      <View
        style={[
          styles.input2,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
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
  );
};

export default DebtInfo;

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
