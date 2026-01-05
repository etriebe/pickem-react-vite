import { League } from '../../services/PickemApiClient';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { LeagueUtilities } from '../../utilities/LeagueUtilities';
import { AuthenticationUtilities } from '../../utilities/AuthenticationUtilities';
import { Create, Settings, Autorenew, SportsFootball, Send } from '@mui/icons-material';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { useState } from 'react';

export interface SquaresLeagueCardProps {
    league: League;
}

export default function SquaresLeagueCard({ league }: SquaresLeagueCardProps) {
    const leagueYear = league.year?.replace("_", "-");
    const editLeagueLink = SiteUtilities.getEditLeagueLink(league.id!);
    const squaresCreateBoardLink = SiteUtilities.getSquaresCreateBoardLink(league.id!);
    const squaresBrowseBoardsLink = SiteUtilities.getSquaresBrowseBoardsLink(league.id!);
    const isOffSeason = LeagueUtilities.isOffSeason(league);
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
                        <CardActions>
                            <Button size="small" startIcon={<Create />} href={squaresCreateBoardLink}>Create New Squares Board</Button>
                        </CardActions>
                    </>
                }
                <CardActions>
                    {isOffSeason ?
                        <Button size="large" startIcon={<Autorenew />}>Renew League{!isAdmin && " - Notify League Admin"} </Button> :
                        <Button size="large" href={squaresBrowseBoardsLink} startIcon={<SportsFootball />}>Browse Boards</Button>
                    }
                </CardActions>
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
