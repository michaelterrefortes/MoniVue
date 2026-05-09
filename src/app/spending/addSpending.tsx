import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
import CurrencyInput from "react-native-currency-input";
import PickerComponent from "../../../components/Picker";
import { DebtContext } from "../../../context/DebtContext";
import { addSpending } from "../../../services/api";

const options = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Gas",
  "Shopping",
  "Entertainment",
  "Subscriptions",
  "Health & Fitness",
  "Travel",
  "Education",
  "Personal Care",
  "Gifts & Donations",
  "Bills & Fees",
  "Others",
];

const AddSpending = () => {
  const { setUpdateMonth, setUpdateWeek, setUpdateYear } =
    useContext(DebtContext);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState(null);
  const [type, setType] = useState("1");
  const [date, setDate] = useState(new Date());

  const [nameWarning, setNameWarning] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);
  const [typeWarning, setTypeWarning] = useState(false);
  const [priceWarningNumber, setPriceWarningNumber] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
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

    const result = await addSpending(name, amount, type, date);

    setLoading(false);

    if (result?.success) {
      //console.log(result);
      //router.setParams(result.data);

      setUpdateMonth((prevItem) => !prevItem);
      setUpdateWeek((prevItem) => !prevItem);
      setUpdateYear((prevItem) => !prevItem);

      //router.setParams({ refreshed: "true" });
      //console.log("spending:", spending);
      router.back();
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

  const options = [
    "Food & Dining",
    "Groceries",
    "Transport",
    "Gas",
    "Shopping",
    "Entertainment",
    "Subscriptions",
    "Health & Fitness",
    "Travel",
    "Education",
    "Personal Care",
    "Gifts & Donations",
    "Bills & Fees",
    "Others",
  ];
  const [selectedTag, setSelectedTag] = useState(options[0]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      //keyboardVerticalOffset={90} // adjust if header overlaps
    >
      <ScrollView style={isDarkMode ? styles.darkBg : styles.lightBg}>
        <View
          style={[
            { height: 60, width: "100%" },
            isDarkMode ? styles.darkBg : styles.lightBg,
          ]}
        />
        {loading ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              flexDirection: "row",
            }}
          >
            <Text
              style={[
                { marginRight: 5 },
                isDarkMode ? styles.lightText : styles.darkText,
              ]}
            >
              Processing addition ...
            </Text>
            <ActivityIndicator size={20} color="gray" />
          </View>
        ) : null}
        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Name
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
          Amount
        </Text>
        <CurrencyInput
          style={[
            styles.input,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
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

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Date
        </Text>

        <View
          style={[
            styles.input2,
            isDarkMode ? styles.darkField : styles.lightField,
          ]}
        >
          <Text style={{ color: "grey" }}>Date:</Text>
          <View style={{ transform: [{ scale: 0.85 }] }}>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onValueChange={(event, selectedDate) => setDate(selectedDate)}
              //maximumDate={new Date()}
              //minimumDate={new Date(2024, 11)}
              //maximumDate={new Date(2026, 5, 3)}
            />
          </View>
        </View>

        <Text
          style={[
            styles.title,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          Category
        </Text>
        {/*
      <Dropdown
        open={open}
        type={type}
        items={items}
        setOpen={setOpen}
        setType={setType}
        setItems={setItems}
      />*/}

        <View
          style={[
            styles.input2,
            isDarkMode ? styles.darkField : styles.lightField,
            {
              //flexDirection: "row",
              justifyContent: "flex-end",
              //alignItems: "center",
            },
          ]}
        >
          <PickerComponent
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            setType={setType}
            options={options}
          />
        </View>

        {typeWarning ? (
          <Text style={styles.warning}>*Field value missing</Text>
        ) : null}

        <View style={{ height: 70 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddSpending;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#1d1d1d" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

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
