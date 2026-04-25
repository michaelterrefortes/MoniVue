import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categoriesSpending } from "../constants/categories";

const Card = ({ item, params }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(params)}>
      <View style={styles.cardLeft}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 35,
              height: 35,
              paddingHorizontal: 10,
              backgroundColor: categoriesSpending[item.type_spending].color,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={{
                ios: categoriesSpending[item.type_spending].icon,
              }}
              tintColor="black"
              size={25}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.cardTitle}>{item.spending_name}</Text>
            <Text style={{ paddingTop: 5, fontSize: 12, color: "gray" }}>
              {categoriesSpending[item.type_spending].name}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.cardPrice}>${item.amount.toFixed(2)}</Text>
        <Text style={styles.cardDate}>
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
          }).format(new Date(item.date_spending))}{" "}
          {new Date(item.date_spending).getDate()}
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
};

export default Card;

const styles = StyleSheet.create({
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

  cardDate: {
    fontSize: 12,
    color: "#6b7280",
  },
});
