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

export default function PickemWeekStandings() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [columns, setColumns] = useState<GridColDef<UserInfo>[]>([]);
    const [userMapping, setUserMapping] = useState<UserInfo[]>();
    const [weekDescription, setWeekDescription] = useState("");
    const { leagueId, weekNumber } = useParams();
    const weekNumberConverted = parseInt(weekNumber!);
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const [dataLoaded, setDataLoaded] = useState(false);
    const userColumnWidth = 100;
    const gameColumnWidth = isSmallScreen ? 95 : 95;

    const renderUserCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>,
        userMapping: UserInfo[]): React.ReactNode => {
        const userId = params.row.id;
        let userName = SiteUtilities.getShortenedUserNameFromId(userMapping, userId, params.row.email);
        return <div className='centerDivContainer standingsUserName'><span>{userName}</span></div>;
    }

    const renderGamePickCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>,
        league: LeagueDTO,
        picks: SpreadWeekPickDTO[],
        game: GameDTO,
        weekResults: SpreadWeekResultDTO[]): React.ReactNode => {
        const userId = params.row.id;
        const userPicks = picks?.find(p => p.userId === userId);
        const gamePick = userPicks?.gamePicks?.find(gp => gp.gameID === game.id);

        if (!gamePick) {
            return <></>;
        }

        const teamPicked = gamePick.sidePicked === 0 ? game.homeTeam : game.awayTeam;
        const pickImagePath = SiteUtilities.getTeamIconPathFromTeam(teamPicked!, league!);
        const pickAltText = SiteUtilities.getAltTextFromTeam(teamPicked!);
        const userWeekResult = weekResults.find(wr => wr.userId === userId);
        const userGameResult = userWeekResult?.pickResults?.find(pr => pr.gameId === game.id);
        const gameResultText = userGameResult?.isFinal ? (userGameResult.success ? "✅" : "❌") : "";
        return <div className='centerDivContainer'>
            <TeamIcon imagePath={pickImagePath} altText={pickAltText} />
            {gamePick.isKeyPicked && <div className='keyPickIndicator'>🔑</div>}
            {userGameResult && <div className='gamePickResultIndicator'>{gameResultText}</div>}
        </div>;
    }

    const renderGameHeader = (game: GameDTO, league: LeagueDTO): React.ReactNode => {
        return <PickemWeekStandingsHeaderTeamCell game={game} currentLeague={league!} isSmallScreen={isSmallScreen} />;
    };

    const renderWeekResultsCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>, league: LeagueDTO, weekResults: SpreadWeekResultDTO[], picks: SpreadWeekPickDTO[]): React.ReactNode => {
        const userId = params.row.id;
        const userWeekResult = weekResults.find(wr => wr.userId === userId);
        const userPicks = picks.find(p => p.userId === userId);
        let maximumPoints = 0;
        if (!userWeekResult?.pickResults) {
            return <>0 / 0</>;
        }
        for (const pick of userPicks?.gamePicks!) {
            const pickResult = userWeekResult.pickResults?.find(pr => pr.gameId === pick.gameID);

            // There is no pick result yet so game is still in progress
            if (!pickResult || !pickResult?.isFinal) {
                maximumPoints += 1;
                if (pick.isKeyPick) {
                    maximumPoints += league.settings?.keyPickBonus!;
                }
                continue;
            }
            else {
                if (pickResult.success && pickResult.totalPoints) {
                    maximumPoints += pickResult.totalPoints!;
                }
            }
        }
        const totalPoints = userWeekResult?.totalPoints;
        return <>
            <div>
                {totalPoints} / {maximumPoints}
            </div>
        </>;
    };

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const league = await pickemClient.getLeagueById(leagueId);
            setCurrentLeague(league);

            const picks = await pickemClient.getAllSpreadWeekPicks(leagueId, weekNumberConverted);
            const returnOnlyGamesThatHaveStarted = false;
            let games = await pickemClient.queryGames(weekNumberConverted, league.year, league.sport, returnOnlyGamesThatHaveStarted);
            games = games.sort((a, b) => {
                if (a.gameStartTime && b.gameStartTime) {
                    if (a.result && b.result) {
                        const gameAStatus = a.result.status;
                        const gameBStatus = b.result.status;
                        if (gameAStatus !== undefined && gameBStatus !== undefined && gameAStatus !== gameBStatus) {
                            if (gameAStatus === 1) { // in progress
                                return -1;
                            }
                            if (gameAStatus === 2) { // final
                                return -1;
                            }
                            return gameAStatus - gameBStatus;
                        }
                    }

                    return a.gameStartTime.getTime() - b.gameStartTime.getTime();
                }
                else {
                    return 0;
                }
            });
            const longDescription = true;
            const description = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, league.currentWeekNumber!, longDescription);
            const leagueUserMapping = await pickemClient.getUserMappingForLeague(leagueId);
            const weekResults = await pickemClient.getAllTempSpreadWeekResults(leagueId, weekNumberConverted);

            const columnList: GridColDef<(UserInfo[])[number]>[] = [
                {
                    field: 'user',
                    headerName: 'User',
                    width: userColumnWidth,
                    minWidth: userColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderHeader: () => {
                        return <div className='weekStandingsHeader'>User</div>;
                    },
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
                    field: 'weekPoints',
                    width: userColumnWidth,
                    minWidth: userColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderHeader: () => {
                        return <div className='weekStandingsHeader'>Week<br />Points</div>;
                    },
                    renderCell: (params) => {
                        return renderWeekResultsCell(params, league, weekResults, picks);
                    },
                    valueGetter: (_, row) => {
                        if (!row) {
                            return 0;
                        }

                        const userId = row.id;
                        const userWeekResult = weekResults.find(wr => wr.userId === userId);
                        return userWeekResult?.totalPoints ?? 0;
                    },
                    sortable: true,
                    disableColumnMenu: true,
                },
            ];

            for (const game of games!) {
                const gameColumn: GridColDef<(UserInfo[])[number]> = {
                    field: `game_${game.id}`,
                    headerName: `${game.awayTeam?.abbreviation} @ ${game.homeTeam?.abbreviation}`,
                    renderHeader: () => {
                        return renderGameHeader(game, league);
                    },
                    width: gameColumnWidth,
                    minWidth: gameColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderCell: (params) => {
                        return renderGamePickCell(params, league, picks, game, weekResults);
                    },
                    valueGetter: (_, row) => {
                        if (!row) {
                            return 0;
                        }

                        const userId = row.id;
                        const userPicks = picks?.find(p => p.userId === userId);
                        const gamePick = userPicks?.gamePicks?.find(gp => gp.gameID === game.id);
                        return gamePick?.sidePicked ?? -1;
                    },
                    disableColumnMenu: true,
                    sortable: true,
                };
                columnList.push(gameColumn);
            }

            setWeekDescription(description);
            setUserMapping(leagueUserMapping);
            setColumns(columnList);
            setDataLoaded(true);
        }

        fetchData();
    }, []);

    return (
        <>
            <Typography variant='h4'>{currentLeague?.leagueName}</Typography>
            <Typography variant='h5'>{weekDescription} Standings</Typography>
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
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'weekPoints', sort: 'desc' }],
                                },
                            }}
                        />
                    }
                </div>
                {/** Visualize max and min container height */}
            </div>

        </>
    );
}

