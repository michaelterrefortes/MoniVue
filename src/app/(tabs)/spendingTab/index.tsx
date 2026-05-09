import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { addWeeks, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AccountButton from "../../../../components/AccountButton";
import BarPlot from "../../../../components/BarPlot";
import Card from "../../../../components/Card";
import {
  formatMoney,
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
    weekly,
    setWeekly,
    yearSummary,
    setYearSpending,
    updateMonth,
    updateWeek,
    updateYear,
  } = useContext(DebtContext);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const year = new Date().getFullYear();

  const [date, setDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(year);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selected, setSelected] = useState(0);

  const [weeklyTotal, setLocalWeeklyTotalSpending] = useState(0);

  const [yearTotal, setYearTotalSpending] = useState(0);

  const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const end = endOfWeek(currentWeek, { weekStartsOn: 1 });

  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [loadingYearly, setLoadingYearly] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMonthly(true);
      try {
        //console.log(date);
        const cond =
          date.getMonth() === new Date().getMonth() &&
          date.getFullYear() === new Date().getFullYear();
        //  console.log("\nFetch Month Data", date);
        //await sleep(1000);
        if (cond) {
          const result = await fetchSpending(date);

          setSpending(result);
          //console.log(result);
          setLocalSpending(result);
        } else {
          const result = await fetchSpending(date);

          const result2 = await fetchSpending(new Date());

          setLocalSpending(result);
          setSpending(result2);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoadingMonthly(false);
      }
    };

    fetchData();
  }, [date, updateMonth]);

  useEffect(() => {
    setLoadingWeekly(true);
    const fetchData = async () => {
      // console.log("Fetch Week Data", currentWeek);
      //await sleep(1000);
      try {
        const result = await fetchSpendingWeek(
          format(start, "yyyy-M-d"),
          format(end, "yyyy-M-d"),
        );

        setWeekly(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoadingWeekly(false);
      }
    };

    fetchData();
  }, [currentWeek, updateWeek]);

  useEffect(() => {
    setLoadingYearly(true);

    const fetchData = async () => {
      // console.log("Fetch Year Data", selectedYear);
      //await sleep(1000);
      try {
        const result = await fetchSpendingYear(selectedYear);

        setYearSpending(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoadingYearly(false);
      }
    };

    fetchData();
  }, [selectedYear, updateYear]);

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

  useLayoutEffect(() => {
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
                    //selectedWeek: currentWeek,
                    startWeek: start,
                    endWeek: end,
                    year: selectedYear,
                  },
                })
              }
            >
              <SymbolView
                name={{ ios: "plus" }}
                tintColor={isDarkMode ? "#fff" : "#000"}
                size={20}
              />
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

  const handleRefresh = async () => {
    setRefreshing(true);

    //await sleep(1000);

    if (selected === 0) {
      try {
        //console.log(date);
        // console.log("\nFetch Month Data", date);
        //await sleep(1000);
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
    } else if (selected === 1) {
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
    } else {
      try {
        const result = await fetchSpendingYear(selectedYear);

        //console.log(result);

        setYearSpending(result);
        //console.log("\ndata week", yearSummary);
        //console.log(yearSummary);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    setRefreshing(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}
      edges={["left", "right"]}
    >
      {selected === 0 ? (
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefresh}
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

                    //selectedWeek: currentWeek,
                    startWeek: start,
                    endWeek: end,
                    year: selectedYear,
                  },
                }}
              />
            );
          }}
          //contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyExtractor={(item) => item.id.toString()}
          //scrollEnabled={false}
          ListFooterComponent={<View style={{ height: 15 }} />}
          ListHeaderComponent={() => {
            return (
              <>
                <Text
                  style={[
                    { marginLeft: 20 },
                    isDarkMode ? styles.lightText : styles.darkText,
                  ]}
                >
                  Track your expenses
                </Text>
                <LinearGradient
                  colors={["#9e1df0", "#da108b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spendingBalance}
                >
                  <Text style={[styles.text, { color: "lightgray" }]}>
                    Total:
                  </Text>
                  <Text
                    style={[
                      styles.textSpendingNumber,
                      { fontSize: 28, color: "#fff" },
                    ]}
                  >
                    {formatMoney(localTotalSpending)}
                  </Text>
                </LinearGradient>
                <View
                  style={[
                    styles.spendingBalance,
                    isDarkMode ? styles.darkField : styles.lightField,
                  ]}
                >
                  <View style={styles.datePickerCard}>
                    <TouchableOpacity
                      style={[
                        styles.buttonLeft,
                        isDarkMode ? styles.darkField : styles.lightField,
                      ]}
                      onPress={() => changeMonth(-1)}
                    >
                      <SymbolView
                        name={{ ios: "chevron.left" }}
                        tintColor="gray"
                        size={20}
                      />
                    </TouchableOpacity>

                    <Text
                      style={[
                        {
                          fontSize: 20,
                          textAlign: "center",
                          justifyContent: "center",
                          fontWeight: "500",
                        },
                        isDarkMode ? styles.lightText : styles.darkText,
                      ]}
                    >
                      {formatMonth(date)}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.buttonRight,
                        isDarkMode ? styles.darkField : styles.lightField,
                      ]}
                      onPress={() => changeMonth(1)}
                    >
                      <SymbolView
                        name={{ ios: "chevron.right" }}
                        tintColor="gray"
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>

                  <BarPlot
                    height={100}
                    //spacing={10}
                    barWidth={25}
                    data={formatPlotData(localSpending, date)}
                  />

                  <SegmentedControl
                    values={TABS}
                    style={{
                      width: "80%",
                      alignSelf: "center",
                      marginTop: 20,
                    }}
                    selectedIndex={selected}
                    onChange={(event) => {
                      setSelected(event.nativeEvent.selectedSegmentIndex);
                    }}
                  />
                </View>
                {loadingMonthly && (
                  <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ActivityIndicator size="large" />
                  </View>
                )}
                {localSpending.length === 0 && !loadingMonthly ? (
                  <Text
                    style={[
                      { textAlign: "center", marginTop: 20 },
                      isDarkMode ? styles.lightText : styles.darkText,
                    ]}
                  >
                    No Spending
                  </Text>
                ) : null}
              </>
            );
          }}
        />
      ) : selected === 1 ? (
        <FlatList
          data={weekly}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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

                    //selectedWeek: currentWeek,
                    startWeek: start,
                    endWeek: end,
                    year: selectedYear,
                  },
                }}
              />
            );
          }}
          //contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyExtractor={(item) => item.id.toString()}
          //scrollEnabled={false}
          ListFooterComponent={<View style={{ height: 15 }} />}
          ListHeaderComponent={() => {
            return (
              <>
                <Text
                  style={[
                    { marginLeft: 20 },
                    isDarkMode ? styles.lightText : styles.darkText,
                  ]}
                >
                  Track your expenses
                </Text>
                <LinearGradient
                  colors={["#9e1df0", "#da108b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spendingBalance}
                >
                  <Text style={[styles.text, { color: "lightgray" }]}>
                    Total:
                  </Text>
                  <Text
                    style={[
                      styles.textSpendingNumber,
                      { fontSize: 28, color: "#fff" },
                    ]}
                  >
                    {formatMoney(weeklyTotal)}
                  </Text>
                </LinearGradient>
                <View
                  style={[
                    styles.spendingBalance,
                    isDarkMode ? styles.darkField : styles.lightField,
                  ]}
                >
                  <View style={[styles.datePickerCard]}>
                    <TouchableOpacity
                      style={[
                        styles.buttonLeft,
                        isDarkMode ? styles.darkField : styles.lightField,
                      ]}
                      onPress={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    >
                      <SymbolView
                        name={{ ios: "chevron.left" }}
                        tintColor="gray"
                        size={20}
                      />
                    </TouchableOpacity>

                    <Text
                      style={[
                        {
                          fontSize: 20,
                          textAlign: "center",
                          justifyContent: "center",
                          fontWeight: "500",
                        },
                        isDarkMode ? styles.lightText : styles.darkText,
                      ]}
                    >
                      {format(start, "MMM d")} - {format(end, "MMM d, yyyy")}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.buttonRight,
                        isDarkMode ? styles.darkField : styles.lightField,
                      ]}
                      onPress={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    >
                      <SymbolView
                        name={{ ios: "chevron.right" }}
                        tintColor="gray"
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>

                  <BarPlot
                    height={100}
                    spacing={10}
                    data={formatWeeklyData(weekly)}
                  />

                  <SegmentedControl
                    values={TABS}
                    style={{
                      width: "80%",
                      alignSelf: "center",
                      marginTop: 20,
                    }}
                    selectedIndex={selected}
                    onChange={(event) => {
                      setSelected(event.nativeEvent.selectedSegmentIndex);
                    }}
                  />
                </View>

                {loadingWeekly && (
                  <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ActivityIndicator size="large" />
                  </View>
                )}

                {weekly.length === 0 && !loadingWeekly ? (
                  <Text
                    style={[
                      { textAlign: "center", marginTop: 20 },
                      isDarkMode ? styles.lightText : styles.darkText,
                    ]}
                  >
                    No spending
                  </Text>
                ) : null}
              </>
            );
          }}
        />
      ) : selected == 2 ? (
        <>
          <FlatList
            data={[]}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListHeaderComponent={
              <>
                <Text
                  style={[
                    { marginLeft: 20 },
                    isDarkMode ? styles.lightText : styles.darkText,
                  ]}
                >
                  Track your expenses
                </Text>
                <LinearGradient
                  colors={["#9e1df0", "#da108b"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.spendingBalance}
                >
                  <Text style={[styles.text, { color: "lightgray" }]}>
                    Total:
                  </Text>
                  <Text
                    style={[
                      styles.textSpendingNumber,
                      { fontSize: 28, color: "#fff" },
                    ]}
                  >
                    {formatMoney(yearTotal)}
                  </Text>
                </LinearGradient>
                <View
                  style={[
                    styles.spendingBalance,
                    isDarkMode ? styles.darkField : styles.lightField,
                  ]}
                >
                  <View style={[styles.datePickerCard]}>
                    <TouchableOpacity
                      style={[
                        styles.buttonLeft,
                        isDarkMode ? styles.darkField : styles.lightField,
                      ]}
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
                      style={[
                        {
                          fontSize: 20,
                          textAlign: "center",
                          justifyContent: "center",
                          fontWeight: "500",
                        },
                        isDarkMode ? styles.lightText : styles.darkText,
                      ]}
                    >
                      {selectedYear}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.buttonRight,
                        isDarkMode ? styles.darkField : styles.lightField,
                      ]}
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

                  {yearSummary.length === 0 ? (
                    <BarPlot
                      height={100}
                      data={[]}
                      spacing={15}
                      barWidth={10}
                    />
                  ) : (
                    <BarPlot
                      height={100}
                      data={formatYearly(yearSummary)}
                      spacing={15}
                      barWidth={10}
                    />
                  )}

                  <SegmentedControl
                    values={TABS}
                    style={{
                      width: "80%",
                      alignSelf: "center",
                      marginTop: 20,
                    }}
                    selectedIndex={selected}
                    onChange={(event) => {
                      setSelected(event.nativeEvent.selectedSegmentIndex);
                    }}
                  />

                  {loadingYearly && (
                    <View style={{ alignItems: "center", marginTop: 20 }}>
                      <ActivityIndicator size="large" />
                    </View>
                  )}
                </View>
              </>
            }
          />
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default SpendingTab;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#000" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

  container: {
    flex: 1,
    //marginTop: 150,
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
    paddingHorizontal: 16,
    paddingVertical: 30,
    borderRadius: 30,
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
    fontWeight: "500",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },

  buttonRight: {
    //paddingRight: 5,
    padding: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 50,
  },
  buttonLeft: {
    padding: 5,
    backgroundColor: "#f2f2f2",
    borderRadius: 50,
  },
});
