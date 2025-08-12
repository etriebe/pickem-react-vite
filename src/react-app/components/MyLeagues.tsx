import * as React from 'react';
import { useState, useEffect } from "react";
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { League, IWeekPick } from '../services/PickemApiClient';
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import LeagueCard from './LeagueCard';

export default function MyLeagues() {
    const [currentLeagues, setCurrentLeagues] = useState<League[]>([]);
    const [currentPicks, setCurrentPicks] = useState<IWeekPick[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const leagues = await LeagueUtilities.getLeaguesForCurrentUser(false);
            let picks: IWeekPick[] = [];
            for (let l of leagues) {
                const currentLeaguePick = await pickemClient.getWeekPickForUser(l.id!, l.currentWeekNumber, l.type);
                if (currentLeaguePick) {
                    picks.push(currentLeaguePick);
                }
            }
            setCurrentLeagues(leagues);
            setCurrentPicks(picks);
        }

        fetchData();
    }, []);
    return (
        <>
            {currentLeagues.map((l, index) => {
                const currentLeaguePicks = currentPicks.find(p => p.leagueId === l.id);
                return (<ul style={{ listStyleType: 'none' }} key={l.id}><LeagueCard league={l} picksSubmitted={currentLeaguePicks != null} /></ul>);
            })}
        </>
    );
}
