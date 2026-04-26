import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { categories } from "../../../constants/categories";
import { validateDate } from "../../../constants/functions";
import { DebtContext } from "../../../context/DebtContext";
import { fetchBills } from "../../../services/api";
/*const bills = [
  { id: 1, name: "T-Mobile", price: 248, variable: 0, type: 8 },
  { id: 2, name: "Elecric Bill", price: 120.32, variable: 10, type: 4 },
  { id: 3, name: "Water Bill", price: 211.23, variable: 5, type: 4 },
  { id: 4, name: "Mortgage", price: 718, variable: 0, type: 1 },
  { id: 5, name: "Netflix", price: 19.99, variable: 0, type: 11 },
  { id: 6, name: "Apple Music", price: 10.99, variable: 0, type: 11 },
];*/

export default function BillsTab() {
  const router = useRouter();
  //const billsUtilities = bills.reduce((acc, curr) => acc + curr.price, 0);
  //const variance = bills.reduce((acc, curr) => acc + curr.variable, 0);

  const { bills, setBills, setTotalBills, totalBills, isDarkMode } =
    useContext(DebtContext);
  //const [billsUtilities, setBillsUtilities] = useState(0);
  const [variance, setVariance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchBills();

        setBills(result);
        //console.log(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setTotalBills(bills.reduce((acc, curr) => acc + curr.price, 0));
    setVariance(bills.reduce((acc, curr) => acc + curr.variable, 0));
  }, [bills]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "rgb(242, 242, 242)" : "#000" },
      ]}
    >
      <View style={{ height: 70 }} />

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 28,
          paddingTop: 10,
          paddingLeft: 15,
          color: isDarkMode ? "#000" : "#fff",
        }}
      >
        Bills & Utilities
      </Text>

      <View
        style={[
          styles.billsBalance,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <Text style={styles.textVaries}>Total:</Text>
        <Text
          style={[styles.textBills, { color: isDarkMode ? "#000" : "#fff" }]}
        >
          ${totalBills.toFixed(2)}
        </Text>
        <Text style={styles.textVaries}>Variation:</Text>
        <Text style={styles.textVaries}>
          ${(totalBills - variance).toFixed(2)} - $
          {(totalBills + variance).toFixed(2)}
        </Text>
      </View>

      <View style={{ height: 20 }} />

      <FlatList
        style={{
          backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
          //borderRadius: 50,
          paddingTop: 30,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
        data={bills}
        renderItem={({ item }) => {
          //console.log(categories[item.type].icon);
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isDarkMode ? "#fff" : "#1c1c1c",
                  shadowColor: isDarkMode ? "#000" : "#838383",
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/bills/[billId]",
                  params: {
                    id: item.id,
                    name: item.bill_name,
                    price: item.price,
                    type: item.type_bill,
                    variable: item.variable,
                    date: item.payment_date,
                  },
                })
              }
            >
              <View style={styles.cardLeft}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      paddingHorizontal: 10,
                      backgroundColor: categories[item.type_bill].color,

                      borderRadius: 50,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SymbolView
                      name={{ ios: categories[item.type_bill].icon }}
                      tintColor="black"
                      size={25}
                    />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={[
                        styles.cardTitle,
                        { color: isDarkMode ? "#000" : "#fff" },
                      ]}
                    >
                      {item.bill_name}
                    </Text>
                    <Text
                      style={{ paddingTop: 5, fontSize: 12, color: "gray" }}
                    >
                      {categories[item.type_bill].name}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardRight}>
                <Text
                  style={[
                    styles.cardPrice,
                    { color: isDarkMode ? "#000" : "#fff" },
                  ]}
                >
                  ${item.price.toFixed(2)}
                </Text>
                <Text style={styles.cardVariable}>
                  Due: {validateDate(Number(item.payment_date))}
                </Text>
                <Text style={styles.cardVariable}>
                  Variation: ${item.variable}
                </Text>
              </View>

              <SymbolView
                style={{ marginLeft: 5 }}
                name={{ ios: "chevron.forward" }}
                tintColor="gray"
                size={15}
              />
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push(`/bills/addBill`)}
      >
        <SymbolView name={{ ios: "plus" }} tintColor="white" size={20} />
      </TouchableOpacity>
    </View>
  );
}

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
  billsBalance: {
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

  textBills: {
    fontWeight: "bold",
    fontSize: 38,
    textAlign: "center",
  },
  textVaries: {
    //fontWeight: "bold",
    fontSize: 12,
    color: "gray",
    textAlign: "center",
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
    shadowOpacity: 0.2,
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
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "700",
    //marginBottom: 1,
  },

  cardPrice: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  cardVariable: {
    fontSize: 12,
    color: "#6b7280",
  },
});
