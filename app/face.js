import { display } from "display";
import document from "document";

class Face {
    settings;
    body;
    hrm;
    dateBox;

    constructor(settings, body, hrm, dateBox) {
        this.settings = settings;
        this.body = body;
        this.hrm = hrm;
        this.dateBox = dateBox;
    }

    updateDisplay() {
        // Is AOD inactive and the display is on?
        if (!display.aodActive && display.on) {
            document.getElementsByClassName("tertiary").forEach((item, index) => {
                item.style.visibility = "visible";
            });
            document.getElementById("numbers").style.visibility = "visible";
            document.getElementById("seconds").style.visibility = "visible";
            document.getElementById("steps").style.visibility = "visible";
            document.getElementById("distance").style.visibility = "visible";
            document.getElementById("zone").style.visibility = "visible";
        }
        else {
            document.getElementsByClassName("tertiary").forEach((item, index) => {
                item.style.visibility = "hidden";
            });
            document.getElementById("numbers").style.visibility = "hidden";
            document.getElementById("seconds").style.visibility = "hidden";
            document.getElementById("steps").style.visibility = "hidden";
            document.getElementById("distance").style.visibility = "hidden";
            document.getElementById("zone").style.visibility = "hidden";
        }
      
        // Date
        if (!this.settings.hideDate) {
            this.dateBox.style.visibility = "visible";
            document.getElementById("iii").style.visibility = "hidden";
        }
        else if (this.settings.hideDate && !display.aodActive && display.on) {
            this.dateBox.style.visibility = "hidden";
            document.getElementById("iii").style.visibility = "visible";
        }
        else {
            this.dateBox.style.visibility = "hidden";
            document.getElementById("iii").style.visibility = "hidden";
        }
      
        // Weather
        if (!this.settings.hideWeather && !display.aodActive && display.on) {
            document.getElementById("weatherBox").style.visibility = "visible";
            document.getElementById("ix").style.visibility = "hidden";
        }
        else if (this.settings.hideWeather && !display.aodActive && display.on) {
            document.getElementById("weatherBox").style.visibility = "hidden";
            document.getElementById("ix").style.visibility = "visible";
        }
        else {
            document.getElementById("weatherBox").style.visibility = "hidden";
            document.getElementById("ix").style.visibility = "hidden";
        }
      
        // Heart Rate
        if (!this.settings.hideHeartRate && !display.aodActive && display.on) {
            document.getElementById("heartrateBox").style.visibility = "visible";
            document.getElementById("vi").style.visibility = "hidden";
        }
        else if (this.settings.hideHeartRate && !display.aodActive && display.on) {
            document.getElementById("heartrateBox").style.visibility = "hidden";
            document.getElementById("vi").style.visibility = "visible";
        }
        else {
            document.getElementById("heartrateBox").style.visibility = "hidden";
            document.getElementById("vi").style.visibility = "hidden";
        }
        if (!this.settings.hideHeartRate && !display.aodActive && display.on && this.body.present) {
            document.getElementById("bpm").style.visibility = "visible";
            document.getElementById("bpm").text = this.hrm.heartRate;
        } else {
            document.getElementById("bpm").style.visibility = "hidden";
        }
      
        // Goals
        if (!this.settings.hideGoals && !display.aodActive && display.on) {
            document.getElementById("icons").style.visibility = "visible";
        }
        else
            document.getElementById("icons").style.visibility = "hidden";
      
        if (this.settings.hideGoals) {
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
        }
        else {
            document.getElementById("steps").style.visibility = "visible";
            document.getElementById("distance").style.visibility = "visible";
            document.getElementById("zone").style.visibility = "visible";
        }
    }      
}

export default Face;