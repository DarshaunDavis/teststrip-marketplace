// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";
import { AuthProvider } from "./authContext";
import LislalCallback from "./LislalCallback";
import TermsPage from "./pages/TermsPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import HomePage from "./pages/HomePage";
import DirectoryPage from "./pages/DirectoryPage";

const pathname = window.location.pathname;

const isLislalCallback = pathname === "/lislal-callback";
const isTermsPage = pathname === "/terms";
const isPrivacyPage = pathname === "/privacy";
const isMarketplace = pathname === "/marketplace" || pathname === "/ads";
const isDirectoryPage = pathname === "/directory";

let RootComponent: React.ReactNode;

if (isLislalCallback) {
  RootComponent = <LislalCallback />;
} else if (isTermsPage) {
  RootComponent = <TermsPage />;
} else if (isPrivacyPage) {
  RootComponent = <PrivacyPage />;
} else if (isMarketplace) {
  RootComponent = <App />;
} else if (isDirectoryPage) {
  RootComponent = <DirectoryPage />;
} else {
  // Default route is the funnel home page
  RootComponent = <HomePage />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>{RootComponent}</AuthProvider>
  </React.StrictMode>
);
