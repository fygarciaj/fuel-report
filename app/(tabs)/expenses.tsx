import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { FuelForm } from "@/components/FuelForm";
import { ScrollView } from "react-native";
import { ExpensesForm } from "@/components/ExpensesForm";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <ExpensesForm />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
