import "@/styles/globals.css";
import "@/styles/notepad.css";
import "@/styles/gallery.css";
import { Toaster } from "react-hot-toast";
export default function MyApp({ Component, pageProps }) {
  return (
  <>
  <Component {...pageProps} />

  <Toaster position="top-center" autoClose={3000} />
  </>
  );
}
