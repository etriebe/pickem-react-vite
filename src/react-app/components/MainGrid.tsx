import { Container, Grid, Text } from '@mantine/core';
import HighlightedCard from './HighlightedCard';

export default function MainGrid() {
  return (
    <Container fluid px={0} maw={1700}>
      <Text component="h2" size="xl" mb="md">
        Welcome to Just Pick'em!
      </Text>
      <Grid gutter="md" mb="lg">
        <Grid.Col xs={12} sm={6} lg={3}>
          <HighlightedCard />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
