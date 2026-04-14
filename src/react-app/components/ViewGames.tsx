import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { SiteUtilities, Sports } from '../utilities/SiteUtilities';
import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import PublicLeagueCard from './PublicLeagueCard';
import SportsGamesGrid from './SportsGamesGrid';

type Props = {}

function ViewGames({ }: Props) {
    const viewGamesQuery = useQuery({
        queryKey: ['viewgames'],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.queryAllActiveGames();
        },
    });

    return (
        <>
            <Typography variant='h2'>Active Games</Typography>

            
                {
                    Sports.map(s => {
                        const games = viewGamesQuery.data![s.label];
                        if (games) {
                            return <SportsGamesGrid games={games} sport={s.label} sportNumber={s.value} />
                        }
                        else {
                            return <></>;
                        }
                    })
                }
                {/* {viewGamesQuery.data?.map((g) => {
                    return <React.Fragment key={g.id}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <Typography variant='body1'>{g.awayTeam?.abbreviation} @ {g.homeTeam?.abbreviation} {g.gameStartTime?.toString()}</Typography>
                        </Grid>
                    </React.Fragment>;
                })} */}
        </>
    )
}

export default ViewGames
