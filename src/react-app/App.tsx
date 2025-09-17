// src/App.tsx

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Box, Stack } from '@mantine/core';
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
import PickemLeagueStandings from './components/pickem/PickemLeagueStandings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

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
      <QueryClientProvider client={queryClient}>
        <AppTheme>
          <Box sx={{ display: 'flex' }}>
            <SideMenu isAuthenticated={isAuthenticated} email={email} username={username} />
            <AppNavbar isAuthenticated={isAuthenticated} email={email} username={username} />
            {/* Main content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflow: 'auto',
              }}
            >
              <Stack
                spacing="md"
                sx={{
                  alignItems: 'center',
                  mx: 12,
                  pb: 20,
                }}
              >
                <Header />

                <Routes>
                  <Route path="/" element={isAuthenticated ? <MyLeagues /> : <MainGrid />} />
                  <Route path="/myleagues" element={isAuthenticated ? <MyLeagues /> : <SignIn />} />
                  <Route path="/signin" element={isAuthenticated ? <SignIn /> : <SignIn />} />
                  <Route path="/signup" element={isAuthenticated ? <SignUp /> : <SignIn />} />
                  <Route path="/createleague" element={isAuthenticated ? <CreateLeague /> : <SignIn />} />
                  <Route path="/pickem/makepicks/:leagueId/:weekNumber" element={isAuthenticated ? <PickemMakePicks /> : <SignIn />} />
                  <Route path="/pickem/week/:leagueId/:weekNumber" element={isAuthenticated ? <PickemWeekStandings /> : <SignIn />} />
                  <Route path="/pickem/standings/:leagueId" element={isAuthenticated ? <PickemLeagueStandings /> : <SignIn />} />
                  <Route path="/resetpassword/:resetCode" element={isAuthenticated ? <ResetPassword /> : <SignIn />} />
                </Routes>
              </Stack>
            </Box>
          </Box>
        </AppTheme>
      </QueryClientProvider>
    </>
  );
}

export default App;
