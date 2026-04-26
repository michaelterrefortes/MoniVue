import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { categories } from "../../../constants/categories";
import { validateDate } from "../../../constants/functions";
import { url } from "../../../constants/url";
import { DebtContext } from "../../../context/DebtContext";

const BillDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { bills, setBills, isDarkMode } = useContext(DebtContext);
  //console.log(params);

  const [name, setName] = useState(params.name);
  const [price, setPrice] = useState(Number(params.price));
  const [type, setType] = useState(params.type);
  const [variable, setVariable] = useState(Number(params.variable));
  const [date, setDate] = useState(params.date);

  const [categoryName, setCategoryName] = useState(categories[type].name);
  const [iconImage, setIconImage] = useState(categories[type].icon);
  const [itemColor, setItemColor] = useState(categories[type].color);

  const [editing, setEditing] = useState(false);

  const navigation = useNavigation();

  const confirmDelete = () => {
    Alert.alert("Delete Bill", "Are you sure you want to delete this bill?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: handleDelete,
      },
    ]);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${url}/bills/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setBills((prevItems) =>
        prevItems.filter((item) => Number(item.id) !== Number(params.id)),
      );
      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not delete item");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!editing) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              //backgroundColor: "grey",
              width: 35,
              height: 35,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SymbolView
              name={{ ios: "xmark" }}
              tintColor={isDarkMode ? "#000" : "#fff"}
              size={20}
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={{
                width: 35,
                height: 35,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <SymbolView
                name={{ ios: "pencil" }}
                tintColor={isDarkMode ? "#000" : "#fff"}
                size={20}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={confirmDelete}
              style={{
                width: 35,
                height: 35,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SymbolView
                name={{ ios: "trash" }}
                tintColor={isDarkMode ? "#000" : "#fff"}
                size={20}
              />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => setEditing(false)}>
            <Text style={{ color: isDarkMode ? "#000" : "#fff" }}>Cancel</Text>
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity onPress={() => setEditing(false)}>
            <SymbolView
              name={{ ios: "checkmark" }}
              tintColor={isDarkMode ? "#000" : "#fff"}
              size={20}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, editing]);

  return (
    <ScrollView style={[styles.container]}>
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
        {name}
      </Text>

      <View
        style={[
          styles.billsBalance,
          { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
        ]}
      >
        <Text style={styles.label}>Due Date: {validateDate(Number(date))}</Text>
        <Text
          style={[styles.textBills, { color: isDarkMode ? "#000" : "#fff" }]}
        >
          ${price.toFixed(2)}
        </Text>
        {variable !== 0 ? (
          <>
            <Text style={styles.textVaries}>Variation:</Text>
            <Text style={styles.textVaries}>
              ${(price - variable).toFixed(2)} - $
              {(price + variable).toFixed(2)}
            </Text>
          </>
        ) : null}
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.squares,
            { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
          ]}
        >
          <Text style={styles.label}>Type:</Text>

          <View
            style={{
              width: 35,
              height: 35,
              backgroundColor: itemColor,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <SymbolView
              name={{ ios: `${iconImage}.fill` }}
              tintColor="white"
              size={20}
            />
          </View>
          <Text style={[styles.textVaries, { paddingTop: 5 }]}>
            {categoryName}
          </Text>
        </View>
        <View
          style={[
            styles.squares,
            { backgroundColor: isDarkMode ? "#fff" : "#1c1c1c" },
          ]}
        >
          <Text style={styles.label}>Variation:</Text>
          <Text style={[styles.text, { color: isDarkMode ? "#000" : "#fff" }]}>
            ${Number(variable).toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default BillDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f2f2f2",
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
  content: {
    //justifyContent: "space-between",
    flexDirection: "row",
    justifyContent: "center",
  },
  squares: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    //paddingVertical: 30,
    paddingBottom: 30,
    height: 120,
    paddingTop: 15,
    borderRadius: 30,
    //marginBottom: 30,
    marginHorizontal: 5,

    marginTop: 10,

    width: "40%",
    justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    color: "gray",
  },
});
