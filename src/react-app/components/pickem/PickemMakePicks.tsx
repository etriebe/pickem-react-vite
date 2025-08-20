import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO, SpreadGamePickDTO, TeamDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams, GridTreeNodeWithRender, useGridApiRef } from '@mui/x-data-grid';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { Typography, Snackbar, SnackbarCloseReason } from '@mui/material';
import TeamIcon from '../TeamIcon';

enum MakePicksColumnType {
    AwayTeam = 1,
    HomeTeam = 2,
    KeyPick = 3,
    GameStartTime = 4,
}

export default function PickemMakePicks() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [currentPicks, setCurrentPicks] = useState<SpreadWeekPickDTO>();
    const [selectedPicksCount, setSelectedPicksCount] = useState(0);
    const [weekGames, setWeekGames] = useState<GameDTO[]>();
    const [weekDescription, setWeekDescription] = useState("");
    const { leagueId, weekNumber } = useParams();
    const [open, setOpen] = useState(false);
    const weekNumberConverted = parseInt(weekNumber!);
    const apiRef = useGridApiRef();

    const formatCell = (params: GridRenderCellParams<GameDTO, any, any, GridTreeNodeWithRender>, cellType: MakePicksColumnType): React.ReactNode => {
        const imagePath = SiteUtilities.getTeamIconPathFromTeam(params.value as TeamDTO, currentLeague!);
        const altText = SiteUtilities.getAltTextFromTeam(params.value as TeamDTO);
        let cellText = `${params.value.name}`;

        if (cellType === MakePicksColumnType.HomeTeam) {
            cellText += ` (${SiteUtilities.getFormattedSpreadAmount(params.row.currentSpread!)})`
        }

        if (currentPicks && currentPicks.gamePicks) {
            const selectedGameId = params.row.id;
            const gamePick = currentPicks.gamePicks.find(g => g.gameID === selectedGameId);
            if (gamePick) {
                const isTeamSelected = (gamePick.sidePicked === 0 && cellType === MakePicksColumnType.HomeTeam) ||
                    (gamePick.sidePicked === 1 && cellType === MakePicksColumnType.AwayTeam);

                if (isTeamSelected) {
                    cellText += ` ☑️`;
                }
            }
        }

        return (
            <>
                <div className='teamPickContainer'>
                    <TeamIcon imagePath={imagePath} altText={altText} />
                    <div >{cellText}</div>
                </div>
            </>);
    }

    const columns: GridColDef<(GameDTO[])[number]>[] = [
        {
            field: 'awayTeam',
            headerName: 'Away Team',
            width: 250,
            minWidth: 250,
            renderCell: (params) => {
                return formatCell(params, MakePicksColumnType.AwayTeam);
            },
        },
        {
            field: 'homeTeam',
            headerName: 'Home Team',
            width: 250,
            minWidth: 250,
            renderCell: (params) => {
                return formatCell(params, MakePicksColumnType.HomeTeam);
            }
        },
        {
            field: 'gameStartTime',
            headerName: 'Game Time',
            width: 175,
            minWidth: 175,
            renderCell: (params) => (
                `${SiteUtilities.getFormattedGameTime(params.value)}`
            ),
        },
        {
            field: 'keyPick',
            headerName: 'Key Pick',
            minWidth: 175,
            width: 100,
        },
    ];

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleCellClick: GridEventListener<"cellClick"> = (params) => {
        console.log("Cell clicked:", params);
        if (!currentPicks) {
            throw new Error("currentPicks should not be able to be null here.");
        }
        if (!currentPicks.gamePicks) {
            throw new Error("currentPicks.gamePicks should not be able to be null here.");
        }
        let currentGame = weekGames?.find(g => g.id === params.row.id);
        if (!currentGame) {
            throw new Error("Couldn't find the correct game");
        }
        let currentPick = currentPicks.gamePicks.find(g => g.gameID === params.row.id);

        if (!currentPick) {
            // Picking a brand new game
            if (currentPicks.gamePicks.length >= currentLeague?.settings?.totalPicks!) {
                setOpen(true);
                return;
            }
            currentPick = createPickObject(currentGame, params.value as TeamDTO);
            currentPicks.gamePicks.push(currentPick);
            setCurrentPicks(currentPicks);
        }
        else {
            console.log(`Side picked: ${currentPick.sidePicked}`);

            // If they picked home or away and are clicking this again, we should remove
            if ((currentPick.sidePicked === 0 && currentGame?.homeTeam === params.value) ||
                (currentPick.sidePicked === 1 && currentGame?.awayTeam === params.value)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                currentPicks.gamePicks.splice(indexOfPick, 1);
            }
            // If they are picking the opposite side now. TODO: THIS CASE ISN'T WORKING
            else if ((currentPick.sidePicked === 0 && currentGame?.awayTeam === params.value) ||
                (currentPick.sidePicked === 1 && currentGame?.homeTeam === params.value)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                currentPicks.gamePicks.splice(indexOfPick, 1);
                currentPick = createPickObject(currentGame, params.value as TeamDTO);
                currentPicks.gamePicks.push(currentPick);
                // currentPick.sidePicked = currentGame?.homeTeam === params.value ? 0 : 1;
            }
            setCurrentPicks(currentPicks);

            // currentPick.sidePicked = currentGame?.awayTeam === params.value ? 0 : 1;
        }

        // setWeekGames(weekGames);
        setCurrentPicks(currentPicks);
        setSelectedPicksCount(currentPicks.gamePicks.length);
        // apiRef.current!.setCellFocus(params.id, params.field);
        apiRef.current?.selectRow(params.id);
        apiRef.current?.autosizeColumns();
    };

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const league = await pickemClient.getLeagueById(leagueId);
            const picks = await pickemClient.getSpreadWeekPicksForUser(leagueId, weekNumberConverted);
            const returnOnlyGamesThatHaveStarted = false;
            const games = await pickemClient.queryGames(weekNumberConverted, league.year, league.sport, returnOnlyGamesThatHaveStarted);
            const description = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, league.currentWeekNumber!);

            setCurrentLeague(league);
            setCurrentPicks(picks);
            setWeekGames(games);
            setWeekDescription(description)
        }

        fetchData();
    }, []);

    return (
        <>
            <Typography variant='h4'>{currentLeague?.leagueName}</Typography>
            <Typography variant='h5'>{weekDescription} Picks - {selectedPicksCount} / {currentLeague?.settings?.totalPicks} Picks</Typography>
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                message="You have selected too many picks. Please unselect one before selecting again."
            />
            <DataGrid
                rows={weekGames}
                columns={columns}
                onCellClick={handleCellClick}
                apiRef={apiRef}
                rowSelection={false}
            />
        </>
    );

    function createPickObject(currentGame: GameDTO, chosenTeam: TeamDTO) {
        const currentPick = new SpreadGamePickDTO();
        currentPick.gameID = currentGame?.id;
        currentPick.gameStartTime = currentGame?.gameStartTime;
        currentPick.sidePicked = currentGame?.homeTeam === chosenTeam ? 0 : 1;
        currentPick.isKeyPicked = false; // TODO: Pull for real
        return currentPick;
    }
}

