import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React from 'react';
import { Sports } from '../utilities/SiteUtilities';
import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import PublicLeagueCard from './PublicLeagueCard';

type Props = {}

function BrowseLeagues({ }: Props) {
    const [sport, setSport] = React.useState(1);

    const browseLeaguesQuery = useQuery({
        queryKey: ['browseleagues', sport],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getPublicLeagues(sport)
        },
        refetchOnWindowFocus: false,
    });

    return (
        <>

            <Typography variant='h2'>Public Leagues</Typography>

            <FormControl
                sx={{
                    '& .MuiTextField-root': { m: 1 },
                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                        background: 'var(--template-palette-background-default)',
                        padding: '0 4px',
                        zIndex: 1,
                    },
                }}>
                <InputLabel id="sport-select-label">Sport</InputLabel>
                <Select
                    labelId="sport-select-label"
                    id="sport-select"
                    value={sport}
                    label="Age"
                    onChange={e => setSport(Number(e.target.value))}
                >
                    {Sports.map(s =>
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    )}
                </Select>
            </FormControl>

            <Typography variant='subtitle2'>{browseLeaguesQuery.data?.length} League(s) Found</Typography>
            <Grid
                container
                spacing={2}
                padding={2}
                sx={{
                    mb: (theme) => theme.spacing(2),
                    width: '100%',
                }}
            >
                {browseLeaguesQuery.data?.map((l) => {
                    return <React.Fragment key={l.id}>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <PublicLeagueCard leagueId={l.id!} leagueName={l.leagueName!} leagueYear={l.year!} key={l.id} sport={l.sport!} numberOfMembers={l.userSeasons?.length!} />
                        </Grid>
                    </React.Fragment>;
                })}
            </Grid>
        </>
    )
}

export default BrowseLeagues
