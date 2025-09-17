import { Navbar, ScrollArea, Group, Avatar, Text, Anchor, MediaQuery, Box } from '@mantine/core';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import SiteLogo from './SiteLogo';

export interface SideMenuProps {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
}

export default function SideMenu({ isAuthenticated, username, email } : SideMenuProps ) {
  return (
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      <Navbar width={{ base: 240 }} p="xs">
        <Navbar.Section>
          <Box style={{ marginTop: 'calc(var(--template-frame-height, 0px) + 4px)', padding: 12 }}>
            <SiteLogo />
          </Box>
        </Navbar.Section>

        <Navbar.Section grow component={ScrollArea}>
          <MenuContent />
        </Navbar.Section>

        <Navbar.Section>
          <Group position="left" spacing={8} align="center" style={{ padding: 12, borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Avatar src="/static/images/avatar/7.jpg" alt={username} radius="xl" size={36} />
            <Box style={{ flex: 1 }}>
              {isAuthenticated ? (
                <>
                  <Text weight={500} size="sm">{username}</Text>
                  <Text color="dimmed" size="xs">{email}</Text>
                </>
              ) : (
                <Anchor href="/signin">Sign in</Anchor>
              )}
            </Box>
            <OptionsMenu />
          </Group>
        </Navbar.Section>
      </Navbar>
    </MediaQuery>
  );
}
