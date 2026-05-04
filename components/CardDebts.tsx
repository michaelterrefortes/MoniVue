import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatMoney, validateDate } from "../constants/functions";

const getUtilizationColor = (value) => {
  if (value <= 10) return "#22c55e"; // green
  if (value <= 30) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};

const CardDebts = ({ item, params, utilization }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, styles.shadow]}
      onPress={() => router.push(params)}
    >
      <Text style={styles.cardTitle}>{item.credit_name}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text>Balance</Text>
          <Text style={styles.cardBalance}>{formatMoney(item.balance)}</Text>
        </View>

        <View>
          <Text style={{ textAlign: "right" }}>Limit</Text>
          <Text style={styles.cardBalance}>
            {formatMoney(item.credit_limit)}
          </Text>
        </View>
      </View>

      <Text style={styles.cardSub}>Minimum: {formatMoney(item.minimum)}</Text>

      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>
            Due {validateDate(item.statement_date)}
          </Text>
          <Text style={styles.percentText}>{utilization.toFixed(2)}% used</Text>
        </View>

        <View style={[styles.progressBarBackground]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${utilization}%`,
                backgroundColor: getUtilizationColor(utilization),
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardDebts;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 20,
    marginTop: 12,
    width: "92%",
    alignSelf: "center",
    //flexDirection: "row",
    //justifyContent: "space-between",
    //alignItems: "center",
  },

  shadow: {
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
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 15,
    color: "#000",
  },

  cardBalance: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 5,
    marginBottom: 4,
    color: "#000",
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
    fontWeight: "500",
    color: "#000",
  },

  container: {
    //backgroundColor: "#e3e3e3",
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
    backgroundColor: "rgba(146, 146, 146, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    //backgroundColor: "#d3ff00",
    borderRadius: 3,
  },
});
