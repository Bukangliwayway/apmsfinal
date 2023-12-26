import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ModeProvider } from "./context/ModeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModeProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </ModeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
