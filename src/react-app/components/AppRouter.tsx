import { useState } from 'react';
import { Routes, Route } from 'react-router';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';
import MyLeagues from './MyLeagues';
import PickemMakePicks from './pickem/PickemMakePicks';
import PickemWeekStandings from './pickem/PickemWeekStandings';
import ResetPassword from './ResetPassword';
import CreateLeague from './CreateLeague';
import PickemLeagueStandings from './pickem/PickemLeagueStandings';
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import MainGrid from './MainGrid';
import { useQuery } from '@tanstack/react-query';
import Loading from './Loading';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SideMenu from "./SideMenu";
import AppNavbar from "./AppNavbar";
import Header from "./Header";
import { alpha } from '@mui/material/styles';

type Props = {}

function AppRouter({ }: Props) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const isAuthenticatedQuery = useQuery({
        queryKey: ['auth'], 
        queryFn: async () => {
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
            return result;
        },
        staleTime: 60 * 60 * 1000, // 5 minutes
    });

    return (
        <>
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

                        {isAuthenticatedQuery.isPending && <Loading />}
                        {isAuthenticatedQuery.isError && <SignIn />}
                        {isAuthenticatedQuery.isSuccess &&
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
                        }
                    </Stack>
                </Box>
            </Box>
        </>

    )
}

export default AppRouter