import * as React from 'react';
import { useParams } from 'react-router';
import { UserInfo, SpreadWeekResultDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import Loading from '../Loading';
import { Typography } from '@mui/material';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { useQuery } from '@tanstack/react-query';

export default function PickemLeagueStandings() {
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const userColumnWidth = 100;
    const weekColumnWidth = isSmallScreen ? 75 : 75;

    const renderUserCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>,
        userMapping: UserInfo[]): React.ReactNode => {
        const userId = params.row.id;
        let userName = SiteUtilities.getShortenedUserNameFromId(userMapping, userId, params.row.email);
        return <div className='centerDivContainer standingsUserName'><span>{userName}</span></div>;
    }

    const renderWeekResultCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>,
        weekResults: SpreadWeekResultDTO[],
        weekNumber: number): React.ReactNode => {
        const userId = params.row.id;
        const userWeekResult = weekResults.find(wr => wr.userId === userId && wr.weekNumber === weekNumber);
        let trophies: string[] = [];
        if (userWeekResult?.trophies) {
            userWeekResult?.trophies.map(t => trophies.push(SiteUtilities.ConvertTrophyToEmoji(t)));
        }
        const trophyString = trophies.join('');

        if (!userWeekResult) {
            return <>-</>;
        }
        return <div className='centerDivContainer'>
            {userWeekResult.totalPoints}{trophyString}
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

    const leagueStandingsQuery = useQuery({
        queryKey: ['leaguestandings', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getLeagueStandings(leagueId!);
        },
    });

    const columnList: GridColDef<(UserInfo[])[number]>[] = [
        {
            field: 'user',
            headerName: 'User',
            width: userColumnWidth,
            minWidth: userColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return renderUserCell(params, leagueStandingsQuery.data?.users || []);
            },
            valueGetter: (_, row) => {
                if (!row) {
                    return "";
                }

                return row.userName ?? row.email;
            },
            disableColumnMenu: true,
            sortable: true,
            pinnable: true,
        },
        {
            field: 'seasonPoints',
            headerName: 'Season Points',
            width: userColumnWidth,
            minWidth: userColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                const userId = params.row.id;
                if (!userId) {
                    return <>0</>;
                }
                return renderSeasonResultsCell(leagueStandingsQuery.data?.results!, userId);
            },
            valueGetter: (_, row) => {
                if (!row) {
                    return 0;
                }

                const userId = row.id;
                const userWeekResults = leagueStandingsQuery.data?.results!.filter(wr => wr.userId === userId);
                return getTotalPointsForSeason(userWeekResults || []);
            },
            sortable: true,
            disableColumnMenu: true,
        },
    ];

    const startingWeekNumber = leagueStandingsQuery.data?.league!.startingWeekNumber!;
    const endingWeekNumber = leagueStandingsQuery.data?.league!.endingWeekNumber!;
    for (let weekNumber = startingWeekNumber; weekNumber <= endingWeekNumber; weekNumber++) {
        const weekColumn: GridColDef<(UserInfo[])[number]> = {
            field: `week_${weekNumber}`,
            headerName: `Week ${weekNumber}`,
            width: weekColumnWidth,
            minWidth: weekColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return renderWeekResultCell(params, leagueStandingsQuery.data?.results!, weekNumber);
            },
            valueGetter: (_, row) => {
                if (!row) {
                    return 0;
                }

                const userId = row.id;
                const userWeekResult = leagueStandingsQuery.data?.results!.find(wr => wr.userId === userId && wr.weekNumber === weekNumber);
                return userWeekResult?.totalPoints ?? 0;
            },
            disableColumnMenu: true,
            sortable: true,
        };
        columnList.push(weekColumn);
    }

    return (
        <>
            <Typography variant='h4'>{leagueStandingsQuery.data?.league?.leagueName}</Typography>
            <Typography variant='h5'>Season Standings</Typography>
            <div style={{ height: '100%', width: '90%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {leagueStandingsQuery.isPending ?
                        <Loading /> :
                        <DataGrid
                            sx={{
                                border: '1px solid #7e7e7eff', // Darker gray border
                                '& .MuiDataGrid-row': {
                                    borderBottom: '1px solid #7e7e7eff', // Darker row border
                                },
                                '& .MuiDataGrid-iconSeparator': {
                                    color: '#7e7e7eff', // Darker row border
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    borderBottom: '1px solid #7e7e7eff', // Darker row border
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    padding: 0,
                                },
                                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                    outline: "none !important",
                                },
                                '& .MuiIconButton-root': {
                                    fontSize: '0.8rem',
                                    padding: '2px',
                                    width: '24px',
                                    height: '24px',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1rem',
                                },
                            }}
                            rows={leagueStandingsQuery.data?.users || []}
                            columns={columnList}
                            rowSelection={false}
                            columnHeaderHeight={175}
                            scrollbarSize={10}
                            getRowClassName={isSmallScreen ? () => 'makePickContainerSmall' : () => 'makePickContainer'}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'seasonPoints', sort: 'desc' }],
                                },
                            }}
                        />
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

