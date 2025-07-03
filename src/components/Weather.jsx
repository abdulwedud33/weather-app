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
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeatherData(data);
      setWeatherType(data.weather[0].main.toLowerCase());
      setError(null);
      setcityName("");
    } catch (error) {
      setError(error.message || "Something went wrong!");
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

  const getCurrentDate = () =>
    new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-[url('/weather-app/images/background.jpg')] bg-cover bg-center flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-black bg-opacity-60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl text-yellow-100 space-y-6 transition-all">
        <h1 className="text-3xl font-bold text-center text-purple-400 tracking-wide">
          Weather App
        </h1>

        <div className="flex gap-2">
          <input
            type="text"
            value={cityName}
            onChange={(e) => setcityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeatherData(cityName)}
            placeholder="Enter city"
            className="flex-1 px-4 py-2 rounded-lg bg-purple-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            onClick={() => getWeatherData(cityName)}
            className="bg-purple-800 px-4 py-2 rounded-lg hover:bg-purple-600 active:bg-purple-900 transition"
          >
            <i className="fas fa-search text-white text-lg" />
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-400 text-center font-medium">
            {error}
          </p>
        )}

        {weatherData && (
          <div className="text-center space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-200">
                {weatherData.name}, {weatherData.sys.country}
              </h2>
              <p className="text-sm text-slate-400">{getCurrentDate()}</p>
            </div>

            <div>
              <i
                className={`${getWeatherIcon(weatherType)} text-5xl text-slate-300`}
              ></i>
              <p className="capitalize text-lg font-medium text-slate-200 mt-1">
                {weatherData.weather[0].description}
              </p>
              <h2 className="text-3xl font-bold text-slate-100">
                {Math.round(weatherData.main.temp)}°C
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
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
  <div className="flex justify-between items-center bg-gradient-to-r from-purple-500 to-purple-700 bg-opacity-90 p-4 rounded-xl shadow-md">
    <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
      <i className={`${icon} text-lg`} />
      <span>{label}</span>
    </div>
    <p className="text-slate-900 font-bold text-base">{value}</p>
  </div>
);

export default Weather;
