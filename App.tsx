import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Battery from "expo-battery";
import { useFonts } from "expo-font";
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import * as BackgroundFetch from "expo-background-fetch";
import { registerFetchTask, registerLocationTask, initTasks } from "./src/services/tasks";

const INTERVAL = 60 * 1000;
const FETCH_INTERVAL_TASKS = 1 * 60;
const LOCATION_INTERVAL_TASKS = 5;
const LOCATION_TASK_NAME = "custom-background-location-task";
const FETCH_TASK_NAME = "custom-background-fetch-task";

let setStateFn = (p: any) => {
  console.log("State not yet initialized");
};

let setBackgroundFetchDateFn = (p: any) => {
  console.log("State not yet initialized");
};

let setBackgroundFetchCountFn = (p: any) => {
  console.log("State not yet initialized");
};

let setLocationDateFn = (p: any) => {
  console.log("State not yet initialized");
};

let setLocationCountFn = (p: any) => {
  console.log("State not yet initialized");
};

function formatDate(d: Date) {
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString();
}

async function atualizaBateriaTask() {
  const backendData = await Battery.getBatteryLevelAsync();
  console.log(backendData);
  // const backendData = "Simulated fetch " + Math.random();
  setStateFn(backendData);
  return backendData;
}

async function myTaskBackgroundFetch() {
  try {
    console.log("myTaskBackgroundFetch");

    const backendData = await atualizaBateriaTask();

    setBackgroundFetchDateFn(new Date());
    console.log("BackgroundFetchDate: " + new Date());

    return backendData !== undefined
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
}

async function myTaskLocation({ data: { locations }, error }: any) {
  try {
    console.log("myTaskLocation");
    console.log(locations);

    const backendData = await atualizaBateriaTask();

    setLocationDateFn(new Date());
    console.log("LocationDate: " + new Date());

    return backendData !== undefined
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
}

initTasks();
registerFetchTask(FETCH_TASK_NAME, myTaskBackgroundFetch, FETCH_INTERVAL_TASKS);
/* registerLocationTask(
  LOCATION_TASK_NAME,
  myTaskLocation,
  LOCATION_INTERVAL_TASKS,
  "Battery Monitor"
); */

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const [batteryLevel, setBatteryLevel] = useState(-1);

  // Put the next lines inside the React component
  const [state, setState] = useState(-1);
  const [backgroundFetchDate, setBackgroundFetchDate] = useState(new Date());
  const [backgroundFetchCount, setBackgroundFetchCount] = useState(-1);
  const [locationDate, setLocationDate] = useState(new Date());
  const [locationCount, setLocationCount] = useState(-1);
  const [intervalDate, setIntervalDate] = useState(new Date());
  const [intervalCount, setIntervalCount] = useState(-1);
  setStateFn = setState;
  setBackgroundFetchDateFn = setBackgroundFetchDate;
  setLocationDateFn = setLocationDate;
  setBackgroundFetchCountFn = setBackgroundFetchCount;
  setLocationCountFn = setLocationCount;

  function atualizaBatteryLevel() {
    Battery.getBatteryLevelAsync().then((r) => {
      /* console.log("getBatteryLevelAsync");
      console.log(r); */

      setBatteryLevel(r);

      setIntervalDate(new Date());
    });
  }

  useEffect(() => {
    /* setInterval(() => {
      // console.log("setInterval");

      atualizaBatteryLevel();

      console.log("IntervalDate: " + formatDate(new Date()));
      // setIntervalCount(intervalCount + 1);
      // console.log("IntervalCount: " + intervalCount);
    }, INTERVAL); */
    atualizaBatteryLevel();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Battery Level Format: {(batteryLevel * 100).toFixed(0) + "%"}</Text>
      <Text style={styles.text}>Battery Level: {batteryLevel}</Text>
      <Text style={styles.text}>Interval Date: {formatDate(intervalDate)}</Text>
      <Text style={styles.text}></Text>
      <Text style={styles.text}>State format: {(state * 100).toFixed(0) + "%"}</Text>
      <Text style={styles.text}>State: {state}</Text>
      <Text style={styles.text}>BackgroundFetch Date: {formatDate(backgroundFetchDate)}</Text>
      <Text style={styles.text}>Location Date: {formatDate(locationDate)}</Text>
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
