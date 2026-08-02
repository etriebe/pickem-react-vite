import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Grid, Select, Stack, Text, Container } from '@mantine/core';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import PublicLeagueCard from './PublicLeagueCard';
import { Sports } from '../utilities/SiteUtilities';

type Props = {}

function BrowseLeagues({}: Props) {
    const [sport, setSport] = React.useState(1);

    const browseLeaguesQuery = useQuery({
        queryKey: ['browseleagues', sport],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getPublicLeagues(sport);
        },
    });

    const sportOptions = Sports.map((option) => ({
        value: option.value.toString(),
        label: option.label,
    }));

    return (
        <Container size="xl" py="md">
            <Stack spacing="xl">
                <Text size="xl" weight={700}>Public Leagues</Text>
                <Select
                    label="Sport"
                    value={sport.toString()}
                    data={sportOptions}
                    onChange={(value) => value && setSport(Number(value))}
                />
                <Text size="sm">{browseLeaguesQuery.data?.length ?? 0} League(s) Found</Text>
                <Grid>
                    {browseLeaguesQuery.data?.map((l) => (
                        <Grid.Col key={l.id} xs={12} sm={6} lg={4}>
                            <PublicLeagueCard
                                leagueId={l.id!}
                                leagueName={l.leagueName!}
                                leagueYear={l.year!}
                                sport={l.sport!}
                                numberOfMembers={l.userSeasons?.length ?? 0}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
}

export default BrowseLeagues;
