import clock from "clock";

class Clock {
    updateDisplay = function() {};
    updateBattery = function() {};
    updateGoals = function() {};
    updateWeather = function() {};

    constructor(dateBox, hourHand, minuteHand, secondsHand) {
        try {
            this.dateBox = dateBox;
            this.hourHand = hourHand;
            this.minuteHand = minuteHand;
            this.secondsHand = secondsHand;

            clock.granularity = "seconds";
        }
        catch (err) {
            console.log(err);
        }
    }

    updateTime(now) {
        let hours = now.getHours();
        hours = hours % 12 || 12;
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        this.hourHand.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
        this.minuteHand.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
        this.secondsHand.groupTransform.rotate.angle = seconds * 6;

        if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) this.updateGoals();
        if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) this.updateBattery();
        if((clock.granularity === "minutes" || (seconds === 0)) && (minutes + 10) % 10 === 0) this.updateWeather();

        this.updateDisplay();
    }

    updateDate(date) {
        let dateText = date.toLocaleString('default', { month: 'short' }).substring(4, 10);
        this.dateBox.text = dateText;
    }

    // ***** Add event handler *****
    startClock() {
        clock.ontick = (evt) => {
            let now = evt.date;
            this.updateDate(now);
            this.updateTime(now);
        }
    }
}

export default Clock;
