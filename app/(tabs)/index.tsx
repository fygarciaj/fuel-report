import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView } from "react-native";
import { Home } from "@/components/Home";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView>
      <ThemedView
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Home />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
