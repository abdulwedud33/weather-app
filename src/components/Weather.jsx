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
      setError(
        "API key is missing. Please set the VITE_WEATHER_API_KEY environment variable."
      );
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
      setError(
        error.response?.data?.message || "process Failed, somethong wrong !"
      );
      setWeatherData(null);
      setWeatherType(null);
      setcityName("");
    }
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case "drizzle":
        return "fas fa-cloud-rain";
      case "rain":
        return "fas fa-cloud-showers-heavy";
      case "wind":
        return "fas fa-wind";
      case "snowflake":
        return "fas fa-snowflake";
      case "clear":
        return "fas fa-snowflake";
      case "clouds":
        return "fas fa-cloud";
      case "haze":
        return "fas fa-smog";
      case "partly-cloudy":
        return "fas fa-cloud-sun";
      case "mist":
        return "fas fa-smog";
      case "sunny":
        return "fas fa-sun";
      case "cloudy":
        return "fas fa-cloud";
      case "snow":
        return "fas fa-snowflake";
      case "thunderstorm":
        return "fas fa-bolt";
      case "fog":
        return "fas fa-smog";
      case "clear-night":
        return "fas fa-moon";
      default:
        return "fas fa-question";
    }
  };
  const getCurrentDate = () => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-custom-bg bg-cover bg-center h-screen w-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl mb-4 text-purple-400">Weather App</h1>
        <div className="bg-black text-yellow-200 bg-opacity-50 flex flex-col justify-center items-center p-4 max-w-96 overflow-hidden rounded-lg shadow-lg">
          <div className="flex items-center justify-between w-full">
            <input
              type="text"
              value={cityName}
              onChange={(e) => setcityName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getWeatherData(cityName);
                }
              }}
              placeholder="Enter City Name"
              className="focus:outline-none focus:ring-0 w-full mr-3 p-2 rounded-lg bg-purple-800 text-gray-300 capitalize font-semibold"
            />
            <button
              onClick={async () => await getWeatherData(cityName)}
              className="bg-purple-800 p-2 rounded-lg hover:bg-purple-500 active:bg-purple-900 transition-all cursor-pointer"
            >
              <i className="fas fa-search text-white font-bold"></i>
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {weatherData && (
            <div className="flex flex-col items-center mt-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <h2 className="text-2xl font-bold mb-2 text-slate-400">
                    {weatherData.name}
                    <span>,</span>
                  </h2>
                  <p className="text-lg font-semibold mb-2 text-slate-400">
                    {weatherData.sys.country}
                  </p>
                </div>
                <p className="text-lg font-bold mb-6 text-slate-400">
                  {getCurrentDate()}
                </p>
              </div>
              <i
                className={`${getWeatherIcon(
                  weatherType
                )} text-6xl text-slate-400`}
              ></i>
              <p className="text-xl font-bold mb-4 text-slate-400">
                {weatherData.weather[0].description}
              </p>
              <h2 className="text-xl font-bold text-slate-400">
                {Math.round(weatherData.main.temp)}°C
              </h2>
              <div className="grid grid-cols-3 gap-2 p-3 items-center justify-center mt-4 w-full">
                <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-opacity-50 p-2 rounded-lg shadow-lg">
                  <p className="text-center text-lg  font-bold text-slate-900">
                    Humidity
                  </p>
                  <i className="fas fa-tint text-2xl text-slate-900"></i>
                  <p className="text-center text-lg  font-bold text-slate-900">
                    {weatherData.main.humidity}%
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-opacity-50 p-2 rounded-lg shadow-lg">
                  <p className="text-center text-lg  font-bold text-slate-900">
                    Wind
                  </p>
                  <i className="fas fa-wind text-2xl text-slate-900"></i>
                  <p className="text-center text-lg  font-bold text-slate-900">
                    {weatherData.wind.speed}km/h
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 bg-opacity-50 p-2 rounded-lg shadow-lg">
                  <p className="text-center text-lg  font-bold text-slate-900">
                    Pressure
                  </p>
                  <i className="fas fa-tachometer-alt text-2xl text-slate-900"></i>
                  <p className="text-center text-lg  font-bold text-slate-900">
                    {weatherData.main.pressure}hPa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;

/*


*/
