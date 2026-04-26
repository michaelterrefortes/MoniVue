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
import { categoriesSpending } from "../../../constants/categories";
import { dateString } from "../../../constants/functions";
import { url } from "../../../constants/url";
import { DebtContext } from "../../../context/DebtContext";

const SpendingDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { spending, setSpending, setLocalSpending } = useContext(DebtContext);

  const [name, setName] = useState(params.name);
  const [amount, setAmount] = useState(Number(params.amount));
  const [type, setType] = useState(params.category);

  const [date, setDate] = useState(params.date);

  const [categoryName, setCategoryName] = useState(
    categoriesSpending[type].name,
  );
  const [iconImage, setIconImage] = useState(categoriesSpending[type].icon);
  const [itemColor, setItemColor] = useState(categoriesSpending[type].color);

  const [editing, setEditing] = useState(false);

  const navigation = useNavigation();

  const confirmDelete = () => {
    Alert.alert(
      "Delete Spending",
      "Are you sure you want to delete this spending?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${url}/spending/${params.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      //router.setParams(result.data);
      const selectedMonth = Number(params?.selectedMonth);
      const selectedYear = Number(params?.selectedYear);

      // 📅 Real time date
      const realMonth = new Date().getMonth() + 1;
      const realYear = new Date().getFullYear();

      const isCurrentMonth =
        selectedMonth === realMonth && selectedYear === realYear;

      if (isCurrentMonth) {
        (setSpending((prevItems) =>
          prevItems.filter((item) => Number(item.id) !== Number(params.id)),
        ),
          setLocalSpending((prevItems) =>
            prevItems.filter((item) => Number(item.id) !== Number(params.id)),
          ));
      } else {
        setLocalSpending((prevItems) =>
          prevItems.filter((item) => Number(item.id) !== Number(params.id)),
        );
      }

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
            <SymbolView name={{ ios: "xmark" }} tintColor="black" size={20} />
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
                tintColor="black"
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
              <SymbolView name={{ ios: "trash" }} tintColor="black" size={20} />
            </TouchableOpacity>
          </View>
        ),
      });
    } else {
      navigation.setOptions({
        //presentation: "modal",

        headerLeft: () => (
          <TouchableOpacity onPress={() => setEditing(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity onPress={() => setEditing(false)}>
            <SymbolView
              name={{ ios: "checkmark" }}
              tintColor="black"
              size={20}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, editing]);

  //console.log(params);
  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 70 }} />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 28,
          paddingTop: 10,
          paddingLeft: 15,
        }}
      >
        {name}
      </Text>

      <View style={styles.spendingBalance}>
        <Text style={styles.textAmount}>${amount.toFixed(2)}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.squares}>
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
            <SymbolView name={{ ios: iconImage }} tintColor="white" size={20} />
          </View>
          <Text style={[styles.textCategory, { paddingTop: 5 }]}>
            {categoryName}
          </Text>
        </View>
        <View style={styles.squares}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.text}>{dateString(date)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SpendingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#f2f2f2",
  },

  spendingBalance: {
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
  textAmount: {
    fontWeight: "bold",
    fontSize: 38,
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

  textCategory: {
    //fontWeight: "bold",
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
});
