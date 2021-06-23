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

// ***** Settings *****

const settings;

function settingsCallback(data) {
  settings = data;
}

simpleSettings.initialize(settingsCallback);

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt && evt.data && evt.data.key) {
    settings[evt.data.key] = evt.data.value;
    //console.log(`${evt.data.key} : ${evt.data.value}`); // Good for debugging
    if(evt.data.key === "tempUnit") updateWeather();
  }
});

// ***** Initialize Body & Heart Rate *****

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
      // Show elements & start sensors
      document.getElementsByClassName("tertiary").forEach(showMinutes);
      document.getElementById("numbers").style.visibility = "visible";
      document.getElementById("seconds").style.visibility = "visible";
      if(!settings.hideDate) document.getElementById("dateBox").style.visibility = "visible";
      else document.getElementById("iii").style.visibility = "visible";
      if(!settings.hideHeartRate) {
        document.getElementById("heartrateBox").style.visibility = "visible";
        document.getElementById("bpm").style.visibility = "visible";
      }
      else document.getElementById("vi").style.visibility = "visible";
      if(!settings.hideWeather) document.getElementById("weatherBox").style.visibility = "visible";
      else document.getElementById("ix").style.visibility = "visible";
      if(!settings.hideGoals) {
        document.getElementById("icons").style.visibility = "visible";
      }
      document.getElementById("steps").style.visibility = "visible";
      document.getElementById("distance").style.visibility = "visible";
      document.getElementById("zone").style.visibility = "visible";  
  }
    else {
      body.stop();
      hrm.stop();
      clock.granularity = "minutes";
      // Hide elements & stop sensors
      document.getElementById("seconds").style.visibility = "hidden";
      document.getElementById("numbers").style.visibility = "hidden";
      document.getElementById("icons").style.visibility = "hidden";
      if(settings.hideGoals) {
        document.getElementById("steps").style.visibility = "hidden";
        document.getElementById("distance").style.visibility = "hidden";
        document.getElementById("zone").style.visibility = "hidden";
      }
      document.getElementById("heartrateBox").style.visibility = "hidden";
      if(settings.hideDate) document.getElementById("dateBox").style.visibility = "hidden";
      document.getElementById("weatherBox").style.visibility = "hidden";
      document.getElementById("bpm").style.visibility = "hidden";
      document.getElementById("iii").style.visibility = "hidden";
      document.getElementById("vi").style.visibility = "hidden";
      document.getElementById("ix").style.visibility = "hidden";
      document.getElementsByClassName("tertiary").forEach(hideMinutes);
    }
  });
}

function hideMinutes(item, index) {
  item.style.visibility = "hidden";
}

function showMinutes(item, index) {
  item.style.visibility = "visible";
}

function processDisplay() {
  // Date
  if (!settings.hideDate) {
    dateBox.style.visibility = "visible";
    document.getElementById("iii").style.visibility = "hidden";
  }
  else if (settings.hideDate && !display.aodActive && display.on) {
    dateBox.style.visibility = "hidden";
    document.getElementById("iii").style.visibility = "visible";
  }
  else {
    dateBox.style.visibility = "hidden";
    document.getElementById("iii").style.visibility = "hidden";
  }

  // Weather
  if (!settings.hideWeather && !display.aodActive && display.on) {
    document.getElementById("weatherBox").style.visibility = "visible";
    document.getElementById("ix").style.visibility = "hidden";
  }
  else if(settings.hideWeather && !display.aodActive && display.on) {
    document.getElementById("weatherBox").style.visibility = "hidden";
    document.getElementById("ix").style.visibility = "visible";
  }
  else {
    document.getElementById("weatherBox").style.visibility = "hidden";
    document.getElementById("ix").style.visibility = "hidden";
  }
  
  // Heart Rate
  if (!settings.hideHeartRate && !display.aodActive && display.on) {
    document.getElementById("heartrateBox").style.visibility = "visible";
    document.getElementById("vi").style.visibility = "hidden";
  }
  else if (settings.hideHeartRate && !display.aodActive && display.on) {
    document.getElementById("heartrateBox").style.visibility = "hidden";
    document.getElementById("vi").style.visibility = "visible";
  }
  else {
    document.getElementById("heartrateBox").style.visibility = "hidden";
    document.getElementById("vi").style.visibility = "hidden";
  }
  if (!settings.hideHeartRate && !display.aodActive && display.on && body.present) {
    document.getElementById("bpm").style.visibility = "visible";
    document.getElementById("bpm").text = hrm.heartRate;
  } else {
    document.getElementById("bpm").style.visibility = "hidden";
  }

  // Goals
  if (!settings.hideGoals && !display.aodActive && display.on) {
    document.getElementById("icons").style.visibility = "visible";
  }
  else
    document.getElementById("icons").style.visibility = "hidden";
  
  if (settings.hideGoals) {
    document.getElementById("steps").style.fill = "#FFFFFF";
    document.getElementById("steps1").style.opacity = 0.33;
    document.getElementById("steps2").style.opacity = 0.33;
    document.getElementById("steps3").style.opacity = 0.33;
    document.getElementById("steps4").style.opacity = 0.33;
    document.getElementById("distance").style.fill = "#FFFFFF";
    document.getElementById("distance1").style.opacity = 0.33;
    document.getElementById("distance2").style.opacity = 0.33;
    document.getElementById("distance3").style.opacity = 0.33;
    document.getElementById("distance4").style.opacity = 0.33;
    document.getElementById("zone").style.fill = "#FFFFFF";
    document.getElementById("zone1").style.opacity = 0.33;
    document.getElementById("zone2").style.opacity = 0.33;
    document.getElementById("zone3").style.opacity = 0.33;
    document.getElementById("zone4").style.opacity = 0.33;

    if(display.aodActive) {
      document.getElementById("steps").style.visibility = "hidden";
      document.getElementById("distance").style.visibility = "hidden";
      document.getElementById("zone").style.visibility = "hidden";
    }
  }
  else {
    document.getElementById("steps").style.visibility = "visible";
    document.getElementById("distance").style.visibility = "visible";
    document.getElementById("zone").style.visibility = "visible";
  }
}

// ***** Clock *****

const dateBox = document.getElementById("dateBox")
const hourHand = document.getElementById("hours");
const minuteHand = document.getElementById("minutes");
const secondsHand = document.getElementById("seconds");
const heartRate = document.getElementById("heartRate");

clock.granularity = "seconds";

clock.ontick = (evt) => {
  let now = evt.date;
  processDate(now);

  let hours = now.getHours();
  hours = hours % 12 || 12;
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hourHand.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
  minuteHand.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
  secondsHand.groupTransform.rotate.angle = seconds * 6;

  if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) processGoals();
  if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) processBattery();
  if((clock.granularity === "minutes" || (seconds === 0)) && (minutes + 10) % 10 === 0) updateWeather();

  processDisplay();
}

// ***** Date *****

function processDate(date) {
  let dateText = date.toLocaleString('default', { month: 'short' }).substring(4, 10);
  dateBox.text = dateText;
}

// ***** Weather *****

function processWeather(weather) {
  if (!settings.hideWeather && !display.aodActive && display.on) {
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

  console.log("Weather Updated");
}

function updateWeather() {
  if (!settings.hideWeather && !display.aodActive && display.on) {
    weather.fetch(30 * 60 * 1000) // return the cached value if it is less than 30 minutes old 
      .then(weather => processWeather(weather))
      .catch(error => console.log(JSON.stringify(error)));
  }
}

// ***** Heart Rate *****

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

function processGoals() {
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

function processBattery() {
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

processGoals();
processBattery();
updateWeather();
