import { useState, useEffect } from "react";
import Calculator from "../components/Calculator";
import Login from "../components/Login";

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (savedUser) setUser(savedUser);
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return <Calculator user={user} />;
}




