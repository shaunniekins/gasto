import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import ExpensePicker from "./ExpensePicker";
import { formatNumber } from "../tools/tools";

const AddExpenseModal = ({
  addModalVisible,
  setAddModalVisible,
  setAmount,
  amount,
  pickerModalVisible,
  setPickerModalVisible,
  setSelectedExpense,
  selectedExpense,
  show,
  setShow,
  date,
  onChangeModalDate,
  handleAddTransaction,
}) => {
  const handleAmountChange = (text) => {
    const formattedText = text.replace(/,/g, "");
    if (!isNaN(formattedText)) {
      setAmount(formattedText);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => setAddModalVisible(false)}>
      {/* <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}> */}
      <View style={styles.addModalCenteredView}>
        {/* <TouchableWithoutFeedback> */}
        <View style={styles.addModalView}>
          <TouchableOpacity
            // style={[styles.saveButton, !amount && styles.saveButtonEmpty]}
            style={styles.goBackButton}
            onPress={() => {
              handleAddTransaction();
            }}>
            <View style={styles.goBackButtonLabel}>
              <Ionicons name="chevron-back-outline" size={25} />
              <Text style={styles.goBackButtonText}>Add Amount</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!amount || amount === "0" || amount === 0) &&
                styles.saveButtonEmpty,
            ]}
            disabled={!amount || amount === "0" || amount === 0}
            onPress={() => {
              handleAddTransaction();
            }}>
            <Ionicons name="save" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.addModalCategoryContainer}>
            <Text style={styles.modalLabel}>Amount</Text>
            <View style={styles.modalAmountInputContainer}>
              <Text style={styles.currencySymbol}>₱</Text>
              <TextInput
                style={styles.modalAmountInput}
                onChangeText={handleAmountChange}
                value={formatNumber(amount)}
                placeholder="0"
                maxLength={9}
                keyboardType="numeric"
              />
            </View>
          </View>

          <ExpensePicker
            pickerModalVisible={pickerModalVisible}
            setPickerModalVisible={setPickerModalVisible}
            setSelectedExpense={setSelectedExpense}
          />

          <View style={styles.addModalCategoryContainerExtra}>
            <View style={styles.addModalCategoryContainerExtraInside}>
              <Text style={styles.modalLabel}>Expenses made for</Text>
              {/* <Pressable> */}
              <Text style={styles.modalInput}>{selectedExpense}</Text>
              {/* </Pressable> */}
            </View>
            <Pressable
              onPress={() => setPickerModalVisible(true)}
              style={styles.arrowSelect}>
              <Ionicons name="chevron-down-outline" size={20} color="black" />
            </Pressable>
          </View>
          {/* <View style={styles.addModalCategoryContainer}>
            <Text style={styles.modalLabel}>Date</Text>
            <Pressable onPress={() => setShow(true)}>
              <Text style={styles.modalInput}>{date.toDateString()}</Text>
            </Pressable>
          </View> */}
          <View style={styles.addModalCategoryContainerExtra}>
            <View style={styles.addModalCategoryContainerExtraInside}>
              <Text style={styles.modalLabel}>Date</Text>
              {/* <Pressable> */}
              <Text style={styles.modalInput}>{date.toDateString()}</Text>
              {/* </Pressable> */}
            </View>
            <Pressable onPress={() => setShow(true)} style={styles.arrowSelect}>
              <Ionicons name="chevron-down-outline" size={20} color="black" />
            </Pressable>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              onChange={onChangeModalDate}
            />
          )}
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Modal>
  );
};

export default AddExpenseModal;

const styles = StyleSheet.create({
  addModalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  addModalView: {
    width: "100%",
    flex: 1,

    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 35,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 30,
  },
  addModalCategoryContainer: {
    width: "100%",
    gap: 10,
    // backgroundColor: "red",
  },
  addModalCategoryContainerExtra: {
    width: "100%",

    flexDirection: "row",
    // backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addModalCategoryContainerExtraInside: {
    // width: "100%",
    gap: 10,
    // backgroundColor: "red",
  },
  modalLabel: {
    width: "100%",
    color: "grey",
  },
  modalAmountInputContainer: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
  currencySymbol: {
    color: "black",
    fontWeight: "600",
    fontSize: 30,
  },
  modalAmountInput: {
    width: "80%",
    textAlign: "right",
    fontSize: 50,
    fontWeight: "bold",
  },
  modalInput: {
    fontWeight: "600",
  },
  arrowSelect: {
    // backgroundColor: "#c3e4e6",
    padding: 8,
    borderRadius: 10,
  },
  goBackButton: {
    width: "100%",
  },
  goBackButtonLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  goBackButtonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  saveButton: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#54CEB7",
    borderRadius: 15,
    elevation: 8,
  },
  saveButtonEmpty: {
    backgroundColor: "gray",
  },
});
