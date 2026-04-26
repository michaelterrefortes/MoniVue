import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
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
import DropDownPicker from "react-native-dropdown-picker";
import { DebtContext } from "../../../context/DebtContext";
import { addBills } from "../../../services/api";

const AddBill = () => {
  const { bills, setBills, isDarkMode } = useContext(DebtContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [variation, setVariation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState(new Date());

  const [nameWarning, setNameWarning] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);
  const [variationWarning, setVariationWarning] = useState(false);
  const [typeWarning, setTypeWarning] = useState(false);

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
            //backgroundColor: "blue",
            //borderColor: "blue",
          }}
        >
          {loading ? (
            <ActivityIndicator size={10} />
          ) : (
            <SymbolView
              name={{ ios: "checkmark" }}
              tintColor="black"
              size={20}
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, variation, price, type, date]);

  const processForm = async () => {
    let hasError = false;

    if (name.trim() === "") {
      setNameWarning(true);
      hasError = true;
    }
    if (variation.trim() === "") {
      setVariationWarning(true);
      hasError = true;
    }
    if (price.trim() === "") {
      setPriceWarning(true);
      hasError = true;
    }
    if (type.trim() === "") {
      setTypeWarning(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const result = await addBills(name, variation, price, type, date);

    setLoading(false);

    if (result?.message) {
      //console.log(result.message);
      //router.setParams(result.data);
      setBills((prevBills) => [...prevBills, result.data]);
      //router.setParams({ refreshed: "true" });
      router.back();
    } else {
      Alert.alert("Problem", result.wrong);
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

  return (
    <ScrollView
      style={{ backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#141414" }}
    >
      <View style={{ height: 60, width: "100%" }} />
      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Bill Name
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
        Price
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
        onChangeText={(val) => {
          setPrice(val);
          if (val.trim() !== "") setPriceWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={price}
        placeholder="Price: 0.00"
        keyboardType="numeric"
      />
      {priceWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Monthly Bill Variation
      </Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
        onChangeText={(val) => {
          setVariation(val);
          if (val.trim() !== "") setVariationWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={variation}
        placeholder="Variation: 0.00"
        keyboardType="numeric"
      />
      {variationWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}
      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Bill Due Date
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
            onValueChange={(event, selectedDate) => setDate(selectedDate)}
          />
        </View>
      </View>

      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Bill Category
      </Text>
      <DropDownPicker
        style={[
          styles.input,
          {
            borderColor: isDarkMode ? "#fff" : "#1c1c1c",
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            borderTopLeftRadius: open ? 30 : 50,
            borderTopRightRadius: open ? 30 : 50,
            backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
          },
        ]}
        open={open}
        value={type}
        items={items}
        setOpen={setOpen}
        setValue={setType}
        setItems={setItems}
        placeholder={"Type"}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={[
          styles.dropdown,
          {
            backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
            borderColor: isDarkMode ? "#fff" : "#1c1c1c",
          },
        ]}
        listItemContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: "#eee",

          //paddingVertical: 13,
        }}
        placeholderStyle={{
          color: "gray",
        }}
      />
      {typeWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <View style={{ height: 70 }} />
    </ScrollView>
  );
};

export default AddBill;

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
