const apiKey = "05249967b5334d347cf5f0282dcc2b8c";

const emojiMap = {
  Clear: '☼',
  Clouds: '☁',
  Rain: '☂',
  Snow: '✻',
  Thunderstorm: '⚡',
  Drizzle: '☔',
  Mist: '〰'
};

let currentTempCelsius = null;
let usingCelsius = true;

function fetchWeather(url) {
  document.getElementById("loading").classList.remove("hidden");

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Weather not found.");
      return res.json();
    })
    .then(data => {
      console.log("Weather data:", data);
      document.getElementById("loading").classList.add("hidden");
      displayWeather(data);
      changeBackground(data.weather[0].main);
    })
    .catch(err => {
      document.getElementById("loading").classList.add("hidden");
      alert(err.message);
      console.error("Error fetching weather:", err);
    });
}

function displayWeather(data) {
  const condition = data.weather[0].main;
  const icon = emojiMap[condition] || '🌈';

  currentTempCelsius = data.main.temp;

  document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("condition").textContent = `${icon} ${data.weather[0].description}`;
  updateTemperatureDisplay();
  document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `💨 Wind Speed: ${data.wind.speed} m/s`;

  document.getElementById("weatherDisplay").classList.remove("hidden");
}

function updateTemperatureDisplay() {
  if (currentTempCelsius === null) return;

  const tempText = usingCelsius
    ? `🌡 Temperature: ${currentTempCelsius.toFixed(1)} °C`
    : `🌡 Temperature: ${(currentTempCelsius * 9 / 5 + 32).toFixed(1)} °F`;

  const tempElement = document.getElementById("temperature");
  if (tempElement) {
    tempElement.textContent = tempText;
  }
}

function changeBackground(condition) {
  const body = document.body;
  body.className = "";

  if (condition === "Clear") body.classList.add("sunny");
  else if (condition === "Clouds") body.classList.add("cloudy");
  else if (condition === "Rain") body.classList.add("rainy");
  else if (condition === "Snow") body.classList.add("snowy");
  else if (condition === "Thunderstorm") body.classList.add("stormy");
  else if (condition === "Mist") body.classList.add("misty");
  else body.classList.add("default");
}

// Search by city
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
});

// Current location
document.getElementById("currentLocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    }, () => alert("Failed to get location."));
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Set date on page load
document.addEventListener("DOMContentLoaded", () => {
  const dateElement = document.getElementById("date");
  if (dateElement) {
    dateElement.textContent = new Date().toDateString();
  }
});

// Theme toggle logic
document.getElementById("toggleThemeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Unit toggle logic
document.getElementById("toggleUnitBtn").addEventListener("click", () => {
  usingCelsius = !usingCelsius;
  updateTemperatureDisplay();
  document.getElementById("toggleUnitBtn").textContent = usingCelsius ? "🌡 Switch to °F" : "🌡 Switch to °C";
});
