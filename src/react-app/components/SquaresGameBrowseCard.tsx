import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { GameDTO } from '../services/PickemApiClient';
import { SiteUtilities } from '../utilities/SiteUtilities';
import TeamIcon from './TeamIcon';

type SquaresGameBrowseCardProps = {
    leagueId: string;
    boardId: string;
    game: GameDTO;
    isSmallScreen: boolean;
};

function SquaresGameBrowseCard({ leagueId, boardId, game, isSmallScreen }: SquaresGameBrowseCardProps) {
    const homeImagePath = SiteUtilities.getTeamIconPathFromTeam(game.homeTeam!, game.sport!);
    const homeAltText = SiteUtilities.getAltTextFromTeam(game.homeTeam!);
    const awayImagePath = SiteUtilities.getTeamIconPathFromTeam(game.awayTeam!, game.sport!);
    const awayAltText = SiteUtilities.getAltTextFromTeam(game.awayTeam!);
    const squaresBoardLink = SiteUtilities.getSquaresBoardLink(leagueId, boardId);

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
                    <Button component="a" href={squaresBoardLink} variant="light">
                        Select Squares
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
}

export default SquaresGameBrowseCard;
