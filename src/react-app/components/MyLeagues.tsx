import { LeagueUtilities } from '../utilities/LeagueUtilities';
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import LeagueCard from './LeagueCard';
import { Grid } from '@mantine/core';
import Loading from "./Loading";
import { useQueries, useQuery } from "@tanstack/react-query";

export default function MyLeagues() {
    const leaguesQuery = useQuery({
        queryKey: ['leagues'], queryFn: async () => {
            const leagues = LeagueUtilities.getLeaguesForCurrentUser(false);
            return leagues;
        },
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
                <Grid gutter="md" p="md">
                    {leaguesQuery.data.map((l) => {
                        const currentLeaguePicks = picksQuery.data.find(p => p?.leagueId === l.id);
                        return (
                            <Grid.Col key={l.id} xs={12} sm={6} lg={4}>
                                <LeagueCard league={l} picksSubmitted={currentLeaguePicks != null} />
                            </Grid.Col>
                        );
                    })}
                </Grid>
            </>
        );
    }

}
