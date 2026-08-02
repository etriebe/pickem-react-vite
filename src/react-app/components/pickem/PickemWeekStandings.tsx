import { useParams } from 'react-router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Paper, ScrollArea, Table, Title, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { GameDTO, UserInfo } from '../../services/PickemApiClient';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { PageType, SiteUtilities } from '../../utilities/SiteUtilities';
import LeagueNavigationBreadcrumbs from '../LeagueNavigationBreadcrumbs';
import Header from '../Header';
import PickemWeekStandingsHeaderTeamCell from '../PickemWeekStandingsTeamCell';
import TeamIcon from '../TeamIcon';
import Loading from '../Loading';

type StandingsColumn = {
    field: string;
    header: React.ReactNode;
    renderCell: (row: UserInfo) => React.ReactNode;
};

export default function PickemWeekStandings() {
    const { leagueId, weekNumber } = useParams();
    const weekNumberConverted = parseInt(weekNumber!);
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const weekStandingsQuery = useQuery({
        queryKey: ['weekstandings', leagueId, weekNumberConverted],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getWeekStandings(leagueId!, weekNumberConverted);
        },
    });

    const league = weekStandingsQuery.data?.league;
    const games = React.useMemo(() => {
        const sorted = [...(weekStandingsQuery.data?.games ?? [])];
        sorted.sort((a, b) => {
            try {
                if (a.gameStartTime && b.gameStartTime) {
                    const aGameStartTime = new Date(a.gameStartTime);
                    const bGameStartTime = new Date(b.gameStartTime);
                    if (a.result && b.result) {
                        const gameAStatus = a.result.status;
                        const gameBStatus = b.result.status;
                        if (gameAStatus !== undefined && gameBStatus !== undefined && gameAStatus !== gameBStatus) {
                            if (gameAStatus === 1) {
                                return -1;
                            }
                            if (gameAStatus === 2) {
                                if (gameBStatus === 1) {
                                    return 1;
                                }
                                return -1;
                            }
                        }
                    }
                    return aGameStartTime.getTime() - bGameStartTime.getTime();
                }
                return 0;
            } catch (e) {
                console.error('Error sorting games in PickemWeekStandings: ', e);
                return 0;
            }
        });
        return sorted;
    }, [weekStandingsQuery.data?.games]);

    const users = weekStandingsQuery.data?.users ?? [];
    const results = weekStandingsQuery.data?.results ?? [];
    const picks = weekStandingsQuery.data?.picks ?? [];

    const getWeekPoints = (userId: string | undefined) => {
        if (!userId) {
            return 0;
        }
        const weekResult = results.find((wr) => wr.userId === userId);
        return weekResult?.totalPoints ?? 0;
    };

    const getSeasonPoints = (userId: string | undefined) => {
        if (!userId) {
            return 0;
        }
        const userSeason = league?.userSeasons?.find((us) => us.userId === userId);
        const userWeekResult = results.find((wr) => wr.userId === userId);
        let seasonPoints = userSeason?.totalPoints ?? 0;
        if (!userSeason?.processedWeekResults?.find((wr) => wr === userWeekResult?.id)) {
            seasonPoints += userWeekResult?.totalPoints ?? 0;
        }
        return seasonPoints;
    };

    const getTrophyString = (userId: string | undefined) => {
        if (!userId) {
            return '';
        }
        const userWeekResult = results.find((wr) => wr.userId === userId);
        const trophies: string[] = [];
        if (userWeekResult?.trophies) {
            userWeekResult.trophies.map((t) => trophies.push(SiteUtilities.ConvertTrophyToEmoji(t)));
        }
        return trophies.join('');
    };

    const renderUserCell = (user: UserInfo) => {
        const userName = SiteUtilities.getShortenedUserNameFromId(users, user.id, user.email);
        return (
            <div className="centerDivContainer standingsUserName">
                <span>{userName}</span>
            </div>
        );
    };

    const renderGamePickCell = (user: UserInfo, game: GameDTO) => {
        const userPicks = picks.find((p) => p.userId === user.id);
        const gamePick = userPicks?.gamePicks?.find((gp) => gp.gameID === game.id);

        if (!gamePick) {
            return <></>;
        }

        const teamPicked = gamePick.sidePicked === 0 ? game.homeTeam : game.awayTeam;
        const pickImagePath = SiteUtilities.getTeamIconPathFromTeam(teamPicked!, league!.sport!);
        const pickAltText = SiteUtilities.getAltTextFromTeam(teamPicked!);
        const userWeekResult = results.find((wr) => wr.userId === user.id);
        const userGameResult = userWeekResult?.pickResults?.find((pr) => pr.gameId === game.id);
        const gameResultText = userGameResult?.isFinal ? (userGameResult.success ? '✅' : '❌') : '';

        return (
            <div className="centerDivContainer">
                <TeamIcon imagePath={pickImagePath} altText={pickAltText} useSmallLogo={isSmallScreen} />
                {gamePick.isKeyPicked && <div className="keyPickIndicator">🔑</div>}
                {userGameResult && <div className="gamePickResultIndicator">{gameResultText}</div>}
            </div>
        );
    };

    const renderGameHeader = (game: GameDTO) => {
        return <PickemWeekStandingsHeaderTeamCell game={game} currentLeague={league!} isSmallScreen={isSmallScreen} />;
    };

    const renderWeekResultsCell = (user: UserInfo) => {
        const userWeekResult = results.find((wr) => wr.userId === user.id);
        const userPicks = picks.find((p) => p.userId === user.id);
        if (!userWeekResult || !userPicks) {
            return <div className="centerDivContainer">0 / 0</div>;
        }

        let maximumPoints = 0;
        for (const pick of userPicks.gamePicks ?? []) {
            const pickResult = userWeekResult.pickResults?.find((pr) => pr.gameId === pick.gameID);
            if (!pickResult || !pickResult.isFinal) {
                maximumPoints += 1;
                if (pick.isKeyPicked) {
                    maximumPoints += league?.settings?.keyPickBonus ?? 0;
                }
                continue;
            }
            if (pickResult.success && pickResult.totalPoints) {
                maximumPoints += pickResult.totalPoints;
            }
        }

        const totalPoints = userWeekResult.totalPoints;
        return (
            <div className="centerDivContainer">
                {totalPoints} / {maximumPoints}
            </div>
        );
    };

    const sortedUsers = React.useMemo(() => {
        return [...users].sort((a, b) => getWeekPoints(b.id) - getWeekPoints(a.id));
    }, [users, weekStandingsQuery.data]);

    const columnList: StandingsColumn[] = [
        {
            field: 'user',
            header: <div className="standingsHeader">User</div>,
            renderCell: renderUserCell,
        },
        {
            field: 'weekPoints',
            header: <div className="standingsHeader">Week<br />Points</div>,
            renderCell: renderWeekResultsCell,
        },
    ];

    games.forEach((game) => {
        columnList.push({
            field: `game_${game.id}`,
            header: renderGameHeader(game),
            renderCell: (user: UserInfo) => renderGamePickCell(user, game),
        });
    });

    columnList.push({
        field: 'seasonPoints',
        header: <div className="standingsHeader">Season</div>,
        renderCell: (user: UserInfo) => (
            <div className="centerDivContainer">{getSeasonPoints(user.id)}</div>
        ),
    });

    columnList.push({
        field: 'trophy',
        header: <div className="standingsHeader">Trophies</div>,
        renderCell: (user: UserInfo) => (
            <div className="centerDivContainer">{getTrophyString(user.id)}</div>
        ),
    });

    const getRowClassName = (isSmall: boolean) => (isSmall ? 'makePickContainerSmall' : 'makePickContainer');

    const longDescription = true;
    const description = SiteUtilities.getWeekDescriptionFromWeekNumber(league?.seasonInformation!, weekNumberConverted, longDescription);
    const pageTitle = `${description} Standings`;

    return (
        <Container fluid px="md" py="md">
            <Paper shadow="md" p="md" radius="md">
                <Stack spacing="md">
                    <Header leagueId={leagueId} weekNumber={weekNumberConverted} isSmallScreen={isSmallScreen} />
                    <Title order={3} align="center">
                        {league?.leagueName}
                    </Title>
                    <LeagueNavigationBreadcrumbs
                        league={league!}
                        currentWeekNumber={weekNumberConverted}
                        navigationTitle={pageTitle}
                        pageType={PageType.WeekStandingsPage}
                        isSmallScreen={isSmallScreen}
                    />
                    {weekStandingsQuery.isPending ? (
                        <Loading />
                    ) : (
                        <ScrollArea style={{ height: '75vh' }}>
                            <Table striped highlightOnHover verticalSpacing="xs" fontSize="sm">
                                <thead>
                                    <tr>
                                        {columnList.map((column) => (
                                            <th key={column.field}>{column.header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedUsers.map((user) => (
                                        <tr key={user.id} className={getRowClassName(isSmallScreen)}>
                                            {columnList.map((column) => (
                                                <td key={column.field}>{column.renderCell(user)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </ScrollArea>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
}
