import { Stack, useRouter } from "expo-router";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ArrowIcon } from "./ui/Icons";
import { useAppStore, AppState } from "../services/zustandStore";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

type SalesSummaryEntry = [
  keyof Omit<AppState["salesSummary"], "total"> | "total",
  number,
];

export const Home = () => {
  const [dateSpreadsheet, setDateSpreadsheet] = useState(new Date());
  const [modeDateSpreadsheet, setModeDateSpreadsheet] = useState<
    "date" | "time"
  >("date");
  const [showDateSpreadsheet, setShowDateSpreadsheet] = useState(false);
  const [user, setUser] = useState("Isleman");
  const { t } = useTranslation();
  const router = useRouter();

  const salesSummary = useAppStore((state: AppState) => state.salesSummary);

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || dateSpreadsheet;
    setShowDateSpreadsheet(false);
    setDateSpreadsheet(currentDate);
  };

  const showMode = (currentMode: "date" | "time") => {
    setShowDateSpreadsheet(true);
    setModeDateSpreadsheet(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const renderSummaryItem = ({ item }: { item: SalesSummaryEntry }) => {
    const [key, value] = item;

    const navigableKeys: Array<keyof AppState["salesSummary"]> = [
      "fuelSales",
      "lubricantSales",
      "credits",
      "cards",
      "bonds",
      "expenses",
      "deposits",
      "cash",
    ];

    const isNavigable = navigableKeys.includes(key as any);

    const keyRoute = key.toLowerCase();

    return (
      <Pressable
        style={styles.itemContainer}
        onPress={() => (isNavigable ? router.push(`/details/${key}`) : {})}
        disabled={!isNavigable}
      >
        <Text style={styles.itemKey}>{t(key)}:</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.itemValue}>
            {value.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </Text>
          {isNavigable && (
            <React.Fragment>
              <ArrowIcon width={20} height={20} color="#555" />
            </React.Fragment>
          )}
        </View>
      </Pressable>
    );
  };

  const summaryData = Object.entries(salesSummary) as SalesSummaryEntry[];

  return (
    <View style={styles.headerSection}>
      <Text style={styles.title}>{t("planilla de ventas")}</Text>

      <View style={styles.infoContainer}>
        <Pressable onPress={showDatepicker} style={styles.dateContainer}>
          <Text>{t("dateOfSpreadsheet")}:</Text>
          <Text style={styles.dateText}>
            {dateSpreadsheet.toLocaleDateString("es-CO")}
          </Text>
        </Pressable>

        <View style={styles.userContainer}>
          <Text>{t("user")}:</Text>
          <Text style={styles.userText}>{user}</Text>
        </View>
      </View>
    </View>

    {showDateSpreadsheet && (
      <DateTimePicker
        testID="dateTimePicker"
        value={dateSpreadsheet}
        mode={modeDateSpreadsheet}
        is24Hour={true}
        display="default"
        onChange={onChangeDate}
      />
    )}

    <ScrollView style={{ flex: 1 }}>
      <FlatList
        data={summaryData}
        keyExtractor={(item) => item[0]}
        renderItem={renderSummaryItem}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
    </ScrollView>
    <View style={styles.totalContainer}>
      <Text style={styles.totalKey}>{t("total").toUpperCase()}:</Text>
      <Text style={styles.totalValue}>
        {salesSummary.total.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  headerSection: {
    padding: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef",
    padding: 5,
    borderRadius: 5,
  },
  dateText: {
    fontWeight: "bold",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userText: {
    fontWeight: "bold",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    borderRadius: 5,
    marginBottom: 8,
  },
  itemKey: {
    fontSize: 15,
    fontWeight: "500",
    textTransform: "capitalize",
    flexShrink: 1,
    marginRight: 10,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    marginRight: 5,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 5,
  },
  totalKey: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
});
