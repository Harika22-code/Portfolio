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
      document.getElementById("loading").classList.add("hidden");
      displayWeather(data);
      changeBackground(data.weather[0].main);
    })
    .catch(err => {
      document.getElementById("loading").classList.add("hidden");
      alert(err.message);
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

  document.getElementById("temperature").textContent = tempText;
}

/*function changeBackground(condition) {
  const body = document.body;
  body.className = ""; // Clear previous weather class
  const rainWrapper = document.querySelector(".rain-wrapper");
  if (rainWrapper) rainWrapper.remove(); // Remove old rain

  switch (condition) {
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      body.classList.add("rainy");
      createRain();
      break;
    case "Clear": body.classList.add("sunny"); break;
    case "Clouds": body.classList.add("cloudy"); break;
    case "Snow": body.classList.add("snowy"); break;
    case "Mist": body.classList.add("misty"); break;
    default: body.classList.add("default"); break;
  }
}*/
function changeBackground(condition) {
  // Remove any previous rain wrapper (in case it's already added)
  const existing = document.querySelector('.rain-wrapper');
  if (existing) existing.remove();

  // Always create rain now
  createRain();

  // Set background based on condition (optional)
  if (condition === "Rain" || condition === "Drizzle" || condition === "Thunderstorm") {
    document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1600573472558-6d08fc44c9e2")';
  } else {
    document.body.style.backgroundImage = 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb")';
  }
}


/*function createRain() {
  const rainContainer = document.createElement("div");
  rainContainer.className = "rain-wrapper";

  for (let i = 0; i < 100; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";
    drop.style.left = `${Math.random() * 100}vw`;
    drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    rainContainer.appendChild(drop);
  }

  /*document.body.appendChild(rainContainer);*/
 /* document.getElementById("weatherInfo").innerHTML = `...`; // ✅ Only updates info

}*/
function createRain() {
  const existing = document.querySelector('.rain-wrapper');
  if (existing) existing.remove();

  const rainContainer = document.createElement("div");
  rainContainer.className = "rain-wrapper";

  for (let i = 0; i < 120; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";
    drop.style.left = `${Math.random() * 100}vw`;
    drop.style.animationDuration = `${0.5 + Math.random()}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    rainContainer.appendChild(drop);
  }

  document.body.appendChild(rainContainer);
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

// Set date
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date").textContent = new Date().toDateString();
  createRain(); // Start rain immediately by default
});

// Theme toggle
document.getElementById("toggleThemeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Unit toggle
document.getElementById("toggleUnitBtn").addEventListener("click", () => {
  usingCelsius = !usingCelsius;
  updateTemperatureDisplay();
  document.getElementById("toggleUnitBtn").textContent = usingCelsius ? "🌡 Switch to °F" : "🌡 Switch to °C";
});

window.onload = () => {
  createRain(); // ⛈️ Always falling from the start
};


