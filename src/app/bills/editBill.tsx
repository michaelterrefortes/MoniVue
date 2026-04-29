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
import DropDownPicker from "react-native-dropdown-picker";
import { DebtContext } from "../../../context/DebtContext";
import { editBills } from "../../../services/api";

const EditBill = () => {
  const { bills, setBills } = useContext(DebtContext);
  const params = useLocalSearchParams();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(params.name);
  const [variation, setVariation] = useState(params.variable);
  const [price, setPrice] = useState(params.price);
  const [type, setType] = useState(params.type);
  const [date, setDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      Number(params.date),
    ),
  );

  const [nameOld, setNameOld] = useState(params.name);
  const [variationOld, setVariationOld] = useState(params.variable);
  const [priceOld, setPriceOld] = useState(params.price);
  const [typeOld, setTypeOld] = useState(params.type);
  const [dateOld, setDateOld] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      Number(params.date),
    ),
  );

  const [nameWarning, setNameWarning] = useState(false);
  const [priceWarning, setPriceWarning] = useState(false);
  const [variationWarning, setVariationWarning] = useState(false);
  const [typeWarning, setTypeWarning] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          type: "button",
          label: "Add",

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

    const result = await editBills(
      params.id,
      name,
      variation,
      price,
      type,
      date,
    );

    setLoading(false);

    //console.log(result);

    if (result?.success) {
      //console.log(result.message);
      //router.setParams(result.data);
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.id === result.data.id ? result.data : bill,
        ),
      );

      router.dismissAll();

      //router.back();
      //router.back();
      /*router.setParams({
        id: result.data.id,
        name: result.data.bill_name,
        price: result.data.price,
        type: result.data.type_bill,
        variable: result.data.variable,
        date: result.data.payment_date,
      });*/
      //router.setParams({ refreshed: "true" });

      //navigation.navigate("/(tabs)/cards");

      /*router.dismissTo({
        pathname: `bills/${result.data.id}`,
        params: {
          id: result.data.id,
          name: result.data.bill_name,
          price: result.data.price,
          type: result.data.type_bill,
          variable: result.data.variable,
          date: result.data.payment_date,
        },
      });*/
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
    <ScrollView style={{ backgroundColor: "rgb(242, 242, 242)" }}>
      <View style={{ height: 60, width: "100%" }} />
      <Text style={[styles.title, { color: "#000" }]}>Bill Name</Text>
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

      <Text style={[styles.title, { color: "#000" }]}>Price</Text>
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
      />
      {priceWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
      ) : null}

      <Text style={[styles.title, { color: "#000" }]}>
        Monthly Bill Variation
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#fff" }]}
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
      <Text style={[styles.title, { color: "#000" }]}>Bill Due Date</Text>

      <View style={[styles.input2, { backgroundColor: "#fff" }]}>
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

      <Text style={[styles.title, { color: "#000" }]}>Bill Category</Text>
      <DropDownPicker
        style={[
          styles.input,
          {
            borderColor: "#fff",
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            borderTopLeftRadius: open ? 30 : 50,
            borderTopRightRadius: open ? 30 : 50,
            backgroundColor: "#fff",
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
            backgroundColor: "#fff",
            borderColor: "#fff",
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

export default EditBill;

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
