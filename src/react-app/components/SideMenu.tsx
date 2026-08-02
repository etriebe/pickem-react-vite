import { Anchor, Avatar, Navbar, ScrollArea, Stack, Text } from '@mantine/core';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import SiteLogo from './SiteLogo';

export interface SideMenuProps {
  isAuthenticated: boolean;
  username?: string;
  email?: string;
}

export default function SideMenu({ isAuthenticated, username, email }: SideMenuProps) {
  return (
    <Navbar p="sm" width={{ base: 0, md: 240 }} sx={{ display: 'none', '@media (min-width: 900px)': { display: 'block' } }}>
      <Navbar.Section>
        <SiteLogo />
      </Navbar.Section>

      <Navbar.Section grow component={ScrollArea} py="xs">
        <MenuContent />
      </Navbar.Section>

      <Navbar.Section>
        <Stack spacing="xs" mt="sm">
          <Stack spacing={2}>
            <Avatar radius="xl" alt={username} src="/static/images/avatar/7.jpg" />
            {isAuthenticated ? (
              <>
                <Text weight={500}>{username}</Text>
                <Text color="dimmed" size="sm">
                  {email}
                </Text>
              </>
            ) : (
              <Anchor href="/signin">Sign in</Anchor>
            )}
          </Stack>
          <OptionsMenu />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}
