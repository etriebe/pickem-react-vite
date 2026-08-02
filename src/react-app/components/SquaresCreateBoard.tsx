import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import { Container, SimpleGrid, Title } from '@mantine/core';
import { useParams } from 'react-router';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import SquaresGameCreateCard from './SquaresGameCreateCard';

function SquaresCreateBoard() {
    const { leagueId } = useParams<{ leagueId: string }>();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    const chooseGameQuery = useQuery<any>({
        queryKey: ['squareschoosegame', leagueId],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getSquaresChooseGame(leagueId);
        },
    });

    return (
        <Container fluid px="md" py="md">
            <Title order={2} align="center" mb="lg">
                Create Squares Game Board
            </Title>
            <SimpleGrid cols={1} spacing="md" breakpoints={[{ minWidth: 640, cols: 2 }, { minWidth: 1024, cols: 3 }]}> 
                {chooseGameQuery.data?.games
                        ?.filter((g: any) => g.result?.status !== 2)
                        .map((g: any) => (
                        <React.Fragment key={g.id}>
                            <SquaresGameCreateCard
                                game={g}
                                isSmallScreen={isSmallScreen}
                                leagueId={leagueId!}
                            />
                        </React.Fragment>
                    ))}
            </SimpleGrid>
        </Container>
    );
}

export default SquaresCreateBoard;
