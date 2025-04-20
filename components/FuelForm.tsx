import React, { useState, useEffect, useRef, useMemo } from "react"; // Añadir useMemo
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
import SalesList from "./SalesList"; // Asumiendo que este componente muestra la lista
import { useTranslation } from "react-i18next";
import { AddIcon } from "./ui/Icons";
import { useAppStore, AppState } from "../services/zustandStore"; // Importar store y tipos

// Interfaz para las props (eliminamos onSalesChange si no se necesita fuera)
// interface FuelFormProps { } // Podría no necesitar props ahora

// Interfaz para una venta individual (ya la tenías y coincide)
interface FuelSale {
  id: string;
  type: string;
  pricePerGal: number;
  quantityGal: number;
  total: number;
}

// Ya no necesitamos FuelTypeSales

// Exportar el componente funcional
export const FuelForm: React.FC = () => {
  // --- Estado Local del Formulario (para la entrada actual) ---
  const [volume, setVolume] = useState("");
  const [price, setPrice] = useState(""); // Empezar vacío o con un default
  const [fuelType, setFuelType] = useState("regular"); // Solo un estado para el tipo
  const [currentTotal, setCurrentTotal] = useState(0); // Total de la entrada actual
  const volumeInputRef = useRef<TextInput>(null);
  const { t } = useTranslation();

  // --- Conexión con Zustand Store ---
  // Seleccionar los datos y acciones necesarios del store
  const fuelSalesFromStore = useAppStore((state: AppState) => state.fuelSales);
  const addFuelSale = useAppStore((state) => state.addFuelSale); // Asume que existe
  const removeFuelSale = useAppStore((state) => state.removeFuelSale); // Asume que existe y actualiza summary
  const setFuelSales = useAppStore((state) => state.setFuelSales); // Para limpiar (asume que actualiza summary)
  // Opcional: Seleccionar el total directamente si el store lo calcula y expone bien
  // const totalSalesFromSummary = useAppStore((state: AppState) => state.salesSummary.fuelSales);

  // --- Cálculos Derivados ---
  // Calcular el total de ventas a partir de los datos del store
  const totalSales = useMemo(() => {
    return fuelSalesFromStore.reduce((acc, sale) => acc + sale.total, 0);
    // Si confías en que salesSummary.fuelSales está siempre actualizado por las acciones,
    // podrías usar totalSalesFromSummary directamente en lugar de useMemo.
  }, [fuelSalesFromStore]);

  // Calcular el total para la entrada actual cada vez que cambian volumen o precio
  useEffect(() => {
    const parsedVolume = parseFloat(volume);
    const parsedPrice = parseFloat(price);

    if (
      !isNaN(parsedVolume) &&
      !isNaN(parsedPrice) &&
      parsedVolume > 0 &&
      parsedPrice > 0
    ) {
      setCurrentTotal(parsedVolume * parsedPrice);
    } else {
      setCurrentTotal(0);
    }
  }, [volume, price]);

  // --- Manejadores de Eventos (Modificados para usar acciones de Zustand) ---

  const handleAddSale = () => {
    const parsedVolume = parseFloat(volume);
    const parsedPrice = parseFloat(price);

    // Validar antes de añadir
    if (
      !isNaN(parsedVolume) &&
      !isNaN(parsedPrice) &&
      parsedVolume > 0 &&
      parsedPrice > 0
    ) {
      // Llamar a la acción de Zustand para añadir la venta
      // La acción en el store se encargará de generar ID, calcular total y actualizar el array Y el summary
      addFuelSale({
        type: fuelType,
        pricePerGal: parsedPrice,
        quantityGal: parsedVolume,
      });

      // Limpiar los campos del formulario local
      setVolume("");
      setPrice("");
      setCurrentTotal(0);
      // Opcional: resetear fuelType a 'regular' o mantener el último usado
      // setFuelType("regular");
      volumeInputRef.current?.focus(); // Mover foco de nuevo
    } else {
      alert(t("alertInvalidInput")); // Usar traducción para el mensaje
    }
  };

  const handleFuelTypeSelection = (type: string) => {
    setFuelType(type); // Solo actualiza el tipo seleccionado
    volumeInputRef.current?.focus(); // Mover foco al input de volumen
  };

  // handleDelete llama a la acción removeFuelSale del store
  const handleDeleteSale = (id: string) => {
    removeFuelSale(id); // La acción en el store debe manejar la lógica de filtrado y actualización del summary
  };

  // handleClear llama a setFuelSales con un array vacío
  const handleClearSales = () => {
    setFuelSales([]); // La acción en el store debe actualizar el array y poner el summary a 0
  };

  // --- Renderizado ---
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>{t("fuelSales")}</ThemedText>

      {/* Selección de Tipo de Combustible */}
      <ThemedView style={styles.inputGroup}>
        <Text style={styles.label}>{t("fuelType")}</Text>
        <View style={styles.row}>
          {/* Podrías generar estos botones dinámicamente si los tipos cambian */}
          <Button
            title={t("regular")} // Usar traducciones para los tipos
            onPress={() => handleFuelTypeSelection("regular")}
            color={fuelType === "regular" ? "blue" : "gray"}
          />
          <Button
            title={t("diesel")}
            onPress={() => handleFuelTypeSelection("diesel")}
            color={fuelType === "diesel" ? "blue" : "gray"}
          />
          <Button
            title={t("adBlue")}
            onPress={() => handleFuelTypeSelection("adBlue")}
            color={fuelType === "adBlue" ? "blue" : "gray"}
          />
        </View>
      </ThemedView>

      {/* Inputs para Cantidad, Precio, Total y Botón Añadir */}
      <View style={styles.row}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("Quantity/Gal")}</Text>
          <NumericInput
            ref={volumeInputRef}
            style={styles.input}
            decimal={true}
            placeholder={t("10.123")}
            value={volume}
            onChangeText={setVolume} // Actualiza estado local directamente
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("Price/Gal")}</Text>
          <NumericInput
            style={styles.input}
            decimal={true}
            placeholder={t("Price")}
            value={price}
            onChangeText={setPrice} // Actualiza estado local
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t("total")}</Text>
          <NumericInput
            style={styles.input}
            decimal={true}
            placeholder={t("total")}
            value={currentTotal.toLocaleString("es-CO", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} // Formatear
            editable={false}
          />
        </View>
        <View style={styles.addButtonContainer}>
          <Pressable onPress={handleAddSale} style={styles.addButton}>
            <AddIcon color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Lista de Ventas (leyendo del store) */}
      <View style={styles.listContainer}>
        <SalesList
          fuelSales={fuelSalesFromStore} // Pasar datos del store
          onDelete={handleDeleteSale} // Pasar la función que llama a la acción del store
        />
      </View>

      {/* Total General de Ventas */}
      <View style={styles.totalSalesContainer}>
        <Text style={styles.totalSalesLabel}>{t("totalSales")}:</Text>
        <NumericInput
          style={styles.totalSalesInput}
          decimal={true}
          value={totalSales.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })} // Formatear como moneda
          editable={false}
        />
      </View>

      {/* Botón Limpiar */}
      <View style={styles.clearButtonContainer}>
        <Pressable style={styles.clearButton} onPress={handleClearSales}>
          <Text style={styles.clearButtonText}>{t("clear")}</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
};

// --- Estilos (Ajustados y/o Añadidos) ---
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f8f8f8", // Fondo ligeramente distinto
  },
  title: {
    fontSize: 20, // Más grande
    fontWeight: "bold",
    marginBottom: 15, // Más espacio
    textAlign: "center",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 12,
    flex: 1, // Para que los inputs se distribuyan en la fila
    marginHorizontal: 4, // Pequeño espacio entre inputs
  },
  label: {
    fontSize: 13,
    marginBottom: 5,
    color: "#555",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Distribuir espacio
    alignItems: "flex-end", // Alinear por abajo (útil si las etiquetas tienen distinta altura)
    marginBottom: 10,
  },
  addButtonContainer: {
    marginLeft: 8, // Espacio antes del botón
    paddingBottom: 5, // Alinear con la base de los inputs
  },
  addButton: {
    backgroundColor: "#28a745", // Verde para añadir
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    marginVertical: 15, // Espacio antes y después de la lista
    minHeight: 100, // Altura mínima para verla aunque esté vacía
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 5,
  },
  totalSalesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // Alinear a la derecha
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalSalesLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalSalesInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f0f0f0", // Fondo distinto para indicar no editable
    minWidth: 120, // Ancho mínimo
    textAlign: "right",
    fontWeight: "bold",
  },
  clearButtonContainer: {
    marginTop: 20, // Más espacio arriba
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#dc3545", // Rojo para limpiar/borrar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff", // Texto blanco
  },
  // Estilos redundantes o no usados del código original comentados
  /*
  button: { ... },
  buttonText: { ... },
  addButtonText: { ... },
  */
});
