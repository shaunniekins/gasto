import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

const ExpensePicker = ({
  pickerModalVisible,
  setPickerModalVisible,
  setSelectedExpense,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={pickerModalVisible}
      onRequestClose={() => {
        setPickerModalVisible(!pickerModalVisible);
      }}>
      <TouchableWithoutFeedback onPress={() => setPickerModalVisible(false)}>
        <View style={styles.pickerCenteredView}>
          <TouchableWithoutFeedback>
            <View style={styles.pickerModalView}>
              {["Food", "Shopping", "Travel", "Transportation"].map((item) => (
                <Pressable
                  key={item}
                  style={styles.button}
                  onPress={() => {
                    setSelectedExpense(item);
                    setPickerModalVisible(false);
                  }}>
                  <Text style={styles.textStyle}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ExpensePicker;

const styles = StyleSheet.create({
  // select option modal
  pickerCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "transparent",
  },
  pickerModalView: {
    // height: 50,
    width: "90%",
    // overflow: "scroll",
    // flexDirection: "row", // Add this line
    // flexWrap: "wrap",
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 10,
  },
  button: {
    width: "100%",
    // marginHorizontal: 10,
    backgroundColor: "#54CEB7",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    // marginBottom: 10,
    // marginLeft: 1,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
