import { League } from '../services/PickemApiClient';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SiteUtilities } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

export interface LeagueCardProps {
    league: League;
    picksSubmitted: boolean;
}

export default function LeagueCard({ league, picksSubmitted }: LeagueCardProps) {
    const weekStandingLink = SiteUtilities.getWeekStandingLink(league.type, league.id!, league.currentWeekNumber!);
    const leagueStandingLink = SiteUtilities.getLeagueStandingLink(league.type, league.id!);
    const myPicksLink = SiteUtilities.getMakePicksLink(league.type, league.id!, league.currentWeekNumber!);
    const pickStatus = SiteUtilities.getEmojiForPickStatus(picksSubmitted);
    const weekDescription = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, league.currentWeekNumber!);
    const leagueYear = league.year?.replace("_", "-");
    const isOffSeason = LeagueUtilities.isOffSeason(league);
    const userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
    const isAdmin = league.leagueAdminIds?.find(a => a === userInfo.id);
    return (
        <>
            <Card sx={{  }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {league.leagueName}
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        {weekDescription} - {leagueYear}
                    </Typography>
                    <Typography variant="body2">
                        Picks: {pickStatus}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" href={leagueStandingLink}>League Standings</Button>
                </CardActions>
                <CardActions>
                    <Button size="small" href={weekStandingLink}>Week Standings</Button>
                </CardActions>
                <CardActions>
                    {isOffSeason ?
                        <Button size="large">Renew League{!isAdmin && " - Notify League Admin"} </Button> :
                        <Button size="large" href={myPicksLink}>Make Picks</Button>
                    }
                </CardActions>
            </Card>
        </>
    );
}
