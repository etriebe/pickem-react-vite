import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import { Alert, Button, Container, Group, Paper, ScrollArea, Stack, Table, Text, Title } from '@mantine/core';
import { SpreadWeekPickDTO, GameDTO, SpreadGamePickDTO, TeamDTO, ApiException } from '../../services/PickemApiClient';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { PageType, SiteUtilities } from '../../utilities/SiteUtilities';
import MakePicksTeamCell from '../MakePicksTeamCell';
import LeagueNavigationBreadcrumbs from '../LeagueNavigationBreadcrumbs';
import Loading from '../Loading';
import Header from '../Header';

enum MakePicksColumnType {
    AwayTeam = 1,
    HomeTeam = 2,
    KeyPick = 3,
    GameStartTime = 4,
}

export default function PickemMakePicks() {
    const [selectedPicksCount, setSelectedPicksCount] = useState(-1);
    const [selectedKeyPicksCount, setSelectedKeyPicksCount] = useState(-1);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { leagueId, weekNumber } = useParams();
    const weekNumberConverted = parseInt(weekNumber!);
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const makePicksQuery = useQuery({
        queryKey: ['makepicks', leagueId, weekNumberConverted],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getMakePicks(leagueId!, weekNumberConverted);
        },
    });

    const currentPicks = makePicksQuery.data?.picks;
    const selectedPicksOriginal = currentPicks?.gamePicks?.length ?? 0;
    const selectedKeyPicksOriginal = currentPicks?.gamePicks?.filter((p) => p.isKeyPicked).length ?? 0;
    const weekInformation = makePicksQuery.data?.league?.seasonInformation?.weekStartTimes?.find(
        (w) => w.weekNumber === weekNumberConverted,
    );
    const weekDescription = makePicksQuery.data
        ? `${SiteUtilities.getWeekDescriptionFromWeekNumber(
              makePicksQuery.data.league!.seasonInformation!,
              weekNumberConverted,
              true,
          )} Picks`
        : '';

    const formatCell = (game: GameDTO, cellType: MakePicksColumnType): React.ReactNode => {
        if (cellType === MakePicksColumnType.GameStartTime) {
            const gameStartTime = game.gameStartTime;
            const lockSymbol = gameStartTime ? (new Date(gameStartTime) <= new Date() ? '🔒' : '') : '';
            const gameStartDate = gameStartTime ? new Date(gameStartTime) : new Date();
            return <>{lockSymbol}{SiteUtilities.getFormattedGameTime(gameStartDate, isSmallScreen)}</>;
        }

        const teamChosen = cellType === MakePicksColumnType.AwayTeam ? game.awayTeam : game.homeTeam;
        if (!teamChosen) {
            return null;
        }

        const cellText = isSmallScreen ? `${teamChosen.abbreviation}` : `${teamChosen.name}`;
        const gameSpread = makePicksQuery.data?.league?.settings?.lockSpreadsDuringWeek
            ? game.spreadAtLockTime
            : game.currentSpread;
        const teamDisplayText = cellType === MakePicksColumnType.HomeTeam
            ? `${cellText} (${SiteUtilities.getFormattedSpreadAmount(gameSpread!)})`
            : cellText;

        if (cellType === MakePicksColumnType.KeyPick) {
            const gamePick = currentPicks?.gamePicks?.find((g) => g.gameID === game.id);
            return gamePick?.isKeyPicked ? <>🔑</> : <></>;
        }

        const imagePath = SiteUtilities.getTeamIconPathFromTeam(teamChosen, makePicksQuery.data?.league!.sport!);
        const altText = SiteUtilities.getAltTextFromTeam(teamChosen);
        return (
            <MakePicksTeamCell
                imagePath={imagePath}
                altText={altText}
                isSmallScreen={isSmallScreen}
                cellText={teamDisplayText}
            />
        );
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCellClick = (game: GameDTO, cellType: MakePicksColumnType, chosenTeam?: TeamDTO) => {
        if (!currentPicks || !currentPicks.gamePicks) {
            return;
        }

        let picksAllowed = makePicksQuery.data?.league?.settings?.totalPicks ?? 0;
        let keyPicksAllowed = makePicksQuery.data?.league?.settings?.keyPicks ?? 0;
        if (weekInformation?.allowAllPicks) {
            picksAllowed = -1;
            keyPicksAllowed = 0;
        }

        const currentGame = makePicksQuery.data?.games?.find((g) => g.id === game.id);
        if (!currentGame) {
            return;
        }

        if (currentGame.gameStartTime && new Date(currentGame.gameStartTime) <= new Date()) {
            setSnackbarMessage('You cannot change your pick for a game that has already started.');
            setOpen(true);
            return;
        }

        let currentPick = currentPicks.gamePicks.find((g) => g.gameID === game.id);

        if (cellType === MakePicksColumnType.GameStartTime) {
            return;
        }

        if (cellType === MakePicksColumnType.KeyPick) {
            if (!currentPick) {
                setSnackbarMessage('You cannot select a key pick unless you have selected the game first.');
                setOpen(true);
                return;
            }
            if (currentPick.isKeyPicked) {
                currentPick.isKeyPicked = false;
            } else {
                const currentKeyPickCount = currentPicks.gamePicks.filter((g) => g.isKeyPicked).length;
                if (currentKeyPickCount >= keyPicksAllowed) {
                    setSnackbarMessage('You have selected too many picks. Please unselect one before selecting again.');
                    setOpen(true);
                    return;
                }
                currentPick.isKeyPicked = true;
            }
            setSelectedKeyPicksCount(getSelectedKeyPicksCount(currentPicks));
            return;
        }

        if (!chosenTeam) {
            return;
        }

        if (!currentPick) {
            if (picksAllowed !== -1 && currentPicks.gamePicks.length >= picksAllowed) {
                setSnackbarMessage('You have selected too many picks. Please unselect one before selecting again.');
                setOpen(true);
                return;
            }
            currentPick = createPickObject(currentGame, chosenTeam);
            currentPicks.gamePicks.push(currentPick);
        } else {
            if ((currentPick.sidePicked === 0 && currentGame.homeTeam === chosenTeam) ||
                (currentPick.sidePicked === 1 && currentGame.awayTeam === chosenTeam)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                currentPicks.gamePicks.splice(indexOfPick, 1);
            } else if ((currentPick.sidePicked === 0 && currentGame.awayTeam === chosenTeam) ||
                (currentPick.sidePicked === 1 && currentGame.homeTeam === chosenTeam)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                currentPicks.gamePicks.splice(indexOfPick, 1);
            }
        }

        setSelectedPicksCount(getSelectedPicksCount(currentPicks));
        setSelectedKeyPicksCount(getSelectedKeyPicksCount(currentPicks));
    };

    const handleSubmitPicks = async () => {
        if (!currentPicks) {
            return;
        }

        const pickemClient = PickemApiClientFactory.createClient();
        try {
            await pickemClient.upsertSpreadWeekPick(currentPicks);
            setSnackbarMessage('Your picks have been submitted successfully!');
            setOpen(true);
        } catch (error: ApiException | any) {
            setSnackbarMessage(`There was an error submitting your picks. ${error.response}`);
            setOpen(true);
        }
    };

    function createPickObject(currentGame: GameDTO, chosenTeam: TeamDTO) {
        const currentPick = new SpreadGamePickDTO();
        currentPick.gameID = currentGame?.id;
        currentPick.gameStartTime = currentGame?.gameStartTime;
        currentPick.sidePicked = currentGame?.homeTeam === chosenTeam ? 0 : 1;
        currentPick.isKeyPicked = false;
        currentPick.spreadWhenPicked = currentGame?.currentSpread!;
        currentPick.isEdited = false;
        currentPick.isLocked = false;
        currentPick.timeOfPick = new Date();
        currentPick.pickType = makePicksQuery.data?.league?.type;
        return currentPick;
    }

    const rowClassName = isSmallScreen ? 'makePickContainerSmall' : 'makePickContainer';

    const getCellClassName = (game: GameDTO, cellType: MakePicksColumnType) => {
        const gamePicked = currentPicks?.gamePicks?.find((p) => p.gameID === game.id);
        if (!gamePicked) {
            return '';
        }
        if (cellType === MakePicksColumnType.AwayTeam && gamePicked.sidePicked === 1) {
            return 'teamPicked';
        }
        if (cellType === MakePicksColumnType.HomeTeam && gamePicked.sidePicked === 0) {
            return 'teamPicked';
        }
        return '';
    };

    return (
        <Container fluid px="md" py="md">
            <Paper shadow="md" p="md" radius="md">
                <Stack spacing="md">
                    <Header leagueId={leagueId} weekNumber={weekNumberConverted} isSmallScreen={isSmallScreen} />
                    <Title order={isSmallScreen ? 4 : 3} align="center">
                        {makePicksQuery.data?.league?.leagueName}
                    </Title>
                    <LeagueNavigationBreadcrumbs
                        league={makePicksQuery.data?.league!}
                        currentWeekNumber={weekNumberConverted}
                        navigationTitle={weekDescription}
                        pageType={PageType.MakePicksPage}
                        isSmallScreen={isSmallScreen}
                    />
                    {open && (
                        <Alert title="Notice" color="blue" variant="light" onClose={handleClose}>
                            {snackbarMessage}
                        </Alert>
                    )}
                    <Text align="center">
                        {weekInformation?.allowAllPicks
                            ? 'Pick all games. No Key Picks'
                            : `${selectedPicksCount === -1 ? selectedPicksOriginal : selectedPicksCount} / ${makePicksQuery.data?.league?.settings?.totalPicks} Picks, ${selectedKeyPicksCount === -1 ? selectedKeyPicksOriginal : selectedKeyPicksCount} / ${makePicksQuery.data?.league?.settings?.keyPicks} Key Picks`}
                    </Text>
                    {makePicksQuery.isPending ? (
                        <Loading />
                    ) : (
                        <ScrollArea style={{ height: '60vh' }}>
                            <Table striped highlightOnHover verticalSpacing="xs" fontSize="sm">
                                <thead>
                                    <tr>
                                        <th>Away</th>
                                        <th>Home</th>
                                        <th>Game Time</th>
                                        <th>Key</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {makePicksQuery.data?.games?.map((game) => (
                                        <tr key={game.id} className={rowClassName}>
                                            <td
                                                className={getCellClassName(game, MakePicksColumnType.AwayTeam)}
                                                onClick={() => handleCellClick(game, MakePicksColumnType.AwayTeam, game.awayTeam!)}
                                            >
                                                {formatCell(game, MakePicksColumnType.AwayTeam)}
                                            </td>
                                            <td
                                                className={getCellClassName(game, MakePicksColumnType.HomeTeam)}
                                                onClick={() => handleCellClick(game, MakePicksColumnType.HomeTeam, game.homeTeam!)}
                                            >
                                                {formatCell(game, MakePicksColumnType.HomeTeam)}
                                            </td>
                                            <td onClick={() => handleCellClick(game, MakePicksColumnType.GameStartTime)}>
                                                {formatCell(game, MakePicksColumnType.GameStartTime)}
                                            </td>
                                            <td
                                                className={getCellClassName(game, MakePicksColumnType.KeyPick)}
                                                onClick={() => handleCellClick(game, MakePicksColumnType.KeyPick)}
                                            >
                                                {formatCell(game, MakePicksColumnType.KeyPick)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </ScrollArea>
                    )}
                    <Group position="right" spacing="md">
                        <Button onClick={handleSubmitPicks}>Submit Picks</Button>
                        <Button component="a" href="/" variant="outline">
                            Cancel
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Container>
    );
}

function getSelectedPicksCount(picks: SpreadWeekPickDTO): React.SetStateAction<number> {
    return picks.gamePicks!.length;
}

function getSelectedKeyPicksCount(currentPicks: SpreadWeekPickDTO): React.SetStateAction<number> {
    if (!currentPicks || !currentPicks.gamePicks) {
        return 0;
    }
    return currentPicks.gamePicks.filter((p) => p.isKeyPicked).length;
}
