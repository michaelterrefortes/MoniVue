import { SymbolView } from "expo-symbols";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { formatMoney } from "../constants/functions";

const CardHome = ({ data, label, color, route, pressable = true }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  if (pressable)
    return (
      <TouchableOpacity
        onPress={route}
        style={[
          styles.cardSmall,
          { flexDirection: "row", justifyContent: "space-between" },
          isDarkMode ? styles.darkField : styles.lightField,
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
          <Text
            style={[
              { fontSize: 20, fontWeight: "500" },
              isDarkMode ? styles.lightText : styles.darkText,
            ]}
          >
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
          isDarkMode ? styles.darkField : styles.lightField,
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
          <Text
            style={[
              { fontSize: 20, fontWeight: "500" },
              isDarkMode ? styles.lightText : styles.darkText,
            ]}
          >
            {formatMoney(data)}
          </Text>
        </View>
      </View>
    );
};

export default CardHome;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#000" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

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
