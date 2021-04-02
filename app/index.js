import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import { display } from "display";
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { today } from "user-activity";
import { goals } from "user-activity";
import { battery } from "power";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as weather from 'fitbit-weather/app';
import * as simpleSettings from "./device-settings";

const settings;

function settingsCallback(data) {
  settings = data;
}

simpleSettings.initialize(settingsCallback);

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt && evt.data && evt.data.key) {
    settings[evt.data.key] = evt.data.value;
    //console.log(`${evt.data.key} : ${evt.data.value}`); // Good for debugging
  }
});

// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const dateBox = document.getElementById("dateBox")
const hourHand = document.getElementById("hours");
const minuteHand = document.getElementById("minutes");
const secondsHand = document.getElementById("seconds");
const heartRate = document.getElementById("heartRate");

const body = null;
if (BodyPresenceSensor) {
  body = new BodyPresenceSensor();
  body.start();
}

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let now = evt.date;
  let dateText = now.toLocaleString('default', { month: 'short' }).substring(4, 10);

  let hours = now.getHours();
  hours = hours % 12 || 12;
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  if (!settings.hideDate) {
    dateBox.text = dateText;
    dateBox.style.visibility = "visible";
    document.getElementById("iii").style.visibility = "hidden";
  }
  else {
    dateBox.style.visibility = "hidden";
    document.getElementById("iii").style.visibility = "visible";
  }
  hourHand.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
  minuteHand.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
  secondsHand.groupTransform.rotate.angle = seconds * 6;
  heartRate.animate("enable");

  if (settings.hideGoals)
    document.getElementById("icons").style.visibility = "hidden";
  else
    document.getElementById("icons").style.visibility = "visible";
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
  if (stepPercent >= 20 && !settings.hideGoals) document.getElementById("steps1").style.opacity = 1;
  else document.getElementById("steps1").style.opacity = 0.5;
  if (stepPercent >= 40 && !settings.hideGoals) document.getElementById("steps2").style.opacity = 1;
  else document.getElementById("steps2").style.opacity = 0.5;
  if (stepPercent >= 60 && !settings.hideGoals) document.getElementById("steps3").style.opacity = 1;
  else document.getElementById("steps3").style.opacity = 0.5;
  if (stepPercent >= 80 && !settings.hideGoals) document.getElementById("steps4").style.opacity = 1;
  else document.getElementById("steps4").style.opacity = 0.5;

  if (distancePercent >= 20 && !settings.hideGoals) document.getElementById("distance1").style.opacity = 1;
  else document.getElementById("distance1").style.opacity = 0.5;
  if (distancePercent >= 40 && !settings.hideGoals) document.getElementById("distance2").style.opacity = 1;
  else document.getElementById("distance2").style.opacity = 0.5;
  if (distancePercent >= 60 && !settings.hideGoals) document.getElementById("distance3").style.opacity = 1;
  else document.getElementById("distance3").style.opacity = 0.5;
  if (distancePercent >= 80 && !settings.hideGoals) document.getElementById("distance4").style.opacity = 1;
  else document.getElementById("distance4").style.opacity = 0.5;

  if (zonePercent >= 20 && !settings.hideGoals) document.getElementById("zone1").style.opacity = 1;
  else document.getElementById("zone1").style.opacity = 0.5;
  if (zonePercent >= 40 && !settings.hideGoals) document.getElementById("zone2").style.opacity = 1;
  else document.getElementById("zone2").style.opacity = 0.5;
  if (zonePercent >= 60 && !settings.hideGoals) document.getElementById("zone3").style.opacity = 1;
  else document.getElementById("zone3").style.opacity = 0.5;
  if (zonePercent >= 80 && !settings.hideGoals) document.getElementById("zone4").style.opacity = 1;
  else document.getElementById("zone4").style.opacity = 0.5;

  if (battery.chargeLevel >= 20) document.getElementById("battery1").style.opacity = 1;
  else document.getElementById("battery1").style.opacity = 0.5;
  if (battery.chargeLevel >= 40) document.getElementById("battery2").style.opacity = 1;
  else document.getElementById("battery2").style.opacity = 0.5;
  if (battery.chargeLevel >= 60) document.getElementById("battery3").style.opacity = 1;
  else document.getElementById("battery3").style.opacity = 0.5;
  if (battery.chargeLevel >= 80) document.getElementById("battery4").style.opacity = 1;
  else document.getElementById("battery4").style.opacity = 0.5;

  if (!settings.hideWeather) {
    document.getElementById("weatherBox").style.visibility = "visible";
    document.getElementById("ix").style.visibility = "hidden";
    weather.fetch(30 * 60 * 1000) // return the cached value if it is less than 30 minutes old 
      .then(weather => processWeather(weather))
      .catch(error => console.log(JSON.stringify(error)));
  }
  else {
    document.getElementById("weatherBox").style.visibility = "hidden";
    document.getElementById("ix").style.visibility = "visible";
  }

  if (!settings.hideHeartRate) {
    document.getElementById("heartrateBox").style.visibility = "visible";
    document.getElementById("vi").style.visibility = "hidden";
  }
  else {
    document.getElementById("heartrateBox").style.visibility = "hidden";
    document.getElementById("vi").style.visibility = "visible";
  }

  if (!display.aodActive && display.on && body.present && !settings.hideHeartRate) {
    hrm.start();
    document.getElementById("bpm").style.visibility = "visible";
  } else {
    hrm.stop();
    document.getElementById("bpm").style.visibility = "hidden";
  }
}

function processWeather(weather) {
  if (settings.tempUnit.selected == "1")
    document.getElementById("temperature").text = `${Math.round(weather.temperatureF)}°`;
  else
    document.getElementById("temperature").text = `${Math.round(weather.temperatureC)}°`;
  var weatherIcon = document.getElementById("weatherIcon");
  var weatherCode = weather.conditionCode;
  var dayNight;
  if (weather.timestamp > weather.sunrise && weather.timestamp < weather.sunset) dayNight = "d";
  else dayNight = "n";
  weatherIcon.href = `weather/${weatherCode}${dayNight}.png`;
}

if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {
    // Is AOD inactive and the display is on?
    if (!display.aodActive && display.on) {
      clock.granularity = "seconds";
      // Show elements & start sensors
      document.getElementById("seconds").style.visibility = "visible";
      document.getElementById("numbers").style.visibility = "visible";
      document.getElementById("icons").style.visibility = "visible";
      document.getElementsByClassName("tertiary").forEach(showMinutes);
    } else {
      clock.granularity = "minutes";
      // Hide elements & stop sensors
      document.getElementById("seconds").style.visibility = "hidden";
      document.getElementById("numbers").style.visibility = "hidden";
      document.getElementById("icons").style.visibility = "hidden";
      document.getElementsByClassName("tertiary").forEach(hideMinutes);
    }
  });
}

const hrm;

if (HeartRateSensor) {
  hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    document.getElementById("bpm").text = hrm.heartRate;
  });
}

// if (BodyPresenceSensor) {
//   const body = new BodyPresenceSensor();
//   body.addEventListener("reading", () => {
//     if (!display.aodActive && display.on && body.present && !settings.showHeartRate) {
//       hrm.start();
//       document.getElementById("bpm").style.visibility = "visible";
//     } else {
//       hrm.stop();
//       document.getElementById("bpm").style.visibility = "hidden";
//     }
//   });
//   body.start();
// }

function hideMinutes(item, index) {
  item.style.visibility = "hidden";
}

function showMinutes(item, index) {
  item.style.visibility = "visible";
}