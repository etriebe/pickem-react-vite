import { Drawer, Stack, Group, Avatar, Divider, Text, Anchor, Button, Box } from '@mantine/core';
import { IconLogout, IconBell } from '@tabler/icons-react';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

interface SideMenuMobileProps {
  open: boolean | undefined;
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, isAuthenticated, username, email, toggleDrawer }: SideMenuMobileProps) {
  const handleLogOut = async () => {
    await AuthenticationUtilities.logout();
  };

  return (
    <Drawer opened={!!open} onClose={toggleDrawer(false)} position="right" size="70vw" zIndex={1100} overlayProps={{ opacity: 0.5 }}>
      <Stack style={{ height: '100%', maxWidth: '70dvw' }} spacing="sm">
        <Group position="apart" noWrap style={{ padding: 12, paddingBottom: 0 }}>
          <Group spacing="xs" style={{ alignItems: 'center', flexGrow: 1 }}>
            <Avatar size={24} alt={username ?? 'User'} src="/static/images/avatar/7.jpg" />
            {isAuthenticated ? (
              <Box>
                <Text size="sm" weight={500} style={{ lineHeight: '16px' }}>{username}</Text>
                <Text size="xs" color="dimmed">{email}</Text>
              </Box>
            ) : (
              <Anchor href="/signin" size="sm">Sign in</Anchor>
            )}
          </Group>

          <MenuButton showBadge>
            <IconBell />
          </MenuButton>
        </Group>

        <Divider />

        <Stack style={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>

        <Box style={{ padding: 12 }}>
          <Button variant="outline" fullWidth onClick={handleLogOut} leftIcon={<IconLogout /> }>
            Logout
          </Button>
        </Box>
      </Stack>
    </Drawer>
  );
}
