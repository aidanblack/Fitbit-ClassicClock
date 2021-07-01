import document from "document";
import { battery } from "power";

class Battery {

    constructor() {}

    updateBattery() {
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
}

export default Battery;