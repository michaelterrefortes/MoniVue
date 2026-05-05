import { LinearGradient } from "expo-linear-gradient";
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

const getUtilizationColor = (value) => {
  if (value <= 10) return "#22c55e"; // green
  if (value <= 30) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};

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

  const [totalLimit, setTotalLimit] = useState(0);

  const [globalUtilization, setGlobalUtilization] = useState(0);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      //await sleep(1000);
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
    setTotalLimit(debts.reduce((acc, curr) => acc + curr.credit_limit, 0));
  }, [debts]);

  const { top } = useSafeAreaInsets();

  const handleRefresh = async () => {
    setRefreshing(true);

    //await sleep(1000);

    try {
      const result = await fetchCredit();
      setDebts(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (totalLimit === 0) setGlobalUtilization(0);
    else setGlobalUtilization((totalDebts / totalLimit) * 100);
  }, [totalDebts, totalLimit]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "rgb(242, 242, 242)" }]}
      edges={["left", "right"]}
    >
      <FlatList
        data={debts}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item, index }) => {
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
              index={index}
              utilization={utilization}
            />
          );
        }}
        //contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        keyExtractor={(item) => item.id.toString()}
        //scrollEnabled={false}

        ListFooterComponent={<View style={{ height: 15 }} />}
        ListHeaderComponent={
          <>
            <Text style={{ marginLeft: 20 }}>Monitor your credit usage</Text>
            <LinearGradient
              colors={["#5536f4", "#7f07dd"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.viewBalance, { backgroundColor: "#fff" }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ fontSize: 12, color: "lightgray" }}>
                    Total Balance
                  </Text>
                  <Text style={[styles.balanceNumber, { color: "#fff" }]}>
                    {formatMoney(totalDebts)}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: "lightgray" }}>
                    Available
                  </Text>
                  <Text
                    style={[
                      styles.balanceNumber,
                      { color: "#fff", fontSize: 20 },
                    ]}
                  >
                    {formatMoney(totalLimit - totalDebts)}
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: "lightgray" }}>
                Total Min Payment:
              </Text>
              <Text style={{ fontSize: 12, color: "lightgray" }}>
                {formatMoney(totalCreditMinimum)}
              </Text>

              <View style={styles.container2}>
                <View style={styles.headerRow}>
                  <Text style={[styles.dateText, { color: "white" }]}>
                    Credit Utilization
                  </Text>
                  <Text style={[styles.percentText, { color: "white" }]}>
                    {globalUtilization.toFixed(2)}% used
                  </Text>
                </View>

                <View style={[styles.progressBarBackground]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${globalUtilization}%`,
                        //backgroundColor: getUtilizationColor(globalUtilization),
                        backgroundColor: "#fff",
                      },
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
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
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 20,
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

  balanceNumber: {
    fontWeight: "500",
    fontSize: 30,
    //textAlign: "center",
  },

  container2: {
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    padding: 16,
    borderRadius: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    //backgroundColor: "rgba(146, 146, 146, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    //backgroundColor: "#d3ff00",
    borderRadius: 3,
  },
});
