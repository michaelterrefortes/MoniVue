import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import Card from "../../../components/Card";
import { DebtContext } from "../../../context/DebtContext";
import { fetchSpending } from "../../../services/api";

const TABS = ["Month", "Week", "Year"];

const pieData = [
  {
    value: 47,
    color: "#009FFF",
    gradientCenterColor: "#006DFF",
    focused: true,
  },
  { value: 40, color: "#93FCF8", gradientCenterColor: "#3BE9DE" },
  { value: 16, color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
  { value: 3, color: "#FFA5BA", gradientCenterColor: "#FF7F97" },
];

const formatPlotData = (localSpending, selectedDate) => {
  const weeklyTotals = new Map();

  const year = new Date(selectedDate).getFullYear();
  const month = new Date(selectedDate).getMonth();

  //const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();

  // Loop through weeks in 7-day increments
  for (let i = 1; i <= numDays; i += 7) {
    const start = i;
    const end = Math.min(i + 6, numDays);
    const key = `${start}-${end}`;
    weeklyTotals.set(key, 0); // Initialize with empty array
    //console.log(weeklyTotals);
  }

  //console.log(weeklyTotals);

  localSpending.forEach((t) => {
    const day = new Date(t.date_spending).getDate();
    // Determine 7-day bucket (1-7, 8-14, 15-21, 22-31)
    const weekBucket = Math.ceil(day / 7);
    const startDay = (weekBucket - 1) * 7 + 1;
    let endDay = weekBucket * 7;

    // Adjust end day for last week of month
    const lastDayOfMonth = new Date(
      new Date(t.date_spending).getFullYear(),
      new Date(t.date_spending).getMonth() + 1,
      0,
    ).getDate();
    if (endDay > lastDayOfMonth) endDay = lastDayOfMonth;

    const label = `${startDay}-${endDay}`;

    weeklyTotals.set(label, (weeklyTotals.get(label) || 0) + t.amount);
  });

  //console.log("aqui", JSON.stringify(Object.fromEntries(weeklyTotals)));

  const arrayTotals = Array.from(weeklyTotals, ([label, value]) => ({
    label,
    value,
  }));

  //console.log(arrayTotals);

  return arrayTotals;
};

const SpendingTab = () => {
  const router = useRouter();

  const {
    spending,
    setSpending,
    totalSpending,
    setTotalSpending,
    localSpending,
    setLocalSpending,
    localTotalSpending,
    setLocalTotalSpending,
  } = useContext(DebtContext);

  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log(date);

        if (
          date.getMonth() === new Date().getMonth() &&
          date.getFullYear() === new Date().getFullYear()
        ) {
          const result = await fetchSpending(date);

          setSpending(result);
          setLocalSpending(result);
        } else {
          const result = await fetchSpending(date);

          //setSpending(result);
          setLocalSpending(result);
        }

        //console.log(spending);
        //console.log(date);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [date]);

  useEffect(() => {
    setTotalSpending(spending.reduce((acc, curr) => acc + curr.amount, 0));
  }, [spending]);

  useEffect(() => {
    setLocalTotalSpending(
      localSpending.reduce((acc, curr) => acc + curr.amount, 0),
    );
  }, [localSpending]);

  const changeMonth = (direction) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + direction);
    setDate(newDate);
  };

  const formatMonth = (date) => {
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  //formatPlotData(localSpending, date);

  return (
    <View style={styles.container}>
      <View style={{ height: 70 }} />

      {/*<Text
        style={{
          fontWeight: "bold",
          fontSize: 28,
          paddingTop: 10,
          paddingLeft: 15,
        }}
      >
        Spending List
      </Text>*/}

      <FlatList
        data={localSpending}
        renderItem={({ item }) => {
          //console.log(categories[item.type].icon);
          return (
            <Card
              item={item}
              params={{
                pathname: "spending/[spendingId]",
                params: {
                  id: item.id,
                  name: item.spending_name,
                  amount: item.amount,
                  category: item.type_spending,
                  date: item.date_spending,
                  selectedMonth: date.getMonth() + 1,
                  selectedYear: date.getFullYear(),
                },
              }}
            />
          );
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        keyExtractor={(item) => item.id.toString()}
        //scrollEnabled={false}
        ListHeaderComponent={() => {
          return (
            <>
              <View style={styles.datePickerCard}>
                <TouchableOpacity
                  style={{ paddingHorizontal: 10 }}
                  onPress={() => changeMonth(-1)}
                >
                  <SymbolView
                    name={{ ios: "chevron.left" }}
                    tintColor="gray"
                    size={20}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: 28,
                    textAlign: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {formatMonth(date)}
                </Text>

                <TouchableOpacity
                  style={{ paddingHorizontal: 10 }}
                  onPress={() => changeMonth(1)}
                >
                  <SymbolView
                    name={{ ios: "chevron.right" }}
                    tintColor="gray"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <SegmentedControl
                values={TABS}
                style={{ width: "80%", alignSelf: "center", margin: 20 }}
                selectedIndex={selected}
                onChange={(event) => {
                  setSelected(event.nativeEvent.selectedSegmentIndex);
                }}
                onValueChange={(value) => {
                  console.log("Selected value:", value);
                }}
              />
              {selected === 0 ? (
                <View style={styles.spendingBalance}>
                  <Text style={styles.text}>Total:</Text>
                  <Text style={styles.textSpendingNumber}>
                    ${localTotalSpending.toFixed(2)}
                  </Text>

                  <BarChart
                    data={formatPlotData(localSpending, date)}
                    height={200}
                    //width={220}
                    //barWidth={20}
                    minHeight={3}
                    barBorderRadius={3}
                    spacing={20}
                    noOfSections={4}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={{ color: "gray", fontSize: 12 }}
                    yAxisTextStyle={{ color: "gray", fontSize: 12 }}
                    isAnimated
                    animationDuration={300}
                    //showGradient={true}
                  />
                </View>
              ) : selected === 1 ? (
                <View style={styles.spendingBalance}>
                  <Text style={styles.text}>Pie:</Text>
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <PieChart
                      data={pieData}
                      donut
                      showGradient
                      sectionAutoFocus
                      radius={50}
                      innerRadius={30}
                      //innerCircleColor={"#232B5D"}
                    />
                  </View>
                </View>
              ) : selected === 2 ? (
                <View style={styles.spendingBalance}>
                  <Text style={styles.text}>Weekly:</Text>
                  <Text style={styles.textSpendingNumber}>
                    ${localTotalSpending.toFixed(2)}
                  </Text>
                </View>
              ) : (
                <View style={styles.spendingBalance}>
                  <Text style={styles.text}>Monthly:</Text>
                  <Text style={styles.textSpendingNumber}>
                    ${localTotalSpending.toFixed(2)}
                  </Text>
                </View>
              )}
            </>
          );
        }}
        //ListHeaderComponent={
        //  <Text style={{ fontWeight: "bold", fontSize: 28, paddingTop: 10 }}>
        //    Card Balances:
        //</View>  </Text>
        //}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: `/spending/addSpending`,
            params: {
              selectedMonth: date.getMonth() + 1,
              selectedYear: date.getFullYear(),
            },
          })
        }
      >
        <SymbolView name={{ ios: "plus" }} tintColor="white" size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default SpendingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    //justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 20, // adjust if your tab bar is different
    right: 20,
    backgroundColor: "#0080FF",
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  spendingBalance: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 50,
    //marginBottom: 30,
    marginTop: 10,

    width: "90%",
    //justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  textSpendingNumber: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 10,
    paddingBottom: 5,
    //textAlign: "center",
  },
  text: {
    //fontWeight: "bold",
    fontSize: 12,
    color: "gray",
    paddingLeft: 10,
    //textAlign: "center",
  },

  datePickerCard: {
    marginTop: 15,
    flexDirection: "row",
    //justifyContent: "space-between",
    //backgroundColor: "#fff",
    alignItems: "center",
    width: "50%",
    //paddingVertical: 10,
    //alignSelf: "center",
    //marginLeft: 10,
    borderRadius: 50,
    //shadowColor: "#000",
    //shadowOpacity: 0.2,
    //shadowRadius: 10,
    //shadowOffset: { width: 0, height: 4 },
  },
});
