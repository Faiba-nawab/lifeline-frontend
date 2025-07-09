// ... all your existing imports
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCog, FaHeartbeat, FaExclamationTriangle } from "react-icons/fa";

export default function Calculator() {
  const [display, setDisplay] = useState("");
  const [theme, setTheme] = useState("gradient-purple");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultPIN, setVaultPIN] = useState("");
  const [enteredPIN, setEnteredPIN] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [sosContact, setSosContact] = useState("");
  const [sosNumber, setSosNumber] = useState("");
  const [nicknames, setNicknames] = useState({});
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    const savedPIN = localStorage.getItem("vaultPIN") || "1234";
    setVaultPIN(savedPIN);

    const savedNicknames = localStorage.getItem("nicknames");
    const savedContacts = localStorage.getItem("contacts");
    const savedSos = localStorage.getItem("sosContact");
    const savedSosNumber = localStorage.getItem("sosNumber");

    if (savedNicknames) setNicknames(JSON.parse(savedNicknames));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedSos) setSosContact(savedSos);
    if (savedSosNumber) setSosNumber(savedSosNumber);

    document.body.className = theme;
  }, [theme]);

  const handleClick = (value) => {
    if (value === "AC") return setDisplay("");
    if (value === "=") return calculate();
    if (value === "SOS") return sendSOS();
    setDisplay(display + value);
    handleSecret(display + value);
  };

  const calculate = () => {
    try {
      setDisplay(eval(display).toString());
    } catch {
      setDisplay("Err");
    }
  };

  const handleSecret = (currentInput) => {
    if (nicknames[currentInput]) {
      alert(`Calling ${nicknames[currentInput]}...`);
      triggerRealCall(nicknames[currentInput]);
      setDisplay("");
    }
  };

  const triggerRealCall = (nickname) => {
    const phoneNumber = contacts[nickname] || sosNumber;
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      alert(`No phone number found for ${nickname}.`);
    }
  };

  const sendSOS = () => {
    if (!sosContact || !sosNumber) {
      alert("No SOS contact selected. Please set one in Settings.");
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`📍 SOS Sent to ${sosContact}!\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);

          // Send to backend
          fetch("https://lifeline-backend-fr78.onrender.com/api/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: localStorage.getItem("username") || "test_user",
              alertType: "sos",
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            }),
          })
            .then((res) => res.json())
            .then((data) => console.log("Backend Response:", data))
            .catch((err) => console.error("Backend Error:", err));

          setTimeout(() => {
            alert("⚠️ No response from receiver. Calling now...");
            triggerRealCall(sosContact);
          }, 60000);
        },
        () => {
          alert("Failed to get location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation not supported on this device.");
    }
  };

  const fetchUserAlerts = async () => {
    const username = localStorage.getItem("username");
    if (!username) return alert("User not found.");

    try {
      const res = await fetch(`http://lifeline-backend-fr78.onrender.com/api/alerts/${username}`);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        return alert("No SOS alerts found.");
      }

      const formatted = data.map((alert, index) => {
        return `${index + 1}. Type: ${alert.alertType}, Time: ${alert.timestamp || alert.createdAt || "unknown"}, Location: (${alert.location?.lat}, ${alert.location?.lng})`;
      }).join("\n\n");

      alert("📜 SOS History:\n\n" + formatted);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      alert("Failed to fetch SOS history.");
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.body.className = newTheme;
  };

  const addNickname = (code, nickname, contact) => {
    const updatedNicknames = { ...nicknames, [code]: nickname };
    const updatedContacts = { ...contacts, [nickname]: contact };

    setNicknames(updatedNicknames);
    setContacts(updatedContacts);

    localStorage.setItem("nicknames", JSON.stringify(updatedNicknames));
    localStorage.setItem("contacts", JSON.stringify(updatedContacts));
  };

  const checkPIN = () => {
    if (enteredPIN === vaultPIN) {
      setIsUnlocked(true);
    } else {
      alert("Incorrect PIN");
    }
  };

  const changePIN = () => {
    const newPIN = prompt("Enter new PIN:");
    if (newPIN && newPIN.length >= 4) {
      setVaultPIN(newPIN);
      localStorage.setItem("vaultPIN", newPIN);
      alert("PIN updated successfully.");
    } else {
      alert("PIN must be at least 4 characters.");
    }
  };

  const updateSosContact = (contact) => {
    setSosContact(contact);
    localStorage.setItem("sosContact", contact);
  };

  const updateSosNumber = (number) => {
    setSosNumber(number);
    localStorage.setItem("sosNumber", number);
  };

  if (showSettingsPage) {
    const username = localStorage.getItem("username") || "Unknown User";
    const email = localStorage.getItem("email") || "Not Provided";

    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme} p-4 animate-fade-in`}>
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <FaCog /> Settings
        </h1>

        <div className="w-full bg-white rounded-xl shadow-md p-4 mb-4 text-center">
          <p className="font-semibold">Logged in as:</p>
          <p className="mb-1">{username}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        <label className="block mb-1 font-semibold">Theme</label>
        <select onChange={(e) => changeTheme(e.target.value)} className="p-2 border rounded w-full mb-4">
          <option value="gradient-purple">Gradient Purple-Pink</option>
          <option value="gradient-3d">3D Gradient</option>
          <option value="gradient-classic">Classic</option>
        </select>

        <label className="block mb-1 font-semibold">SOS Contact Name</label>
        <input value={sosContact} onChange={(e) => updateSosContact(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="Enter SOS Contact Name" />

        <label className="block mb-1 font-semibold">SOS Contact Number</label>
        <input value={sosNumber} onChange={(e) => updateSosNumber(e.target.value)} className="border p-2 rounded w-full mb-4" placeholder="Enter SOS Phone Number" />

        <button onClick={() => { setVaultOpen(true); setIsUnlocked(false); }} className="w-full bg-pink-500 text-white p-2 rounded mb-4 hover:scale-105">
          🔐 Vault Settings
        </button>

        {vaultOpen && !isUnlocked && (
          <div className="mt-2 p-4 bg-white rounded-xl shadow-xl w-full">
            <h2 className="text-lg font-bold mb-2">Enter Vault PIN</h2>
            <input type="password" value={enteredPIN} onChange={(e) => setEnteredPIN(e.target.value)} className="border p-2 rounded w-full mb-2" placeholder="Enter PIN" />
            <button onClick={checkPIN} className="w-full bg-blue-500 text-white rounded p-2 mb-2">Unlock</button>
          </div>
        )}

        {vaultOpen && isUnlocked && (
          <div className="mt-2 p-4 bg-white rounded-xl shadow-xl w-full">
            <h2 className="text-lg font-bold mb-2">Vault Shortcuts</h2>
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="mb-2">
                <input placeholder={`Code ${index + 1}`} id={`code${index}`} className="border p-2 rounded w-full mb-1" />
                <input placeholder={`Nickname ${index + 1}`} id={`nickname${index}`} className="border p-2 rounded w-full mb-1" />
                <input placeholder={`Contact Number ${index + 1}`} id={`contact${index}`} className="border p-2 rounded w-full mb-2" />
                <button onClick={() => {
                  const code = document.getElementById(`code${index}`).value;
                  const nickname = document.getElementById(`nickname${index}`).value;
                  const contact = document.getElementById(`contact${index}`).value;
                  if (code && nickname && contact) addNickname(code, nickname, contact);
                }} className="w-full bg-green-500 text-white rounded p-2 mb-2">Save</button>
              </div>
            ))}
            <button onClick={changePIN} className="w-full bg-red-400 text-white rounded p-2">Change Vault PIN</button>
          </div>
        )}

        <button onClick={fetchUserAlerts} className="mt-4 bg-yellow-500 text-white p-2 rounded hover:scale-105">
          📜 View SOS History
        </button>

        <button onClick={() => setShowSettingsPage(false)} className="mt-4 bg-gray-500 text-white p-2 rounded hover:scale-105">
          Back to Calculator
        </button>

        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} className="mt-4 bg-red-500 text-white p-2 rounded hover:scale-105">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme} animate-fade-in`}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`relative rounded-3xl p-4 shadow-2xl w-72 ${theme}`}>
        <button onClick={() => setShowSettingsPage(true)} className="absolute top-2 right-2 text-xl text-gray-700 hover:scale-110">
          <FaCog />
        </button>

        <div className="bg-blue-500 rounded-xl p-4 text-right text-white text-2xl mb-4 flex items-center justify-between">
          <FaHeartbeat className="text-pink-200 animate-pulse" />
          <span>{display || "0"}</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {"AC,+-,%,/,7,8,9,*,4,5,6,-,1,2,3,+,0,.,SOS,=".split(",").map((btn, i) => (
            <motion.button whileTap={{ scale: 0.9 }} key={i} onClick={() => handleClick(btn)} className={`rounded-xl text-lg h-14 shadow-md hover:scale-105 transition ${theme === "gradient-3d" ? "theme-3d-button" : theme === "gradient-classic" ? "theme-classic-button" : "theme-purple-button"}`}>
              {btn === "SOS" ? <FaExclamationTriangle className="inline animate-pulse" /> : btn}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

