import React from "react";
import { StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = ({ open, type, items, setOpen, setType, setItems }) => {
  return (
    <DropDownPicker
      style={[
        styles.input,
        {
          borderColor: "#fff",
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          borderTopLeftRadius: open ? 30 : 50,
          borderTopRightRadius: open ? 30 : 50,
          backgroundColor: "#fff",
        },
      ]}
      open={open}
      value={type}
      items={items}
      setOpen={setOpen}
      setValue={setType}
      setItems={setItems}
      placeholder={"Type"}
      listMode="SCROLLVIEW"
      dropDownContainerStyle={[
        styles.dropdown,
        {
          backgroundColor: "#fff",
          borderColor: "#fff",
        },
      ]}
      listItemContainerStyle={{
        borderBottomWidth: 1,
        borderBottomColor: "#eee",

        //paddingVertical: 13,
      }}
      placeholderStyle={{
        color: "gray",
      }}
    />
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
    //color: "gray",

    //marginBottom: 30,

    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  dropdown: {
    paddingHorizontal: 5,
    //paddingVertical: 15,
    borderRadius: 30,

    borderTopColor: "lightgray",

    //color: "gray",

    //marginBottom: 30,

    width: "70%",
    //justifyContent: "center",
    //alignItems: "center",
    alignSelf: "center",
    borderColor: "#fff",
  },
});
