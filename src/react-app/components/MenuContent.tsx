import { Anchor, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconHome, IconPlus, IconSearch, IconSettings } from '@tabler/icons-react';

const mainListItems = [
  { text: 'My Leagues', icon: <IconHome size={18} />, path: '/' },
  { text: 'Create League', icon: <IconPlus size={18} />, path: '/createleague' },
  { text: 'Browse Leagues', icon: <IconSearch size={18} />, path: '/browseleagues' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <IconSettings size={18} />, path: '/settings' },
];

export default function MenuContent() {
  return (
    <Stack spacing="xs" px="xs" py="sm" justify="space-between" sx={{ flexGrow: 1 }}>
      <Stack spacing={4}>
        {mainListItems.map((item, index) => (
          <Anchor
            key={item.text}
            href={item.path}
            sx={(theme) => ({
              display: 'block',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.black,
              backgroundColor: index === 0 ? theme.colors.blue[0] : 'transparent',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
              },
            })}
          >
            <Group spacing="sm">
              <ThemeIcon variant="light" size="sm">
                {item.icon}
              </ThemeIcon>
              <Text>{item.text}</Text>
            </Group>
          </Anchor>
        ))}
      </Stack>
      <Stack spacing={4} mt="md">
        {secondaryListItems.map((item) => (
          <Anchor
            key={item.text}
            href={item.path}
            sx={(theme) => ({
              display: 'block',
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.black,
              textDecoration: 'none',
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
              },
            })}
          >
            <Group spacing="sm">
              <ThemeIcon variant="light" size="sm">
                {item.icon}
              </ThemeIcon>
              <Text>{item.text}</Text>
            </Group>
          </Anchor>
        ))}
      </Stack>
    </Stack>
  );
}
