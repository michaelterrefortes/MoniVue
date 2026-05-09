import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { categories } from "../constants/categories";
import { formatMoney, validateDate } from "../constants/functions";

const CardBills = ({ item, params }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <TouchableOpacity
      style={[styles.card, isDarkMode ? styles.darkField : styles.lightField]}
      onPress={() => router.push(params)}
    >
      <View style={styles.cardLeft}>
        <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: categories[item.type_bill].color },
            ]}
          >
            <SymbolView
              name={{ ios: categories[item.type_bill].icon }}
              tintColor="white"
              size={25}
            />
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.cardTitle,
                isDarkMode ? styles.lightText : styles.darkText,
              ]}
            >
              {item.bill_name}
            </Text>
            <Text style={styles.cardCategory}>
              {categories[item.type_bill].name}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardRight}>
        <Text
          style={[
            styles.cardPrice,
            isDarkMode ? styles.lightText : styles.darkText,
          ]}
        >
          {formatMoney(item.price)}
        </Text>
        <Text style={styles.cardDate}>
          Due: {validateDate(Number(item.payment_date))}
        </Text>
        <Text style={styles.cardDate}>
          Variation: {formatMoney(item.variable)}
        </Text>
      </View>

      <SymbolView
        name={{ ios: "chevron.forward" }}
        tintColor="gray"
        size={15}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

export default CardBills;

const styles = StyleSheet.create({
  darkField: { backgroundColor: "#2f2f2f", color: "white" },
  lightField: { backgroundColor: "#fff", color: "black" },

  darkBg: { backgroundColor: "#000" },
  lightBg: { backgroundColor: "#f2f2f2" },
  lightText: { color: "white" },
  darkText: { color: "black" },

  card: {
    backgroundColor: "#fff",
    padding: 12,
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
    borderRadius: 10,
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
    color: "grey",
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
