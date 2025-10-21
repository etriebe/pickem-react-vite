import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import React from 'react'
import { Sports, SportType } from '../utilities/SiteUtilities';
import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../services/PickemApiClientFactory';

type Props = {}

function BrowseLeagues({ }: Props) {
    const [sport, setSport] = React.useState(1);

    const browseLeaguesQuery = useQuery({
        queryKey: ['browseleagues', sport],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getPublicLeagues(sport)
        },
    });

    return (
        <>
            <Box sx={{
                minWidth: 120,
                '& .MuiTextField-root': { m: 1 },
                '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                    background: 'var(--template-palette-background-default)',
                    padding: '0 4px',
                    zIndex: 1,
                },
            }}>

                <Typography variant='h2'>View Public Leagues</Typography>

                <FormControl fullWidth>
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
            </Box>
        </>
    )
}

export default BrowseLeagues
