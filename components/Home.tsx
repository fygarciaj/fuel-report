import { Stack } from "expo-router";
import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowIcon } from "./ui/Icons";

export const Home = () => {
  const [dateSpreadsheet, setDateSpreadsheet] = useState(new Date());
  const [modeDateSpreadsheet, setModeDateSpreadsheet] = useState<
    "date" | "time"
  >("date");
  const [showDateSpreadsheet, setShowDateSpreadsheet] = useState(false);
  const [user, setUser] = useState("Isleman");
  const [isleman, setIsleman] = useState("Isleman");
  const { t } = useTranslation();

  const onChange = (
    event: React.SyntheticEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShowDateSpreadsheet(false);
    setDateSpreadsheet(currentDate || new Date());
  };

  const showMode = (currentMode: "date" | "time") => {
    setShowDateSpreadsheet(true);
    setModeDateSpreadsheet(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  return (
    <>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{t("planilla de ventas")}</Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text>
          {t("dateOfSpreadsheet")} {dateSpreadsheet.toLocaleDateString()}
          {showDateSpreadsheet && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateSpreadsheet}
              mode={modeDateSpreadsheet}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Text>{t("user")}</Text>
        <Text>{user}</Text>
        <Button title={t("changeUser")} onPress={() => setUser(isleman)} />
      </View>
      <View style={styles.list}>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>
            {t("fuelSolds").toUpperCase()}
          </Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>
            {t("lubricantSolds").toUpperCase()}
          </Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>{t("credits").toUpperCase()}</Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>{t("cards").toUpperCase()}</Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>{t("bonos").toUpperCase()}</Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>{t("expenses").toUpperCase()}</Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>{t("deposits").toUpperCase()}</Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
        <View style={styles.itemList}>
          <Text style={styles.textItemName}>{t("cashs").toUpperCase()}</Text>
          <Text style={styles.textItemValue}>$1.500.000</Text>
          <Pressable onPress={() => {}}>
            <ArrowIcon />
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  itemList: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "center",
    flexDirection: "row",
    display: "flex",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  textItemName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
    alignItems: "flex-start",
  },
  textItemValue: {
    flex: 1,
    alignItems: "flex-end",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonItem: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});
