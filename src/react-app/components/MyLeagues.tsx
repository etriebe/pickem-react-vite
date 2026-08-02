import { useQueries, useQuery } from '@tanstack/react-query';
import { Container, SimpleGrid } from '@mantine/core';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import LeagueCard from './LeagueCard';
import Loading from './Loading';
import SquaresLeagueCard from './squares/SquaresLeagueCard';

export default function MyLeagues() {
    const leaguesQuery = useQuery({
        queryKey: ['leagues'],
        queryFn: async () => {
            const leagues = LeagueUtilities.getLeaguesForCurrentUser(false);
            return leagues;
        },
        staleTime: 1000 * 60 * 60,
    });

    const picksQuery = useQueries({
        queries: leaguesQuery && leaguesQuery.data
            ? leaguesQuery.data
                  .filter((l) => l.type === 1 || l.type === 2)
                  .map((league) => ({
                      queryKey: ['picks', league.id],
                      queryFn: async () => {
                          const pickemClient = PickemApiClientFactory.createClient();
                          return pickemClient.getWeekPickForUser(
                              league.id!,
                              LeagueUtilities.getCurrentWeekNumber(league),
                              league.type,
                          );
                      },
                  }))
            : [],
        combine: (results) => ({
            data: results.map((result) => result.data),
            pending: results.some((result) => result.isPending),
        }),
    });

    if (leaguesQuery.isPending) {
        return <Loading />;
    }

    if (leaguesQuery.isError) {
        return <div>Error!</div>;
    }

    return (
        <Container fluid px="md" py="md">
            <SimpleGrid
                cols={1}
                spacing="md"
                breakpoints={[
                    { minWidth: 640, cols: 2 },
                    { minWidth: 1024, cols: 3 },
                ]}
            >
                {leaguesQuery.data.map((l) => {
                    const currentLeaguePicks = picksQuery.data.find((p) => p?.leagueId === l.id);
                    const leagueType = l.type;

                    if (leagueType === 1 || leagueType === 2) {
                        return (
                            <LeagueCard
                                key={l.id}
                                league={l}
                                picksSubmitted={currentLeaguePicks != null}
                            />
                        );
                    }

                    if (leagueType === 5) {
                        return <SquaresLeagueCard key={l.id} league={l} />;
                    }

                    return null;
                })}
            </SimpleGrid>
        </Container>
    );
}
