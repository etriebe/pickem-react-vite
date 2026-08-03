import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useParams } from 'react-router';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { UserBracketCreateRequest } from '../../services/PickemApiClient';
import { SiteUtilities } from '../../utilities/SiteUtilities';

type Props = {}

function BracketCreateUserBracket({ }: Props) {
    const { leagueId } = useParams();
    const [bracketName, setBracketName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const userBracketCreateRequest = new UserBracketCreateRequest();
        userBracketCreateRequest.bracketName = bracketName;
        userBracketCreateRequest.leagueId = leagueId;
        await pickemClient.createUserBracket(userBracketCreateRequest);
        window.location.href = SiteUtilities.getBracketMakePicksLink(leagueId!);
    };
    return (
        <Box sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 4,
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
                    <Grid size={12}>
                        <TextField
                            label="Bracket Name"
                            value={bracketName}
                            onChange={e => setBracketName(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default BracketCreateUserBracket