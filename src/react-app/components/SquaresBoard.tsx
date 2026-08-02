import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Container, Text, Title } from '@mantine/core';
import PickemApiClientFactory from '../services/PickemApiClientFactory';

function SquaresBoard() {
    const { leagueId, boardId } = useParams<{ leagueId: string; boardId: string }>();
    const selectBoardsQuery = useQuery<any>({
        queryKey: ['selectboard', leagueId, boardId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getSquaresBoard(boardId, leagueId);
        },
    });

    return (
        <Container fluid px="md" py="md">
            <Title order={2} mb="md">
                Squares Board
            </Title>
            {selectBoardsQuery.isLoading ? (
                <Text>Loading squares board...</Text>
            ) : selectBoardsQuery.error ? (
                <Text color="red">Unable to load squares board.</Text>
            ) : (
                <Text>{JSON.stringify(selectBoardsQuery.data)}</Text>
            )}
        </Container>
    );
}

export default SquaresBoard;
