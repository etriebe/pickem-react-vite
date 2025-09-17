import * as React from 'react';
import { Header, Group, Box, Title, MediaQuery } from '@mantine/core';
import { IconMenu2, IconDashboard } from '@tabler/icons-react';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { SideMenuProps } from './SideMenu';

export default function AppNavbar({ isAuthenticated, username, email } : SideMenuProps ) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    // show only on small screens (hide on md and up)
    <MediaQuery largerThan="md" styles={{ display: 'none' }}>
      <Header height={64} fixed style={{ borderBottom: '1px solid var(--mantine-color-gray-3)', top: 'var(--template-frame-height, 0px)', background: 'var(--template-background-paper, white)' }}>
        <Group sx={{ height: '100%' }} px="md" position="apart">
          <Group spacing="xs" style={{ alignItems: 'center' }}>
            <CustomIcon />
            <Title order={4} style={{ margin: 0 }}>Just Pick'em</Title>
          </Group>

          <Group spacing="xs">
            <ColorModeIconDropdown />
            {/* <MenuButton aria-label="menu" >
              <IconMenu2 />
            </MenuButton> */}
            <SideMenuMobile open={open} toggleDrawer={toggleDrawer} isAuthenticated={isAuthenticated} email={email} username={username} />
          </Group>
        </Group>
      </Header>
    </MediaQuery>
  );
}

export function CustomIcon() {
  return (
  <Box
      style={{
        width: '1.5rem',
        height: '1.5rem',
        background: 'black',
        borderRadius: '999px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundImage: 'linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)',
        color: 'hsla(210, 100%, 95%, 0.9)',
        border: '1px solid hsl(210, 100%, 55%)',
        boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.3)',
      }}
      >
      <IconDashboard size={16} />
    </Box>
  );
}
