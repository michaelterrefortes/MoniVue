import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categoriesSpending } from "../constants/categories";
import { formatMoney } from "../constants/functions";

const Card = ({ item, params }) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.card} onPress={() => router.push(params)}>
      <View style={styles.cardLeft}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* ICON */}
          <View
            style={{
              width: 35,
              height: 35,
              backgroundColor: categoriesSpending[item.type_spending].color,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SymbolView
              name={{
                ios: categoriesSpending[item.type_spending].icon,
              }}
              tintColor="white"
              size={20}
            />
          </View>

          {/* TEXT */}
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.cardTitle}>{item.spending_name}</Text>
            <Text style={{ fontSize: 12, color: "grey" }}>
              {categoriesSpending[item.type_spending].name}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.cardPrice}>{formatMoney(item.amount)}</Text>
        <Text style={styles.cardDate}>
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
          }).format(new Date(item.date_spending))}{" "}
          {new Date(item.date_spending).getDate()}
        </Text>
      </View>

      <SymbolView
        style={{ marginLeft: 8, alignSelf: "center" }}
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

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 50,
    backgroundColor: "gray", // replace with your dynamic color
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    marginLeft: 10,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  cardCategory: {
    fontSize: 12,
    //color: "red",
  },

  cardRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginRight: 8,
  },

  cardPrice: {
    fontSize: 20,
    fontWeight: "500",
    //textAlign: "center",
  },

  cardDate: {
    fontSize: 12,
    color: "gray",
    //textAlign: "center",
  },

  chevron: {
    alignSelf: "center",
  },
});
