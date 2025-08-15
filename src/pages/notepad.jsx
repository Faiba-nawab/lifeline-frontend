import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FiSettings } from "react-icons/fi";
import toast from "react-hot-toast";

export default function Notepad() {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [notes, setNotes] = useState(Array(8).fill("")); // 8 empty lines
  const longPressTimer = useRef(null);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContacts = JSON.parse(localStorage.getItem("sosContacts") || "[]");
      setContacts(savedContacts);

      const savedNotes = JSON.parse(localStorage.getItem("notesData") || "[]");
      if (savedNotes.length) setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notesData", JSON.stringify(notes));
    }
  }, [notes]);

  const handleCall = (index) => {
    const contact = contacts[index];
    if (contact?.number) {
      window.location.href = `tel:${contact.number}`;
    }
    else{
      toast.error("⚠ No phone number saved for this contact!");
    }
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };

   const handleSOS = () => {
    if (!navigator.geolocation) {
      toast.success("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const locationText = `SOS! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`;
      const sosContact = contacts[2]; // Third contact for SOS
     if (sosContact?.number) {
      window.open(`https://wa.me/${sosContact.number}?text=${encodeURIComponent(locationText)}`, "_blank");
    } else {
      toast.error("No SOS contact (Contact 3) saved");
    }
  });
};

  const PatternCanvas = ({ mode, onPatternChange}) => {
    const [pattern, setPattern] = useState([]);
    const [message, setMessage] = useState("");
    const isDrawing = useRef(false);

     const handleDotTouch = (i) => {
      if (!pattern.includes(i)) setPattern((prev) => [...prev, i]);
    };

    const handleEnd = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      const patternStr = pattern.join("-");
      setPattern([]);

    if (mode === "set") {
      if (pattern.length >= 4) {
        onPatternChange(patternStr);
  } else {
    setMessage("⚠ Pattern too short!");
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
          ))
        }    </div>
              {message && <div className="pattern-message">{message}</div>}
            </>
          );
        };
      

  return (
    <div className="notepad-container">
      <div className="notepad-header">
        <h1>Notes</h1>
        <FiSettings className="settings-icon" onClick={() => router.push("/notepad-settings")} />
      </div>

      <div className="notepad-content">
         {notes.map((text, i) => (
          <div key={i} className="note-line">
            <span className="heart" 
            style={{ cursor: i < 2 ? "pointer" : "default" }}
              onClick={() => {
                if (i === 0) handleCall(0);
                if (i === 1) handleCall(1);
              }}
            >
              ❤
            </span>
            <textarea className="note-text" rows={1} value={text} onChange={(e) => handleNoteChange(i, e.target.value)} 
            onDoubleClick={() => setShowPattern(true)} />
          </div>
        ))}
      </div>

      {showPattern && (
        <div className="pattern-popup">
          <p>Draw your SOS pattern</p>
          <PatternCanvas mode="match" onMatch={handleSOS} />
          <button onClick={() => setShowPattern(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
