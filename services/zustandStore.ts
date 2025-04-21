import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values"; // Necesario para uuid en React Native
import { v4 as uuidv4 } from "uuid"; // Usar UUIDs para IDs más robustos

// --- Interfaces ---
// Usaremos string para IDs con UUID
interface FuelSale {
  id: string; // Cambiado a string para UUID
  type: string;
  pricePerGal: number;
  quantityGal: number;
  total: number;
}

interface Expense {
  id: string; // Cambiado a string para UUID
  amount: number;
  description: string;
}

interface Lubricant {
  id: string; // Cambiado a string para UUID
  type: string;
  amount: number; // Asumiendo que es el valor total de la venta del lubricante
}

interface SalesSummary {
  fuelSales: number;
  lubricantSales: number;
  credits: number;
  cards: number;
  bonds: number;
  expenses: number;
  deposits: number;
  cash: number;
  total: number; // Calculado
}

// --- Interfaz Completa del Estado y Acciones ---
export interface AppState {
  // Exportar para usar en componentes
  fuelSales: Array<FuelSale>;
  expenses: Array<Expense>;
  lubricants: Array<Lubricant>;
  salesSummary: SalesSummary;

  // --- Acciones ---
  // Fuel Sales
  addFuelSale: (saleData: Omit<FuelSale, "id" | "total">) => void;
  removeFuelSale: (id: string) => void;
  setFuelSales: (fuelSales: Array<FuelSale>) => void; // Útil para limpiar o reemplazar todo

  // Expenses
  addExpense: (expenseData: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  setExpenses: (expenses: Array<Expense>) => void;

  // Lubricants
  addLubricant: (lubricantData: Omit<Lubricant, "id">) => void;
  removeLubricant: (id: string) => void;
  setLubricants: (lubricants: Array<Lubricant>) => void;

  // Sales Summary (para campos que no derivan de listas: credits, cards, etc.)
  setSalesSummaryField: <
    K extends keyof Omit<
      SalesSummary,
      "fuelSales" | "lubricantSales" | "expenses" | "total"
    >,
  >(
    field: K,
    value: SalesSummary[K],
  ) => void;
  // setSalesSummary: (summaryData: Omit<SalesSummary, "total">) => void; // Mantenida por si acaso

  // General
  resetStore: () => void;
}

// --- Función de cálculo del Total General del Resumen ---
// (Sin cambios, calcula el total final a partir de los otros campos del resumen)
const calculateTotalSummary = (
  summary: Omit<SalesSummary, "total">,
): number => {
  return (
    summary.fuelSales +
    summary.lubricantSales +
    summary.credits +
    summary.cards +
    summary.bonds - // Restando gastos y depósitos
    summary.expenses -
    summary.deposits +
    summary.cash
  );
};

// --- Estado Inicial ---
// Definimos el estado inicial completo aquí para usarlo en resetStore
const initialState: Omit<AppState, keyof AppState> & // Hack para que coincida con la estructura base
  Pick<AppState, "fuelSales" | "expenses" | "lubricants" | "salesSummary"> = {
  fuelSales: [],
  expenses: [],
  lubricants: [],
  salesSummary: {
    fuelSales: 0,
    lubricantSales: 0,
    credits: 0,
    cards: 0,
    bonds: 0,
    expenses: 0,
    deposits: 0,
    cash: 0,
    total: 0,
  },
};

// --- Creación del Store ---
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- Estado Inicial ---
      ...initialState,

      // --- Acciones FuelSales ---
      addFuelSale: (saleData) => {
        const newSale: FuelSale = {
          ...saleData,
          id: uuidv4(), // Generar UUID
          total: saleData.pricePerGal * saleData.quantityGal,
        };
        set((state) => {
          const updatedFuelSales = [...state.fuelSales, newSale];
          const newFuelSalesTotal = updatedFuelSales.reduce(
            (acc, sale) => acc + sale.total,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            fuelSales: newFuelSalesTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            fuelSales: updatedFuelSales,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },
      removeFuelSale: (id) => {
        set((state) => {
          const updatedFuelSales = state.fuelSales.filter(
            (sale) => sale.id !== id,
          );
          const newFuelSalesTotal = updatedFuelSales.reduce(
            (acc, sale) => acc + sale.total,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            fuelSales: newFuelSalesTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            fuelSales: updatedFuelSales,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },
      setFuelSales: (newFuelSales) => {
        // Para limpiar o reemplazar
        set((state) => {
          const newFuelSalesTotal = newFuelSales.reduce(
            (acc, sale) => acc + sale.total,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            fuelSales: newFuelSalesTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            fuelSales: newFuelSales,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },

      // --- Acciones Expenses ---
      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: uuidv4(),
        };
        set((state) => {
          const updatedExpenses = [...state.expenses, newExpense];
          const newExpensesTotal = updatedExpenses.reduce(
            (acc, exp) => acc + exp.amount,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            expenses: newExpensesTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            expenses: updatedExpenses,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },
      removeExpense: (id) => {
        set((state) => {
          const updatedExpenses = state.expenses.filter((exp) => exp.id !== id);
          const newExpensesTotal = updatedExpenses.reduce(
            (acc, exp) => acc + exp.amount,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            expenses: newExpensesTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            expenses: updatedExpenses,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },
      setExpenses: (newExpenses) => {
        set((state) => {
          const newExpensesTotal = newExpenses.reduce(
            (acc, exp) => acc + exp.amount,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            expenses: newExpensesTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            expenses: newExpenses,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },

      // --- Acciones Lubricants ---
      addLubricant: (lubricantData) => {
        const newLubricant: Lubricant = {
          ...lubricantData,
          id: uuidv4(),
          // Asumiendo que lubricantData.amount es el total a añadir
        };
        set((state) => {
          const updatedLubricants = [...state.lubricants, newLubricant];
          // Asumiendo que 'amount' en Lubricant es el valor a sumar
          const newLubricantsTotal = updatedLubricants.reduce(
            (acc, lub) => acc + lub.amount,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            lubricantSales: newLubricantsTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            lubricants: updatedLubricants,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },
      removeLubricant: (id) => {
        set((state) => {
          const updatedLubricants = state.lubricants.filter(
            (lub) => lub.id !== id,
          );
          const newLubricantsTotal = updatedLubricants.reduce(
            (acc, lub) => acc + lub.amount,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            lubricantSales: newLubricantsTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            lubricants: updatedLubricants,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },
      setLubricants: (newLubricants) => {
        set((state) => {
          const newLubricantsTotal = newLubricants.reduce(
            (acc, lub) => acc + lub.amount,
            0,
          );
          const newSummary = {
            ...state.salesSummary,
            lubricantSales: newLubricantsTotal,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            lubricants: newLubricants,
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },

      // --- Acción para actualizar campos específicos del Summary (credits, cards, bonds, deposits, cash) ---
      setSalesSummaryField: (field, value) => {
        set((state) => {
          const newSummary = {
            ...state.salesSummary,
            [field]: value,
          };
          const newTotal = calculateTotalSummary(newSummary);
          return {
            salesSummary: { ...newSummary, total: newTotal },
          };
        });
      },

      // --- Acción de Reseteo ---
      resetStore: () => {
        // Restablece todo al estado inicial definido arriba
        set(initialState);
      },
    }),
    {
      name: "app-storage-v2", // Cambiar versión si la estructura cambia significativamente
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
