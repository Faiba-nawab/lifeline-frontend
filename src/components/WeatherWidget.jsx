import React, { useState, useEffect, useRef } from "react";
import { FiSettings } from "react-icons/fi";

export default function WeatherWidget() {
  const [weather, setWeather] = useState({
    city: "Kochi",
    temperature: "",
    condition: "",
    isDay: true,
  });

  const [contacts, setContacts] = useState([
    { name: "", number: "" },
    { name: "", number: "" },
    { name: "", number: "" },
  ]);

  const [screen, setScreen] = useState("weather"); // "weather" or "settings"
  const lastTapRef = useRef(0);
  const longPressTimerRef = useRef(null);

  // Load saved contacts + weather
  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    const temp = isDay
      ? `${Math.floor(Math.random() * 6) + 28}°C`
      : `${Math.floor(Math.random() * 4) + 24}°C`;

    const dayConditions = ["Sunny ☀️", "Partly Cloudy 🌤", "Cloudy ☁️"];
    const nightConditions = ["Clear 🌙", "Cloudy ☁️", "Fog 🌫"];

    const condition = isDay
      ? dayConditions[Math.floor(Math.random() * dayConditions.length)]
      : nightConditions[Math.floor(Math.random() * nightConditions.length)];

    setWeather({
      city: "Kochi",
      temperature: temp,
      condition,
      isDay,
    });

    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("weatherContacts") || "[]");
      if (saved.length) setContacts(saved);
    }
  }, []);

  // SOS Trigger (double tap city or temp)
  const handleSOS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const sosContact = contacts[2];
      if (!sosContact?.number) {
        alert("No SOS contact saved!");
        return;
      }
      const whatsappUrl = `https://wa.me/${sosContact.number}?text=SOS!%20I%20need%20help.%20My%20location:%20https://maps.google.com/?q=${latitude},${longitude}`;
      window.open(whatsappUrl, "_blank");
    });
  };

  const handleCityOrTempClick = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300 && now - lastTapRef.current > 0) {
      handleSOS();
    }
    lastTapRef.current = now;
  };

  // Call Trigger (Long Press)
  const handleLongPressStart = (index) => {
    longPressTimerRef.current = setTimeout(() => {
      const contact = contacts[index];
      if (contact?.number) {
        window.location.href = `tel:${contact.number}`;
      } else {
        alert("No phone number saved!");
      }
    }, 800);
  };
  const handleLongPressEnd = () => {
    clearTimeout(longPressTimerRef.current);
  };

  // Save Settings
  const saveSettings = () => {
    localStorage.setItem("weatherContacts", JSON.stringify(contacts));
    alert("Settings saved!");
    setScreen("weather");
  };

  // Settings UI
  if (screen === "settings") {
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-xl px-2 p-10 text-center border border-gray-200">
        <h2 className="text-3xl text-purple-600 font- font-bold mb-6 flex items-center justify-center gap-2">⚙ Weather Settings</h2>
        {[0, 1, 2].map((i) => (
          <div key={i} className="mb-4 text-left">
            <label className="block text-black font-medium mb-1">
              {i === 0 && "📞 Contact 1 (Call)"}
              {i === 1 && "📞 Contact 2 (Call)"}
              {i === 2 && "📩 Contact 3 (SOS-double tap on temp)"}
            </label>
            <input
              type="text"
              placeholder="Name"
              value={contacts[i].name}
              onChange={(e) => {
                const updated = [...contacts];
                updated[i].name = e.target.value;
                setContacts(updated);
              }}
              className="w-full text-black border rounded p-2 mb-2"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={contacts[i].number}
              onChange={(e) => {
                const updated = [...contacts];
                updated[i].number = e.target.value;
                setContacts(updated);
              }}
              className="w-full text-black border rounded p-2"
            />
          </div>
        ))}

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={saveSettings}
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
          >
            💾 Save
          </button>
          <button
            onClick={() => setScreen("weather")}
            className="bg-red-400 text-white px-4 py-2 rounded-lg shadow hover:bg-red-500"
          >
            🔙 Back
          </button>
        </div>
      </div>
    );
  }

  // Weather UI
  return (
       <div className="flex items-center justify-center min-h-screen bg-gray-900 font-poppins">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-200 relative min-h-[420px] flex flex-col justify-between">
        {/* Settings Icon */}
        <FiSettings
          className="absolute top-3 right-3 text-gray-600 cursor-pointer hover:text-gray-900"
          size={22}
          onClick={() => setScreen("settings")}
        />

        <h2
          className="text-5xl px-5 py-8 font-semibold text-gray-700 tracking-wide cursor-pointer"
          onClick={handleCityOrTempClick}
        >
          {weather.city}
        </h2>

        <div
          className={`text-4xl font-bold text-white rounded-lg py-3 cursor-pointer ${
            weather.isDay
              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
              : "bg-gradient-to-r from-blue-800 to-indigo-900"
          }`}
          onClick={handleCityOrTempClick}
        >
          {weather.temperature}
        </div>

        <p className="text-gray-500 text-xl">{weather.condition}</p>

        {/* Buttons for Call */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onMouseDown={() => handleLongPressStart(0)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={() => handleLongPressStart(0)}
            onTouchEnd={handleLongPressEnd}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            🌦 Forecast +
          </button>

          <button
            onMouseDown={() => handleLongPressStart(1)}
            onMouseUp={handleLongPressEnd}
            onMouseLeave={handleLongPressEnd}
            onTouchStart={() => handleLongPressStart(1)}
            onTouchEnd={handleLongPressEnd}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            🌍 Nearby Weather
          </button>
        </div>
      </div>
    </div>
  );
}
