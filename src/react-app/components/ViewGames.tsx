import { Typography } from '@mui/material';
import { Sports } from '../utilities/SiteUtilities';
import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
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
            <Typography variant='h2'>Scoreboard</Typography>

            
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
        </>
    )
}

export default ViewGames
