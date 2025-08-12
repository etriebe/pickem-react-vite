import * as React from 'react';
import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { LeagueUtilities } from '../../utilities/LeagueUtilities';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SiteUtilities } from '../../utilities/SiteUtilities';

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
    width: 150,
    renderCell: (params) => (
      `${params.value.city} ${params.value.name}`
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

export default function PickemMakePicks() {
    const [currentLeague, setCurrentLeague] = useState<LeagueDTO>();
    const [currentPicks, setCurrentPicks] = useState<SpreadWeekPickDTO>();
    const [weekGames, setWeekGames] = useState<GameDTO[]>();
    const { leagueId, weekNumber } = useParams();
    const weekNumberConverted = parseInt(weekNumber!);

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const league = await pickemClient.getLeagueById(leagueId);
            const picks = await pickemClient.getAllSpreadWeekPicks(leagueId, weekNumberConverted);
            const returnOnlyGamesThatHaveStarted = false;
            const games = await pickemClient.queryGames(weekNumberConverted, league.year, league.sport, returnOnlyGamesThatHaveStarted);

            setCurrentLeague(league);
            setCurrentPicks(picks);
            setWeekGames(games);
        }

        fetchData();
    }, []);
    return (
        <>
            <DataGrid
                rows={weekGames}
                columns={columns}
            />
        </>
    );
}

