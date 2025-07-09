import { useEffect } from "react";

export default function LocationFetcher({ onLocation }) {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          onLocation({ latitude, longitude });
        },
        (err) => console.error("Location error:", err)
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  return null; // No visible UI
}
