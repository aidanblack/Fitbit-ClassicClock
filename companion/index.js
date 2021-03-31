/* This file per https://github.com/gregoiresage/fitbit-weather */
import * as weather from 'fitbit-weather/companion';

/* Api Key can be obtained from openweathermap.com */
weather.setup({ provider : weather.Providers.openweathermap, apiKey : '<API KEY>' });

