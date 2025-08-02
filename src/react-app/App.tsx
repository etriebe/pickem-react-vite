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
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import AppTheme from "./theme/AppTheme";
import { AuthenticationUtilities } from "./utilities/AuthenticationUtilities";
import AuthenticationService from './services/AuthenticationService';

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("unknown");
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const result = await AuthenticationUtilities.isAuthenticated();
      if (result)
      {
        console.log(`Authenticated with AuthenticationUtilities.isAuthenticated()!`);
      }
      setAuthenticated(result);
      if (result) {
        console.log(`Authenticated with IsAuthorized!`);
        let userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
        if (!userInfo.email || !userInfo.id || !userInfo.userName) {
          userInfo = await AuthenticationUtilities.getUserInfo();
        }
        const username = userInfo.userName ?? userInfo.email!;
        setUsername(username);
        setEmail(userInfo.email!)
      }
      else {

      }
      console.log(`testing`);
    }

    fetchData();
  }, []);

  // Example: Replace this with your actual authentication logic
  const authenticated = false; // Set to true if the user is authenticated
  console.log(import.meta.env.VITE_PICKEM_API_URL);
  console.log(`import.meta.env.PROD: ${import.meta.env.PROD}`);
  console.log(`import.meta.env.DEV: ${import.meta.env.DEV}`);

  return (
    <>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu isAuthenticated={isAuthenticated} email={email} username={username} />
          <AppNavbar />
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />

              <Routes>
                <Route path="/" element={<MainGrid />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </Stack>
          </Box>
        </Box>
      </AppTheme>
    </>
  );
}

export default App;
