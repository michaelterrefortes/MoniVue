import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import BarPlot from "../../../../components/BarPlot";
import CardHome from "../../../../components/CardHome";
import { categoriesSpending } from "../../../../constants/categories";
import {
  formatMoney,
  formatPlotData,
  getMonthStats,
} from "../../../../constants/functions";
import { DebtContext } from "../../../../context/DebtContext";
import {
  fetchProfile,
  fetchSpending,
  fetchTotals,
} from "../../../../services/api";
const formatDataType = (monthlyData, total) => {
  let dataPlot = [];
  //console.log(monthlyData);

  if (monthlyData.length !== 0) {
    const sumData = monthlyData.reduce(
      (acc, curr) => {
        // Initialize category if it doesn't exist
        if (!acc[curr.type_spending]) {
          acc[curr.type_spending] = 0;
        }
        // Sum the price
        acc[curr.type_spending] += curr.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    //console.log("\n", sumData);

    for (const key in sumData) {
      dataPlot.push({
        key: Number[key],
        label: categoriesSpending[Number(key)].name,
        value: (sumData[key] / total) * 100,
        color: categoriesSpending[Number(key)].color,
      });
    }

    //console.log(dataPlot);

    return dataPlot;
  }
};

const Index = () => {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const {
    totalDebts,
    setTotalDebts,
    totalBills,
    setTotalBills,
    totalSpending,
    setTotalSpending,
    totalCreditMinimum,
    setTotalCreditMinimum,
    spending,
    setSpending,
    income,
    setIncome,
  } = useContext(DebtContext);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      //await sleep(1000);
      try {
        const result1 = await fetchProfile();
        setIncome(result1.data.income);
        const result = await fetchTotals();
        setTotalBills(result.bills);
        setTotalDebts(result.debts);
        setTotalCreditMinimum(result.minimum);
        setTotalSpending(result.spending);

        const result2 = await fetchSpending();
        setSpending(result2);
        //console.log(result2);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    //await sleep(1000);
    try {
      const result = await fetchTotals();
      setTotalBills(result.bills);
      setTotalDebts(result.debts);
      setTotalCreditMinimum(result.minimum);
      setTotalSpending(result.spending);

      const result2 = await fetchSpending();
      setSpending(result2);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, isDarkMode ? styles.darkBg : styles.lightBg]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <>
          <Text
            style={[
              { marginBottom: 10 },
              isDarkMode ? styles.lightText : styles.darkText,
            ]}
          >
            Track your monthly finances
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <CardHome
              data={income}
              label={"Income"}
              color={"green"}
              route={() => router.push("/settings/change-income")}
            />

            <CardHome
              data={totalBills + totalCreditMinimum + totalSpending}
              label={"Total Expenses"}
              color={"red"}
              pressable={false}
              route={() => null}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <CardHome
              data={totalBills}
              label={"Bills"}
              color={"red"}
              route={() => router.navigate("/(tabs)/billsTab")}
            />

            <CardHome
              data={totalSpending}
              label={"Spending"}
              color={"red"}
              route={() => router.navigate("/(tabs)/spendingTab")}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <CardHome
              data={totalCreditMinimum}
              label={"Credit Card"}
              color={"red"}
              route={() => router.navigate("/(tabs)/cards")}
            />

            <CardHome
              data={income - totalBills - totalCreditMinimum - totalSpending}
              label={"Left This Month"}
              color={"green"}
              pressable={false}
              route={() => null}
            />
          </View>

          <LinearGradient
            colors={["#2b5bfc", "#921ffa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.cardBudget,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#fff",
              },
            ]}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={[styles.label, { color: "lightgray" }]}>
                Daily Amount to Spend:
              </Text>
              <Text style={[styles.label, { color: "lightgray" }]}>
                Remaining Days in Month: {getMonthStats().remainingDays}
              </Text>
            </View>
            <Text style={[styles.value, { color: "#fff" }]}>
              {formatMoney(
                (income - totalBills - totalCreditMinimum - totalSpending) /
                  getMonthStats().totalDays,
              )}
              /day
            </Text>
          </LinearGradient>
          <View
            style={[
              styles.card,
              { marginTop: 10 },
              isDarkMode ? styles.darkField : styles.lightField,
            ]}
          >
            <Text style={[styles.label, { textAlign: "left" }]}>
              Monthly Spending:
            </Text>
            <Text
              style={[
                { fontWeight: "bold" },
                isDarkMode ? styles.lightText : styles.darkText,
              ]}
            >
              {new Date().toLocaleDateString("en-US", { month: "short" })}{" "}
              {new Date().getFullYear()}
            </Text>
            <View
              style={{
                //alignSelf: "center",
                marginBottom: 15,
                marginTop: 10,
              }}
            >
              {spending.length !== 0 ? (
                <BarPlot
                  height={200}
                  spacing={25}
                  data={formatPlotData(spending, new Date())}
                />
              ) : (
                <BarPlot height={200} barWidth={25} data={[]} />
              )}
            </View>
          </View>
          <View
            style={[
              styles.card,
              { marginTop: 10, marginBottom: 15 },
              isDarkMode ? styles.darkField : styles.lightField,
            ]}
          >
            <Text style={[styles.label, { textAlign: "left" }]}>
              Spending Categories:
            </Text>
            <View
              style={{ alignSelf: "center", marginBottom: 15, marginTop: 10 }}
            >
              {spending.length !== 0 ? (
                <PieChart
                  radius={90}
                  innerRadius={60}
                  innerCircleColor={isDarkMode ? "#2f2f2f" : "#fff"}
                  data={formatDataType(spending, totalSpending)}
                  donut
                />
              ) : (
                <PieChart
                  radius={90}
                  innerRadius={60}
                  data={[]}
                  innerCircleColor={isDarkMode ? "#2f2f2f" : "#fff"}
                  donut
                />
              )}
            </View>
            {formatDataType(spending, totalSpending)?.map((item, index) => {
              return (
                <View
                  key={`${item.key}-${index}`}
                  style={{ flexDirection: "row", alignSelf: "center" }}
                >
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: item.color,
                      marginRight: 10,
                    }}
                  />
                  <Text style={styles.label}>
                    {item.label}: {item.value.toFixed(0)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#000" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardSmall: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    //paddingTop: 80,
    paddingHorizontal: 20,
    //marginHorizontal: 20,
  },
  cardBudget: {
    //marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "500",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  income: {
    color: "#2ECC71",
  },
  expense: {
    color: "#E74C3C",
  },
});

const styles2 = StyleSheet.create({
  containerCard: {
    borderRadius: 24, // rounded-3xl
    padding: 6, // space for border effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10, // Android shadow
  },
  inner: {
    borderRadius: 24,
    padding: 24, // p-6
    backgroundColor: "rgba(255,255,255,0.05)", // subtle glass effect
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)", // border-white/20
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    //paddingTop: 80,
    paddingHorizontal: 20,
    //marginHorizontal: 20,
  },
  cardBudget: {
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1A1A1A",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  labelTitle: {
    fontSize: 14,
    color: "#888",
    //marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
  },
  income: {
    color: "#2ECC71",
  },
  expense: {
    color: "#E74C3C",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 15,
  },
});
