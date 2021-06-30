import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me as companion } from "companion";
import * as weather from 'fitbit-weather/companion';
import * as weatherKey from './weather';

/* Api Key can be obtained from openweathermap.com */
weather.setup({ provider: weather.Providers.openweathermap, apiKey: weatherKey.apiKey });

// Settings have been changed
settingsStorage.addEventListener("change", (evt) => {
    sendValue(evt.key, evt.newValue);
});

// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
    // Send the value of the setting
    sendValue("tempUnit", settingsStorage.getItem("tempUnit"));
    sendValue("hideDate", settingsStorage.getItem("hideDate"));
    sendValue("hideWeather", settingsStorage.getItem("hideWeather"));
    sendValue("hideHeartRate", settingsStorage.getItem("hideHeartRate"));
    sendValue("hideGoals", settingsStorage.getItem("hideGoals"));
}

function sendValue(key, val) {
    //console.log(`${key} : ${val}`); // Good for debugging
    if (val) {
        sendSettingData({
            key: key,
            value: JSON.parse(val)
        });
    }
}
function sendSettingData(data) {
    // If we have a MessageSocket, send the data to the device
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
        //console.log(data); // Good for debugging
    } else {
        console.log("No peerSocket connection");
    }
}