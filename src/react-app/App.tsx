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
import MyLeagues from './components/MyLeagues';
import PickemMakePicks from './components/pickem/PickemMakePicks';
import PickemWeekStandings from './components/pickem/PickemWeekStandings';
import ResetPassword from './components/ResetPassword';
import CreateLeague from './components/CreateLeague';

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await AuthenticationUtilities.isAuthenticated();
      setAuthenticated(result);
      if (result) {
        let userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
        if (!userInfo.email || !userInfo.id || !userInfo.userName) {
          userInfo = await AuthenticationUtilities.getUserInfo();
        }
        const username = userInfo.userName ?? userInfo.email!;
        setUsername(username);
        setEmail(userInfo.email!)
      }
      else {
        console.log(`Not authenticated. ${result}`);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu isAuthenticated={isAuthenticated} email={email} username={username} />
          <AppNavbar isAuthenticated={isAuthenticated} email={email} username={username} />
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
                <Route path="/" element={ isAuthenticated ? <MyLeagues /> : <MainGrid />}/>
                <Route path="/myleagues" element={ <MyLeagues />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/createleague" element={isAuthenticated ? <CreateLeague /> : <SignIn />} />
                <Route path="/pickem/makepicks/:leagueId/:weekNumber" element={<PickemMakePicks />} />
                <Route path="/pickem/week/:leagueId/:weekNumber" element={<PickemWeekStandings />} />
                <Route path="/resetpassword/:resetCode" element={<ResetPassword />} />
              </Routes>
            </Stack>
          </Box>
        </Box>
      </AppTheme>
    </>
  );
}

export default App;
