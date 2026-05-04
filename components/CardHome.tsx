import { SymbolView } from "expo-symbols";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatMoney } from "../constants/functions";

const CardHome = ({ data, label, color, route, pressable = true }) => {
  if (pressable)
    return (
      <TouchableOpacity
        onPress={route}
        style={[
          styles.cardSmall,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <View>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <SymbolView
              name={{
                ios: color === "red" ? "arrow.up.right" : "arrow.down.right",
              }}
              tintColor={color}
              size={14}
            />
            <Text style={{ color: color, marginLeft: 10 }}>{label}</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            {formatMoney(data)}
          </Text>
        </View>

        <SymbolView
          name={{ ios: "chevron.right" }}
          tintColor="gray"
          size={12}
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
    );
  else
    return (
      <View
        style={[
          styles.cardSmall,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <View>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <SymbolView
              name={{
                ios: color === "red" ? "arrow.up.right" : "arrow.down.right",
              }}
              tintColor={color}
              size={14}
            />
            <Text style={{ color: color, marginLeft: 10 }}>{label}</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "500" }}>
            {formatMoney(data)}
          </Text>
        </View>
      </View>
    );
};

export default CardHome;

const styles = StyleSheet.create({
  cardSmall: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
