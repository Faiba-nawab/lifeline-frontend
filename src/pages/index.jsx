import { useState, useEffect } from "react";
import Calculator from "../components/Calculator";
import Login from "../components/Login";
import Notepad from "./notepad";
import WeatherWidget from "../components/WeatherWidget";
import Clock from "../components/clock";
import Gallery from "../components/Gallery";

export default function Home() {
  const [user, setUser] = useState("");
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUser(savedUser);

      let count = parseInt(localStorage.getItem("launchCount") || "0");
       const screens = ["calculator", "notepad", "weather" , "clock" , "gallery"];
      const nextScreen = screens[count % screens.length];

      setScreen(nextScreen);
      localStorage.setItem("launchCount", (count + 1).toString());
    }
  }, []);

  if (!user) return <Login setUser={setUser} />;

  if (!screen) return null; // Still deciding

      if (screen === "calculator") return <Calculator user={user} />;
      if (screen === "notepad") return <Notepad />;
      if (screen === "weather") return <WeatherWidget />;
      if (screen === "clock") return <Clock />;
      if (screen === "gallery") return <Gallery />;

    return null;
}
