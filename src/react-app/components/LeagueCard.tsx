import { League, ApiException } from '../services/PickemApiClient';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SiteUtilities } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';
import { Create, Settings, Autorenew, CalendarToday, FormatListNumbered, Send } from '@mui/icons-material';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { useState } from 'react';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { queryClient } from '../main';

export interface LeagueCardProps {
    league: League;
    picksSubmitted: boolean;
}

export default function LeagueCard({ league, picksSubmitted }: LeagueCardProps) {
    const [open, setOpen] = useState(false);
    const currentWeekNumber = LeagueUtilities.getCurrentWeekNumber(league);
    const weekStandingLink = SiteUtilities.getWeekStandingLink(league.type, league.id!, currentWeekNumber!);
    const leagueStandingLink = SiteUtilities.getLeagueStandingLink(league.type, league.id!);
    const myPicksLink = SiteUtilities.getMakePicksLink(league.type, league.id!, currentWeekNumber!);
    const editLeagueLink = SiteUtilities.getEditLeagueLink(league.id!);
    const pickStatus = SiteUtilities.getEmojiForPickStatus(picksSubmitted);
    const longDescription = true;
    const weekDescription = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, currentWeekNumber!, longDescription);
    const leagueYear = league.year?.replace("_", "-");
    const isOffSeason = LeagueUtilities.isOffSeason(league);
    const isSeasonInFuture = LeagueUtilities.isSeasonInFuture(league);
    const userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
    const isAdmin = league.leagueAdminIds?.find(a => a === userInfo.id);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const copyLeagueInvite = async () => {
        const fullCopyInviteLink = `${window.location.origin}${SiteUtilities.getInviteLink(league.id!)}`;
        navigator.clipboard.writeText(fullCopyInviteLink);
        setSnackbarMessage("Copied invite link!");
        setOpen(true);
    };

    const renewLeague = async () => {
        const pickemClient = PickemApiClientFactory.createClient();
        try {
            await pickemClient.renewLeague(league.id!);
            queryClient.invalidateQueries({ queryKey: ['leagues'] });

            setSnackbarMessage("League has been renewed!");
            setOpen(true);
        }
        catch (error: ApiException | any) {
            setSnackbarMessage(`There was an error renewing your league. ${error.response}`);
            setOpen(true);
        }
    };

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Card sx={{}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {league.leagueName} - {leagueYear}
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        {weekDescription}
                    </Typography>
                    <Typography variant="body2">
                        Picks: {pickStatus}
                    </Typography>
                </CardContent>
                {isAdmin &&
                    <>
                        <CardActions>
                            <Button size="small" href={editLeagueLink} startIcon={<Settings />}>
                                Edit League
                            </Button>
                        </CardActions>
                        <CardActions>
                            <Button size="small" onClick={() => { copyLeagueInvite() }} startIcon={<Send />}>
                                Copy Invite
                            </Button>
                        </CardActions>
                    </>
                }
                <CardActions>
                    <Button size="small" startIcon={<FormatListNumbered />} href={leagueStandingLink}>League Standings</Button>
                </CardActions>
                <CardActions>
                    <Button size="small" startIcon={<CalendarToday />} href={weekStandingLink}>Week Standings</Button>
                </CardActions>
                <CardActions>
                    {isOffSeason && !isSeasonInFuture ?
                        <Button size="large" startIcon={<Autorenew />} onClick={() => { renewLeague() }}>Renew League{!isAdmin && " - Notify League Admin"} </Button> :
                        <Button size="large" href={myPicksLink} startIcon={<Create />}>Make Picks</Button>
                    }
                </CardActions>
            </Card>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={snackbarMessage}
            />
        </>
    );
}
