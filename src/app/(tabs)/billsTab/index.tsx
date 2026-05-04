import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
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
import CardBills from "../../../../components/CardBills";
import { formatMoney } from "../../../../constants/functions";
import { DebtContext } from "../../../../context/DebtContext";
import { fetchBills } from "../../../../services/api";

export default function BillsTab() {
  const router = useRouter();

  const { bills, setBills, setTotalBills, totalBills } =
    useContext(DebtContext);

  const [variance, setVariance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { top } = useSafeAreaInsets();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const loadBills = async () => {
      setLoading(true);
      await sleep(1000);
      try {
        const result = await fetchBills();
        setBills(result);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, []);

  useEffect(() => {
    setTotalBills(bills.reduce((acc, curr) => acc + curr.price, 0));
    setVariance(bills.reduce((acc, curr) => acc + curr.variable, 0));
  }, [bills]);

  const handleRefresh = async () => {
    setRefreshing(true);

    await sleep(1000);

    try {
      const result = await fetchBills();
      setBills(result);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bills}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <Text style={{ marginLeft: 20 }}>Manage your monthly payments</Text>
            <View style={[styles.billsBalance, { backgroundColor: "#fff" }]}>
              <Text style={styles.textVaries}>Total:</Text>
              <Text style={[styles.textBills, { color: "#000" }]}>
                {formatMoney(totalBills)}
              </Text>

              <Text style={styles.textVaries}>Variation:</Text>
              <Text style={styles.textVaries}>
                {formatMoney(totalBills - variance)} - $
                {formatMoney(totalBills + variance)}
              </Text>
            </View>

            <View style={{ height: 20 }} />

            {loading && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <ActivityIndicator size="large" />
              </View>
            )}

            {bills.length === 0 && !loading ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No Bills
              </Text>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <CardBills
            item={item}
            params={{
              pathname: "/bills/[billId]",
              params: {
                id: item.id,
                name: item.bill_name,
                price: item.price,
                type: item.type_bill,
                variable: item.variable,
                date: item.payment_date,
              },
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  billsBalance: {
    paddingHorizontal: 15,
    paddingVertical: 30,
    borderRadius: 30,
    marginTop: 10,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  textBills: {
    fontWeight: "500",
    fontSize: 38,
  },

  textVaries: {
    fontSize: 12,
    color: "gray",
  },
});
