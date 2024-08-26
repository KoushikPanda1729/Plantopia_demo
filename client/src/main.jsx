import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
const googleClientId = import.meta.env.VITE_GOOGLE_SIGNUP_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
    <Toaster />
  </GoogleOAuthProvider>
);
