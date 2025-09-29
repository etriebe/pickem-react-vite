// src/App.tsx

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { useState, useEffect } from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
import SideMenu from "./components/SideMenu";
import AppTheme from "./theme/AppTheme";
import { AuthenticationUtilities } from "./utilities/AuthenticationUtilities";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import AppRouter from './components/AppRouter';

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <CssBaseline enableColorScheme />
          <AppRouter />
        </AppTheme>
      </QueryClientProvider>
    </>
  );
}

export default App;
