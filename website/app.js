// Personal API Key for OpenWeatherMap API
const apiKey = "067b54c4267bee3e1bbf10ec33458fde&units=imperial";

// Event listener for the "generate" button
document.getElementById("generate").addEventListener("click", performAction);

// Event listener callback function
function performAction() {
  const zipCode = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;

  if (!zipCode || !feelings) {
    alert("Please enter a zip code and your feelings");
    return;
  }

  getWeatherData(zipCode)
    .then((weatherData) => {
      if (weatherData.cod === "404") {
        alert("Invalid zip code");
        return;
      }
      const {
        main: { temp },
        weather,
      } = weatherData;
      const date = new Date().toLocaleDateString();
      const weatherIcon = weather.length > 0 ? weather[0].icon : "";
      return saveData("http://localhost:3000/data", {
        temperature: temp,
        date,
        feelings,
        weatherIcon,
      });
    })
    .then((response) => {
      if (response.success) {
        updateUI();
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(zipCode) {
  const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
}

// Function to save data to the server
async function saveData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Failed to save data");
  }
}

// Function to update the UI with the latest entry
async function updateUI() {
  try {
    const response = await fetch("http://localhost:3000/all");
    const data = await response.json();

    if (data) {
      document.getElementById("date").textContent = data.date;
      document.getElementById("temp").textContent = `${Math.round(
        data.temperature
      )}°F`;
      document.getElementById("content").textContent = data.feelings;
      document
        .getElementById("weather-icon")
        .setAttribute("src", getWeatherIconUrl(data.weatherIcon));
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function to get the URL for the weather icon image
function getWeatherIconUrl(icon) {
  return `https://openweathermap.org/img/w/${icon}.png`;
}

// Initial update of UI on page load
updateUI();
