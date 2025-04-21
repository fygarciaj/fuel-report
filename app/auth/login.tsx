import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { FuelForm } from "@/components/FuelForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={{ flex: 1 }}>
      <ThemedView
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View style={styles.container}>
          <LoginScreen />
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
