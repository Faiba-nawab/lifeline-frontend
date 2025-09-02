"use client";
import { useEffect, useState } from "react";


export default function Gallery() {
  const STORAGE = {
    wa1: "waContact1",
    call2: "callContact2",
    pattern: "sosPattern",
  };

  const MIN_DIGITS = 8;
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patternOpen, setPatternOpen] = useState(false);

  const [form, setForm] = useState({
    wa1: "",
    call2: "",
    pattern: "",
  });

  const PLACEHOLDERS = Array.from({ length: 9 }, (_, i) => 
    `https://picsum.photos/seed/${i + 11}/600/600`
  );

  const normalizeNumber = (v) => (v || "").toString().replace(/\D+/g, "");

  function saveSettings() {
    const v1 = normalizeNumber(form.wa1);
    const v2 = normalizeNumber(form.call2);
    const pat = form.pattern.trim();

    if (!v1 || v1.length < MIN_DIGITS) return alert("Invalid WhatsApp number.");
    if (!v2 || v2.length < MIN_DIGITS) return alert("Invalid Call number.");
    if (!pat) return alert("Pattern is required.");

    localStorage.setItem(STORAGE.wa1, v1);
    localStorage.setItem(STORAGE.call2, v2);
    localStorage.setItem(STORAGE.pattern, pat);

    setSettingsOpen(false);
    alert("Settings saved.");
  }

  function loadSettings() {
    setForm({
      wa1: localStorage.getItem(STORAGE.wa1) || "",
      call2: localStorage.getItem(STORAGE.call2) || "",
      pattern: localStorage.getItem(STORAGE.pattern) || "",
    });
  }

  function showToast(msg, ms = 1500) {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  }

  // Dummy GPS fetcher (keep same logic as before, shortened here)
  async function getBestPosition() {
    return { lat: 12.9716, lon: 77.5946, accuracy: 20 }; // placeholder
  }

  function buildSOSMessage(loc, label = "SOS") {
    const dt = new Date().toLocaleString();
    return encodeURIComponent(
      `${label}! Time: ${dt}\nLocation: https://www.google.com/maps?q=${loc.lat},${loc.lon}`
    );
  }

  function sendWhatsApp(num, msg) {
    if (!num) return;
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  }

  function makeCall(num) {
    if (!num) return;
    window.open(`tel:${num}`, "_self");
  }

  async function handlePatternSOS() {
    const saved = localStorage.getItem(STORAGE.pattern) || "";
    if (!saved) return alert("No pattern set.");
    if (form.pattern !== saved) return alert("Incorrect pattern.");

    const loc = await getBestPosition();
    const msg = buildSOSMessage(loc, "SOS (Pattern)");
    sendWhatsApp(localStorage.getItem(STORAGE.wa1), msg);
    setTimeout(() => makeCall(localStorage.getItem(STORAGE.call2)), 400);
    setPatternOpen(false);
  }

  useEffect(() => {
    loadSettings();
    setStatus("Ready. For best accuracy, enable GPS.");
  }, []);

  return (
    <div className="gallery-app">
      {/*trigger pop up*/}
      <header>
        <div className="title">Gallery</div>
        <div>
          <button className="icon-btn" onClick={() => setPatternOpen(true)}>🔒</button>
          <button className="icon-btn" onClick={() => { loadSettings(); setSettingsOpen(true); }}>⚙️</button>
        </div>
      </header>

      <div className="statusbar">{status}</div>

      <div className="wrap">

        {/* Gallery Grid */}
        <div className="grid">
          {PLACEHOLDERS.map((src, idx) => (
            <div key={idx} className="card">
              <img src={src} alt={`photo-${idx+1}`} />
              {idx === 0 && (
                <>
                 {/* <div className="hint">Top-left → WhatsApp SOS</div>*/}
                  <div className="hotspot" onClick={async (e) => {
                    e.stopPropagation();
                    const loc = await getBestPosition();
                    const msg = buildSOSMessage(loc, "SOS (Top-left)");
                    sendWhatsApp(localStorage.getItem(STORAGE.wa1), msg);
                  }}></div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="modal show">
          <div className="panel">
            <h3>Gallery Settings</h3>
            <div className="row">
              <label>Trusted Contact 1 (WhatsApp)</label>
              <input value={form.wa1} onChange={(e)=>setForm({...form,wa1:e.target.value})}/>
            </div>
            <div className="row">
              <label>Trusted Contact 2 (Call)</label>
              <input value={form.call2} onChange={(e)=>setForm({...form,call2:e.target.value})}/>
            </div>
            <div className="row">
              <label>Pattern / Passcode</label>
              <input type="password" value={form.pattern} onChange={(e)=>setForm({...form,pattern:e.target.value})}/>
            </div>
            <div className="actions">
              <button className="btn secondary" onClick={()=>setSettingsOpen(false)}>Cancel</button>
              <button className="btn" onClick={saveSettings}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Popup */}
      {patternOpen && (
        <div className="popup show">
          <div className="popbox">
            <h3>Enter Pattern</h3>
            <input type="password" value={form.pattern} onChange={(e)=>setForm({...form,pattern:e.target.value})}/>
            <div style={{display:"flex",gap:"10px",justifyContent:"flex-end"}}>
              <button className="btn secondary" onClick={()=>setPatternOpen(false)}>Cancel</button>
              <button className="btn" onClick={handlePatternSOS}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast show">{toast}</div>}
    </div>
  );
}
