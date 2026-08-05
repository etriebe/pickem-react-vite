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

    if (bracketQuery.isLoading) {
        return <Loading />;
    }
    
    if (bracketQuery.isError) {
        return <div>Error loading bracket for league {leagueId}</div>;
    }
    
    if (bracketQuery.isSuccess) {
        let bracketMatches = bracketQuery.data.reactBracketMatches!;
        return (
            <>
                <SingleEliminationBracket
                    matches={bracketMatches}
                    matchComponent={Match}
                    svgWrapper={({ children, ...props }: { children: React.ReactNode; props: any }) => (
                        <SVGViewer width={600} height={600} {...props}>
                            {children}
                        </SVGViewer>
                    )}
                />
            </>
        );
    }

    return <div>Unexpected state</div>;
}
