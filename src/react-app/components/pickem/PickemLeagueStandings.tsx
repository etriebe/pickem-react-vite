import { useParams } from 'react-router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Paper, ScrollArea, Table, Text, Title, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { UserInfo } from '../../services/PickemApiClient';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import Header from '../Header';

type StandingsColumn = {
    field: string;
    header: React.ReactNode;
    renderCell: (row: UserInfo) => React.ReactNode;
};

export default function PickemLeagueStandings() {
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const leagueStandingsQuery = useQuery({
        queryKey: ['leaguestandings', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getLeagueStandings(leagueId!);
        },
    });

    const league = leagueStandingsQuery.data?.league;
    const users = leagueStandingsQuery.data?.users ?? [];
    const results = leagueStandingsQuery.data?.results ?? [];
    const startingWeekNumber = league?.startingWeekNumber ?? 1;
    const endingWeekNumber = league?.endingWeekNumber ?? 1;

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

    const renderSeasonResultsCell = (user: UserInfo) => {
        return (
            <div className="centerDivContainer">
                {getSeasonPoints(user.id)}
            </div>
        );
    };

    const renderWeekResultCell = (user: UserInfo, weekNumber: number) => {
        const userWeekResult = results.find((wr) => wr.userId === user.id && wr.weekNumber === weekNumber);
        const trophies: string[] = [];
        if (userWeekResult?.trophies) {
            userWeekResult.trophies.map((t) => trophies.push(SiteUtilities.ConvertTrophyToEmoji(t)));
        }
        const trophyString = trophies.join('');

        if (!userWeekResult) {
            return <div className="centerDivContainer">-</div>;
        }

        return (
            <div className="centerDivContainer">
                {userWeekResult.totalPoints}
                {trophyString}
            </div>
        );
    };

    const sortedUsers = React.useMemo(() => {
        return [...users].sort((a, b) => getSeasonPoints(b.id) - getSeasonPoints(a.id));
    }, [users, leagueStandingsQuery.data]);

    const columnList: StandingsColumn[] = [
        {
            field: 'user',
            header: <div className="standingsHeader">User</div>,
            renderCell: renderUserCell,
        },
        {
            field: 'seasonPoints',
            header: <div className="standingsHeader">Season<br />Points</div>,
            renderCell: renderSeasonResultsCell,
        },
    ];

    for (let weekNumber = startingWeekNumber; weekNumber <= endingWeekNumber; weekNumber++) {
        columnList.push({
            field: `week_${weekNumber}`,
            header: <div className="standingsHeader">Week {weekNumber}</div>,
            renderCell: (user: UserInfo) => renderWeekResultCell(user, weekNumber),
        });
    }

    columnList.push({
        field: 'trophies',
        header: <div className="standingsHeader">Trophies</div>,
        renderCell: (user: UserInfo) => (
            <div className="centerDivContainer">{getTrophyString(user.id)}</div>
        ),
    });

    const getRowClassName = (isSmall: boolean) => {
        return isSmall ? 'makePickContainerSmall' : 'makePickContainer';
    };

    return (
        <Container fluid px="md" py="md">
            <Paper shadow="md" p="md" radius="md">
                <Stack spacing="md">
                    <Header leagueId={leagueId} weekNumber={league?.currentWeekNumber} isSmallScreen={isSmallScreen} />
                    <Title order={3} align="center">
                        {league?.leagueName}
                    </Title>
                    <Title order={4} align="center">
                        Season Standings
                    </Title>
                    {leagueStandingsQuery.isPending ? (
                        <Text>Loading...</Text>
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
