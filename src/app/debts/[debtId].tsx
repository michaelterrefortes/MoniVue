import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
//import CircularPicker from "react-native-circular-picker";
import { useNavigation } from "expo-router";
import { SymbolView } from "expo-symbols";
import CurrencyInput from "react-native-currency-input";
import { PieChart } from "react-native-gifted-charts";
import { formatMoney, validateDate } from "../../../constants/functions";
import { url } from "../../../constants/url";
import { DebtContext } from "../../../context/DebtContext";
import { getAccessToken } from "../../../services/auth";
import { calculateInterest } from "../../../services/calculate";

const DebtDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { debts, setDebts } = useContext(DebtContext);
  //console.log(params);

  const [balance, setBalance] = useState(params.balance);
  const [limit, setLimit] = useState(params.limit);
  const [apr, setApr] = useState(params.apr);
  const [name, setName] = useState(params.name);
  const [date, setDate] = useState(params.date);
  const [minimum, setMinimum] = useState(params.minimum);
  const [interestMonths, setInterestMonths] = useState({});

  const percentage = (Number(balance) / Number(limit)) * 100;

  const [editing, setEditing] = useState(false);

  //console.log(percentage);

  const [payment, setPayment] = useState(null);

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`${url}/credit/${params.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) Alert.alert("Error", result.error);
      else {
        setDebts((prevItems) =>
          prevItems.filter((item) => Number(item.id) !== Number(params.id)),
        );
        router.back();
      }
    } catch (err) {
      Alert.alert("Error", "Could not delete item");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: `/debts/editDebt`,
                params: {
                  id: params.id,
                  name: params.name,
                  balance: params.balance,
                  limit: params.limit,
                  apr: params.apr,
                  minimum: params.minimum,
                  date: params.date,
                },
              })
            }
            style={{
              width: 35,
              height: 35,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <SymbolView name={{ ios: "pencil" }} tintColor={"#000"} size={20} />
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
            <SymbolView name={{ ios: "trash" }} tintColor={"#000"} size={20} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, editing]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "rgb(242, 242, 242)" }]}
    >
      <View style={{ height: 90 }} />

      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
            flexDirection: "row",
          }}
        >
          <Text style={{ marginRight: 5 }}>Processing deletion ...</Text>
          <ActivityIndicator size={20} color="gray" />
        </View>
      ) : null}

      <Text style={[styles.name, { color: "#000" }]}>{name}</Text>

      <View style={[styles.balanceCard, { backgroundColor: "#fff" }]}>
        <Text style={styles.labelBalance}>Balance</Text>
        <Text style={[styles.balanceText, { color: "#000" }]}>
          {formatMoney(balance)}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={[styles.squares, { backgroundColor: "#fff" }]}>
          <Text style={styles.label}>Limit</Text>
          <Text style={[styles.text, { color: "#000" }]}>
            {formatMoney(limit)}
          </Text>
        </View>
        <View style={[styles.squares, { backgroundColor: "#fff" }]}>
          <Text style={styles.label}>APR</Text>
          <Text style={[styles.text, { color: "#000" }]}>{apr}%</Text>
        </View>
      </View>

      <View style={[styles.rectangle, { backgroundColor: "#fff" }]}>
        <Text style={styles.label}>Utilization</Text>

        <View style={styles.headerRow}>
          <Text
            style={[styles.percentText, { color: "#000", fontWeight: "500" }]}
          >
            {percentage.toFixed(2)}% used
          </Text>
        </View>

        <View style={[styles.progressBarBackground]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: percentage > 100 ? 100 : `${percentage}%`,
                backgroundColor: getUtilizationColor(percentage),
                //backgroundColor: "#ffffff",
              },
            ]}
          />
        </View>
        {/*<AnimatedCircularProgress
          size={80}
          width={9}
          backgroundWidth={5}
          fill={percentage}
          tintColor={getUtilizationColor(percentage)}
          backgroundColor={"#e5e7eb"}
          arcSweepAngle={240}
          rotation={240}
          lineCap="round"
          style={{ alignSelf: "center" }}
        >
          {(fill) => (
            <Text
              style={{
                fontWeight: "500",
                fontSize: 20,
                color: "#000",
              }}
            >
              {Math.round(fill)}%
            </Text>
          )}
        </AnimatedCircularProgress>*/}
      </View>

      <View style={styles.content}>
        <View style={[styles.squares, { backgroundColor: "#fff" }]}>
          <Text style={styles.label}>Min Payment</Text>
          <Text style={[styles.text, { color: "#000" }]}>
            {formatMoney(minimum)}
          </Text>
        </View>
        <View style={[styles.squares, { backgroundColor: "#fff" }]}>
          <Text style={styles.label}>Due Date</Text>
          <Text style={[styles.text, { color: "#000" }]}>
            {validateDate(date)}
          </Text>
        </View>
      </View>

      <View style={[styles.input, { backgroundColor: "#fff" }]}>
        <Text style={styles.labelBalance}>Monthly Payment Calculator</Text>

        <CurrencyInput
          style={[styles.inputText, { color: "#000" }]}
          value={payment}
          onChangeValue={setPayment}
          prefix="$"
          delimiter=","
          separator="."
          precision={2}
          minValue={0}
          placeholder="$0.00"
          placeholderTextColor={"lightgrey"}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
          onEndEditing={() => {
            if (payment === null) {
              setInterestMonths({});
            } else if (payment === 0) {
              setInterestMonths({});
              Alert.alert("Error", "Payment cannot be zero. Try again.");
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
          //showPositiveSign
          //onChangeText={(formattedValue) => {
          //  console.log(formattedValue);
          //}}
        />
        {Object.keys(interestMonths).length !== 0 ? (
          <>
            <View style={styles.content}>
              <View
                style={[
                  styles.squares2,
                  {
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                  },
                ]}
              >
                <Text style={styles.label}>Interest Payed</Text>
                <Text style={[styles.text, { color: "#000" }]}>
                  {formatMoney(interestMonths.interest)}
                </Text>
              </View>
              <View
                style={[
                  styles.squares2,
                  {
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                  },
                ]}
              >
                <Text style={styles.label}>Total Months</Text>
                <Text style={[styles.text, { color: "#000" }]}>
                  {interestMonths.months}
                </Text>
              </View>
            </View>

            <View style={[styles.squares2, { width: "83%" }]}>
              <Text style={styles.label}>Interest Plot</Text>
              <View
                style={{ alignSelf: "center", marginBottom: 15, marginTop: 10 }}
              >
                <PieChart
                  radius={90}
                  innerRadius={60}
                  data={[
                    {
                      key: 1,
                      label: "Balance",
                      value:
                        (Number(balance) /
                          (Number(balance) + Number(interestMonths.interest))) *
                        100,
                      color: "#66BB6A",
                    },
                    {
                      key: 2,
                      label: "Interest",
                      value:
                        (Number(interestMonths.interest) /
                          (Number(balance) + Number(interestMonths.interest))) *
                        100,
                      color: "#F48FB1",
                    },
                  ]}
                  donut
                />
              </View>

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: "#66BB6A",
                    marginRight: 10,
                  }}
                />
                <Text style={styles.label}>
                  Balance:{" "}
                  {(
                    (Number(balance) /
                      (Number(balance) + Number(interestMonths.interest))) *
                    100
                  ).toFixed(0)}
                  %
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: "#F48FB1",
                    marginRight: 10,
                  }}
                />
                <Text style={styles.label}>
                  Interest:{" "}
                  {(
                    (Number(interestMonths.interest) /
                      (Number(balance) + Number(interestMonths.interest))) *
                    100
                  ).toFixed(0)}
                  %
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
    fontWeight: "500",
    fontSize: 28,
    paddingLeft: 40,
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
  input: {
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

  balanceText: {
    fontSize: 38,
    textAlign: "center",
    fontWeight: "500",
  },

  inputText: {
    fontSize: 38,
    textAlign: "center",
    fontWeight: "500",
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

    width: "39%",
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
    fontWeight: "500",
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  dateText: {
    //color: "#FFFFFF",
    fontSize: 14,
  },
  percentText: {
    //color: "#FFFFFF",
    fontSize: 14,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "rgba(146, 146, 146, 0.3)",
    //backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    //backgroundColor: "#d3ff00",
    borderRadius: 3,
  },
});
