import { useParams } from 'react-router';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { useQuery } from '@tanstack/react-query';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import SquaresGameCreateCard from './SquaresGameCreateCard';

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
        <Typography variant='h4'>
            <div className='centerDivContainerHorizontally'>
                Create Squares Game Board
            </div>
            <Grid
                container
                spacing={2}
                padding={2}
                sx={{ mb: (theme) => theme.spacing(2), width: '100%' }}
            >
                {chooseGameQuery.data?.games
                .filter((g) => g.result?.status != 2) // Filter out games that are Status === Final
                .map((g) => {
                    return <React.Fragment key={g.id}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <SquaresGameCreateCard game={g} isSmallScreen={isSmallScreen} leagueId={leagueId!} />
                        </Grid>
                    </React.Fragment>;
                })}
            </Grid>
        </Typography>
    )
}

export default SquaresCreateBoard