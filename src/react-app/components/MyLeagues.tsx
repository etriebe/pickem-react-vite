import { LeagueUtilities } from '../utilities/LeagueUtilities';
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import LeagueCard from './LeagueCard';
import { Grid } from "@mui/material";
import Loading from "./Loading";
import React from "react";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function MyLeagues() {
    const leaguesQuery = useQuery({
        queryKey: ['leagues'], queryFn: async () => {
            const leagues = LeagueUtilities.getLeaguesForCurrentUser(false);
            return leagues;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
    const picksQuery = useQueries({
        queries: leaguesQuery && leaguesQuery.data
            ? leaguesQuery.data.map((league) => {
                return {
                    queryKey: ['picks', league.id],
                    queryFn: async () => {
                        const pickemClient = PickemApiClientFactory.createClient();
                        const picks = pickemClient.getWeekPickForUser(league.id!, league.currentWeekNumber, league.type);
                        return picks;
                    },
                }
            })
            : [],
        combine: (results) => {
            return {
                data: results.map((result) => result.data),
                pending: results.some((result) => result.isPending),
            }
        },
    });
    const allFinished = !picksQuery.pending;

    if (leaguesQuery.isPending) {
        return <Loading />;
    }
    else if (leaguesQuery.isError) {
        return <div>Error!</div>;
    }
    else if (leaguesQuery.isSuccess && allFinished) {
        return (
            <>
                <Grid
                    container
                    spacing={2}
                    padding={2}
                    sx={{ mb: (theme) => theme.spacing(2), width: '100%' }}
                >
                    {leaguesQuery.data.map((l) => {
                        const currentLeaguePicks = picksQuery.data.find(p => p?.leagueId === l.id);
                        return <React.Fragment key={l.id}>
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                <LeagueCard key={l.id} league={l} picksSubmitted={currentLeaguePicks != null} />
                            </Grid>
                        </React.Fragment>;
                    })}
                </Grid>
            </>
        );
    }

}
