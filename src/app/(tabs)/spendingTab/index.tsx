import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import AccountButton from "../../../../components/AccountButton";
import Card from "../../../../components/Card";
import {
  formatPlotData,
  formatWeeklyData,
  formatYearly,
} from "../../../../constants/functions";
import { DebtContext } from "../../../../context/DebtContext";
import {
  fetchSpending,
  fetchSpendingWeek,
  fetchSpendingYear,
} from "../../../../services/api";

const TABS = ["Month", "Week", "Year"];

const SpendingTab = () => {
  const router = useRouter();
  const navigation = useNavigation();

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

  const year = new Date().getFullYear();

  const [date, setDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(year);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selected, setSelected] = useState(0);

  const [weekly, setWeekly] = useState([]);
  const [weeklyTotal, setLocalWeeklyTotalSpending] = useState(0);

  const [yearSummary, setYearSpending] = useState([]);
  const [yearTotal, setYearTotalSpending] = useState(0);

  const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const end = endOfWeek(currentWeek, { weekStartsOn: 1 });

  function usePrevious(value) {
    const ref = useRef();

    // Store current value in ref after every render
    useEffect(() => {
      ref.current = value;
    }, [value]);

    // Return the value from the previous render (which was stored in the last effect run)
    return ref.current;
  }

  const prevMonth = usePrevious(date);
  const prevWeekly = usePrevious(currentWeek);
  const prevYear = usePrevious(selectedYear);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log(date);
        console.log("\nFetch Month Data", date);
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
    const fetchData = async () => {
      console.log("Fetch Week Data", currentWeek);
      try {
        const result = await fetchSpendingWeek(
          format(start, "yyyy-M-d"),
          format(end, "yyyy-M-d"),
        );

        setWeekly(result);

        //console.log("data week", result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    //if (selected === 1) {
    //console.log(format(start, "yyyy-M-d"), format(end, "yyyy-M-d"));

    fetchData();
    //}
  }, [currentWeek]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetch Year Data", selectedYear);
      try {
        const result = await fetchSpendingYear(selectedYear);

        //console.log(result);

        setYearSpending(result);
        //console.log("\ndata week", yearSummary);
        //console.log(yearSummary);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    //if (selected === 1) {
    //console.log(format(start, "yyyy-M-d"), format(end, "yyyy-M-d"));

    fetchData();
    //}
  }, [selectedYear]);

  useEffect(() => {
    setTotalSpending(spending.reduce((acc, curr) => acc + curr.amount, 0));
  }, [spending]);

  useEffect(() => {
    setLocalTotalSpending(
      localSpending.reduce((acc, curr) => acc + curr.amount, 0),
    );
  }, [localSpending]);

  useEffect(() => {
    setLocalWeeklyTotalSpending(
      weekly.reduce((acc, curr) => acc + curr.amount, 0),
    );
  }, [weekly]);

  useEffect(() => {
    setYearTotalSpending(
      yearSummary.reduce((acc, curr) => acc + curr.total_sum, 0),
    );
  }, [yearSummary]);

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

  useEffect(() => {
    navigation.setOptions({
      unstable_headerRightItems: () => [
        {
          type: "custom",
          element: (
            <TouchableOpacity
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
              <SymbolView name={{ ios: "plus" }} tintColor="black" size={20} />
            </TouchableOpacity>
          ),
        },
        {
          type: "custom",
          element: <AccountButton />,
        },
      ],
    });
  }, [navigation, date]);

  //formatPlotData(localSpending, date);

  return (
    <View style={styles.container}>
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

      <SegmentedControl
        values={TABS}
        style={{ width: "80%", alignSelf: "center", margin: 20 }}
        selectedIndex={selected}
        onChange={(event) => {
          setSelected(event.nativeEvent.selectedSegmentIndex);
        }}
      />

      {selected === 0 ? (
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
                    //minHeight={3}
                    barBorderRadius={3}
                    spacing={20}
                    noOfSections={4}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
                    yAxisTextStyle={{ color: "gray", fontSize: 10 }}
                    isAnimated
                    animationDuration={300}
                    gradientColor={"#12ff00"} // Default top color
                    frontColor={"#d3ff00"} // Default bottom color
                    //showGradient
                  />
                </View>
              </>
            );
          }}
        />
      ) : selected === 1 ? (
        <FlatList
          data={weekly}
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
                <View
                  style={[
                    styles.datePickerCard,
                    {
                      width: "90%",
                      alignSelf: "center",
                      alignContent: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  >
                    <SymbolView
                      name={{ ios: "chevron.left" }}
                      tintColor="gray"
                      size={20}
                    />
                  </TouchableOpacity>

                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {format(start, "MMM d")} - {format(end, "MMM d, yyyy")}
                  </Text>

                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  >
                    <SymbolView
                      name={{ ios: "chevron.right" }}
                      tintColor="gray"
                      size={20}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.spendingBalance}>
                  <Text style={styles.text}>Total:</Text>
                  <Text style={styles.textSpendingNumber}>
                    ${weeklyTotal.toFixed(2)}
                  </Text>

                  <BarChart
                    data={formatWeeklyData(weekly)}
                    height={200}
                    //width={220}
                    //barWidth={20}
                    //minHeight={3}
                    barBorderRadius={3}
                    spacing={5}
                    noOfSections={4}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
                    yAxisTextStyle={{ color: "gray", fontSize: 10 }}
                    isAnimated
                    animationDuration={300}
                    gradientColor={"#12ff00"} // Default top color
                    frontColor={"#d3ff00"} // Default bottom color
                    //showGradient
                  />
                </View>
              </>
            );
          }}
        />
      ) : selected == 2 ? (
        <>
          <View
            style={[
              styles.datePickerCard,
              { paddingHorizontal: 16, paddingBottom: 16 },
            ]}
          >
            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => {
                setSelectedYear((prev) => prev - 1);
              }}
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
              {selectedYear}
            </Text>

            <TouchableOpacity
              style={{ paddingHorizontal: 10 }}
              onPress={() => {
                setSelectedYear((prev) => prev + 1);
              }}
            >
              <SymbolView
                name={{ ios: "chevron.right" }}
                tintColor="gray"
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.spendingBalance]}>
            <Text style={styles.text}>Total:</Text>
            <Text style={styles.textSpendingNumber}>
              ${yearTotal.toFixed(2)}
            </Text>
            {yearSummary.length !== 0 ? (
              <BarChart
                data={formatYearly(yearSummary)}
                height={200}
                //width={220}
                barWidth={20}
                //horizontal
                //minHeight={3}
                barBorderRadius={3}
                spacing={5}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
                yAxisTextStyle={{ color: "gray", fontSize: 10 }}
                isAnimated
                animationDuration={300}
                gradientColor={"#12ff00"} // Default top color
                frontColor={"#d3ff00"} // Default bottom color
                //showGradient
              />
            ) : (
              <BarChart
                data={[]}
                height={200}
                //width={220}
                barWidth={20}
                //horizontal
                //minHeight={3}
                barBorderRadius={3}
                spacing={5}
                noOfSections={4}
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
                yAxisTextStyle={{ color: "gray", fontSize: 10 }}
                isAnimated
                animationDuration={300}
                gradientColor={"#12ff00"} // Default top color
                frontColor={"#d3ff00"} // Default bottom color
                //showGradient
              />
            )}
          </View>
        </>
      ) : null}
    </View>
  );
};

export default SpendingTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    //alignItems: "center",
    //justifyContent: "center",
  },
  fab: {
    position: "absolute",
    bottom: 100, // adjust if your tab bar is different
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
    //marginTop: 15,
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
