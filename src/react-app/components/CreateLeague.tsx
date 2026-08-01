import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CreateLeagueRequest, SeasonDateInformation } from '../services/PickemApiClient';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { Sports, LeagueTypes } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { queryClient } from '../main';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { NumberInput } from '@mantine/core';

export default function CreateLeague() {
    const [leagueName, setLeagueName] = useState('');
    const [leagueType, setLeagueType] = useState(1);
    const [sport, setSport] = useState(1);
    const [startWeek, setStartWeek] = useState<string | number>(1);
    const [endWeek, setEndWeek] = useState<string | number>('');
    const [totalPicks, setTotalPicks] = useState(7);
    const [keyPicks, setKeyPicks] = useState(1);
    const [keyPickBonus, setKeyPickBonus] = useState(1);
    const [maxWeeks, setMaxWeeks] = useState(-1);
    const [pointsForCorrectPickPerRoundCSV, setPointsForCorrectPickPerRoundCSV] = useState('');
    const [numberOfBracketsPerPerson, setNumberOfBracketsPerPerson] = useState(1);

    const allBracketsQuery = useQuery({
        queryKey: ['allbrackets'],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getActiveBrackets();
        },
    });

    const sportSeasonInformationQuery = useQuery({
        queryKey: ['sportseasoninformation'],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const sportSeasonInformation = await pickemClient.getCurrentSportsSeasonInformation();
            changeSport(setSport, 1 /* NFL */, sportSeasonInformation, setEndWeek, setMaxWeeks);
            return sportSeasonInformation;
        },
    });

    let currentSportsBracket;
    let currentBracketName;
    if (allBracketsQuery.isSuccess) {
        currentSportsBracket = allBracketsQuery.data.find(b => b.sport === sport);
        if (currentSportsBracket) {
            currentBracketName = currentSportsBracket.bracketName;
        }
        else {
            currentBracketName = `No active brackets for ${LeagueUtilities.getSportNameFromNumber(sport)}`;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const createLeagueRequest = new CreateLeagueRequest();
        createLeagueRequest.leagueName = leagueName;
        createLeagueRequest.leagueType = leagueType;
        createLeagueRequest.sport = sport;
        createLeagueRequest.startingWeekNumber = Number(startWeek);
        createLeagueRequest.endingWeekNumber = Number(endWeek);
        createLeagueRequest.totalPicks = totalPicks;
        createLeagueRequest.keyPicks = keyPicks;
        createLeagueRequest.keyPickBonus = keyPickBonus;
        createLeagueRequest.pointsForCorrectPickPerRoundCSV = pointsForCorrectPickPerRoundCSV;
        createLeagueRequest.numberOfBracketsPerPerson = numberOfBracketsPerPerson;
        await pickemClient.createLeague(createLeagueRequest);
        queryClient.invalidateQueries({ queryKey: ['leagues'] });
        window.location.href = '/';
    };

    /*
    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const sportSeasonInformation = await pickemClient.getCurrentSportsSeasonInformation();
            setSportSeasonInformation(sportSeasonInformation);
            const max = LeagueUtilities.getCurrentMaxWeeksForSport(sportSeasonInformation, LeagueUtilities.getSportNameFromNumber(sport));
            setEndWeek(max);
            setMaxWeeks(max);
            setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(max));
        }

        fetchData();
    }, []);
    */

    return (
        <Box sx={{ p: 2, maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Create a League</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <TextField
                            label="League Name"
                            value={leagueName}
                            onChange={e => setLeagueName(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            helperText="Enter a name for your league"
                        />
                    </Grid>
                    <Grid size={5}>
                        <TextField
                            select
                            label="League Type"
                            value={leagueType}
                            onChange={e => setLeagueType(Number(e.target.value))}
                            fullWidth
                            required
                            variant="outlined">

                            {LeagueTypes.map(option => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={3}>
                        <TextField
                            select
                            label="Sport"
                            value={sport}
                            onChange={e => {
                                if (sportSeasonInformationQuery.isSuccess) {
                                    changeSport(setSport, Number(e.target.value), sportSeasonInformationQuery.data!, setEndWeek, setMaxWeeks);
                                }
                            }}
                            fullWidth
                            required
                            variant="outlined"
                        >
                            {Sports.map(option => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {leagueType != 5 && // We don't need the rest of these parameters for a squares league
                        leagueType != 6 && // We don't need the rest of these parameters for a squares league
                        <>
                            <Grid size={6}>
                                <NumberInput 
                                    label="Starting Week Number"
                                    value={startWeek}
                                    onChange={(val: any) => setStartWeek(val)}
                                    required
                                    min={1}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={6}>
                                <NumberInput 
                                    label={LeagueUtilities.getEndingWeekString(maxWeeks)}
                                    value={endWeek}
                                    onChange={(val: any) => setEndWeek(val)}
                                    required
                                    min={startWeek}
                                    max={maxWeeks}
                                    variant="outlined"
                                />
                                <Typography gutterBottom sx={{ ml: 1 }}>
                                </Typography>
                            </Grid>
                            <Grid size={4}>
                                <NumberInput 
                                    label="Total Number of Picks"
                                    value={totalPicks}
                                    onChange={(val: any) => setTotalPicks(val)}
                                    required
                                    min={1}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={4}>
                                <NumberInput 
                                    label="Total Number of Key Picks"
                                    value={keyPicks}
                                    onChange={(val: any) => setKeyPicks(val)}
                                    required
                                    min={0}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={4}>
                                <NumberInput 
                                    label="Key Pick Bonus"
                                    value={keyPickBonus}
                                    onChange={(val: any) => setKeyPickBonus(val)}
                                    required
                                    min={0}
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    }
                    {leagueType == 6 &&
                        <>
                            <Grid size={12}>
                                <Typography variant="h6" gutterBottom>Bracket: {currentBracketName}</Typography>
                            </Grid>
                            <Grid size={8}>
                                <TextField
                                    label="Points per correct pick per round (CSV)"
                                    value={pointsForCorrectPickPerRoundCSV}
                                    onChange={e => setPointsForCorrectPickPerRoundCSV(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid size={4}>
                                <NumberInput 
                                    label="# of Brackets/Person"
                                    value={numberOfBracketsPerPerson}
                                    onChange={(val: any) => setNumberOfBracketsPerPerson(val)}
                                    required
                                    min={0}
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    }

                    <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create League
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
function changeSport(setSport: React.Dispatch<React.SetStateAction<number>>, sportNumber: number, sportSeasonInformation: {[key: string]: SeasonDateInformation}, setEndWeek: React.Dispatch<React.SetStateAction<string | number>>, setMaxWeeks: React.Dispatch<React.SetStateAction<number>>) {
    setSport(sportNumber);
    const sportName: string = LeagueUtilities.getSportNameFromNumber(sportNumber);
    const newMaxWeeks = LeagueUtilities.getCurrentMaxWeeksForSport(sportSeasonInformation, sportName);
    setEndWeek(newMaxWeeks);
    setMaxWeeks(newMaxWeeks);
}

