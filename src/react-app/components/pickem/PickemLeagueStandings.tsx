import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueDTO, UserInfo, SpreadWeekResultDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { MantineReactTable, MRT_ColumnDef } from 'mantine-react-table';
import { MantineProvider, useMantineTheme, Title, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Loading from '../Loading';
import { SiteUtilities } from '../../utilities/SiteUtilities';

export default function PickemLeagueStandings() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [columns, setColumns] = useState<MRT_ColumnDef<UserInfo>[]>([]);
    const [userMapping, setUserMapping] = useState<UserInfo[]>();
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const [dataLoaded, setDataLoaded] = useState(false);
    const userColumnWidth = 100;
    const weekColumnWidth = isSmallScreen ? 75 : 75;

    const renderUserCell = (row: UserInfo, userMapping: UserInfo[]): React.ReactNode => {
        const userId = row.id;
        let userName = SiteUtilities.getShortenedUserNameFromId(userMapping, userId, row.email);
        return <div className='centerDivContainer standingsUserName'><span>{userName}</span></div>;
    }

    const renderWeekResultCell = (row: UserInfo, weekResults: SpreadWeekResultDTO[], weekNumber: number): React.ReactNode => {
        const userId = row.id;
        const userWeekResult = weekResults.find(wr => wr.userId === userId && wr.weekNumber === weekNumber);

        if (!userWeekResult) {
            return <>-</>;
        }
        return <div className='centerDivContainer'>
            {userWeekResult.totalPoints}
        </div>;
    }

    const renderSeasonResultsCell = (
        weekResults: SpreadWeekResultDTO[],
        userId: string): React.ReactNode => {
        if (!weekResults) {
            return <>0</>;
        }

        const userWeekResults = weekResults.filter(wr => wr.userId === userId);
        let totalPoints = getTotalPointsForSeason(userWeekResults);
        return <>
            <div>
                {totalPoints}
            </div>
        </>;
    };

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const league = await pickemClient.getLeagueById(leagueId);
            setCurrentLeague(league);

            const leagueUserMapping = await pickemClient.getUserMappingForLeague(leagueId);
            const weekNumber = -1; // Use -1 to get all week results
            const weekResults = await pickemClient.getSpreadWeekResult(leagueId, weekNumber);

            const columnList: MRT_ColumnDef<UserInfo>[] = [
                {
                    accessorKey: 'userName',
                    header: 'User',
                    size: userColumnWidth,
                    Cell: ({ row }: any) => renderUserCell(row.original, leagueUserMapping),
                    enableColumnActions: false,
                    sortingFn: (a: any, b: any) => {
                        const userIdA = a.original.id;
                        const userIdB = b.original.id;
                        const userNameA = leagueUserMapping?.find(u => u.id === userIdA)?.userName || "";
                        const userNameB = leagueUserMapping?.find(u => u.id === userIdB)?.userName || "";
                        if (userNameA === userNameB) return 0;
                        return userNameA.localeCompare(userNameB);
                    },
                },
                {
                    accessorKey: 'seasonPoints',
                    header: isSmallScreen ? 'Pts' : 'Season Points',
                    size: userColumnWidth,
                    Cell: ({ row }: any) => {
                        const userId = row.original.id;
                        if (!userId) return <>0</>;
                        return renderSeasonResultsCell(weekResults, userId);
                    },
                    sortingFn: (a: any, b: any) => {
                        const userIdA = a.original.id;
                        const userIdB = b.original.id;
                        const aPoints = weekResults.find(wr => wr.userId === userIdA)?.totalPoints || 0;
                        const bPoints = weekResults.find(wr => wr.userId === userIdB)?.totalPoints || 0;
                        if (aPoints === bPoints) return 0;
                        return aPoints > bPoints ? 1 : -1;
                    },
                    enableColumnActions: false,
                },
            ];

            for (let weekNumber = league.startingWeekNumber!; weekNumber <= league.endingWeekNumber!; weekNumber++) {
                columnList.push({
                    accessorKey: `week_${weekNumber}`,
                    header: `Week ${weekNumber}`,
                    size: weekColumnWidth,
                    Cell: ({ row }: any) => renderWeekResultCell(row.original, weekResults, weekNumber),
                    enableColumnActions: false,
                    enableSorting: true,
                } as MRT_ColumnDef<UserInfo>);
            }

            setUserMapping(leagueUserMapping);
            setColumns(columnList);
            setDataLoaded(true);
        }

        fetchData();
    }, []);

    return (
        <>
            <Title order={4}>{currentLeague?.leagueName}</Title>
            <Text size="lg">Season Standings</Text>
            <div style={{ height: '100%', width: '90%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {!dataLoaded ?
                        <Loading /> :
                        <MantineProvider theme={{ ...useMantineTheme() }}>
                            <MantineReactTable
                                columns={columns}
                                data={userMapping ?? []}
                                enableRowSelection={false}
                                enableColumnPinning
                                enableColumnResizing
                                initialState={{ sorting: [{ id: 'seasonPoints', desc: true }], columnPinning: { left: ['userName', 'seasonPoints'], right: [] } }}
                                enablePagination={false}
                                rowCount={userMapping?.length ?? 0}
                                mantineTableProps={{
                                    horizontalSpacing: 'xs',
                                    verticalSpacing: 'xs',
                                    withBorder: true,
                                    style: { maxHeight: '70vh', overflow: 'auto', backgroundColor: 'var(--template-palette-background-default)' },
                                }}
                                mantinePaperProps={{ style: { backgroundColor: 'var(--template-palette-background-default)' } }}
                            />
                        </MantineProvider>
                    }
                </div>
                {/** Visualize max and min container height */}
            </div>

        </>
    );

    function getTotalPointsForSeason(weekResults: SpreadWeekResultDTO[]) {
        let totalPoints = 0;
        for (const week of weekResults) {
            if (!week.totalPoints) {
                continue;
            }

            totalPoints += week.totalPoints;
        }
        return totalPoints;
    }
}

