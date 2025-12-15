import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { CreateLeagueRequest, SeasonDateInformation2 } from '../services/PickemApiClient';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { Sports, LeagueTypes } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';

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
        createLeagueRequest.startingWeekNumber = startWeek;
        createLeagueRequest.endingWeekNumber = endWeek;
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
            const max = LeagueUtilities.getCurrentMaxWeeksForSport(sportSeasonInformation, LeagueUtilities.getSportNameFromNumber(sport));
            setEndWeek(max);
            setMaxWeeks(max);
            setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(max));
        }

        fetchData();
    }, []);

    return (
        <Box maxWidth={600} mx="auto" mt={4} sx={{
            '& .MuiTextField-root': { m: 1 },
            '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                background: 'var(--template-palette-background-default)',
                padding: '0 4px',
                zIndex: 1,
            },
        }}>
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
                            InputLabelProps={{ shrink: true }}
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
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}>

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
                                setSport(Number(e.target.value));
                                const sportNumber = Number(e.target.value);
                                const sportName: string = LeagueUtilities.getSportNameFromNumber(sportNumber);
                                const newMaxWeeks = LeagueUtilities.getCurrentMaxWeeksForSport(sportSeasonInformation, sportName);
                                setEndWeek(newMaxWeeks);
                                setMaxWeeks(newMaxWeeks);
                                setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(newMaxWeeks));
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
                    <Grid size={6}>
                        <TextField
                            label="Starting Week Number"
                            type="number"
                            value={startWeek}
                            onChange={e => setStartWeek(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label={endingWeekNumberLabel}
                            type="number"
                            value={endWeek}
                            onChange={e => setEndWeek(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: startWeek, max: maxWeeks }}
                            variant="outlined"
                        />
                        <Typography variant="caption" display="block" gutterBottom sx={{ ml: 1 }}>
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            label="Total Number of Picks"
                            type="number"
                            value={totalPicks}
                            onChange={e => setTotalPicks(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            label="Total Number of Key Picks"
                            type="number"
                            value={keyPicks}
                            onChange={e => setKeyPicks(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            label="Key Pick Bonus"
                            type="number"
                            value={keyPickBonus}
                            onChange={e => setKeyPickBonus(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
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
