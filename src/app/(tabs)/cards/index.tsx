import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CardDebts from "../../../../components/CardDebts";
import { formatMoney } from "../../../../constants/functions";
import { DebtContext } from "../../../../context/DebtContext";
import { fetchCredit } from "../../../../services/api";

export default function Cards() {
  const router = useRouter();

  //const [debts, setDebts] = useState([]);
  const {
    debts,
    setDebts,
    setTotalDebts,
    totalDebts,
    totalCreditMinimum,
    setTotalCreditMinimum,
  } = useContext(DebtContext);

  //const [debt, setDebt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await sleep(1000);
      try {
        const result = await fetchCredit();

        setDebts(result);

        //console.log(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setTotalDebts(debts.reduce((acc, curr) => acc + curr.balance, 0));
    setTotalCreditMinimum(debts.reduce((acc, curr) => acc + curr.minimum, 0));
  }, [debts]);

  const { top } = useSafeAreaInsets();

  const handleRefresh = async () => {
    setRefreshing(true);

    await sleep(1000);

    try {
      const result = await fetchCredit();
      setDebts(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "rgb(242, 242, 242)" }]}
    >
      <FlatList
        data={debts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => {
          const utilization = (item.balance / item.credit_limit) * 100 || 0;

          return (
            <CardDebts
              item={item}
              params={{
                pathname: "/debts/[debtId]",
                params: {
                  id: item.id,
                  name: item.credit_name,
                  balance: item.balance,
                  limit: item.credit_limit,
                  apr: item.apr,
                  minimum: item.minimum,
                  date: item.statement_date,
                },
              }}
              utilization={utilization}
            />
          );
        }}
        //contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        keyExtractor={(item) => item.id.toString()}
        //scrollEnabled={false}

        ListHeaderComponent={
          <>
            <View style={[styles.viewBalance, { backgroundColor: "#fff" }]}>
              <Text
                style={{ fontSize: 12, color: "gray", textAlign: "center" }}
              >
                Total Balance:
              </Text>
              <Text style={[styles.balanceNumber, { color: "#000" }]}>
                {formatMoney(totalDebts)}
              </Text>
              <Text
                style={{ fontSize: 12, color: "gray", textAlign: "center" }}
              >
                Total Min Payment:
              </Text>
              <Text
                style={{ fontSize: 12, color: "gray", textAlign: "center" }}
              >
                {formatMoney(totalCreditMinimum)}
              </Text>
            </View>
            <View style={{ height: 20 }} />

            {loading && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <ActivityIndicator size="large" />
              </View>
            )}

            {debts.length === 0 && !loading ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No Credit Cards
              </Text>
            ) : null}
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f5f5f5",
  },
  containerLoading: {
    width: "100%",
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },

  viewBalance: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 50,
    //marginBottom: 30,

    marginTop: 10,

    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  balanceNumber: {
    fontWeight: "bold",
    fontSize: 38,
    textAlign: "center",
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

  buttonText: {
    color: "#fff",
    fontSize: 30,

    //fontWeight: "bold",
  },
});
