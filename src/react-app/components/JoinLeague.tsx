import { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Container, Stack, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import Loading from './Loading';
import { SiteUtilities } from '../utilities/SiteUtilities';

type Props = {}

function JoinLeague({}: Props) {
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
        let message = '';
        try {
            message = await pickemClient.addUserToLeague(leagueId);
            setJoinMessage(message);
            setOpen(true);
        } catch (error) {
            setJoinMessage(message || 'Unable to join league.');
            setOpen(true);
        }
    };

    if (leagueQuery.isPending) {
        return <Loading />;
    }

    return (
        <Container size="sm" py="xl">
            <Stack spacing="xl">
                <Text size="xl" weight={700}>
                    Join "{leagueQuery.data?.leagueName}"
                </Text>
                <Text>Members: {leagueQuery.data?.userSeasons?.length ?? 0}</Text>
                <Text>Sport: {SiteUtilities.getSportTypeFromNumber(leagueQuery.data?.sport!)?.label}</Text>
                <Text>League Type: {SiteUtilities.getLeagueTypeFromNumber(leagueQuery.data?.sport!)?.label}</Text>
                <Button onClick={handleJoinLeague}>Join League</Button>
                {open && (
                    <Alert title="League join status" color="blue" onClose={() => setOpen(false)}>
                        {joinMessage}
                    </Alert>
                )}
            </Stack>
        </Container>
    );
}

export default JoinLeague;
