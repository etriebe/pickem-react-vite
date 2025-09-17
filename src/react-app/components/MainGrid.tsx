import { Grid, Box, Title } from '@mantine/core';
import HighlightedCard from './HighlightedCard';

export default function MainGrid() {
  return (
    <Box style={{ width: '100%', maxWidth: 1700 }}>
      {/* cards */}
      <Title order={2} style={{ marginBottom: 16 }}>
        Welcome to Just Pick'em!
      </Title>
      <Grid gutter="md">
        <Grid.Col span={12} md={6} lg={3}>
          <HighlightedCard />
        </Grid.Col>
        {/* <Grid.Col span={12} md={6} lg={3}>
          <HighlightedCard />
        </Grid.Col> */}
      </Grid>
    </Box>
  );
}
