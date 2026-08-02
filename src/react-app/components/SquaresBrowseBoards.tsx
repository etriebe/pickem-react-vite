import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import { Container, SimpleGrid, Title } from '@mantine/core';
import { useParams } from 'react-router';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import SquaresGameBrowseCard from './SquaresGameBrowseCard';

function SquaresBrowseBoards() {
    const { leagueId } = useParams<{ leagueId: string }>();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const browseBoardsQuery = useQuery<any>({
        queryKey: ['browseboards', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getAllLeagueSquaresBoards(leagueId);
        },
    });

    return (
        <Container fluid px="md" py="md">
            <Title order={2} align="center" mb="lg">
                Active Squares Boards
            </Title>
            <SimpleGrid cols={1} spacing="md" breakpoints={[{ minWidth: 640, cols: 2 }, { minWidth: 1024, cols: 3 }]}> 
                {browseBoardsQuery.data?.boards?.map((b: any) => {
                    const gameId = b.gameId;
                    const gameObject = browseBoardsQuery.data?.games?.find((g: any) => g.id === gameId);
                    return (
                        <React.Fragment key={b.id}>
                            <SquaresGameBrowseCard
                                game={gameObject!}
                                boardId={b.id!}
                                isSmallScreen={isSmallScreen}
                                leagueId={leagueId!}
                            />
                        </React.Fragment>
                    );
                })}
            </SimpleGrid>
        </Container>
    );
}

export default SquaresBrowseBoards;
