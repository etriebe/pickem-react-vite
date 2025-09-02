import { useState, useEffect } from "react";
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { League, IWeekPick } from '../services/PickemApiClient';
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import LeagueCard from './LeagueCard';
import { Grid } from "@mui/material";
import Loading from "./Loading";

export default function MyLeagues() {
    const [currentLeagues, setCurrentLeagues] = useState<League[]>([]);
    const [currentPicks, setCurrentPicks] = useState<IWeekPick[]>([]);
    const [dataLoaded, setDataLoaded] = useState(false);

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
            setDataLoaded(true);
        }

        fetchData();
    }, []);
    return (
        <>
            {!dataLoaded ?
                <Loading /> :
                <Grid
                    container
                    spacing={2}
                    padding={2}
                    sx={{ mb: (theme) => theme.spacing(2) }}
                >
                    {currentLeagues.map((l) => {
                        const currentLeaguePicks = currentPicks.find(p => p.leagueId === l.id);
                        return <><Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <LeagueCard league={l} picksSubmitted={currentLeaguePicks != null} />
                        </Grid></>;
                    })}
                </Grid>
            }
        </>
    );
}
