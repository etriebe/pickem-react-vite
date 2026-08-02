import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, NumberInput, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { CreateLeagueRequest, SeasonDateInformation2 } from '../services/PickemApiClient';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { Sports, LeagueTypes } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { queryClient } from '../main';

type Props = {}

export default function CreateLeague({}: Props) {
    const [leagueName, setLeagueName] = useState('');
    const [leagueType, setLeagueType] = useState(1);
    const [sport, setSport] = useState(1);
    const [startWeek, setStartWeek] = useState(1);
    const [endWeek, setEndWeek] = useState(17);
    const [totalPicks, setTotalPicks] = useState(6);
    const [keyPicks, setKeyPicks] = useState(1);
    const [keyPickBonus, setKeyPickBonus] = useState(1);
    const [sportSeasonInformation, setSportSeasonInformation] = useState<{ [key: string]: SeasonDateInformation2; }>();
    const [maxWeeks, setMaxWeeks] = useState(-1);
    const [endingWeekNumberLabel, setEndingWeekNumberLabel] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const seasonInfo = await pickemClient.getCurrentSportsSeasonInformation();
            setSportSeasonInformation(seasonInfo);
            const max = LeagueUtilities.getCurrentMaxWeeksForSport(seasonInfo, LeagueUtilities.getSportNameFromNumber(sport));
            setEndWeek(max);
            setMaxWeeks(max);
            setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(max));
        };

        fetchData();
    }, [sport]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const createLeagueRequest = new CreateLeagueRequest();
        createLeagueRequest.leagueName = leagueName;
        createLeagueRequest.leagueType = leagueType;
        createLeagueRequest.sport = sport;
        createLeagueRequest.startingWeekNumber = startWeek;
        createLeagueRequest.endingWeekNumber = endWeek;
        createLeagueRequest.totalPicks = totalPicks;
        createLeagueRequest.keyPicks = keyPicks;
        createLeagueRequest.keyPickBonus = keyPickBonus;
        await pickemClient.createLeague(createLeagueRequest);
        queryClient.invalidateQueries({ queryKey: ['leagues'] });
        window.location.href = '/';
    };

    const leagueTypeOptions = LeagueTypes.map((option) => ({ value: option.value.toString(), label: option.label }));
    const sportOptions = Sports.map((option) => ({ value: option.value.toString(), label: option.label }));

    return (
        <Container size="md" py="xl">
            <Paper withBorder p="xl" radius="md">
                <Stack spacing="xl">
                    <Text size="xl" weight={700}>Create a League</Text>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid gutter="md">
                            <Grid.Col xs={12} md={4}>
                                <TextInput
                                    label="League Name"
                                    value={leagueName}
                                    onChange={(event) => setLeagueName(event.currentTarget.value)}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col xs={12} md={5}>
                                <Select
                                    label="League Type"
                                    value={leagueType.toString()}
                                    data={leagueTypeOptions}
                                    onChange={(value) => value && setLeagueType(Number(value))}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col xs={12} md={3}>
                                <Select
                                    label="Sport"
                                    value={sport.toString()}
                                    data={sportOptions}
                                    onChange={(value) => {
                                        if (!value) return;
                                        const sportNumber = Number(value);
                                        setSport(sportNumber);
                                        const sportName: string = LeagueUtilities.getSportNameFromNumber(sportNumber);
                                        const newMaxWeeks = LeagueUtilities.getCurrentMaxWeeksForSport(sportSeasonInformation, sportName);
                                        setEndWeek(newMaxWeeks);
                                        setMaxWeeks(newMaxWeeks);
                                        setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(newMaxWeeks));
                                    }}
                                    required
                                />
                            </Grid.Col>

                            {leagueType !== 5 && (
                                <>
                                    <Grid.Col xs={12} md={6}>
                                        <NumberInput
                                            label="Starting Week Number"
                                            value={startWeek}
                                            onChange={(value) => setStartWeek(typeof value === 'number' ? value : 1)}
                                            min={1}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col xs={12} md={6}>
                                        <NumberInput
                                            label={endingWeekNumberLabel || 'Ending Week Number'}
                                            value={endWeek}
                                            onChange={(value) => setEndWeek(typeof value === 'number' ? value : 1)}
                                            min={startWeek}
                                            max={maxWeeks}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col xs={12} md={4}>
                                        <NumberInput
                                            label="Total Number of Picks"
                                            value={totalPicks}
                                            onChange={(value) => setTotalPicks(typeof value === 'number' ? value : 1)}
                                            min={1}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col xs={12} md={4}>
                                        <NumberInput
                                            label="Total Number of Key Picks"
                                            value={keyPicks}
                                            onChange={(value) => setKeyPicks(typeof value === 'number' ? value : 1)}
                                            min={0}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col xs={12} md={4}>
                                        <NumberInput
                                            label="Key Pick Bonus"
                                            value={keyPickBonus}
                                            onChange={(value) => setKeyPickBonus(typeof value === 'number' ? value : 1)}
                                            min={0}
                                            required
                                        />
                                    </Grid.Col>
                                </>
                            )}

                            <Grid.Col xs={12}>
                                <Button type="submit" fullWidth>
                                    Create League
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
}
