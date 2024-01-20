import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { Picker } from "@react-native-picker/picker";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import GlobalStyles from "./GlobalStyles";
import ExpensePicker from "./components/ExpensePicker";
import AddExpenseModal from "./components/AddExpenseModal";
import { formatNumber } from "./tools/tools";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

export default function App() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState("Food");
  const [date, setDate] = useState(new Date(Date.now()));
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  // const [currency, setCurrency] = useState("PHP");

  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  const [transactions, setTransactions] = useState([]);

  const onChangeModalDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const handleAddTransaction = () => {
    const newTransaction = {
      id: Math.random().toString(),
      expense: selectedExpense,
      date: date.toLocaleDateString(),
      amount,
    };

    setTransactions([newTransaction, ...transactions]);
    setAmount("");
    setSelectedExpense("Food");
    setDate(new Date(Date.now()));
    setAddModalVisible(false);
  };

  const amountText = formatNumber(totalExpense); // Your amount
  const amountStr = amountText.toString();

  // Calculate font size based on the length of the amount
  const fontSize = amountStr.length > 7 ? 45 : 50; // Adjust these values as needed

  const deleteTransaction = (id) => {
    const newTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(newTransactions);
  };

  const [sortedGroupedTransactionsArray, setSortedGroupedTransactionsArray] =
    useState([]);

  useEffect(() => {
    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
      const date = transaction.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});

    // Compute total expense
    const total = transactions.reduce(
      (total, transaction) => total + Number(transaction.amount),
      0
    );
    setTotalExpense(total);

    // Convert the grouped transactions object to an array
    const groupedTransactionsArray = Object.keys(groupedTransactions).map(
      (date) => ({
        date,
        transactions: groupedTransactions[date],
      })
    );

    // Custom date parsing function
    const parseDate = (dateString) => {
      const [month, day, year] = dateString.split("/");
      return new Date(year, month - 1, day);
    };

    // Sort the grouped transactions array by date in descending order
    const sortedGroupedTransactionsArray = groupedTransactionsArray.sort(
      (a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA; // For descending order
      }
    );

    setSortedGroupedTransactionsArray(sortedGroupedTransactionsArray);
  }, [transactions]);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <View style={styles.header}>
        <View style={styles.pageName}>
          <Image
            source={require("./assets/gasto-logo.jpeg")}
            style={styles.logoImage}
          />
          <Text style={styles.appName}>Gasto</Text>
        </View>
        {/* <Ionicons name="download-outline" size={25} /> */}
        {/* <Ionicons name="share-social-outline" size={25} /> */}
      </View>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewCardTitleText}>Total Expenses</Text>
        <View style={styles.overViewContentText}>
          <Text style={[styles.overviewCardMainText, { fontSize }]}>
            - ₱ {amountStr}
          </Text>
          <Text style={styles.overviewCardSubText}>PHP</Text>
        </View>
      </View>
      <View style={styles.transactionSection}>
        <View style={styles.transactionTitle}>
          <Text style={styles.transactionTitleMainText}>All Expenses</Text>

          {/* <TouchableHighlight>
            <Text>See All</Text>
          </TouchableHighlight> */}
        </View>
        {transactions && transactions.length !== 0 ? (
          <GestureHandlerRootView style={{ flex: 1 }}>
            {/* <View style={styles.transactionData}> */}
            <ScrollView style={[styles.transactionData, { width: "100%" }]}>
              {sortedGroupedTransactionsArray.map((group, index) => {
                let displayDate;

                const today = new Date();
                today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison

                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1); // Get yesterday's date

                const [month, day, year] = group.date.split("/");
                const groupDate = new Date(year, month - 1, day);

                // console.log("today", today);
                // console.log("groupDate", groupDate);

                if (+groupDate === +today) {
                  displayDate = "Today";
                } else if (+groupDate === +yesterday) {
                  displayDate = "Yesterday";
                } else {
                  displayDate = group.date;
                }

                return (
                  <View key={index} style={styles.transactionDataByGroup}>
                    <View style={styles.dataVal}>
                      <Text style={styles.dataText}>{displayDate}</Text>

                      {/* Total amount for each group */}
                      <Text style={styles.dataText}>
                        - ₱
                        {formatNumber(
                          group.transactions.reduce((total, transaction) => {
                            let totalExpense =
                              total + Number(transaction.amount);
                            return totalExpense;
                          }, 0)
                        )}
                      </Text>
                    </View>
                    {group.transactions.map((transaction, index) => (
                      <Swipeable
                        key={transaction.id} // Assuming each transaction has a unique id
                        renderRightActions={() => (
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteTransaction(transaction.id)}>
                            <Ionicons
                              name="trash-outline"
                              size={20}
                              color="white"
                            />
                            {/* <Text style={styles.deleteButtonText}>Delete</Text> */}
                          </TouchableOpacity>
                        )}>
                        <View style={styles.rowData}>
                          <Text style={styles.rowDataText}>
                            {transaction.expense}
                          </Text>
                          <Text style={styles.rowDataText}>
                            - ₱{formatNumber(transaction.amount)}
                          </Text>
                        </View>
                      </Swipeable>
                    ))}
                  </View>
                );
              })}
              <View style={styles.viewSpace} />
            </ScrollView>
            {/* </View> */}
          </GestureHandlerRootView>
        ) : (
          <View style={styles.defaultDisplay}>
            <Image
              source={require("./assets/gasto-logo.jpeg")}
              style={styles.defaultDisplayImage}
            />
            <Text style={styles.defaultDisplayText}>No entries yet.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (addModalVisible) {
            handleAddTransaction();
          } else {
            setAddModalVisible(true);
          }
        }}>
        <Ionicons
          // name={addModalVisible ? "save" : "add"}
          name="add"
          size={30}
          color="white"
        />
      </TouchableOpacity>

      <AddExpenseModal
        addModalVisible={addModalVisible}
        setAddModalVisible={setAddModalVisible}
        setAmount={setAmount}
        amount={amount}
        pickerModalVisible={pickerModalVisible}
        setPickerModalVisible={setPickerModalVisible}
        setSelectedExpense={setSelectedExpense}
        selectedExpense={selectedExpense}
        show={show}
        setShow={setShow}
        date={date}
        onChangeModalDate={onChangeModalDate}
        handleAddTransaction={handleAddTransaction}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // backgroundColor: "#fff",
  //   // alignItems: "center",
  //   // // justifyContent: "center",
  //   // paddingHorizontal: 20,
  // },
  pageName: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    // backgroundColor: "red",
  },
  logoImage: {
    // marginTop: 30,
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 75,
    // marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginVertical: 20,
  },
  appName: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 25,
  },
  overviewCard: {
    backgroundColor: "#54CEB7",
    padding: 20,
    borderRadius: 15,
    width: "100%",
  },
  overviewCardTitleText: {
    color: "white",
    fontSize: 20,
  },
  overViewContentText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "yellow",
  },
  overviewCardMainText: {
    color: "white",
    // fontSize: 50,
    fontWeight: "bold",
    // lineHeight: 35,
  },
  overviewCardSubText: {
    color: "#c3e4e6",
    // backgroundColor: "red",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 20,

    // lineHeight: 35,
  },
  transactionSection: {
    flexDirection: "column",
    flex: 1,
  },
  transactionTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "lightgrey",
  },
  transactionTitleMainText: {
    fontSize: 20,
    fontWeight: "600",
  },
  transactionData: {
    // flexDirection: "column",
    // justifyContent: "space-between",
    // alignItems: "center",
    // paddingVertical: 20,
    // backgroundColor: "red",
    borderRadius: 10,
    gap: 10,
  },
  transactionDataByGroup: {
    gap: 10,
  },
  dataVal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "red",
    width: "100%",
  },
  dataText: {
    paddingTop: 10,
  },
  rowData: {
    width: "100%",
    backgroundColor: "#c3e4e6",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  rowDataText: {
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    marginLeft: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  viewSpace: {
    height: 100,
  },
  addButton: {
    position: "absolute",
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#54CEB7",
    borderRadius: 15,
    elevation: 8,
  },
  defaultDisplay: {
    // height: "100%",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    // paddingBottom: 50,
    // backgroundColor: "red",
    marginTop: 50,
  },
  defaultDisplayImage: {
    // marginBottom: 100,
    alignSelf: "center",
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  defaultDisplayText: {
    fontSize: 18,
  },
});
