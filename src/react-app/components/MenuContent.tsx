import { Stack, UnstyledButton, Group, Text } from '@mantine/core';
import { IconHome, IconPlus, IconSearch, IconSettings, IconInfoCircle, IconHelpCircle } from '@tabler/icons-react';

const mainListItems = [
  { text: 'My Leagues', icon: <IconHome />, path: '/' },
  { text: 'Create League', icon: <IconPlus />, path: '/createleague' },
  { text: 'Browse Leagues', icon: <IconSearch />, path: '/browseleagues' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <IconSettings />, path: '/settings' },
  { text: 'About', icon: <IconInfoCircle />, path: '/about' },
  { text: 'Feedback', icon: <IconHelpCircle />, path: '/feedback' },
];

export default function MenuContent() {
  return (
    <Stack style={{ flexGrow: 1, padding: 8, justifyContent: 'space-between' }}>
      <div>
        {mainListItems.map((item, index) => (
          <UnstyledButton key={index} component="a" href={item.path} style={{ display: 'block', width: '100%', padding: 8 }}>
            <Group>
              <div>{item.icon}</div>
              <Text>{item.text}</Text>
            </Group>
          </UnstyledButton>
        ))}
      </div>
      <div>
        {secondaryListItems.map((item, index) => (
          <UnstyledButton key={index} component="a" href={item.path} style={{ display: 'block', width: '100%', padding: 8 }}>
            <Group>
              <div>{item.icon}</div>
              <Text>{item.text}</Text>
            </Group>
          </UnstyledButton>
        ))}
      </div>
    </Stack>
  );
}
