import React, { useEffect, useState } from 'react';
import { Box, TextInput, Button, Select, Text, Grid, NumberInput } from '@mantine/core';
import { CreateLeagueRequest, SeasonDateInformation2 } from '../services/PickemApiClient';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { Sports, LeagueTypes } from '../utilities/SiteUtilities';

export default function CreateLeague() {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const createLeagueRequest = new CreateLeagueRequest();
        createLeagueRequest.leagueName = leagueName;
        createLeagueRequest.leagueType = leagueType;
        createLeagueRequest.sport = sport;
        createLeagueRequest.startWeek = startWeek;
        createLeagueRequest.endWeek = endWeek;
        createLeagueRequest.totalPicks = totalPicks;
        createLeagueRequest.keyPicks = keyPicks;
        createLeagueRequest.keyPickBonus = keyPickBonus;
        await pickemClient.createLeague(createLeagueRequest);
        window.location.href = '/';
    };

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const sportSeasonInformation = await pickemClient.getCurrentSportsSeasonInformation();
            setSportSeasonInformation(sportSeasonInformation);
            const max = getCurrentMaxWeeks(sportSeasonInformation, getSportNameFromNumber(sport));
            setEndWeek(max);
            setEndingWeekNumberLabel(getEndingWeekLabel(max));
        }

        fetchData();
    }, []);

    return (
        <Box style={{ maxWidth: 600, margin: '0 auto', marginTop: 16 }}>
            <Text size="xl" weight={700} style={{ marginBottom: 12 }}>Create a League</Text>
            <form onSubmit={handleSubmit}>
                <Grid gutter="md">
                    <Grid.Col span={4}>
                        <TextInput
                            label="League Name"
                            value={leagueName}
                            onChange={e => setLeagueName(e.target.value)}
                            required
                        />
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <Select
                            label="League Type"
                            value={String(leagueType)}
                            onChange={(v) => setLeagueType(Number(v))}
                            data={LeagueTypes.map(opt => ({ value: String(opt.value), label: opt.label }))}
                            required
                        />
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Select
                            label="Sport"
                            value={String(sport)}
                            onChange={(v) => {
                                const sportNumber = Number(v);
                                setSport(sportNumber);
                                const sportName: string = getSportNameFromNumber(sportNumber);
                                const newMaxWeeks = getCurrentMaxWeeks(sportSeasonInformation, sportName);
                                setEndWeek(newMaxWeeks);
                                setMaxWeeks(newMaxWeeks);
                                setEndingWeekNumberLabel(getEndingWeekLabel(newMaxWeeks));
                            }}
                            data={Sports.map(opt => ({ value: String(opt.value), label: opt.label }))}
                            required
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NumberInput
                            label="Starting Week Number"
                            value={startWeek}
                            onChange={(v) => setStartWeek(v || 1)}
                            required
                            min={1}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NumberInput
                            label={endingWeekNumberLabel}
                            value={endWeek}
                            onChange={(v) => setEndWeek(v || endWeek)}
                            required
                            min={startWeek}
                            max={maxWeeks}
                        />
                        <Text size="xs" style={{ marginLeft: 8 }}></Text>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <NumberInput
                            label="Total Number of Picks"
                            value={totalPicks}
                            onChange={(v) => setTotalPicks(v || 1)}
                            required
                            min={1}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <NumberInput
                            label="Total Number of Key Picks"
                            value={keyPicks}
                            onChange={(v) => setKeyPicks(v || 0)}
                            required
                            min={0}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <NumberInput
                            label="Key Pick Bonus"
                            value={keyPickBonus}
                            onChange={(v) => setKeyPickBonus(v || 0)}
                            required
                            min={0}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Button type="submit" fullWidth>
                            Create League
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Box>
    );
}

function getEndingWeekLabel(max: number): React.SetStateAction<string> {
    return `Ending Week Number (Max:${max})`;
}

function getSportNameFromNumber(sportNumber: number): string {
    return Sports.find(s => s.value === sportNumber)?.label!;
}

function getCurrentMaxWeeks(sportSeasonInformation: { [key: string]: SeasonDateInformation2; } | undefined, sportName: string) {
    return sportSeasonInformation ? sportSeasonInformation[sportName].weekStartTimes?.length! : -1;
}

