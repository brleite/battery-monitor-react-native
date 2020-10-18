import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";

export async function initTasks() {
    console.log("initTasks");
    
    await TaskManager.unregisterAllTasksAsync();
}

export async function registerFetchTask(TASKNAME: string, runBackgroundSaga:any, INTERVAL: number) {
    TaskManager.defineTask(TASKNAME, runBackgroundSaga);

    const status = await BackgroundFetch.getStatusAsync();
    switch (status) {
        case BackgroundFetch.Status.Restricted:
        case BackgroundFetch.Status.Denied:
            console.log("Background execution is disabled");
            return;

        default: {
            console.debug("Background execution allowed");

            let tasks = await TaskManager.getRegisteredTasksAsync();
            if (tasks.find(f => f.taskName === TASKNAME)) {
                console.log("Unegistering task");

                await BackgroundFetch.unregisterTaskAsync(TASKNAME);
            }

            console.log("Registering task");
            await BackgroundFetch.registerTaskAsync(TASKNAME, {
                minimumInterval: INTERVAL,
                stopOnTerminate: true,
                startOnBoot: true
                },).then(() => BackgroundFetch.setMinimumIntervalAsync(INTERVAL));

            tasks = await TaskManager.getRegisteredTasksAsync();
            console.debug("Registered tasks", tasks);
        }
    } 
}

export async function registerLocationTask(TASKNAME: string, runBackgroundSaga:any, INTERVAL: number, message: string) {
    TaskManager.defineTask(TASKNAME, runBackgroundSaga);

    const locationTask = await Location.hasStartedLocationUpdatesAsync(TASKNAME)
    if (locationTask) {
        console.log("Parando location task");
        
        await Location.stopLocationUpdatesAsync(TASKNAME);
    }
    Location.startLocationUpdatesAsync(TASKNAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: INTERVAL,
        // distanceInterval: interval,
        foregroundService: {
          notificationTitle: message,
          notificationBody: message,
        },
      });
}