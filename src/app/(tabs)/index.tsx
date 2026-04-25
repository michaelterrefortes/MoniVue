import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { getMonthStats } from "../../../constants/functions";
import { DebtContext } from "../../../context/DebtContext";
import { fetchTotals } from "../../../services/api";

// ...
const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

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
  } = useContext(DebtContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTotals();
        setTotalBills(result.bills);
        setTotalDebts(result.debts);
        setTotalCreditMinimum(result.minimum);
        setTotalSpending(result.spending);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#000" },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? "#000" : "#fff" }]}>
        Budget
      </Text>

      <View
        style={[
          styles.card,
          ,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Income</Text>
            <Text style={[styles.value, styles.income]}>${income}</Text>
          </View>

          <View>
            <Text style={styles.label}>Bills</Text>
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

      <PieChart data={data} donut />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingTop: 80,
    paddingHorizontal: 20,
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
