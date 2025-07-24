import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StyledEngineProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./components/SignIn.tsx";
import SignUp from "./components/SignUp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </StyledEngineProvider>
  </StrictMode>,
);
