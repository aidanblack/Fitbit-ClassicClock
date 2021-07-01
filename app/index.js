import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me } from "appbit";
import * as messaging from "messaging";
import * as simpleSettings from "./device-settings";
import Clock from "./clock";
import Battery from "./battery";
import Weather from "./weather";
import Face from "./face";
import Goals from "./goals";

// ***** Settings *****
console.log("set up settings");

const settings;

function settingsCallback(data) {
  settings = data;
}

simpleSettings.initialize(settingsCallback);

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt && evt.data && evt.data.key) {
    settings[evt.data.key] = evt.data.value;
    //console.log(`${evt.data.key} : ${evt.data.value}`); // Good for debugging
    if (evt.data.key === "tempUnit") {
      weather.tempUnit = evt.data.value.selected;
      clockController.weather.updateWeather();
    }
  }
});

// ***** Clock *****
console.log("set up clock");

const dateBox = document.getElementById("dateBox")
const hourHand = document.getElementById("hours");
const minuteHand = document.getElementById("minutes");
const secondsHand = document.getElementById("seconds");

var clockController = new Clock(
  dateBox,
  hourHand,
  minuteHand,
  secondsHand
);

// ***** Initialize Body & Heart Rate *****
console.log("initialize body and heart rate");

const heartRate = document.getElementById("heartRate");

function processHeartRate() {
  if (!settings.hideHeartRate && display.on) {
    heartRate.animate("enable");
  }

  if (!settings.hideHeartRate && display.on && body.present) {
    hrm.start();
  } else {
    hrm.stop();
  }
}

const body = null;
if (BodyPresenceSensor) {
  body = new BodyPresenceSensor();
  body.start();
  body.addEventListener("reading", () => {
    processHeartRate();
  });
}

const hrm;
if (HeartRateSensor) {
  hrm = new HeartRateSensor({ frequency: 1 });
  hrm.start();
  hrm.addEventListener("reading", () => {
    processHeartRate();
  });
}

// ***** Display *****
console.log("set up display");

var face = new Face(settings, body, hrm, dateBox);

if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {
    // Is the display on?
    if (!display.aodActive && display.on) {
      body.start();
      hrm.start();
      clock.granularity = "seconds";
      clockController.weather.updateWeather();
    }
    else {
      body.stop();
      hrm.stop();
      clock.granularity = "minutes";
    }
    face.updateDisplay();
  });
}
else {
  // respond to display change events
  display.addEventListener("change", () => {
    // Is the display on?
    if (display.on) {
      body.start();
      hrm.start();
      clock.granularity = "seconds";
      clockController.weather.updateWeather();
    }
    else {
      body.stop();
      hrm.stop();
      clock.granularity = "minutes";
    }
    face.updateDisplay();
  });
}

clockController.updateDisplay = () => { face.updateDisplay() };

// ***** Weather *****
console.log("set up weather");

var weather = new Weather(document.getElementById("temperature"), document.getElementById("weatherIcon"));
weather.tempUnit = settings.tempUnit.selected;
clockController.weather = weather;

// ***** Goals *****
console.log("set up goals");

var goals = new Goals(settings);

clockController.updateGoals = () => { goals.updateGoals() };

// ***** Battery *****
console.log("set up battery");

var battery = new Battery();

clockController.updateBattery = () => { battery.updateBattery() };

// ***** Trigger Updates *****
console.log("start updates");

clockController.updateGoals();
clockController.updateBattery();
clockController.startClock();
