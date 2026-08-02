import * as React from 'react';
import { Alert, Button, Card, Group, Stack, Text } from '@mantine/core';
import { League } from '../services/PickemApiClient';
import { SiteUtilities } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

export interface SquaresLeagueCardProps {
    league: League;
}

export default function SquaresLeagueCard({ league }: SquaresLeagueCardProps) {
    const leagueYear = league.year?.replace('_', '-');
    const editLeagueLink = SiteUtilities.getEditLeagueLink(league.id!);
    const squaresCreateBoardLink = SiteUtilities.getSquaresCreateBoardLink(league.id!);
    const squaresBrowseBoardsLink = SiteUtilities.getSquaresBrowseBoardsLink(league.id!);
    const isOffSeason = LeagueUtilities.isOffSeason(league);
    const userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
    const isAdmin = league.leagueAdminIds?.find((a) => a === userInfo.id);
    const [copyInviteMessage, setCopyInviteMessage] = React.useState('');

    const copyLeagueInvite = async () => {
        const fullCopyInviteLink = `${window.location.origin}${SiteUtilities.getInviteLink(league.id!)}`;
        await navigator.clipboard.writeText(fullCopyInviteLink);
        setCopyInviteMessage('Copied invite link!');
        window.setTimeout(() => setCopyInviteMessage(''), 4000);
    };

    return (
        <Card shadow="sm" radius="md" p="lg">
            <Stack spacing="md">
                <Stack spacing="xs">
                    <Text weight={700} size="lg">
                        {league.leagueName} - {leagueYear}
                    </Text>
                    <Text size="sm" color="dimmed">
                        {isOffSeason ? 'Off season' : 'Active league'}
                    </Text>
                </Stack>
                {isAdmin && (
                    <Stack spacing="xs">
                        <Button component="a" href={editLeagueLink} variant="outline" compact>
                            Edit League
                        </Button>
                        <Button onClick={copyLeagueInvite} variant="outline" compact>
                            Copy Invite
                        </Button>
                        <Button component="a" href={squaresCreateBoardLink} variant="light" compact>
                            Create New Squares Board
                        </Button>
                    </Stack>
                )}
                <Group position="right">
                    {isOffSeason ? (
                        <Button variant="filled" disabled>
                            Renew League{!isAdmin ? ' - Notify League Admin' : ''}
                        </Button>
                    ) : (
                        <Button component="a" href={squaresBrowseBoardsLink} variant="filled">
                            Browse Boards
                        </Button>
                    )}
                </Group>
                {copyInviteMessage && (
                    <Alert title="Success" color="green">
                        {copyInviteMessage}
                    </Alert>
                )}
            </Stack>
        </Card>
    );
}
