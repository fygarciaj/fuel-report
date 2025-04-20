import React from "react";
import { Alert, StyleSheet, Pressable } from "react-native";
import { DataTable } from "react-native-paper";
import { DeleteIcon } from "./ui/Icons";
import { useTranslation } from "react-i18next";

interface FuelSales {
  id: string;
  type: string;
  pricePerGal: number;
  quantityGal: number;
  total: number;
}

interface SalesListProps {
  fuelSales: FuelSales[];
  onDelete: (id: string) => void;
}

const handleDelete = (id: string, onDelete: (id: string) => void, t: any) => {
  Alert.alert(t("deleteConfirmationTitle"), t("deleteConfirmation"), [
    {
      text: t("cancel"),
      style: "cancel",
    },
    {
      text: t("delete"),
      style: "destructive",
      onPress: () => onDelete(id),
    },
  ]);
};

const SalesList: React.FC<SalesListProps> = ({ fuelSales, onDelete }) => {
  const { t } = useTranslation();
  console.log("Fuel Sales List:", fuelSales);
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>{t("type")}</DataTable.Title>
        <DataTable.Title numeric>{t("Price/Gal")}</DataTable.Title>
        <DataTable.Title numeric>{t("Quantity/Gal")}</DataTable.Title>
        <DataTable.Title numeric>{t("total")}</DataTable.Title>
        <DataTable.Title style={{ justifyContent: "center" }}>
          {t("actions")}
        </DataTable.Title>
      </DataTable.Header>

      {fuelSales.map((item) => (
        <DataTable.Row key={item.id}>
          <DataTable.Cell>{item.type}</DataTable.Cell>
          <DataTable.Cell numeric>{item.pricePerGal}</DataTable.Cell>
          <DataTable.Cell numeric>{item.quantityGal}</DataTable.Cell>
          <DataTable.Cell numeric>{item.total}</DataTable.Cell>
          <DataTable.Cell style={{ justifyContent: "center" }}>
            <Pressable
              onPress={() => handleDelete(item.id, onDelete, t)}
              style={{ padding: 8 }}
            >
              <DeleteIcon color="red" />
            </Pressable>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
};

const styles = StyleSheet.create({
  // Add any custom styles if needed
});

export default SalesList;
