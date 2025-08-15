import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function NotepadSettings() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [contacts, setContacts] = useState([
    { name: "", number: "" },
    { name: "", number: "" },
    { name: "", number: "" }
  ]);
  const [tempPattern, setTempPattern] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("username") || "";
      const savedContacts = JSON.parse(localStorage.getItem("sosContacts") || "[]");
      const savedPattern = localStorage.getItem("sosPattern") || ""; 
      setUsername(savedUser);
      setTempPattern(savedPattern);

      if (savedContacts.length){
        setContacts([
        savedContacts[0] || { name: "", number: "" },
        savedContacts[1] || { name: "", number: "" },
        savedContacts[2] || { name: "", number: "" }
      ]);
    }
    }
  }, []);

  const handleContactChange = (i, field, value) => {
    const updated = [...contacts];
    updated[i][field] = value;
    setContacts(updated);
  };

  const saveSettings = () => {
    localStorage.setItem("sosContacts", JSON.stringify(contacts));
    if (tempPattern) {
      localStorage.setItem("sosPattern", tempPattern);
    }
    toast.success("✅ Settings saved successfully!");
    router.push("/notepad");
  };
  
  const resetPattern = () => {
    localStorage.removeItem("sosPattern");
    setTempPattern("");
    toast.success("🔄 Pattern reset!");
  };

  const PatternCanvas = ({ mode }) => {
    const [pattern, setPattern] = useState([]);
    const isDrawing =useRef(false);

    const handleDotTouch = (i) => {
      if (!pattern.includes(i)) {
        setPattern((prev) => [...prev, i]);
      }
    };

    const handleEnd = () => {
      if (!isDrawing.current) return;
        isDrawing.current = false;
        const patternStr = pattern.join("-");
        setPattern([]);
         if (mode === "set") {
          if (pattern.length >= 4) {
          setTempPattern(patternStr); // Just store temporarily
          alert("Pattern recorded — click Save Settings to confirm.");
        } else {
          toast.error("⚠ Pattern too short!");
        }
      }
    };

    return (
      <>
        <div className="pattern-grid" onMouseUp={handleEnd} onTouchEnd={handleEnd}>
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className={`dot ${pattern.includes(index) ? "active" : ""}`}
              onMouseDown={() => {
                isDrawing.current = true;
                handleDotTouch(index);
              }}
              onMouseEnter={() => {
                if (isDrawing.current) handleDotTouch(index);
              }}
              onTouchStart={() => {
                isDrawing.current = true;
                handleDotTouch(index);
              }}
            />
          ))}
        </div>
        {tempPattern && <p style={{ textAlign: "center" }}>Pattern set: {tempPattern}</p>}
      </>
    );
  };

  return (
    <div>
      <div className="settings-page">
        <h2>🛠 Notepad Settings</h2>
        <div className="settings-section">
          <label>🧑 Username</label>
          <input type="text" value={username} readOnly />
        </div>

        {[0, 1, 2].map((i) => (
          <div className="settings-section" key={i}>
            <label>
              {i === 0 && "👥 SOS Contact 1 (Heart 1 Call)"}
              {i === 1 && "👥 SOS Contact 2 (Heart 2 Call)"}
              {i === 2 && "📩 SOS Contact 3 (WhatsApp SOS)"}
            </label>
            <input type="text" placeholder="Name" value={contacts[i].name} onChange={(e) => handleContactChange(i, "name", e.target.value)} />
            <input type="tel" placeholder="Phone Number" value={contacts[i].number} onChange={(e) => handleContactChange(i, "number", e.target.value)} />
          </div>
        ))}
        <div className="settings-section">
          <label>🔒 Set SOS Pattern (double tap on notepad to activate)</label>
          <PatternCanvas mode="set" />
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <button className="save-button" onClick={resetPattern} style={{ marginRight: "10px" }}>
            🔄 Reset Pattern
          </button>
        </div>
      </div>
      <div className="settings-buttons">
        <div style={{ textAlign: "center", marginTop: "30px" }}></div>
        <button className="save-button" onClick={saveSettings}>💾 Save Settings</button>
        <button className="back-button" onClick={() => router.push("/notepad")}>🔙 Back</button>
      </div>
    </div>
  );
}
