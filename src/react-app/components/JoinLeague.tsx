import React, { useState } from 'react'
import { useParams } from 'react-router'
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import { useQuery } from '@tanstack/react-query';
import { Button, Snackbar, SnackbarCloseReason, Typography } from '@mui/material';
import Loading from './Loading';

type Props = {}

function JoinLeague({ }: Props) {
    const { leagueId } = useParams();
    const [joinMessage, setJoinMessage] = useState('');
    const [open, setOpen] = useState(false);

    const leagueQuery = useQuery({
        queryKey: ['joinleague', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getLeagueById(leagueId!);
        },
    });

    const handleJoinLeague = async () => {
        const pickemClient = PickemApiClientFactory.createClient();
        let message = "";
        try {
            message = await pickemClient.addUserToLeague(leagueId);
            setJoinMessage(message);
            setOpen(true);
        }
        catch (error) {

            setJoinMessage(message);
            setOpen(true);
        }
    };
    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    if (leagueQuery.isPending) {
        return <Loading />
    }
    return (
        <>
            <Typography variant="h2">
                Join league {leagueQuery.data?.leagueName}
            </Typography>
            <Typography variant="body1">
                # of Members: {leagueQuery.data?.userSeasons?.length}
            </Typography>
            <Button variant='contained' onClick={() => { handleJoinLeague() }}>
                Join League
            </Button>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message={joinMessage}
            />
        </>
    )
}

export default JoinLeague