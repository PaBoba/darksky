const apiKey = "bc792ff35f997724cc2c696badaf00f1";

const cityInput = document.getElementById("cityInput");
const cityList = document.getElementById("cityList");
const cityName = document.getElementById("cityName");
const currentWeatherContainer = document.getElementById("currentWeather");
const forecast = document.getElementById("forecastContainer");
const searchButton = document.getElementById("searchButton");
const weatherInfo = document.getElementById("weatherInfo");

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  console.log(cityName);
  if (cityName) {
    getCoor(cityName);
  }
});

function getCoor(cityName, save = true) {
  const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    cityName
  )}&limit=1&appid=${apiKey}`;

  fetch(geocodeUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        getWeatherData(lat, lon, cityName);
        if (save) {
          saveCity(cityName);
        }
      } else {
        alert("City not found. Please try a different name.");
      }
    })
    .catch((error) => alert(error.message));
}

function getWeatherData(lat, lon, cityName) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      displayWeather(data, cityName);

      displayForecast(data);
    })
    .catch((error) => alert("Error fetching weather data: " + error.message));
}

function displayWeather(weatherData, cityName) {
  currentWeatherContainer.innerHTML = ""; // Clear existing content

  const currentWeather = weatherData.list[0];

  // Create and append the header with the city name and date
  const header = document.createElement("h2");
  header.textContent = `${cityName} (${new Date(
    currentWeatherContainer.dt * 1000
  ).toLocaleDateString()})`;

  const icon = document.createElement("img");
  icon.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
  icon.alt = "Weather icon";

  const temperatureP = document.createElement("p");
  temperatureP.textContent = `Temperature: ${currentWeather.main.temp}°F`;
  currentWeatherContainer.appendChild(temperatureP);

  const windP = document.createElement("p");
  windP.textContent = `Wind: ${currentWeather.wind.speed} mph`;
  currentWeatherContainer.appendChild(windP);

  const humidityP = document.createElement("p");
  humidityP.textContent = `Humidity: ${currentWeather.main.humidity}%`;
  currentWeatherContainer.appendChild(humidityP);
}

function displayForecast(weatherData) {
  forecast.innerHTML = ""; // Clear existing content

  weatherData.list.forEach((forecast, index) => {
    if (index % 8 === 0) {
      const forecastCard = document.createElement("div");
      forecastCard.className = "forecastCard";

      const dateH3 = document.createElement("h3");
      dateH3.textContent = new Date(forecast.dt * 1000).toLocaleDateString();

      const tempP = document.createElement("p");
      tempP.textContent = `Temp: ${forecast.main.temp}°F`;

      const windP = document.createElement("p");
      windP.textContent = `Wind: ${forecast.wind.speed} mph`;

      const humidityP = document.createElement("p");
      humidityP.textContent = `Humidity: ${forecast.main.humidity}%`;

      forecastCard.appendChild(dateH3);
      forecastCard.appendChild(tempP);
      forecastCard.appendChild(windP);
      forecastCard.appendChild(humidityP);

      // forecast.appendChild(forecastCard); // Append the forecast card to the forecast div
    }
  });
}

function saveCity(cityName) {
  let cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (!cities.includes(cityName)) {
    cities.unshift(cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
    addCity(cityName);
  }
}

function addCity(cityName) {
  const cityButton = document.createElement("button");
  cityButton.textContent = cityName;
  cityButton.className = "city-button";
  cityButton.addEventListener("click", () => getCoor(cityName));
  cityList.insertBefore(cityButton, cityList.firstChild); // Add to the top of the list
}

function loadSearchHistory() {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.forEach((city) => addCity(city));
}

function populateCurrentWeather() {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  if (cities.length > 0) {
    const prevCitySearch = cities[0];
    getCoor(prevCitySearch);
  } else {
    randomCity();
  }
}

function randomCity() {
  const randomCities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];
  const randomCity =
    randomCities[Math.floor(Math.random() * randomCities.length)];
  getCoor(randomCity, false);
}

loadSearchHistory();
populateCurrentWeather();
