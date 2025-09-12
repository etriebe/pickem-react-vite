import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO, UserInfo, SpreadWeekResultDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import useMediaQuery from '@mui/material/useMediaQuery';
import PickemWeekStandingsHeaderTeamCell from '../PickemWeekStandingsTeamCell';
import TeamIcon from '../TeamIcon';
import Loading from '../Loading';
import { Typography } from '@mui/material';

export default function PickemLeagueStandings() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [columns, setColumns] = useState<GridColDef<UserInfo>[]>([]);
    const [userMapping, setUserMapping] = useState<UserInfo[]>();
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const [dataLoaded, setDataLoaded] = useState(false);
    const userColumnWidth = 100;
    const weekColumnWidth = isSmallScreen ? 95 : 95;

    const renderUserCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>,
        userMapping: UserInfo[]): React.ReactNode => {
        const userId = params.row.id;
        const userName = userMapping?.find(u => u.id === userId)?.userName ?? "Unknown User";
        return <div className='centerDivContainer standingsUserName'><span>{userName}</span></div>;
    }

    const renderWeekResultCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>,
        weekResults: SpreadWeekResultDTO[],
        weekNumber: number): React.ReactNode => {
        const userId = params.row.id;
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

            const columnList: GridColDef<(UserInfo[])[number]>[] = [
                {
                    field: 'user',
                    headerName: 'User',
                    width: userColumnWidth,
                    minWidth: userColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderCell: (params) => {
                        return renderUserCell(params, leagueUserMapping);
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
                        return renderSeasonResultsCell(weekResults, userId);
                    },
                    valueGetter: (_, row) => {
                        if (!row) {
                            return 0;
                        }

                        const userId = row.id;
                        const userWeekResults = weekResults.filter(wr => wr.userId === userId);
                        return getTotalPointsForSeason(userWeekResults);
                    },
                    sortable: true,
                    disableColumnMenu: true,
                },
            ];

            for (let weekNumber = league.startingWeekNumber!; weekNumber <= league.endingWeekNumber!; weekNumber++) {
                const gameColumn: GridColDef<(UserInfo[])[number]> = {
                    field: `week_${weekNumber}`,
                    headerName: `Week ${weekNumber}`,
                    width: weekColumnWidth,
                    minWidth: weekColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderCell: (params) => {
                        return renderWeekResultCell(params, weekResults, weekNumber);
                    },
                    valueGetter: (_, row) => {
                        if (!row) {
                            return 0;
                        }

                        const userId = row.id;
                        const userWeekResult = weekResults.find(wr => wr.userId === userId && wr.weekNumber === weekNumber);
                        return userWeekResult?.totalPoints ?? 0;
                    },
                    disableColumnMenu: true,
                    sortable: true,
                };
                columnList.push(gameColumn);
            }

            setUserMapping(leagueUserMapping);
            setColumns(columnList);
            setDataLoaded(true);
        }

        fetchData();
    }, []);

    return (
        <>
            <Typography variant='h4'>{currentLeague?.leagueName}</Typography>
            <Typography variant='h5'>Season Standings</Typography>
            <div style={{ height: '100%', width: '90%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {!dataLoaded ?
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
                            rows={userMapping}
                            columns={columns}
                            rowSelection={false}
                            columnHeaderHeight={175}
                            scrollbarSize={10}

                            getRowClassName={isSmallScreen ? () => 'makePickContainerSmall' : () => 'makePickContainer'}
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

