/*let weather = {
  paris: {
    temp: 25,
    humidity: 20
  },
  seoul: {
    temp: 28.1,
    humidity: 14
  },
  cairo: {
    temp: 35,
    humidity: 4
  },
  dublin: {
    temp: 19.2,
    humidity: 67
  },
  london: {
    temp: 28,
    humidity: 49
  },
  reykjavik: {
    temp: 12.8,
    humidity: 71
  },
  barcelona: {
    temp: 31.4,
    humidity: 31
  },
  tokyo: {
    temp: 27,
    humidity: 23
  }
};*/

/*let city = prompt("Enter a city?");
city = city.toLowerCase();
if (weather[city] !== undefined) {
  let temperature = weather[city].temp;
  let humidity = weather[city].humidity;
  let celsiusTemperature = Math.round(temperature);
  let fahrenheitTemperature = Math.round((temperature * 9) / 5 + 32);

  alert(
    `It is currently ${celsiusTemperature}°C (${fahrenheitTemperature}°F) in ${city} with a humidity of ${humidity}%`
  );
} else {
  alert(
    `Sorry we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`
  );
}*/
//Feature #1
let now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let h3 = document.querySelector("h3");
h3.innerHTML = `${day} ${hours}:${minutes}`;

function displayWeatherCondition(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#weather").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;
}

function search(city) {
  let apiKey = "1c261165a83cd1aba6460cd11d191483";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  search(city);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

search("Odesa");

let celsiusTemperature = null;
let feelsLikeTemperature = null;

function showWeather(response) {
  let h1 = document.querySelector("h1");
  let temperature = Math.round(response.data.main.temp);
  h1.innerHTML = `It is currently ${temperature}°C in ${response.data.name}`;

  celsiusTemperature = response.data.main.temp;
  feelsLikeTemperature = response.data.main.feels_like;
}

function weatherByPosition(position) {
  let apiKey = "1c261165a83cd1aba6460cd11d191483";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showWeather);
}

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#weather");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayFeelsLikeFahrenheitTemp(event) {
  event.preventDefault();
  let feelsLikeFahrenheit = document.querySelector("#feels-like");
  feelsLikeFahrenheit.innerHTML = Math.round(
    (feelsLikeTemperature * 9) / 5 + 32
  );
}

function displayFeelsLikeCelsiusTemp(event) {
  event.preventDefault();
  let feelsLikeCelsius = document.querySelector("#feels-like");
  feelsLikeCelsius.innerHTML = Math.round(feelsLikeTemperature);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

let feelsLikeFahrenheitLink = document.querySelector(
  "#feels-like-fahrenheit-link"
);

feelsLikeFahrenheitLink.addEventListener(
  "click",
  displayFeelsLikeFahrenheitTemp
);

let feelsLikeCelsiusLink = document.querySelector("#feels-like-celsius-link");
feelsLikeCelsiusLink.addEventListener("click", displayFeelsLikeCelsiusTemp);

function filterForecastItemsByTime(forecastItems, timeStr) {
  return forecastItems.filter((item) => item.dt_txt.endsWith(timeStr));
}

function setForecast(day, forecastForDay) {
  let temperatureMin = Math.round(forecastForDay.temp.min);
  let temperatureMax = Math.round(forecastForDay.temp.max);
  let date = new Date(forecastForDay.dt * 1000);
  date.toDateString();
  let temperatureIconAndValue = `<img
          src="http://openweathermap.org/img/wn/${forecastForDay.weather[0].icon}@2x.png"
          alt=""
          width="100" class="weather-icon" id="forecast"/>${temperatureMin}°C ${temperatureMax}°C`;
  console.log(forecastForDay);
  document.querySelector(`#day${day} h5`).innerHTML = date.toDateString();
  document.querySelector(`#day${day} p`).innerHTML = temperatureIconAndValue;
}

function displayTemp(response) {
  let daily = response.data.daily;
  for (let i = 0; i < 5; i++) {
    setForecast(i + 1, daily[i]);
  }
  console.log("call and display temperature");
  console.log(response);
}

function dailyTemperature(coordinates) {
  let apiKey = "1c261165a83cd1aba6460cd11d191483";
  let lat = coordinates.coords.latitude;
  let lon = coordinates.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemp);
}

function showWeatherAndForeastByPosition(position) {
  weatherByPosition(position);
  dailyTemperature(position);
}

navigator.geolocation.getCurrentPosition(showWeatherAndForeastByPosition);
