import { useParams } from 'react-router';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { useQuery } from '@tanstack/react-query';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import SquaresGameCard from './SquaresGameCard';

type Props = {}

function SquaresCreateBoard({ }: Props) {
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));

    const chooseGameQuery = useQuery({
        queryKey: ['sqaureschoosegame', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getSquaresChooseGame(leagueId);
        },
    });

    return (
        <Typography variant='h2'>
            Create Squares Board
            <Grid
                container
                spacing={2}
                padding={2}
                sx={{ mb: (theme) => theme.spacing(2), width: '100%' }}
            >
                {chooseGameQuery.data?.games.map((g) => {
                    return <React.Fragment key={g.id}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <SquaresGameCard game={g} isSmallScreen={isSmallScreen} />
                        </Grid>
                    </React.Fragment>;
                })}
            </Grid>
        </Typography>
    )
}

export default SquaresCreateBoard