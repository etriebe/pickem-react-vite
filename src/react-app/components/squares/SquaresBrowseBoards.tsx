import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import SquaresGameBrowseCard from "./SquaresGameBrowseCard";

type Props = {}

function SquaresBrowseBoards({ }: Props) {
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));

    const browseBoardsQuery = useQuery({
        queryKey: ['browseboards', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getAllLeagueSquaresBoards(leagueId);
        },
    });
    return (
        <Typography variant='h4'>
            <div className='centerDivContainerHorizontally'>
                Active Squares Boards
            </div>
            <Grid
                container
                spacing={2}
                padding={2}
                sx={{ mb: (theme) => theme.spacing(2), width: '100%' }}
            >
                {browseBoardsQuery.data?.boards
                .map((b) => {
                    const gameId = b.gameId;
                    const gameObject = browseBoardsQuery.data.games.find(g => g.id === gameId);

                    return <React.Fragment key={b.id}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <SquaresGameBrowseCard game={gameObject!} boardId={b.id!} isSmallScreen={isSmallScreen} leagueId={leagueId!} />
                        </Grid>
                    </React.Fragment>;
                })}
            </Grid>
        </Typography>
    )
}

export default SquaresBrowseBoards