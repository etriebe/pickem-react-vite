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
import { QueryCache } from '@tanstack/react-query';

type Props = {}

function AppRouter({ }: Props) {

    const queryCache = new QueryCache({
    onError: (error) => {
        console.log(error)
    },
    onSuccess: (data) => {
        console.log(data)
    },
    onSettled: (data, error) => {
        console.log(data, error)
    },
    });
    const callback = (event: { type: any; query: any; }) => {
    console.log(event.type, event.query)
    }

    const unsubscribe = queryCache.subscribe(callback)

    const isAuthenticatedQuery = useQuery({
        queryKey: ['auth'],
        queryFn: AuthenticationUtilities.isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const userId = isAuthenticatedQuery?.data;
    
    const userInfoQuery = useQuery({
        queryKey: ['userinfo', userId],
        queryFn: AuthenticationUtilities.getUserInfo,
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const isAuthenticated = isAuthenticatedQuery.isSuccess && isAuthenticatedQuery.data != undefined && isAuthenticatedQuery.data !== '';

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <SideMenu isAuthenticated={isAuthenticatedQuery.isSuccess} email={userInfoQuery.data?.email} username={userInfoQuery.data?.userName} />
                <AppNavbar isAuthenticated={isAuthenticatedQuery.isSuccess} email={userInfoQuery.data?.email} username={userInfoQuery.data?.userName} />
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