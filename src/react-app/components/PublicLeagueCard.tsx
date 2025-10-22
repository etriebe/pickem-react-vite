import { PersonAdd } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import { SiteUtilities } from '../utilities/SiteUtilities'

type Props = {
    leagueId: string,
    leagueName: string,
    leagueYear: string,
    sport: number,
    numberOfMembers: number
}

function PublicLeagueCard({ leagueId, leagueName, leagueYear, sport, numberOfMembers }: Props) {
    leagueYear = leagueYear.replace("_","-");
    const sportType = SiteUtilities.getSportTypeFromNumber(sport);
    return (
        <>
            <Card sx={{}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {leagueName}
                    </Typography>
                    <Typography variant="body1" component="div">
                        {leagueYear} - {sportType?.label}
                    </Typography>
                    <Typography variant="caption" component="div">
                        {numberOfMembers} member(s)
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" href={SiteUtilities.getInviteLink(leagueId!)} startIcon={<PersonAdd />}>
                        Join League
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}

export default PublicLeagueCard