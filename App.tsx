import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Battery from 'expo-battery';

export default function App() {

  const [batteryLevel, setBatteryLevel] = useState(-1);
  
  Battery.getBatteryLevelAsync().then(r => {
    console.log("getBatteryLevelAsync");
    console.log(r);   
    
    setBatteryLevel(r);
  });

  return (
    <View style={styles.container}>
      <Text>Battery Level Format: {(batteryLevel * 100).toFixed(0) + "%"}</Text>
      <Text>Battery Level: {batteryLevel}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
