import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO, SpreadGamePickDTO, TeamDTO, UserInfo } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender, useGridApiRef } from '@mui/x-data-grid';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MakePicksTeamCell from '../MakePicksTeamCell';
import PickemWeekStandingsHeaderTeamCell from '../PickemWeekStandingsTeamCell';

enum PickemWeekColumnType {
    User = 1,
    WeekPoints = 2,
    Game = 3,
    LeaguePoints = 4,
}

export default function PickemWeekStandings() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [weekPicks, setWeekPicks] = useState<SpreadWeekPickDTO[]>();
    const [weekGames, setWeekGames] = useState<GameDTO[]>();
    const [columns, setColumns] = useState<GridColDef<UserInfo>[]>([]);
    const [userMapping, setUserMapping] = useState<UserInfo[]>();
    const [weekDescription, setWeekDescription] = useState("");
    const { leagueId, weekNumber } = useParams();
    const weekNumberConverted = parseInt(weekNumber!);
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const userColumnWidth = 85;
    const gameColumnWidth = isSmallScreen ? 95 : 95;

    const formatCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>, columnType: PickemWeekColumnType): React.ReactNode => {
        const userId = params.row.id;
        if (columnType === PickemWeekColumnType.User) {
            const userName = userMapping?.find(u => u.id === userId)?.userName ?? "Unknown User";
            return <div className='centerDivContainer'><span>{userName}</span></div>;
        }
        else if (columnType === PickemWeekColumnType.WeekPoints) {
            return <div className='centerDivContainer'><span>-1</span></div>;
        }
        else if (columnType === PickemWeekColumnType.Game) {
            return <div className='centerDivContainer'>CHI</div>;
        }
        return <></>;
    }

    const renderGameHeader = (game: GameDTO, league: LeagueDTO): React.ReactNode => {
        return <PickemWeekStandingsHeaderTeamCell game={game} currentLeague={league!} isSmallScreen={isSmallScreen} />;
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

            const columnList: GridColDef<(UserInfo[])[number]>[] = [
                {
                    field: 'user',
                    headerName: 'User',
                    width: userColumnWidth,
                    minWidth: userColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderCell: (params) => {
                        return formatCell(params, PickemWeekColumnType.User);
                    },
                    disableColumnMenu: true,
                },
                {
                    field: 'weekPoints',
                    headerName: 'Week Points',
                    width: userColumnWidth,
                    minWidth: userColumnWidth,
                    cellClassName: "centerDivContainer",
                    renderCell: (params) => {
                        return formatCell(params, PickemWeekColumnType.WeekPoints);
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
                        return formatCell(params, PickemWeekColumnType.Game);
                    },
                    disableColumnMenu: true,
                    sortable: false,
                };
                columnList.push(gameColumn);
            }

            setWeekPicks(picks);
            setWeekGames(games);
            setWeekDescription(description)
            setUserMapping(leagueUserMapping);
            setColumns(columnList);
        }

        fetchData();
    }, []);

    return (
        <>
            <Typography variant='h4'>{currentLeague?.leagueName}</Typography>
            <Typography variant='h5'>{weekDescription} Standings</Typography>
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
                getRowClassName={isSmallScreen ? () => 'makePickContainerSmall' : () => 'makePickContainer'}
            />
        </>
    );
}

