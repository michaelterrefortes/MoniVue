import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
import { editSpending } from "../../../services/api";

const EditSpending = () => {
  const {
    spending,
    setSpending,
    localSpending,
    setLocalSpending,
    setWeekly,
    setYearSpending,
  } = useContext(DebtContext);
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
            //<Image source={checkmark} style={{ width: 15, height: 15 }} />

            <SymbolView
              name={{ ios: "checkmark" }}
              tintColor="black"
              size={20}
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, name, amount, type, date]);

  const processForm = async () => {
    let hasError = false;

    if (name.trim() === "") {
      setNameWarning(true);
      hasError = true;
    }
    if (amount.trim() === "") {
      setPriceWarning(true);
      hasError = true;
    }
    if (type.trim() === "") {
      setTypeWarning(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    const result = await editSpending(params.id, name, amount, type, date);

    setLoading(false);

    if (result?.success) {
      //console.log(result);
      //router.setParams(result.data);
      const selectedMonth = Number(params?.selectedMonth);
      const selectedYear = Number(params?.selectedYear);

      // 📅 REAL current date (device)
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // 📅 UI selected date
      const viewMonth = date.getMonth() + 1;
      const viewYear = date.getFullYear();

      const isCurrentMonth =
        selectedMonth === currentMonth && selectedYear === currentYear;

      const isViewMonth =
        selectedMonth === viewMonth && selectedYear === viewYear;

      // ✅ Update global (current real month)
      if (!isCurrentMonth) {
        setSpending((prevItem) =>
          prevItem.map((spending) =>
            spending.id === result.data.id ? result.data : spending,
          ),
        );
      } else {
        setSpending((prevItems) =>
          prevItems.filter((item) => Number(item.id) !== Number(params.id)),
        );
      }

      // ✅ Update local (currently viewed month)
      if (!isViewMonth) {
        setLocalSpending((prevItem) =>
          prevItem.map((spending) =>
            spending.id === result.data.id ? result.data : spending,
          ),
        );
      } else {
        setLocalSpending((prevItems) =>
          prevItems.filter((item) => Number(item.id) !== Number(params.id)),
        );
      }

      const start = new Date(params.startWeek);
      const end = new Date(params.endWeek);

      if (!(new Date(params.date) >= start && new Date(params.date) <= end)) {
        setWeekly((prevItem) =>
          prevItem.map((spending) =>
            spending.id === result.data.id ? result.data : spending,
          ),
        );
      } else {
        setWeekly((prevItems) =>
          prevItems.filter((item) => Number(item.id) !== Number(params.id)),
        );
      }

      if (!(Number(params.year) === new Date(params.date).getFullYear())) {
        setYearSpending((prevItems) => {
          return prevItems.map((item) => {
            if (
              new Date(item.month_start).getMonth() ===
              new Date(params.date).getMonth()
            ) {
              return {
                ...item,
                total_sum:
                  Number(item.total_sum) -
                  Number(oldAmount) +
                  Number(params.amount),
              };
            }
            return item; // IMPORTANT: always return something
          });
        });
      } else {
        setYearSpending((prevItems) => {
          return prevItems.map((item) => {
            if (
              new Date(item.month_start).getMonth() ===
              new Date(params.date).getMonth()
            ) {
              return {
                ...item,
                total_sum: Number(item.total_sum) - Number(oldAmount),
              };
            }
            return item; // IMPORTANT: always return something
          });
        });
      }

      //router.setParams({ refreshed: "true" });
      //console.log("spending:", spending);
      router.dismissAll();
    } else {
      Alert.alert("Problem", result.wrong);
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
      <TextInput
        style={styles.input}
        onChangeText={(val) => {
          setAmount(val);
          if (val.trim() !== "") setPriceWarning(false); // Clear error while typing
        }}
        placeholderTextColor={"gray"}
        value={amount.toString()}
        placeholder="Amount: 0.00"
        keyboardType="numeric"
      />
      {priceWarning ? (
        <Text style={styles.warning}>*Field value missing</Text>
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
      <DropDownPicker
        style={[
          styles.input,
          {
            borderColor: "white",
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            borderTopLeftRadius: open ? 30 : 50,
            borderTopRightRadius: open ? 30 : 50,
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
        dropDownContainerStyle={styles.dropdown}
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
