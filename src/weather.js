import { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const API_KEY = "a79dc953ae86eb1bf95bd6bb678e20af"; 

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }
    setError(""); 
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
    } catch (error) {
      setWeather(null);
      setError("City not found. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 text-white p-6">
      <h1 className="text-5xl font-extrabold mb-6 text-center">
        Weather App 🌍
      </h1>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Enter city name"
          className="px-5 py-3 text-black rounded-lg w-72 text-lg border-none focus:outline-none shadow-lg"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={fetchWeather}
          className="px-6 py-3 bg-purple-600 rounded-lg text-lg font-bold shadow-lg hover:bg-purple-500 transition-all duration-300"
        >
          Search 🔍
        </button>
      </div>

      {error && <p className="text-red-400 mt-4 text-xl">{error}</p>}

      {weather && (
        <div className="mt-8 p-8 bg-white/20 backdrop-blur-lg rounded-xl shadow-2xl max-w-lg text-center">
          <h2 className="text-4xl font-bold">{weather.name}, {weather.sys.country}</h2>
          <p className="text-lg mt-2 capitalize">{weather.weather[0].description} 🌤️</p>

          <div className="mt-6 text-2xl font-semibold">
            🌡️ {weather.main.temp}°C (Feels like {weather.main.feels_like}°C)
          </div>

          <div className="grid grid-cols-2 gap-4 text-lg mt-6">
            <div className="bg-white/10 p-4 rounded-lg shadow-md">
              💨 Wind: {weather.wind.speed} m/s
            </div>
            <div className="bg-white/10 p-4 rounded-lg shadow-md">
              🌪️ Pressure: {weather.main.pressure} hPa
            </div>
            <div className="bg-white/10 p-4 rounded-lg shadow-md">
              💧 Humidity: {weather.main.humidity}%
            </div>
            <div className="bg-white/10 p-4 rounded-lg shadow-md">
              🌅 Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
            </div>
            <div className="bg-white/10 p-4 rounded-lg shadow-md">
              🌇 Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
