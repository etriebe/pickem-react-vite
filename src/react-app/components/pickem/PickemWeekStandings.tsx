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
        const userName = userMapping?.find(u => u.id === userId)?.userName ?? "Unknown User";
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

    const renderWeekResultsCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>, league: LeagueDTO, weekResults: SpreadWeekResultDTO[]): React.ReactNode => {
        const userId = params.row.id;
        const userWeekResult = weekResults.find(wr => wr.userId === userId);

        let maximumPoints = 0;
        if (!userWeekResult?.pickResults) {
            return <>0 / 0</>;
        }
        for (const pick of userWeekResult?.pickResults!) {
            if (pick.isFinal) {
                if (pick.success) {
                    maximumPoints += pick.totalPoints!;
                }
            }
            else {
                maximumPoints += 1;
                if (pick.isKeyPick) {
                    maximumPoints += league.settings?.keyPickBonus!;
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
            const games = await pickemClient.queryGames(weekNumberConverted, league.year, league.sport, returnOnlyGamesThatHaveStarted);
            const description = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, league.currentWeekNumber!);
            const leagueUserMapping = await pickemClient.getUserMappingForLeague(leagueId);
            const weekResults = await pickemClient.getAllTempSpreadWeekResults(leagueId, weekNumberConverted);

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
                    disableColumnMenu: true,
                    pinnable: true,
                },
                {
                    field: 'weekPoints',
                    headerName: 'Week Points',
                    width: userColumnWidth,
                    minWidth: userColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderCell: (params) => {
                        return renderWeekResultsCell(params, league, weekResults);
                    },
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
                    disableColumnMenu: true,
                    sortable: false,
                };
                columnList.push(gameColumn);
            }

            setWeekDescription(description)
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
                                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                    outline: "none !important",
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
}

