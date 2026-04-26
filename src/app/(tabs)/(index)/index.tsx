import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { categoriesSpending } from "../../../../constants/categories";
import { formatPlotData, getMonthStats } from "../../../../constants/functions";
import { DebtContext } from "../../../../context/DebtContext";
import { fetchSpending, fetchTotals } from "../../../../services/api";

// ...
const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

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

  const [income, setIncome] = useState(2300);
  const {
    totalDebts,
    setTotalDebts,
    totalBills,
    setTotalBills,
    totalSpending,
    setTotalSpending,
    totalCreditMinimum,
    setTotalCreditMinimum,
    isDarkMode,

    spending,
    setSpending,
  } = useContext(DebtContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#000" },
      ]}
    >
      {/*<Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Budget
      </Text>*/}

      <View
        style={[
          styles.card,
          ,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <View style={styles.row}>
          <View>
            <TouchableOpacity
              style={{
                paddingHorizontal: 2,
                flexDirection: "row",
                justifyContent: "center",

                alignItems: "center",
              }}
              onPress={() => console.log("pressed")}
            >
              <Text style={[styles.label]}>Income</Text>
              <SymbolView
                name={{ ios: "chevron.right" }}
                tintColor="gray"
                size={12}
              />
            </TouchableOpacity>

            <Text style={[styles.value, styles.income]}>${income}</Text>
          </View>

          <View>
            <TouchableOpacity
              style={{
                paddingHorizontal: 2,
                flexDirection: "row",
                //justifyContent: "center",

                alignItems: "center",
              }}
              onPress={() => router.push("/(tabs)/billsTab")}
            >
              <Text style={[styles.label]}>Bills</Text>
              <SymbolView
                name={{ ios: "chevron.right" }}
                tintColor="gray"
                size={12}
              />
            </TouchableOpacity>
            <Text style={[styles.value, styles.expense]}>${totalBills}</Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: isDarkMode ? "#eee" : "#424242" },
          ]}
        />

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Credit Card</Text>
            <Text style={[styles.value, styles.expense]}>
              ${totalCreditMinimum.toFixed(2)}
            </Text>
          </View>
          <View>
            <Text style={styles.label}>Spending</Text>
            <Text style={[styles.value, styles.expense]}>
              ${totalSpending.toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.divider,
            { backgroundColor: isDarkMode ? "#eee" : "#424242" },
          ]}
        />
      </View>

      <View
        style={[
          styles.cardBudget,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
          },
        ]}
      >
        <Text style={styles.label}>Left This Month:</Text>
        <Text
          style={[
            styles.value,
            income - totalBills - totalCreditMinimum - totalSpending >= 0
              ? styles.income
              : styles.expense,
          ]}
        >
          $
          {(income - totalBills - totalCreditMinimum - totalSpending).toFixed(
            2,
          )}
        </Text>
      </View>

      <View
        style={[
          styles.cardBudget,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
          },
        ]}
      >
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.label}>Daily Amount to Spend:</Text>
          <Text style={styles.label}>
            Remaining Days in Month: {getMonthStats().remainingDays}
          </Text>
        </View>
        <Text
          style={[
            styles.value,
            (income - totalBills - totalCreditMinimum - totalSpending) /
              getMonthStats().totalDays >=
            0
              ? styles.income
              : styles.expense,
          ]}
        >
          $
          {(
            (income - totalBills - totalCreditMinimum - totalSpending) /
            getMonthStats().totalDays
          ).toFixed(2)}
          /day
        </Text>
      </View>

      <View style={[styles.card, { marginTop: 15 }]}>
        <Text style={[styles.label, { textAlign: "left" }]}>
          Monthly Spending:
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          {new Date().toLocaleDateString("en-US", { month: "short" })}{" "}
          {new Date().getFullYear()}
        </Text>
        <View style={{ alignSelf: "center", marginBottom: 15, marginTop: 10 }}>
          {spending.length !== 0 ? (
            <BarChart
              data={formatPlotData(spending, new Date())}
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
              //frontColor={"#drgb(0, 162, 255)"}
              //showGradient
            />
          ) : (
            <BarChart
              data={[]}
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
              //frontColor={"#drgb(0, 162, 255)"}
              //showGradient
            />
          )}
        </View>
      </View>

      <View style={[styles.card, { marginTop: 15, marginBottom: 15 }]}>
        <Text style={[styles.label, { textAlign: "left" }]}>
          Spending Categories:
        </Text>
        <View style={{ alignSelf: "center", marginBottom: 15, marginTop: 10 }}>
          {spending.length !== 0 ? (
            <PieChart
              radius={90}
              innerRadius={60}
              data={formatDataType(spending, totalSpending)}
              donut
            />
          ) : (
            <PieChart radius={90} innerRadius={60} data={[]} donut />
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
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
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
