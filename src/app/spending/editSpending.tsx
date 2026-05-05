import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import Dropdown from "../../../components/Dropdown";
import { DebtContext } from "../../../context/DebtContext";
import { editSpending } from "../../../services/api";

const EditSpending = () => {
  const { setUpdateMonth, setUpdateWeek, setUpdateYear } =
    useContext(DebtContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(params.name);
  const [amount, setAmount] = useState(Number(params.amount));
  const [type, setType] = useState(params.type);
  const [date, setDate] = useState(new Date(params.date));

  const [oldAmount, setOldAmount] = useState(Number(params.amount));

  const [nameWarning, setNameWarning] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);
  const [typeWarning, setTypeWarning] = useState(false);
  const [priceWarningNumber, setPriceWarningNumber] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const cond = name.trim() === "" || amount === null || type.trim() === "";
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
  }, [navigation, name, amount, type, date]);

  const processForm = async () => {
    let hasError = false;

    if (name.trim() === "") {
      setNameWarning(true);
      hasError = true;
    }
    if (amount === null) {
      setPriceWarning(true);
      hasError = true;
    }
    if (type.trim() === "") {
      setTypeWarning(true);
      hasError = true;
    }

    if (amount === 0) {
      setPriceWarningNumber(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const result = await editSpending(params.id, name, amount, type, date);

    setLoading(false);

    if (result?.success) {
      //console.log(result);
      //router.setParams(result.data);

      setUpdateMonth((prevItem) => !prevItem);
      setUpdateWeek((prevItem) => !prevItem);
      setUpdateYear((prevItem) => !prevItem);

      router.dismissAll();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Food & Dining", value: "1" },
    { label: "Groceries", value: "2" },
    { label: "Transport", value: "3" },
    { label: "Gas", value: "4" },
    { label: "Shopping", value: "5" },
    { label: "Entertainment", value: "6" },
    { label: "Subscriptions", value: "7" },
    { label: "Health & Fitness", value: "8" },
    { label: "Travel", value: "9" },
    { label: "Education", value: "10" },
    { label: "Personal Care", value: "11" },
    { label: "Gifts & Donations", value: "12" },
    { label: "Bills & Fees", value: "13" },
    { label: "Others", value: "14" },
  ]);

  return (
    <ScrollView>
      <View style={{ height: 60, width: "100%" }} />
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
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

      <Text style={styles.title}>Amount</Text>
      <CurrencyInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        value={amount}
        onChangeValue={(val) => {
          setPriceWarningNumber(false);
          setAmount(val);
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
      {priceWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      {priceWarningNumber ? (
        <Text style={styles.warning}>*Amount cannot be zero. Try again</Text>
      ) : null}

      <Text style={styles.title}>Date</Text>

      <View style={styles.input2}>
        <Text>Date:</Text>
        <View style={{ transform: [{ scale: 0.85 }] }}>
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onValueChange={(event, selectedDate) => setDate(selectedDate)}
            //minimumDate={new Date(2024, 11)}
            //maximumDate={new Date(2026, 5, 3)}
          />
        </View>
      </View>

      <Text style={styles.title}>Category</Text>
      <Dropdown
        open={open}
        type={type}
        items={items}
        setOpen={setOpen}
        setType={setType}
        setItems={setItems}
      />
      {typeWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <View style={{ height: 70 }} />
    </ScrollView>
  );
};

export default EditSpending;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    width: 180,
  },
  item: {
    padding: 12,
    fontSize: 16,
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

  dropdown: {
    paddingHorizontal: 5,
    //paddingVertical: 15,
    borderRadius: 30,

    borderTopColor: "lightgray",

    //color: "gray",

    //marginBottom: 30,

    width: "70%",
    //justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",
    borderColor: "#fff",
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
});
