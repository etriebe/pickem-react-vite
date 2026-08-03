import { useQuery } from '@tanstack/react-query';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { useParams } from 'react-router';
import Loading from '../Loading';

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

    if (bracketQuery.isSuccess)
    {
        return (
            <>
                Bracket!
            </>
        );
    }

    return <div>Unexpected state</div>;
}
