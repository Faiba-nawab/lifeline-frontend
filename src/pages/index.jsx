import { useState, useEffect } from "react";
import Calculator from "../components/Calculator";
import Login from "../components/Login";
import Notepad from "./notepad";

export default function Home() {
  const [user, setUser] = useState("");
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) {
      setUser(savedUser);

      const count = parseInt(localStorage.getItem("launchCount") || "0");
      if (count === 0) {
        localStorage.setItem("launchCount", "1");
        setScreen("calculator");
      } else {
        setScreen("notepad");
      }
    }
  }, []);

  if (!user) return <Login setUser={setUser} />;

  if (!screen) return null; // Still deciding

  return screen === "calculator" ? <Calculator user={user} /> : <Notepad/>;
}
