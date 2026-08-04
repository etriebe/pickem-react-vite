import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { useParams } from 'react-router';
import Loading from '../Loading';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';

export default function BracketMakePicks() {
    const { leagueId } = useParams();
    const bracketQuery = useQuery({
        queryKey: ['bracket', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getBracketLeaguePage(leagueId!);
        },
    });

    let matches: any = [
    {
      id: 1,
      name: "Round 1 - Match 1",
      nextMatchId: 5,
      tournamentRoundText: "1",
      startTime: "2023-06-01",
      state: "DONE",
      participants: [
        {
          id: "1",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Team 1"
        },
        {
          id: "2",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Team 2"
        }
      ]
    },
    {
      id: 2,
      name: "Round 1 - Match 2",
      nextMatchId: 5,
      tournamentRoundText: "1",
      startTime: "2023-06-01 30:0",
      state: "DONE",
      participants: [
        {
          id: "3",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Team 3"
        },
        {
          id: "4",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Team 4"
        }
      ]
    },
    {
      id: 3,
      name: "Round 1 - Match 3",
      nextMatchId: 6,
      tournamentRoundText: "1",
      startTime: "2023-06-01",
      state: "DONE",
      participants: [
        {
          id: "5",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Team 5"
        },
        {
          id: "6",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Team 6"
        }
      ]
    },
    {
      id: 4,
      name: "Round 1 - Match 4",
      nextMatchId: 6,
      tournamentRoundText: "1",
      startTime: "2023-06-01",
      state: "DONE",
      participants: [
        {
          id: "7",
          resultText: "WON",
          isWinner: true,
          status: "PLAYED",
          name: "Team 7"
        },
        {
          id: "8",
          resultText: "LOST",
          isWinner: false,
          status: "PLAYED",
          name: "Team 8"
        }
      ]
    },
    {
      id: 5,
      name: "Round 2 - Match 1",
      nextMatchId: 7,
      tournamentRoundText: "2",
      startTime: "2023-06-02",
      state: "NO_SHOW",
      participants: [
        {
          id: "1",
          resultText: "",
          isWinner: false,
          status: "DONE",
          name: "Team 1"
        },
        {
          id: "3",
          resultText: "dd",
          isWinner: false,
          status: "NO_SHOW",
          name: "Team 3"
        }
      ]
    },
    {
      id: 6,
      name: "Round 2 - Match 2",
      nextMatchId: 7,
      tournamentRoundText: "2",
      startTime: "2023-06-02",
      state: "NO_SHOW",
      participants: [
        {
          id: "5",
          resultText: "WON",
          isWinner: true,
          status: "NO_SHOW",
          name: "Team 5"
        },
        {
          id: "7",
          resultText: "LOST",
          isWinner: false,
          status: "NO_SHOW",
          name: "Team 7"
        }
      ]
    },
    {
      id: 7,
      name: "Final - Match",
      nextMatchId: null,
      tournamentRoundText: "3",
      startTime: "2023-06-03",
      state: "NO_SHOW",
      participants: [
        {
          id: "1",
          resultText: "WON",
          isWinner: true,
          status: "NO_SHOW",
          name: "Team 1"
        },
        {
          id: "5",
          resultText: "LOST",
          isWinner: false,
          status: "NO_SHOW",
          name: "l3waqa"
        }
      ]
    }
  ];

    if (bracketQuery.isSuccess) {
        const bracketMatches = bracketQuery.data.bracket;
        // for (let m of )
    }
    /*
        [
        ...,
        {
            "id": 260005,
            "name": "Final - Match",
            "nextMatchId": null, // Id for the nextMatch in the bracket, if it's final match it must be null OR undefined
            "tournamentRoundText": "4", // Text for Round Header
            "startTime": "2021-05-30",
            "state": "DONE", // 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | 'DONE' | 'SCORE_DONE' Only needed to decide walkovers and if teamNames are TBD (to be decided)
            "participants": [
            {
                "id": "c016cb2a-fdd9-4c40-a81f-0cc6bdf4b9cc", // Unique identifier of any kind
                "resultText": "WON", // Any string works
                "isWinner": false,
                "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY' | null
                "name": "giacomo123"
            },
            {
                "id": "9ea9ce1a-4794-4553-856c-9a3620c0531b",
                "resultText": null,
                "isWinner": true,
                "status": null, // 'PLAYED' | 'NO_SHOW' | 'WALK_OVER' | 'NO_PARTY'
                "name": "Ant"
            }
            ]
        }
        ...
        ]
    */

    if (bracketQuery.isLoading) {
        return <Loading />;
    }

    if (bracketQuery.isError) {
        return <div>Error loading bracket for league {leagueId}</div>;
    }

    if (bracketQuery.isSuccess) {
        return (
            <>
                <SingleEliminationBracket
                    matches={matches}
                    matchComponent={Match}
                    svgWrapper={({ children, ...props }) => (
                        <SVGViewer width={500} height={500} {...props}>
                            {children}
                        </SVGViewer>
                    )}
                />
            </>
        );
    }

    return <div>Unexpected state</div>;
}
