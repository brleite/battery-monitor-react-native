import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Battery from "expo-battery";
import { useFonts } from "expo-font";
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

let setStateFn = (p: any) => {
  console.log("State not yet initialized");
};

async function myTask() {
  try {
    console.log("myTask");

    /* let backendData = -1;
    Battery.getBatteryLevelAsync().then((r) => {
      backendData = r;
    }); */
    const backendData = await Battery.getBatteryLevelAsync();
    console.log(backendData);
    // const backendData = "Simulated fetch " + Math.random();
    setStateFn(backendData);
    return backendData !== undefined
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
}

async function initBackgroundFetch(taskName: string, taskFn: any, interval = 60 * 15) {
  try {
    console.log("initBackgroundFetch");

    if (!TaskManager.isTaskDefined(taskName)) {
      console.log("define task");

      TaskManager.defineTask(taskName, taskFn);
    }

    Location.startLocationUpdatesAsync(taskName, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: interval,
      // distanceInterval: interval,
      foregroundService: {
        notificationTitle: "title",
        notificationBody: "LOCATION_SUBTITLE"
      }
    });
    const options = {
      minimumInterval: interval, // in seconds
      stopOnTerminate: false,
      startOnBoot: true
    };
    await BackgroundFetch.registerTaskAsync(taskName, options);
    console.log("register");
    console.log(options);

    await BackgroundFetch.setMinimumIntervalAsync(interval);
    console.log("minimum interval");



  } catch (err) {
    console.log("registerTaskAsync() failed:", err);
  }
}

initBackgroundFetch('myTaskName', myTask, 5);

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [batteryLevel, setBatteryLevel] = useState(-1);

  // Put the next lines inside the React component
  const [state, setState] = useState(-1);
  setStateFn = setState;

  function atualizaBatteryLevel() {
    Battery.getBatteryLevelAsync().then((r) => {
      /* console.log("getBatteryLevelAsync");
      console.log(r); */

      setBatteryLevel(r);
    });
  }

  useEffect(() => {
    setInterval(() => {
      // console.log("setInterval");

      atualizaBatteryLevel();
    }, 60 * 1000);
  }, []);

  atualizaBatteryLevel();


  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Battery Level Format: {(batteryLevel * 100).toFixed(0) + "%"}</Text>
      <Text style={styles.text}>Battery Level: {batteryLevel}</Text>
      <Text style={styles.text}>state format: {(state * 100).toFixed(0) + "%"}</Text>
      <Text style={styles.text}>state: {state}</Text>
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
