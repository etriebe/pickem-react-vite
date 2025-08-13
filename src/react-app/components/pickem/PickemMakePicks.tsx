import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueUtilities } from '../../utilities/LeagueUtilities';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO, SpreadGamePickDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { Typography, Snackbar, SnackbarCloseReason } from '@mui/material';

export default function PickemMakePicks() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [currentPicks, setCurrentPicks] = useState<SpreadWeekPickDTO>();
    const [weekGames, setWeekGames] = useState<GameDTO[]>();
    const [weekDescription, setWeekDescription] = useState("");
    const { leagueId, weekNumber } = useParams();
    const [open, setOpen] = useState(false);
    const weekNumberConverted = parseInt(weekNumber!);

    const columns: GridColDef<(GameDTO[])[number]>[] = [
        {
            field: 'awayTeam',
            headerName: 'Away Team',
            width: 150,
            renderCell: (params) => (
                `${params.value.city} ${params.value.name}`
            ),
        },
        {
            field: 'homeTeam',
            headerName: 'Home Team',
            width: 200,
            renderCell: (params) => (
                `${params.value.city} ${params.value.name} (${SiteUtilities.getFormattedSpreadAmount(params.row.currentSpread!)})`
            ),
        },
        {
            field: 'gameStartTime',
            headerName: 'Game Time',
            width: 175,
            renderCell: (params) => (
                `${SiteUtilities.getFormattedGameTime(params.value)}`
            ),
        },
        {
            field: 'keyPick',
            headerName: 'Key Pick',
            width: 100,
        },
    ];

    const handleClose = (
        event: React.SyntheticEvent | Event,
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
        let currentPick = currentPicks.gamePicks.find(g => g.gameID === params.row.id);

        if (!currentPick) {
            // Picking a brand new game

            if (currentPicks.gamePicks.length >= currentLeague?.settings?.totalPicks!) {
                setOpen(true);
                return;
            }
            currentPick = new SpreadGamePickDTO();
            currentPick.gameID = currentGame?.id;
            currentPick.gameStartTime = currentGame?.gameStartTime;
            currentPick.sidePicked = currentGame?.awayTeam === params.value ? 0 : 1;
            currentPick.isKeyPicked = false; // TODO: Pull for real
            currentPicks.gamePicks.push(currentPick);
            setCurrentPicks(currentPicks);
        }
        else {
            console.log(`Side picked: ${currentPick.sidePicked}`);

            // If they picked home or away and are clicking this again, we should remove
            if ((currentPick.sidePicked === 0 && currentGame?.homeTeam === params.value) ||
                (currentPick.sidePicked === 1 && currentGame?.awayTeam === params.value)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                if (indexOfPick && indexOfPick > -1) {
                    currentPicks.gamePicks.splice(indexOfPick, 1);
                }
            }
            // If they are picking the opposite side now
            else if ((currentPick.sidePicked === 0 && currentGame?.awayTeam === params.value) ||
                (currentPick.sidePicked === 1 && currentGame?.homeTeam === params.value)) {
                currentPick.sidePicked = currentGame?.homeTeam === params.value ? 0 : 1;
            }

            // currentPick.sidePicked = currentGame?.awayTeam === params.value ? 0 : 1;
        }

        setCurrentPicks(currentPicks);
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
            <Typography variant='h5'>{weekDescription} Picks</Typography>
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
            />
        </>
    );
}

