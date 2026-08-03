import { League } from '../../services/PickemApiClient';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { AuthenticationUtilities } from '../../utilities/AuthenticationUtilities';
import { Create, Settings, Send, FormatListNumbered, Add } from '@mui/icons-material';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import Loading from '../Loading';

export interface BracketLeagueCardProps {
    league: League;
}

export default function BracketLeagueCard({ league }: BracketLeagueCardProps) {
    const leagueYear = league.year?.replace("_", "-");
    const leagueId = league.id;
    const editLeagueLink = SiteUtilities.getEditLeagueLink(league.id!);
    const leagueStandingLink = SiteUtilities.getLeagueStandingLink(league.type!, league.id!);
    const leagueMakePickLink = SiteUtilities.getBracketMakePicksLink(league.id!);
    const leagueCreateUserBracketLink = SiteUtilities.getBracketCreateUserBracketLink(league.id!);
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

    const bracketQuery = useQuery({
        queryKey: ['bracket', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getBracketLeaguePage(leagueId!);
        },
    });

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    let userBracketCount = 0;
    const numberOfBracketsPerPerson = league.settings.numberOfBracketsPerPerson ?? 1;
    if (bracketQuery.isSuccess) {
        userBracketCount = bracketQuery.data.userBrackets?.length ?? 0;
    }

    return (
        <>
            <Card sx={{}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {league.leagueName} - {leagueYear}
                    </Typography>

                    {bracketQuery.isLoading &&
                        <Loading />
                    }
                    {bracketQuery.isSuccess &&
                        <>
                            {(userBracketCount < numberOfBracketsPerPerson) &&
                                <CardActions>
                                    <Button size="small" startIcon={<Add />} href={leagueCreateUserBracketLink}>Create Bracket</Button>
                                </CardActions>
                            }
                            {userBracketCount > 0 &&
                                <CardActions>
                                    <Button size="small" startIcon={<Create />} href={leagueMakePickLink}>Make Picks</Button>
                                </CardActions>
                            }
                            <CardActions>
                                <Button size="small" startIcon={<FormatListNumbered />} href={leagueStandingLink}>League Standings</Button>
                            </CardActions>
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
                        </>
                    }
                    {bracketQuery.isError &&
                        <>Error loading bracket data</>
                    }

                </CardContent>
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
