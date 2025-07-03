import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Weather = () => {
  const [cityName, setcityName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [weatherType, setWeatherType] = useState(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeatherData = async (cityName) => {
    if (!cityName) {
      setError("Please enter a city name.");
      setWeatherData(null);
      setWeatherType(null);
      return;
    }
    if (!API_KEY) {
      setError("API key is missing.");
      setWeatherData(null);
      setWeatherType(null);
      return;
    }
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
      setWeatherType(data.weather[0].main.toLowerCase());
      setError(null);
      setcityName("");
    } catch (error) {
      setError("Failed to fetch data.");
      setWeatherData(null);
      setWeatherType(null);
      setcityName("");
    }
  };

  const getWeatherIcon = (type) => {
    switch (type) {
      case "drizzle":
        return "fas fa-cloud-rain";
      case "rain":
        return "fas fa-cloud-showers-heavy";
      case "wind":
        return "fas fa-wind";
      case "snowflake":
      case "clear":
      case "snow":
        return "fas fa-snowflake";
      case "clouds":
        return "fas fa-cloud";
      case "haze":
      case "fog":
      case "mist":
        return "fas fa-smog";
      case "partly-cloudy":
        return "fas fa-cloud-sun";
      case "sunny":
        return "fas fa-sun";
      case "thunderstorm":
        return "fas fa-bolt";
      case "clear-night":
        return "fas fa-moon";
      default:
        return "fas fa-question";
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[url('/weather-app/images/background.jpg')] bg-cover bg-center px-4 py-8">
      <div className="max-w-md mx-auto bg-black bg-opacity-50 p-6 rounded-xl shadow-lg text-yellow-200">
        <h1 className="text-2xl sm:text-3xl text-center mb-6 text-purple-400 font-bold">
          Weather App
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={cityName}
            onChange={(e) => setcityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeatherData(cityName)}
            placeholder="Enter City Name"
            className="w-full p-2 rounded-lg bg-purple-800 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            onClick={() => getWeatherData(cityName)}
            className="bg-purple-800 p-2 rounded-lg hover:bg-purple-600 transition"
          >
            <i className="fas fa-search text-white" />
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {weatherData && (
          <div className="text-center mt-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-300">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-sm text-slate-400">{getCurrentDate()}</p>
            </div>

            <div>
              <i
                className={`${getWeatherIcon(weatherType)} text-5xl text-slate-300`}
              />
              <p className="capitalize text-lg font-medium text-slate-300 mt-2">
                {weatherData.weather[0].description}
              </p>
              <h2 className="text-2xl font-bold text-slate-300">
                {Math.round(weatherData.main.temp)}°C
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <WeatherStat
                label="Humidity"
                icon="fas fa-tint"
                value={`${weatherData.main.humidity}%`}
              />
              <WeatherStat
                label="Wind"
                icon="fas fa-wind"
                value={`${weatherData.wind.speed} km/h`}
              />
              <WeatherStat
                label="Pressure"
                icon="fas fa-tachometer-alt"
                value={`${weatherData.main.pressure} hPa`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WeatherStat = ({ label, icon, value }) => (
  <div className="flex flex-col items-center gap-1 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-opacity-60 p-3 rounded-lg shadow">
    <p className="text-sm font-semibold text-slate-900">{label}</p>
    <i className={`${icon} text-xl text-slate-900`} />
    <p className="text-sm font-bold text-slate-900">{value}</p>
  </div>
);

export default Weather;
