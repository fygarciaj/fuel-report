import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import NumericInput from "./ui/NumericInput";
import SalesList from "./SalesList";
import { useTranslation } from "react-i18next";
import { AddIcon } from "./ui/Icons";

interface FuelSalesInputProps {
  onSalesChange: (value: number) => void;
}

interface FuelTypeSales {
  regular: number;
  diesel: number;
  adBlue: number;
}
interface FuelSales {
  id: number;
  type: string;
  pricePerGal: number;
  quantityGal: number;
  total: number;
}

const dummyData: FuelSales[] = [
  { id: 1, type: "regular", pricePerGal: 3.5, quantityGal: 10, total: 35 },
  { id: 2, type: "diesel", pricePerGal: 4.0, quantityGal: 8, total: 32 },
  { id: 3, type: "adBlue", pricePerGal: 2.5, quantityGal: 12, total: 30 },
];

export const FuelForm: React.FC<FuelSalesInputProps> = ({ onSalesChange }) => {
  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState("0");
  const [fuelType, setFuelType] = useState("regular");
  const [selectedFuelType, setSelectedFuelType] = useState("regular");
  const [fuelSales, setFuelSales] = useState<FuelSales[]>(dummyData);
  const [total, setTotal] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const volumeInputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const newTotal = fuelSales.reduce((acc, sale) => acc + sale.total, 0);
    setTotalSales(newTotal);
    onSalesChange(newTotal);
  }, [fuelSales, onSalesChange]);

  const calculateTotal = () => {
    const parsedVolume = parseFloat(volume);
    const parsedPrice = parseFloat(price);

    if (!isNaN(parsedVolume) && !isNaN(parsedPrice)) {
      const newTotal = parsedVolume * parsedPrice;
      setTotal(newTotal);
    } else {
      setTotal(0);
    }
  };

  const handleAddSales = () => {
    const parsedVolume = parseFloat(volume);
    const parsedPrice = parseFloat(price);

    if (!isNaN(parsedVolume) && !isNaN(parsedPrice)) {
      const newTotal = parsedVolume * parsedPrice;
      const newId =
        fuelSales.length > 0
          ? Math.max(...fuelSales.map((sale) => sale.id)) + 1
          : 1;
      const newSale = {
        id: newId,
        type: fuelType,
        pricePerGal: parsedPrice,
        quantityGal: parsedVolume,
        total: newTotal,
      };
      setFuelSales([...fuelSales, newSale]);
      setVolume("");
      setPrice("");
      setTotal(0);
      setSelectedFuelType("regular");
    } else {
      alert("Please enter valid values for volume and price.");
    }
  };

  const handleFuelTypeSelection = (type: string) => {
    setSelectedFuelType(type);
    setFuelType(type);
    volumeInputRef.current?.focus();
  };

  const handleDelete = (id: number) => {
    setFuelSales((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{t("fuelSales")}</ThemedText>
      <ThemedView style={styles.inputGroup}>
        <Text style={styles.label}>{t("fuelType")}</Text>
        <View style={styles.row}>
          <Button
            title="Regular Gasoline"
            onPress={() => handleFuelTypeSelection("regular")}
            color={selectedFuelType === "regular" ? "blue" : "gray"}
          />
          <Button
            title="Diesel"
            onPress={() => handleFuelTypeSelection("diesel")}
            color={selectedFuelType === "diesel" ? "blue" : "gray"}
          />
          <Button
            title="AdBlue"
            onPress={() => handleFuelTypeSelection("adBlue")}
            color={selectedFuelType === "adBlue" ? "blue" : "gray"}
          />
        </View>
      </ThemedView>
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("Quantity/Gal")}</Text>
          <NumericInput
            ref={volumeInputRef}
            style={styles.input}
            decimal={true}
            placeholder={t("10.123")}
            value={volume}
            onChangeText={(text) => {
              setVolume(text);
              calculateTotal();
            }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("Price/Gal")}</Text>
          <NumericInput
            style={styles.input}
            decimal={true}
            placeholder={t("Price")}
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              calculateTotal();
            }}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("total")}</Text>
          <NumericInput
            style={styles.input}
            decimal={true}
            placeholder={t("total")}
            value={total.toString()}
            editable={false}
          />
        </View>
        <View>
          <Pressable onPress={handleAddSales} style={styles.addButton}>
            <AddIcon />
          </Pressable>
        </View>
      </View>
      <View>
        <SalesList fuelSales={fuelSales} onDelete={handleDelete} />
      </View>
      <View style={{ alignContent: "center", flexDirection: "row", flex: 1 }}>
        <Text style={{ alignContent: "center" }}>{t("totalSales")}</Text>
        <NumericInput
          style={{
            ...styles.input,
            marginLeft: 16,
            marginRight: 16,
            marginTop: 16,
          }}
          decimal={true}
          placeholder={t("totalSales")}
          value={totalSales.toString()}
          editable={false}
        />
      </View>
      <View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={() => setFuelSales([])}>
            <Text style={styles.buttonText}>{t("clear")}</Text>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {},
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007BFF",
  },
  buttonContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
