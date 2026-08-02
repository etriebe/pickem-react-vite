import { Button, Card, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconChevronRight, IconStar } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function HighlightedCard() {
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  return (
    <Card shadow="sm" radius="md" withBorder sx={{ height: '100%' }}>
      <Stack spacing="xs" mb="sm" justify="center">
        <IconStar size={24} />
        <Text component="h2" size="lg" weight={700}>
          Play games with your friends
        </Text>
      </Stack>
      <Text color="dimmed" mb="md">
        Bet against the spread, just pick who wins games or make any types of bets just like you're at a real sportsbook.
      </Text>
      <Stack spacing="sm">
        <Button component="a" href="/signin" variant="filled" rightIcon={<IconChevronRight />} fullWidth={isSmallScreen}>
          Sign In
        </Button>
        <Button component="a" href="/signup" variant="filled" rightIcon={<IconChevronRight />} fullWidth={isSmallScreen}>
          Sign Up
        </Button>
      </Stack>
    </Card>
  );
}
