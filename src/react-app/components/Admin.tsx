import { Button, Grid, Typography } from '@mui/material'
import { Component } from 'react'
import { queryClient } from '../main';

type Props = {}

type State = {}

function resetUserCache() {
    console.log(`Clearing react query cache.`);
    queryClient.clear();
    console.log(`Cache clear complete.`);
};

class Admin extends Component<Props, State> {
    state = {}
    
    
    render() {
        return (
            <>
                <Typography variant="h5">
                    Website Utilities
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                        <Button type="button" variant="contained" color="primary" onClick={resetUserCache}>
                            Reset Cache
                        </Button>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default Admin