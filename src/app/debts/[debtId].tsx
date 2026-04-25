import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
//import CircularPicker from "react-native-circular-picker";
import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { validateDate } from "../../../constants/functions";
import { url } from "../../../constants/url";
import { DebtContext } from "../../../context/DebtContext";
import { calculateInterest } from "../../../services/calculate";

const DebtDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { debts, setDebts, isDarkMode } = useContext(DebtContext);
  //console.log(params);

  const [balance, setBalance] = useState(params.balance);
  const [limit, setLimit] = useState(params.limit);
  const [apr, setApr] = useState(params.apr);
  const [name, setName] = useState(params.name);
  const [date, setDate] = useState(params.date);
  const [minimum, setMinimum] = useState(params.minimum);
  const [interestMonths, setInterestMonths] = useState({});

  const percentage = Math.round((Number(balance) / Number(limit)) * 100);

  const [editing, setEditing] = useState(false);

  //console.log(percentage);

  const [payment, setPayment] = useState(0);

  const getUtilizationColor = (value) => {
    if (value <= 10) return "#22c55e"; // green
    if (value <= 30) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Credit Debt",
      "Are you sure you want to delete this credit debt?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${url}/credit/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setDebts((prevItems) =>
        prevItems.filter((item) => Number(item.id) !== Number(params.id)),
      );
      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not delete item");
      console.error(err);
    }
  };

  const navigation = useNavigation();

  useEffect(() => {
    if (!editing) {
      navigation.setOptions({
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
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={{
                width: 35,
                height: 35,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <SymbolView
                name={{ ios: "pencil" }}
                tintColor={isDarkMode ? "#000" : "#fff"}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={confirmDelete}
              style={{
                width: 35,
                height: 35,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SymbolView
                name={{ ios: "trash" }}
                tintColor={isDarkMode ? "#000" : "#fff"}
                size={20}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => setEditing(false)}>
            <Text style={{ color: isDarkMode ? "#000" : "#fff" }}>Cancel</Text>
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity onPress={() => setEditing(false)}>
            <SymbolView
              name={{ ios: "checkmark" }}
              tintColor={isDarkMode ? "#000" : "#fff"}
              size={20}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, editing]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#141414" },
      ]}
    >
      <View style={{ height: 90 }} />

      <Text style={[styles.name, { color: isDarkMode ? "#000" : "#fff" }]}>
        {name}
      </Text>

      <View
        style={[
          styles.balanceCard,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <Text style={styles.labelBalance}>Balance:</Text>
        <Text
          style={[styles.balanceText, { color: isDarkMode ? "#000" : "#fff" }]}
        >
          ${balance}
        </Text>
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.squares,
            { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
          ]}
        >
          <Text style={styles.label}>Limit:</Text>
          <Text style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}>
            ${limit}
          </Text>
        </View>
        <View
          style={[
            styles.squares,
            { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
          ]}
        >
          <Text style={styles.label}>APR:</Text>
          <Text style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}>
            {apr}%
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.rectangle,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <Text style={styles.label}>Utilization:</Text>
        <AnimatedCircularProgress
          size={80}
          width={9}
          backgroundWidth={5}
          fill={percentage}
          tintColor={getUtilizationColor(percentage)}
          backgroundColor={isDarkMode ? "#e5e7eb" : "#000"}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
          style={{ alignSelf: "center" }}
        >
          {(fill) => (
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: isDarkMode ? "#000" : "#fff",
              }}
            >
              {Math.round(fill)}%
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>

      <View style={styles.content}>
        <View
          style={[
            styles.squares,
            { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
          ]}
        >
          <Text style={styles.label}>Min Payment:</Text>
          <Text style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}>
            ${minimum}
          </Text>
        </View>
        <View
          style={[
            styles.squares,
            { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
          ]}
        >
          <Text style={styles.label}>Due Date:</Text>
          <Text style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}>
            {validateDate(date)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.input,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <Text style={styles.labelBalance}>Monthly Payment</Text>
        <TextInput
          style={[styles.inputText, { color: isDarkMode ? "#000" : "#fff" }]}
          onChangeText={(val) => {
            setPayment(val);
          }}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          value={payment}
          placeholder="$0.00"
          keyboardType="numeric"
          onEndEditing={() => {
            if (payment.trim().length === 0) {
              setInterestMonths({});
            } else {
              setInterestMonths(
                calculateInterest(
                  Number(balance),
                  Number(apr),
                  Number(payment),
                ),
              );
            }
          }}
        />
        {Object.keys(interestMonths).length !== 0 ? (
          <>
            <View style={styles.content}>
              <View
                style={[
                  styles.squares2,
                  {
                    backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
                    shadowColor: isDarkMode ? "#000" : "#838383",
                  },
                ]}
              >
                <Text style={styles.label}>Interest Payed:</Text>
                <Text
                  style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}
                >
                  ${interestMonths.interest}
                </Text>
              </View>
              <View
                style={[
                  styles.squares2,
                  {
                    backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
                    shadowColor: isDarkMode ? "#000" : "#838383",
                  },
                ]}
              >
                <Text style={styles.label}>Total Months:</Text>
                <Text
                  style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}
                >
                  {interestMonths.months}
                </Text>
              </View>
            </View>
          </>
        ) : null}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
};

export default DebtDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    paddingLeft: 26,
  },

  content: {
    //justifyContent: "space-between",
    flexDirection: "row",
    justifyContent: "center",
  },

  balanceCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    //paddingVertical: 30,
    paddingBottom: 30,
    paddingTop: 15,
    borderRadius: 50,
    //marginBottom: 30,

    marginTop: 10,

    width: "80%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    //paddingVertical: 30,
    paddingBottom: 30,
    paddingTop: 15,
    borderRadius: 50,
    //marginBottom: 30,

    marginTop: 10,

    width: "80%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  balanceText: {
    fontSize: 38,
    textAlign: "center",
    fontWeight: "bold",
  },

  inputText: {
    fontSize: 38,
    textAlign: "center",
    fontWeight: "bold",
  },

  squares: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    //paddingVertical: 30,
    paddingBottom: 30,
    paddingTop: 15,
    borderRadius: 30,
    //marginBottom: 30,
    marginHorizontal: 5,

    marginTop: 10,

    width: "40%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  squares2: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    //paddingVertical: 30,
    paddingBottom: 30,
    paddingTop: 15,
    borderRadius: 30,
    //marginBottom: 30,
    marginHorizontal: 5,

    marginTop: 10,

    width: "40%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    color: "gray",
  },
  labelBalance: {
    color: "gray",
    paddingLeft: 10,
  },

  rectangle: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    //paddingVertical: 30,
    paddingBottom: 30,
    paddingTop: 15,
    borderRadius: 30,
    //marginBottom: 30,

    marginTop: 10,

    width: "80%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
