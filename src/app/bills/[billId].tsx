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
  const { bills, setBills } = useContext(DebtContext);
  //console.log(params);

  const [name, setName] = useState(params.name);
  const [price, setPrice] = useState(Number(params.price));
  const [type, setType] = useState(params.type);
  const [variable, setVariable] = useState(Number(params.variable));
  const [date, setDate] = useState(params.date);

  //console.log(dateNew);

  const [categoryName, setCategoryName] = useState(categories[type].name);
  const [iconImage, setIconImage] = useState(categories[type].icon);
  const [itemColor, setItemColor] = useState(categories[type].color);

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
          <SymbolView name={{ ios: "xmark" }} tintColor={"#000"} size={20} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: `/bills/editBill`,
                params: {
                  id: params.id,
                  name: params.name,
                  price: params.price,
                  type: params.type,
                  variable: params.variable,
                  date: params.date,
                },
              })
            }
            style={{
              width: 35,
              height: 35,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <SymbolView name={{ ios: "pencil" }} tintColor={"#000"} size={20} />
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
            <SymbolView name={{ ios: "trash" }} tintColor={"#000"} size={20} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: layout.height > 500 ? "#f2f2f2" : "" },
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
      }}
    >
      <View style={{ height: 70 }} />

      <Text
        style={{
          fontWeight: "bold",
          fontSize: 28,
          paddingTop: 10,
          paddingLeft: 15,
          color: "#000",
        }}
      >
        {name}
      </Text>

      <View style={[styles.billsBalance, { backgroundColor: "#fff" }]}>
        <Text style={styles.label}>Due Date: {validateDate(Number(date))}</Text>
        <Text style={[styles.textBills, { color: "#000" }]}>
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
        <View style={[styles.squares, { backgroundColor: "#fff" }]}>
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
              name={{ ios: `${iconImage}` }}
              tintColor="white"
              size={20}
            />
          </View>
          <Text style={[styles.textVaries, { paddingTop: 5 }]}>
            {categoryName}
          </Text>
        </View>
        <View style={[styles.squares, { backgroundColor: "#fff" }]}>
          <Text style={styles.label}>Variation:</Text>
          <Text style={[styles.text, { color: "#000" }]}>
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
