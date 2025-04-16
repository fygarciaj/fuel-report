import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  ExpenseIcon,
  FuelIcon,
  HomeIcon,
  Lubricant,
} from "@/components/ui/Icons";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="fuels"
        options={{
          title: t("fuels"),
          tabBarIcon: ({ color }) => <FuelIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="lubricants"
        options={{
          title: t("Lubricants"),
          tabBarIcon: ({ color }) => <Lubricant color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: t("expenses"),
          tabBarIcon: ({ color }) => <ExpenseIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
