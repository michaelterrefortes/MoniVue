import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import Dropdown from "../../../components/Dropdown";
import { DebtContext } from "../../../context/DebtContext";
import { addBills } from "../../../services/api";

const AddBill = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { bills, setBills } = useContext(DebtContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [variation, setVariation] = useState(null);
  const [price, setPrice] = useState(null);
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date());

  const [nameWarning, setNameWarning] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);
  const [variationWarning, setVariationWarning] = useState(false);
  const [typeWarning, setTypeWarning] = useState(false);
  const [priceWarningNumber, setPriceWarningNumber] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    const cond =
      name.trim() === "" ||
      variation === null ||
      price === null ||
      type.trim() === "";
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
  }, [navigation, name, variation, price, type, date]);

  const processForm = async () => {
    let hasError = false;

    if (name.trim() === "") {
      setNameWarning(true);
      hasError = true;
    }
    if (variation === null) {
      setVariationWarning(true);
      hasError = true;
    }
    if (price === null) {
      setPriceWarning(true);
      hasError = true;
    }
    if (type.trim() === "") {
      setTypeWarning(true);
      hasError = true;
    }

    if (price === 0) {
      setPriceWarningNumber(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const result = await addBills(name, variation, price, type, date);

    setLoading(false);

    if (result?.success) {
      //console.log(result.message);
      //router.setParams(result.data);
      setBills((prevBills) => [...prevBills, result.data]);
      //router.setParams({ refreshed: "true" });
      router.back();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Mortgage", value: "1" },
    { label: "Rent", value: "2" },
    { label: "Auto Loan", value: "3" },
    { label: "Utilities", value: "4" },
    { label: "Auto Insurance", value: "5" },
    { label: "Cable & Internet", value: "6" },
    { label: "Health Insurance", value: "7" },
    { label: "Mobile", value: "8" },
    { label: "Life Insurance", value: "9" },
    { label: "Alarm & Security", value: "10" },
    { label: "Others", value: "11" },
  ]);

  const options = [
    "Mortgage",
    "Rent",
    "Auto Loan",
    "Utilities",
    "Auto Insurance",
    "Cable & Internet",
    "Health Insurance",
    "Mobile",
    "Life Insurance",
    "Alarm & Security",
    "Others",
  ];

  const [selectedTag, setSelectedTag] = useState(options[0]);

  return (
    <ScrollView style={isDarkMode ? styles.darkBg : styles.lightBg}>
      <View style={{ height: 60, width: "100%" }} />

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
        style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}
      >
        Bill Name
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
        style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}
      >
        Price
      </Text>

      {/*
      <TextInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        onChangeText={(val) => {
          setPrice(val);
          if (val.trim() !== "") setPriceWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={price}
        placeholder="Price: 0.00"
        keyboardType="numeric"
      />*/}

      <CurrencyInput
        style={[
          styles.input,
          isDarkMode ? styles.darkField : styles.lightField,
        ]}
        value={price}
        onChangeValue={(val) => {
          setPriceWarningNumber(false);
          setPrice(val);
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
        <Text style={styles.warning}>*Price cannot be zero. Try again</Text>
      ) : null}

      <Text
        style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}
      >
        Monthly Bill Variation
      </Text>
      {/*<TextInput
        style={[styles.input, { backgroundColor: "#fff" }]}
        onChangeText={(val) => {
          setVariation(val);
          if (val.trim() !== "") setVariationWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={variation}
        placeholder="Variation: 0.00"
        keyboardType="numeric"
      />*/}
      <CurrencyInput
        style={[
          styles.input,
          isDarkMode ? styles.darkField : styles.lightField,
        ]}
        value={variation}
        onChangeValue={setVariation}
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
      {variationWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}
      <Text
        style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}
      >
        Bill Due Date
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
            onValueChange={(event, selectedDate) => setDate(selectedDate)}
          />
        </View>
      </View>

      <Text
        style={[styles.title, isDarkMode ? styles.lightText : styles.darkText]}
      >
        Bill Category
      </Text>
      <Dropdown
        open={open}
        type={type}
        items={items}
        setOpen={setOpen}
        setType={setType}
        setItems={setItems}
      />

      {/*
      <View
        style={[
          styles.input2,
          isDarkMode ? styles.darkField : styles.lightField,
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          },
        ]}
      >
        <Host matchContents>
          <Picker
            modifiers={[pickerStyle("menu")]}
            label="Select a Catgory"
            selection={selectedTag}
            onSelectionChange={(selection) => {
              setSelectedTag(selection);
            }}
          >
            {options.map((option) => (
              <Text2 key={option} modifiers={[tag(option)]}>
                {option}
              </Text2>
            ))}
          </Picker>
        </Host>
      </View>*/}
      {typeWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <View style={{ height: 70 }} />
    </ScrollView>
  );
};

export default AddBill;

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
