import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { SiteUtilities } from '../utilities/SiteUtilities';

type Props = {
    leagueId: string;
    leagueName: string;
    leagueYear: string;
    sport: number;
    numberOfMembers: number;
};

function PublicLeagueCard({ leagueId, leagueName, leagueYear, sport, numberOfMembers }: Props) {
    const formattedLeagueYear = leagueYear.replace('_', '-');
    const sportType = SiteUtilities.getSportTypeFromNumber(sport);
    const inviteLink = SiteUtilities.getInviteLink(leagueId!);

    return (
        <Card shadow="sm" radius="md" p="lg">
            <Stack spacing="xs">
                <Text weight={700} size="lg">
                    {leagueName}
                </Text>
                <Text>{formattedLeagueYear} - {sportType?.label}</Text>
                <Text size="sm" color="dimmed">
                    {numberOfMembers} member(s)
                </Text>
                <Group position="right" mt="md">
                    <Button component="a" href={inviteLink} variant="light">
                        Join League
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}

export default PublicLeagueCard;
