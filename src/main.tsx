// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./authContext";
import LislalCallback from "./LislalCallback";


const isLislalCallback = window.location.pathname === "/lislal-callback";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      {isLislalCallback ? <LislalCallback /> : <App />}
    </AuthProvider>
  </React.StrictMode>
);
