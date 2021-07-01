import document from "document";
import { me } from "appbit";
import { today } from "user-activity";
import { goals } from "user-activity";

class Goals {
    settings;
    stepPercent = 0;
    distancePercent = 0;
    zonePercent = 0;
    
    constructor(settings) {
        this.settings = settings;
    }

    updateGoals() {
        if (me.permissions.granted("access_activity")) {
          var stepCount = today.adjusted.steps;
          var stepGoal = goals.steps;
          this.stepPercent = stepCount / stepGoal * 100;
      
          var distanceCount = today.adjusted.distance;
          var distanceGoal = goals.distance;
          this.distancePercent = distanceCount / distanceGoal * 100;
      
          var zoneCount = today.adjusted.activeZoneMinutes.total;
          var zoneGoal = goals.activeZoneMinutes.total;
          this.zonePercent = zoneCount / zoneGoal * 100;
        }
      
        if (!this.settings.hideGoals) {
          document.getElementById("steps").style.fill = "#EFC12B";
          if (this.stepPercent >= 20) document.getElementById("steps1").style.opacity = 1;
          else document.getElementById("steps1").style.opacity = 0.5;
          if (this.stepPercent >= 40) document.getElementById("steps2").style.opacity = 1;
          else document.getElementById("steps2").style.opacity = 0.5;
          if (this.stepPercent >= 60) document.getElementById("steps3").style.opacity = 1;
          else document.getElementById("steps3").style.opacity = 0.5;
          if (this.stepPercent >= 80) document.getElementById("steps4").style.opacity = 1;
          else document.getElementById("steps4").style.opacity = 0.5;
      
          document.getElementById("distance").style.fill = "#376EEF";
          if (this.distancePercent >= 20) document.getElementById("distance1").style.opacity = 1;
          else document.getElementById("distance1").style.opacity = 0.5;
          if (this.distancePercent >= 40) document.getElementById("distance2").style.opacity = 1;
          else document.getElementById("distance2").style.opacity = 0.5;
          if (this.distancePercent >= 60) document.getElementById("distance3").style.opacity = 1;
          else document.getElementById("distance3").style.opacity = 0.5;
          if (this.distancePercent >= 80) document.getElementById("distance4").style.opacity = 1;
          else document.getElementById("distance4").style.opacity = 0.5;
      
          document.getElementById("zone").style.fill = "#EA7D1E";
          if (this.zonePercent >= 20) document.getElementById("zone1").style.opacity = 1;
          else document.getElementById("zone1").style.opacity = 0.5;
          if (this.zonePercent >= 40) document.getElementById("zone2").style.opacity = 1;
          else document.getElementById("zone2").style.opacity = 0.5;
          if (this.zonePercent >= 60) document.getElementById("zone3").style.opacity = 1;
          else document.getElementById("zone3").style.opacity = 0.5;
          if (this.zonePercent >= 80) document.getElementById("zone4").style.opacity = 1;
          else document.getElementById("zone4").style.opacity = 0.5;
        }
        console.log("Goals Updated");
    }
}

export default Goals;