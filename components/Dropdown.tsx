import { StyleSheet, useColorScheme } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const Dropdown = ({ open, type, items, setOpen, setType, setItems }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = false;
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
          backgroundColor: isDarkMode ? "2f2f2f" : "#fff",
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
          backgroundColor: isDarkMode ? "2f2f2f" : "#fff",
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
      textStyle={{
        color: isDarkMode ? "white" : "black",
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
