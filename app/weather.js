import * as weather from 'fitbit-weather/app';

class Weather {
    tempUnit = "0";
    timestamp = 0;

    constructor(temp, icon) {
        this.temp = temp;
        this.icon = icon;
    }

    processWeather(weather) {
        if (this.tempUnit == "1")
            this.temp.text = `${Math.round(weather.temperatureF)}°`;
        else
            this.temp.text = `${Math.round(weather.temperatureC)}°`;
        var weatherIcon = this.icon;
        var weatherCode = weather.conditionCode;
        var dayNight;
        if (weather.timestamp > weather.sunrise && weather.timestamp < weather.sunset) dayNight = "d";
        else dayNight = "n";
        weatherIcon.href = `weather/${weatherCode}${dayNight}.png`;
        this.timestamp = weather.timestamp;

        console.log("Weather Updated");
    }

    updateWeather() {
        weather.fetch(30 * 60 * 1000) // return the cached value if it is less than 30 minutes old 
        .then(weather => this.processWeather(weather))
        .catch(error => console.log(JSON.stringify(error)));
    }
}
  
export default Weather;
