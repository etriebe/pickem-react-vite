import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO, UserInfo, SpreadWeekResultDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import useMediaQuery from '@mui/material/useMediaQuery';
import PickemWeekStandingsHeaderTeamCell from '../PickemWeekStandingsHeaderTeamCell';
import TeamIcon from '../TeamIcon';
import Loading from '../Loading';
import { Typography } from '@mui/material';

export default function PickemWeekStandings() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [columns, setColumns] = useState<MRT_ColumnDef<UserInfo>[]>([]);
    const [userMapping, setUserMapping] = useState<UserInfo[]>();
    const [weekDescription, setWeekDescription] = useState("");
    const { leagueId, weekNumber } = useParams();
    const weekNumberConverted = parseInt(weekNumber!);
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const [dataLoaded, setDataLoaded] = useState(false);
    const userColumnWidth = 100;
    const weekPointsColumnWidth = 120;
    const gameColumnWidth = isSmallScreen ? 110 : 110;

    const renderUserCell = (row: UserInfo, userMapping: UserInfo[]): React.ReactNode => {
        const userId = row.id;
        let userName = SiteUtilities.getShortenedUserNameFromId(userMapping, userId, row.email);
        return <div className='centerDivContainer standingsUserName'><span>{userName}</span></div>;
    }

    const renderGamePickCell = (row: UserInfo, league: LeagueDTO, picks: SpreadWeekPickDTO[], game: GameDTO, weekResults: SpreadWeekResultDTO[]): React.ReactNode => {
        const userId = row.id;
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

    const renderWeekResultsCell = (row: UserInfo, league: LeagueDTO, weekResults: SpreadWeekResultDTO[], picks: SpreadWeekPickDTO[]): React.ReactNode => {
        const userId = row.id;
        const userWeekResult = weekResults.find(wr => wr.userId === userId);
        const userPicks = picks.find(p => p.userId === userId);
        let maximumPoints = 0;
        if (!userWeekResult?.pickResults) {
            return <>0 / 0</>;
        }
        for (const pick of userPicks?.gamePicks!) {
            const pickResult = userWeekResult.pickResults?.find(pr => pr.gameId === pick.gameID);
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
            const games = await pickemClient.queryGames(weekNumberConverted, league.year, league.sport, returnOnlyGamesThatHaveStarted);
            const longDescription = true;
            const description = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, league.currentWeekNumber!, longDescription);
            const leagueUserMapping = await pickemClient.getUserMappingForLeague(leagueId);
            const weekResults = await pickemClient.getAllTempSpreadWeekResults(leagueId, weekNumberConverted);

            const columnList: MRT_ColumnDef<UserInfo>[] = [
                {
                    accessorKey: 'user',
                    header: 'User',
                    size: userColumnWidth,
                    Cell: ({ row }) => renderUserCell(row.original, leagueUserMapping),
                    sortingFn: (a, b) => {
                        const userIdA = a.original.id;
                        const userIdB = b.original.id;
                        const userNameA = leagueUserMapping?.find(u => u.id === userIdA)?.userName || "";
                        const userNameB = leagueUserMapping?.find(u => u.id === userIdB)?.userName || "";
                        if (userNameA === userNameB) {
                            return 0;
                        }
                        return userNameA.localeCompare(userNameB);
                    },
                    enableColumnActions: false,
                },
                {
                    accessorKey: 'weekPoints',
                    header: 'Points',
                    size: weekPointsColumnWidth,
                    Cell: ({ row }) => renderWeekResultsCell(row.original, league, weekResults, picks),
                    sortingFn: (a, b) => {
                        const userIdA = a.original.id;
                        const userIdB = b.original.id;
                        const aPoints = weekResults.find(wr => wr.userId === userIdA)?.totalPoints || 0;
                        const bPoints = weekResults.find(wr => wr.userId === userIdB)?.totalPoints || 0;
                        if (aPoints === bPoints) {
                            return 0;
                        }
                        return aPoints > bPoints ? -1 : 1;
                    },
                    enableColumnActions: false,
                },
            ];

            for (const game of games!) {
                columnList.push({
                    accessorKey: `game_${game.id}`,
                    header: `${game.awayTeam?.abbreviation} @ ${game.homeTeam?.abbreviation}`,
                    Header: ({ }) => (renderGameHeader(game, league)),
                    size: gameColumnWidth,
                    Cell: ({ row }) => renderGamePickCell(row.original, league, picks, game, weekResults),
                    enableColumnActions: false,
                    enableSorting: false,
                });
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
                {!dataLoaded ? (
                    <Loading />
                ) : (
                    <MaterialReactTable
                        columns={columns}
                        data={userMapping ?? []}
                        enableRowSelection={false}
                        enableColumnPinning
                        enableColumnResizing
                        enableStickyHeader
                        initialState={{
                            sorting: [{ id: 'weekPoints', desc: true }],
                        }}
                        enablePagination={false}
                        rowCount={userMapping?.length ?? 0}
                        muiTableContainerProps={{ sx: { maxHeight: 'auto' } }}
                        muiTableHeadCellProps={{ sx: { fontWeight: 'bold', fontSize: '1rem', background: '#f5f5f5' } }}
                        muiTableBodyCellProps={{ sx: { padding: '4px', fontSize: '0.95rem' } }}
                    />
                )}
            </div>

        </>
    );
}

