import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

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
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{item.credit_name}</Text>

        <Text style={styles.cardBalance}>{formatMoney(item.balance)}</Text>

        <Text style={styles.cardSub}>
          Limit: {formatMoney(item.credit_limit)}
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
            <Text style={styles.progressText}>{Math.round(fill)}%</Text>
          )}
        </AnimatedCircularProgress>

        <Text style={styles.cardSub}>
          Due: {validateDate(item.statement_date)}
        </Text>

        <Text style={styles.cardSub}>Minimum: {formatMoney(item.minimum)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardDebts;

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
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000",
  },

  cardBalance: {
    fontSize: 20,
    fontWeight: "bold",
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
    fontWeight: "600",
    color: "#000",
  },
});
