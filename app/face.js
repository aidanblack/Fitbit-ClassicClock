import { display } from "display";
import document from "document";
import { boolean } from "fp-ts";

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
        // Which clock face is active?
        var roman = true;
        if(this.settings.arabicNumerals) {
            document.getElementById("numbers").style.visibility = "visible";
            document.getElementById("numerals").style.visibility = "hidden";
            roman = false;
        }
        else {
            document.getElementById("numbers").style.visibility = "hidden";
            document.getElementById("numerals").style.visibility = "visible";
        }

        // Is AOD inactive and the display is on?
        if (!display.aodActive && display.on) {
            document.getElementsByClassName("tertiary").forEach((item, index) => {
                item.style.visibility = "visible";
            });
            if(roman) document.getElementById("numerals").style.visibility = "visible";
            else document.getElementById("numbers").style.visibility = "visible";
            document.getElementById("seconds").style.visibility = "visible";
            document.getElementById("steps").style.visibility = "visible";
            document.getElementById("distance").style.visibility = "visible";
            document.getElementById("zone").style.visibility = "visible";
        }
        else {
            document.getElementsByClassName("tertiary").forEach((item, index) => {
                item.style.visibility = "hidden";
            });
            document.getElementById("numerals").style.visibility = "hidden";
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
            document.getElementById("3").style.visibility = "hidden";
        }
        else if (this.settings.hideDate && !display.aodActive && display.on) {
            this.dateBox.style.visibility = "hidden";
            document.getElementById("iii").style.visibility = "inherit";
            document.getElementById("3").style.visibility = "inherit";
        }
        else {
            this.dateBox.style.visibility = "hidden";
            document.getElementById("iii").style.visibility = "hidden";
            document.getElementById("3").style.visibility = "hidden";
        }
      
        // Weather
        if (!this.settings.hideWeather && !display.aodActive && display.on) {
            document.getElementById("weatherBox").style.visibility = "visible";
            document.getElementById("ix").style.visibility = "hidden";
            document.getElementById("9").style.visibility = "hidden";
        }
        else if (this.settings.hideWeather && !display.aodActive && display.on) {
            document.getElementById("weatherBox").style.visibility = "hidden";
            if(roman) document.getElementById("ix").style.visibility = "inherit";
            else document.getElementById("9").style.visibility = "inherit";
        }
        else {
            document.getElementById("weatherBox").style.visibility = "hidden";
            document.getElementById("ix").style.visibility = "hidden";
            document.getElementById("9").style.visibility = "hidden";
        }
      
        // Heart Rate
        if (!this.settings.hideHeartRate && !display.aodActive && display.on) {
            document.getElementById("heartrateBox").style.visibility = "visible";
            document.getElementById("vi").style.visibility = "hidden";
            document.getElementById("6").style.visibility = "hidden";
        }
        else if (this.settings.hideHeartRate && !display.aodActive && display.on) {
            document.getElementById("heartrateBox").style.visibility = "hidden";
            if(roman) document.getElementById("vi").style.visibility = "inherit";
            else document.getElementById("6").style.visibility = "inherit";
        }
        else {
            document.getElementById("heartrateBox").style.visibility = "hidden";
            document.getElementById("vi").style.visibility = "hidden";
            document.getElementById("6").style.visibility = "hidden";
        }
        if (!this.settings.hideHeartRate && !display.aodActive && display.on && this.body.present) {
            document.getElementById("bpm").style.visibility = "visible";
            document.getElementById("bpm").text = this.hrm.heartRate ?? "--";
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