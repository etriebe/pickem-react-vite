import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { useParams } from 'react-router';
import Loading from '../Loading';
import { SingleEliminationBracket, Match, MatchType, ParticipantType, SVGViewer } from '@replydev/react-tournament-brackets';

export default function BracketMakePicks() {
    const { leagueId } = useParams();
    const bracketQuery = useQuery({
        queryKey: ['bracket', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getBracketLeaguePage(leagueId!);
        },
    });
    const width: number = window.innerWidth;
    const height: number = window.innerHeight;
    

    if (bracketQuery.isLoading) {
        return <Loading />;
    }
    
    if (bracketQuery.isError) {
        return <div>Error loading bracket for league {leagueId}</div>;
    }

    if (bracketQuery.isSuccess) {
        let bracketMatches = bracketQuery.data.reactBracketMatches!;
        let bracketMatchTypeArray : MatchType[] = [];
        
        for (let i = 0; i < bracketMatches.length; i++) {
            const bm = bracketMatches[i];
            let nextMatchId: number | string | null = null;
            if (bm.nextMatchId) {
                nextMatchId = String(bm.nextMatchId);
            }

            let matchParticipants: ParticipantType[] = [];
            for (let j = 0; j < bm.participants!.length; j++) {
                const bmParticipantFromAPI = bm.participants![j];
                let newParticipant: ParticipantType = {
                    id: bmParticipantFromAPI.id!,
                    isWinner: bmParticipantFromAPI.isWinner,
                    name: bmParticipantFromAPI.name,
                    resultText: bmParticipantFromAPI.resultText,
                    status: bmParticipantFromAPI.status,
                };
                matchParticipants.push(newParticipant);
            }
            
            const newBM: MatchType = {
                id: bm.id!,
                href: "",
                name: bm.name,
                nextMatchId: nextMatchId,
                nextLooserMatchId: null,
                tournamentRoundText: "Test tournament text",
                startTime: bm.startTime!,
                state: bm.state!,
                participants: matchParticipants,
            }
            bracketMatchTypeArray.push(newBM);
        }
        return (
            <>
                <SingleEliminationBracket
                    matches={bracketMatchTypeArray}
                    matchComponent={Match}
                    svgWrapper={({ children, ...props }: { children: React.ReactNode; props: any }) => (
                        <>
                        <SVGViewer width={width * 0.8} height={height * 0.8} {...props}>
                            {children}
                        </SVGViewer>
                        </>
                    )}
                />
            </>
        );
    }

    return <div>Unexpected state</div>;
}
