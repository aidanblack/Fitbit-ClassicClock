import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me } from "appbit";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import { preferences } from "user-settings";
import * as messaging from "messaging";
import * as simpleSettings from "./device-settings";
import Clock from "./clock";
import Weather from "./weather";
import Face from "./face";

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
    if(evt.data.key === "tempUnit") {
      weather.tempUnit = evt.data.value.selected;
      clock.weather.updateWeather();
    }
  }
});

// ***** Clock *****
console.log("set up clock");

const dateBox = document.getElementById("dateBox")
const hourHand = document.getElementById("hours");
const minuteHand = document.getElementById("minutes");
const secondsHand = document.getElementById("seconds");

var clock = new Clock(
  dateBox,
  hourHand,
  minuteHand,
  secondsHand
);

// ***** Initialize Body & Heart Rate *****
console.log("initialize body and heart rate");

const body = null;
if (BodyPresenceSensor) {
  body = new BodyPresenceSensor();
  body.start();
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
      // Is AOD inactive and the display is on?
      if (!display.aodActive && display.on) {
          body.start();
          hrm.start();
          clock.granularity = "seconds";
          clock.weather.updateWeather();
      }
      else {
          body.stop();
          hrm.stop();
          clock.granularity = "minutes";
      }
      face.updateDisplay();
  });
}

clock.updateDisplay = () => { face.updateDisplay() };

// ***** Weather *****
console.log("set up weather");

var weather = new Weather(document.getElementById("temperature"), document.getElementById("weatherIcon"));
weather.tempUnit = settings.tempUnit.selected;
clock.weather = weather;

// ***** Heart Rate *****
console.log("set up heart rate");

const heartRate = document.getElementById("heartRate");

function processHeartRate() {
  if (!settings.hideHeartRate && !display.aodActive && display.on) {
    heartRate.animate("enable");
  }

  if (!settings.hideHeartRate && !display.aodActive && display.on && body.present) {
    hrm.start();
  } else {
    hrm.stop();
  }
}

// ***** Goals *****
console.log("set up goals");

clock.updateGoals = () => {
  var stepPercent = 0;
  var distancePercent = 0;
  var zonePercent = 0;

  if (me.permissions.granted("access_activity")) {
    var stepCount = today.adjusted.steps;
    var stepGoal = goals.steps;
    stepPercent = stepCount / stepGoal * 100;

    var distanceCount = today.adjusted.distance;
    var distanceGoal = goals.distance;
    distancePercent = distanceCount / distanceGoal * 100;

    var zoneCount = today.adjusted.activeZoneMinutes.total;
    var zoneGoal = goals.activeZoneMinutes.total;
    zonePercent = zoneCount / zoneGoal * 100;
  }

  if (!settings.hideGoals) {
    document.getElementById("steps").style.fill = "#EFC12B";
    if (stepPercent >= 20) document.getElementById("steps1").style.opacity = 1;
    else document.getElementById("steps1").style.opacity = 0.5;
    if (stepPercent >= 40) document.getElementById("steps2").style.opacity = 1;
    else document.getElementById("steps2").style.opacity = 0.5;
    if (stepPercent >= 60) document.getElementById("steps3").style.opacity = 1;
    else document.getElementById("steps3").style.opacity = 0.5;
    if (stepPercent >= 80) document.getElementById("steps4").style.opacity = 1;
    else document.getElementById("steps4").style.opacity = 0.5;

    document.getElementById("distance").style.fill = "#376EEF";
    if (distancePercent >= 20) document.getElementById("distance1").style.opacity = 1;
    else document.getElementById("distance1").style.opacity = 0.5;
    if (distancePercent >= 40) document.getElementById("distance2").style.opacity = 1;
    else document.getElementById("distance2").style.opacity = 0.5;
    if (distancePercent >= 60) document.getElementById("distance3").style.opacity = 1;
    else document.getElementById("distance3").style.opacity = 0.5;
    if (distancePercent >= 80) document.getElementById("distance4").style.opacity = 1;
    else document.getElementById("distance4").style.opacity = 0.5;

    document.getElementById("zone").style.fill = "#EA7D1E";
    if (zonePercent >= 20) document.getElementById("zone1").style.opacity = 1;
    else document.getElementById("zone1").style.opacity = 0.5;
    if (zonePercent >= 40) document.getElementById("zone2").style.opacity = 1;
    else document.getElementById("zone2").style.opacity = 0.5;
    if (zonePercent >= 60) document.getElementById("zone3").style.opacity = 1;
    else document.getElementById("zone3").style.opacity = 0.5;
    if (zonePercent >= 80) document.getElementById("zone4").style.opacity = 1;
    else document.getElementById("zone4").style.opacity = 0.5;
  }
  console.log("Goals Updated");
}

// ***** Battery *****
console.log("set up battery");

clock.updateBattery = () =>  {
  if (battery.chargeLevel >= 20) document.getElementById("battery1").style.opacity = 1;
  else document.getElementById("battery1").style.opacity = 0.5;
  if (battery.chargeLevel >= 40) document.getElementById("battery2").style.opacity = 1;
  else document.getElementById("battery2").style.opacity = 0.5;
  if (battery.chargeLevel >= 60) document.getElementById("battery3").style.opacity = 1;
  else document.getElementById("battery3").style.opacity = 0.5;
  if (battery.chargeLevel >= 80) document.getElementById("battery4").style.opacity = 1;
  else document.getElementById("battery4").style.opacity = 0.5;

  console.log("Battery Updated");
}

// ***** Trigger Updates *****
console.log("start updates");

clock.updateGoals();
clock.updateBattery();
clock.startClock();
