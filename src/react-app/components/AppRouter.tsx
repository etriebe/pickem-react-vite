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
import EditUserSettings from './EditUserSettings';
import EditLeague from './EditLeague';
import JoinLeague from './JoinLeague';
import ChangePassword from './ChangePassword';

type Props = {}

function AppRouter({ }: Props) {

    const userInfoQuery = useQuery({
        queryKey: ['userinfo'],
        queryFn: AuthenticationUtilities.getUserInfo,
        retry: false
    });

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <SideMenu isAuthenticated={userInfoQuery.isSuccess} email={userInfoQuery.data?.email} username={userInfoQuery.data?.userName} />
                <AppNavbar isAuthenticated={userInfoQuery.isSuccess} email={userInfoQuery.data?.email} username={userInfoQuery.data?.userName} />
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

                        {userInfoQuery.isPending && <Loading />}
                        {userInfoQuery.isError &&
                            <Routes>
                                <Route path="/" element={<MainGrid />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/resetpassword/:resetCode" element={<ResetPassword />} />
                            </Routes>
                        }
                        {userInfoQuery.isSuccess &&
                            <Routes>
                                <Route path="/" element={<MyLeagues />} />
                                <Route path="/myleagues" element={<MyLeagues />} />
                                <Route path="/signin" element={<SignIn />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/createleague" element={<CreateLeague />} />
                                <Route path="/pickem/makepicks/:leagueId/:weekNumber" element={<PickemMakePicks />} />
                                <Route path="/pickem/week/:leagueId/:weekNumber" element={<PickemWeekStandings />} />
                                <Route path="/pickem/standings/:leagueId" element={<PickemLeagueStandings />} />
                                <Route path="/settings" element={<EditUserSettings />} />
                                <Route path="/editleague/:leagueId" element={<EditLeague />} />
                                <Route path="/joinleague/:leagueId" element={<JoinLeague />} />
                                <Route path="/changepassword" element={<ChangePassword />} />
                            </Routes>
                        }
                    </Stack>
                </Box>
            </Box>
        </>

    )
}

export default AppRouter