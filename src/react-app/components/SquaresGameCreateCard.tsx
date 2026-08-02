import * as React from 'react';
import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { GameDTO } from '../services/PickemApiClient';
import { SiteUtilities } from '../utilities/SiteUtilities';
import TeamIcon from './TeamIcon';
import PickemApiClientFactory from '../services/PickemApiClientFactory';

type SquaresGameCreateCardProps = {
    leagueId: string;
    game: GameDTO;
    isSmallScreen: boolean;
};

function SquaresGameCreateCard({ leagueId, game, isSmallScreen }: SquaresGameCreateCardProps) {
    const homeImagePath = SiteUtilities.getTeamIconPathFromTeam(game.homeTeam!, game.sport!);
    const homeAltText = SiteUtilities.getAltTextFromTeam(game.homeTeam!);
    const awayImagePath = SiteUtilities.getTeamIconPathFromTeam(game.awayTeam!, game.sport!);
    const awayAltText = SiteUtilities.getAltTextFromTeam(game.awayTeam!);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const createResponse = await pickemClient.createSquaresBoard(leagueId, game.id);
        const boardId = createResponse.boardId;
        const newBoardLink = SiteUtilities.getSquaresBoardLink(leagueId, boardId);
        window.location.href = `${window.location.origin}${newBoardLink}`;
    };

    return (
        <Card shadow="sm" radius="md" p="lg">
            <Stack spacing="md">
                <Stack spacing="xs">
                    <Group position="apart" align="center" style={{ width: '100%' }}>
                        <Stack spacing="xs" align="center">
                            <Text size="sm">{game.awayTeam?.name}</Text>
                            <TeamIcon imagePath={awayImagePath} altText={awayAltText} useSmallLogo={false} />
                        </Stack>
                        <Text size="lg">@</Text>
                        <Stack spacing="xs" align="center">
                            <Text size="sm">{game.homeTeam?.name}</Text>
                            <TeamIcon imagePath={homeImagePath} altText={homeAltText} useSmallLogo={false} />
                        </Stack>
                    </Group>
                    <Text size="xs" color="dimmed">
                        Game Time: {SiteUtilities.getFormattedGameTime(game.gameStartTime!, isSmallScreen)}
                    </Text>
                </Stack>
                <Group position="right">
                    <Button onClick={handleSubmit} variant="light">
                        Create Board
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}

export default SquaresGameCreateCard;
