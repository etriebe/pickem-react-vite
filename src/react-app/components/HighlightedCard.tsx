import { Card, Text, Button, Stack } from '@mantine/core';
import { IconChevronRight, IconBulb } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function HighlightedCard() {
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <Card style={{ height: '100%', padding: 16 }}>
  <Stack spacing="xs">
        <IconBulb />
        <Text weight={600} component="h2">Play games with your friends</Text>
        <Text color="dimmed" style={{ marginBottom: 8 }}>
          Bet against the spread, just pick who wins games or make any types of bets just like you're at a real sportsbook.
        </Text>
        <Button fullWidth={isSmallScreen} style={{ marginRight: 8 }} component="a" href="/signin" rightIcon={<IconChevronRight size={16} />}>Sign In</Button>
        <Button fullWidth={isSmallScreen} component="a" href="/signup" rightIcon={<IconChevronRight size={16} />}>Sign Up</Button>
  </Stack>
    </Card>
  );
}
