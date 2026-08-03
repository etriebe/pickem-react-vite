import { League } from '../../services/PickemApiClient';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { AuthenticationUtilities } from '../../utilities/AuthenticationUtilities';
import { Create, Settings, Send, FormatListNumbered } from '@mui/icons-material';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { useState } from 'react';

export interface BracketLeagueCardProps {
    league: League;
}

export default function BracketLeagueCard({ league }: BracketLeagueCardProps) {
    const leagueYear = league.year?.replace("_", "-");
    const editLeagueLink = SiteUtilities.getEditLeagueLink(league.id!);
    const leagueStandingLink = SiteUtilities.getLeagueStandingLink(league.type!, league.id!);
    const leagueMakePickLink = SiteUtilities.getBracketMakePicksLink(league.id!);
    const userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
    const isAdmin = league.leagueAdminIds?.find(a => a === userInfo.id);
    const [copyInviteMessage, setCopyInviteMessage] = useState('');
    const [open, setOpen] = useState(false);

    const copyLeagueInvite = async () => {
        const fullCopyInviteLink = `${window.location.origin}${SiteUtilities.getInviteLink(league.id!)}`;
        navigator.clipboard.writeText(fullCopyInviteLink);
        setCopyInviteMessage("Copied invite link!");
        setOpen(true);
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
                    <CardActions>
                        <Button size="small" startIcon={<Create />} href={leagueMakePickLink}>Make Picks</Button>
                    </CardActions>
                    <CardActions>
                        <Button size="small" startIcon={<FormatListNumbered />} href={leagueStandingLink}>League Standings</Button>
                    </CardActions>
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
            </Card>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={copyInviteMessage}
            />
        </>
    );
}
