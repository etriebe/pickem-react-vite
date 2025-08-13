import { League } from '../services/PickemApiClient';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { SiteUtilities } from '../utilities/SiteUtilities';

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
    return (
        <>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {league.leagueName}
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        {weekDescription}
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
                    <Button size="large" href={myPicksLink}>Make Picks</Button>
                </CardActions>
            </Card>
        </>
    );
}
