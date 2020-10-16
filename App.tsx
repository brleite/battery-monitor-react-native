import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Battery from "expo-battery";
import { useFonts } from "expo-font";
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [batteryLevel, setBatteryLevel] = useState(-1);

  Battery.getBatteryLevelAsync().then((r) => {
    console.log("getBatteryLevelAsync");
    console.log(r);

    setBatteryLevel(r);
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Battery Level Format: {(batteryLevel * 100).toFixed(0) + "%"}</Text>
      <Text style={styles.text}>Battery Level: {batteryLevel}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121214",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
  },
});
