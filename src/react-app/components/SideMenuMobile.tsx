import { Anchor, Avatar, Button, Drawer, Group, Stack, Text } from '@mantine/core';
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
    <Drawer opened={Boolean(open)} onClose={toggleDrawer(false)} position="right" size="70%" title="Menu">
      <Stack h="100%" spacing="md">
        <Group position="apart" align="center" grow>
          <Group spacing="sm" align="center">
            <Avatar radius="xl" alt={username} src="/static/images/avatar/7.jpg" />
            {isAuthenticated ? (
              <div>
                <Text weight={500}>{username}</Text>
                <Text color="dimmed" size="sm">
                  {email}
                </Text>
              </div>
            ) : (
              <Anchor href="/signin">Sign in</Anchor>
            )}
          </Group>
          <MenuButton showBadge />
        </Group>

        <MenuContent />

        <Button variant="outline" fullWidth onClick={handleLogOut}>
          Logout
        </Button>
      </Stack>
    </Drawer>
  );
}
