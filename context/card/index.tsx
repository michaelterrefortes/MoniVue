import { useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { validateDate } from "../../constants/functions";
import { fetchCredit } from "../../services/api";
import { DebtContext } from "../DebtContext";

/*const debts = [
  { id: 1, name: "AMEX", apr: 28.99, limit: 5000, balance: 143.87 },
  { id: 2, name: "AMEX Ex", apr: 29.99, limit: 1000, balance: 13.98 },
  { id: 3, name: "CapOne", apr: 31.99, limit: 3000, balance: 0 },
  { id: 4, name: "Citi", apr: 11.99, limit: 1600, balance: 0 },
  { id: 5, name: "Premia", apr: 31.99, limit: 5200, balance: 1543.23 },
  { id: 6, name: "CashReward", apr: 30.99, limit: 10500, balance: 2334.56 },
  { id: 7, name: "Discover", apr: 21.99, limit: 3000, balance: 0 },
];*/

//const debt = 143.87 + 586.43;

export default function Cards() {
  const router = useRouter();

  //const [debts, setDebts] = useState([]);
  const { debts, setDebts } = useContext(DebtContext);
  const [debt, setDebt] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.push("debts/addDebt")}>
          <SymbolView name={{ ios: "plus" }} tintColor="white" size={20} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchCredit();

        setDebts(result);
        setLoading(false);
        //console.log(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setDebt(debts.reduce((acc, curr) => acc + curr.balance, 0));
  }, [debts]);

  const getUtilizationColor = (value) => {
    if (value <= 10) return "#22c55e"; // green
    if (value <= 30) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  //const percentage = 100;

  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top - 36 }]}>
      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator
            size="large"
            //color="#0000ff"
            //className="mt-10 self-center"
          />
        </View>
      ) : (
        <FlatList
          data={debts}
          ListHeaderComponent={() => (
            <>
              {/*<Text
        style={{
          fontWeight: "bold",
          fontSize: 28,
          paddingTop: 10,
          paddingLeft: 15,
        }}
      >
        Total Balance
      </Text>*/}
              <View style={{ height: 150 }} />
              <Text style={styles.numberBalance}>${debt.toFixed(2)}</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 28,
                  paddingTop: 10,
                  paddingLeft: 15,
                  paddingBottom: 10,
                }}
              >
                Card Balances
              </Text>
            </>
          )}
          renderItem={({ item }) => {
            const utilization = (item.balance / item.credit_limit) * 100 || 0;

            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
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
                  })
                }
              >
                <View style={styles.cardLeft}>
                  <Text style={styles.cardTitle}>{item.credit_name}</Text>

                  <Text style={styles.cardBalance}>
                    ${item.balance.toFixed(2)}
                  </Text>

                  <Text style={styles.cardSub}>
                    Limit: ${item.credit_limit}
                  </Text>

                  <Text style={styles.cardAPR}>APR {item.apr}%</Text>
                </View>

                <View style={styles.cardRight}>
                  <AnimatedCircularProgress
                    size={65}
                    width={7}
                    backgroundWidth={3}
                    fill={utilization}
                    tintColor={getUtilizationColor(utilization)}
                    backgroundColor="#e5e7eb"
                    arcSweepAngle={240}
                    rotation={240}
                    lineCap="round"
                  >
                    {(fill) => (
                      <Text style={styles.progressText}>
                        {Math.round(fill)}%
                      </Text>
                    )}
                  </AnimatedCircularProgress>
                  <Text style={styles.cardSub}>
                    Due: {validateDate(item.statement_date)}
                  </Text>
                  <Text style={styles.cardSub}>Minimum: ${item.minimum}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyExtractor={(item) => item.id.toString()}
          //scrollEnabled={false}

          //ListHeaderComponent={
          //  <Text style={{ fontWeight: "bold", fontSize: 28, paddingTop: 10 }}>
          //    Card Balances:
          //</View>  </Text>
          //}
        />
      )}
      {/* Floating Action Button */}
    </View>
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

  numberBalance: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 50,
    //marginBottom: 30,
    fontSize: 38,
    marginTop: 10,
    fontWeight: "bold",

    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    textAlign: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
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

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginTop: 12,
    width: "92%",
    alignSelf: "center",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  cardLeft: {
    flex: 1,
  },

  cardRight: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardBalance: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  cardSub: {
    fontSize: 12,
    color: "#6b7280",
  },

  cardAPR: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },

  progressText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
