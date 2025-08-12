import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueUtilities } from '../../utilities/LeagueUtilities';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SiteUtilities } from '../../utilities/SiteUtilities';
import { Typography } from '@mui/material';


export default function PickemMakePicks() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [currentPicks, setCurrentPicks] = useState<SpreadWeekPickDTO>();
    const [weekGames, setWeekGames] = useState<GameDTO[]>();
    const [weekDescription, setWeekDescription] = useState("");
    const { leagueId, weekNumber } = useParams();
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
    ];

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const league = await pickemClient.getLeagueById(leagueId);
            const picks = await pickemClient.getAllSpreadWeekPicks(leagueId, weekNumberConverted);
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
            <DataGrid
                rows={weekGames}
                columns={columns}
            />
        </>
    );
}

