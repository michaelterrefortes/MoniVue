import { Link, useRouter } from "expo-router";
import React from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

const debts = [
  { id: 1, name: "AMEX", apr: 28.99, limit: 5000, balance: 143.87 },
  { id: 2, name: "CapOne", apr: 31.99, limit: 2000, balance: 586.43 },
];

export default function Cards() {
  const router = useRouter();
  const renderItem = ({ item }) => {
    const usage = (item.balance / item.limit) * 100;

    const getUsageColor = () => {
      if (usage < 30) return "#00C851"; // green
      if (usage < 70) return "#ffbb33"; // yellow
      return "#ff4444"; // red
    };

    return (
      <View style={styles.card}>
        {/* Top Row */}
        <View style={styles.row}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.balance}>${item.balance.toFixed(2)}</Text>
        </View>

        {/* Usage Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Usage</Text>
          <Text style={[styles.usageText, { color: getUsageColor() }]}>
            {usage.toFixed(1)}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${usage}%`,
                backgroundColor: getUsageColor(),
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 100,
          alignItems: "center",
        }}
      >
        <FlatList
          data={debts}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Floating Action Button */}
      <Link style={styles.fab} href={`/debts/[debtId]`} asChild>
        <Text style={styles.buttonText}>+</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f5f5f5",
  },

  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
  },

  balance: {
    fontSize: 18,
    fontWeight: "bold",
  },

  label: {
    fontSize: 14,
    color: "#666",
  },

  usageText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  fab: {
    position: "absolute",
    bottom: 20, // adjust if your tab bar is different
    right: 20,
    backgroundColor: "#0080FF",
    width: 60,
    height: 60,
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
