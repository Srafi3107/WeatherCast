import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sunrise, 
  Sunset, 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  MapPin,
  Calendar,
  Gauge
} from "lucide-react";
import { format } from "date-fns";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bgGradient, setBgGradient] = useState("from-slate-900 to-slate-800");

  const API_KEY = "a79dc953ae86eb1bf95bd6bb678e20af"; 

  const fetchWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }
    setError(""); 
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeather(response.data);
      updateBackground(response.data.weather[0].main);
    } catch (error) {
      setWeather(null);
      setError("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateBackground = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        setBgGradient("from-orange-400 to-rose-400");
        break;
      case 'clouds':
        setBgGradient("from-blue-400 to-indigo-500");
        break;
      case 'rain':
      case 'drizzle':
        setBgGradient("from-slate-700 to-slate-900");
        break;
      case 'snow':
        setBgGradient("from-blue-100 to-blue-300 text-slate-800");
        break;
      case 'thunderstorm':
        setBgGradient("from-purple-900 to-slate-900");
        break;
      default:
        setBgGradient("from-blue-600 to-indigo-900");
    }
  };

  const getWeatherIcon = (condition) => {
    const size = 64;
    const color = "currentColor";
    switch (condition.toLowerCase()) {
      case 'clear': return <Sun size={size} color={color} className="text-yellow-400" />;
      case 'clouds': return <Cloud size={size} color={color} className="text-gray-300" />;
      case 'rain': return <CloudRain size={size} color={color} className="text-blue-400" />;
      case 'snow': return <CloudSnow size={size} color={color} className="text-blue-200" />;
      case 'thunderstorm': return <CloudLightning size={size} color={color} className="text-purple-400" />;
      default: return <Cloud size={size} color={color} className="text-gray-400" />;
    }
  };

  return (
    <div className={`weather-bg bg-gradient-to-br ${bgGradient} text-white`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-6xl font-black mb-2 tracking-tighter"
          >
            WeatherCast
          </motion.h1>
          <p className="text-white/60 text-lg font-medium">Real-time weather insights</p>
        </div>

        <div className="relative flex items-center mb-12">
          <input
            type="text"
            placeholder="Search city..."
            className="glass-input w-full px-6 py-5 rounded-2xl text-xl font-medium placeholder-white/40 focus:outline-none pr-16"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button
            onClick={fetchWeather}
            className="absolute right-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Search size={24} />
              </motion.div>
            ) : (
              <Search size={24} />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 px-6 py-4 rounded-xl text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          {weather && (
            <motion.div
              key={weather.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="glass-card rounded-3xl p-10 overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-white/70">
                    <MapPin size={18} />
                    <span className="text-lg font-semibold uppercase tracking-widest">{weather.name}, {weather.sys.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 mb-6">
                    <Calendar size={18} />
                    <span>{format(new Date(), 'EEEE, dd MMMM')}</span>
                  </div>
                  <div className="text-8xl font-black tracking-tighter mb-2">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <p className="text-2xl font-medium capitalize text-white/80">{weather.weather[0].description}</p>
                </div>
                
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="bg-white/5 p-8 rounded-full"
                >
                  {getWeatherIcon(weather.weather[0].main)}
                </motion.div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
                <StatCard icon={<Wind size={20} />} label="Wind" value={`${weather.wind.speed} m/s`} />
                <StatCard icon={<Droplets size={20} />} label="Humidity" value={`${weather.main.humidity}%`} />
                <StatCard icon={<Gauge size={20} />} label="Pressure" value={`${weather.main.pressure} hPa`} />
                <StatCard icon={<Thermometer size={20} />} label="Feels Like" value={`${Math.round(weather.main.feels_like)}°`} />
                <StatCard icon={<Sunrise size={20} />} label="Sunrise" value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <StatCard icon={<Sunset size={20} />} label="Sunset" value={new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300">
    <div className="text-white/40 mb-3">{icon}</div>
    <div className="text-sm font-medium text-white/50 uppercase tracking-wider mb-1">{label}</div>
    <div className="text-lg font-bold">{value}</div>
  </div>
);

export default Weather;

