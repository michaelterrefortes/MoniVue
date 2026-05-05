import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { formatMoney, validateDate } from "../constants/functions";

const getUtilizationColor = (value) => {
  if (value <= 10) return "#22c55e"; // green
  if (value <= 30) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};

const gradients = [
  ["#2F80ED", "#5F6DFB"], // blue → indigo (like Chase)
  ["#FF8A00", "#FF3D2E"], // orange → red (like Amex)
  ["#00C6FF", "#0072FF"], // cyan → deep blue
  ["#7F00FF", "#E100FF"], // violet → magenta
  ["#00F260", "#0575E6"], // green → blue
  ["#F7971E", "#FFD200"], // orange → gold
  ["#FC466B", "#3F5EFB"], // pink → blue (Instagram-ish)
];

const CardDebts = ({ item, params, utilization, index }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(params)}>
      <LinearGradient
        colors={gradients[index % 7]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.shadow]}
      >
        <Text style={[styles.cardTitle, { color: "white" }]}>
          {item.credit_name}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: "lightgray" }}>Balance</Text>
            <Text style={[styles.cardBalance, { color: "white" }]}>
              {formatMoney(item.balance)}
            </Text>
          </View>

          <View>
            <Text style={{ textAlign: "right", color: "lightgray" }}>
              Limit
            </Text>
            <Text style={[styles.cardBalance, { color: "white" }]}>
              {formatMoney(item.credit_limit)}
            </Text>
          </View>
        </View>

        <Text style={[styles.cardSub, { color: "lightgray" }]}>
          Minimum: {formatMoney(item.minimum)}
        </Text>

        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={[styles.dateText, { color: "lightgray" }]}>
              Due {validateDate(item.statement_date)}
            </Text>
            <Text style={[styles.percentText, { color: "white" }]}>
              {utilization.toFixed(2)}% used
            </Text>
          </View>

          <View style={[styles.progressBarBackground]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: utilization > 100 ? 100 : `${utilization}%`,
                  //backgroundColor: getUtilizationColor(utilization),
                  backgroundColor: "#ffffff",
                },
              ]}
            />
          </View>
        </View>
      </LinearGradient>
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
