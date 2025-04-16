import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native";
import { LubricanForm } from "@/components/LubricanForm";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <LubricanForm />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
