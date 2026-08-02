import { Box, Group, Image, Text } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import * as React from 'react';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import { SideMenuProps } from './SideMenu';
import siteLogo from '../assets/logo.png';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

export default function AppNavbar({ isAuthenticated, username, email }: SideMenuProps) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const goHome = () => () => {
    window.location.href = '/';
  };

  return (
    <Box
      component="header"
      sx={(theme) => ({
        display: 'block',
        position: 'fixed',
        width: '100%',
        top: 'var(--template-frame-height, 0px)',
        zIndex: 1000,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
          display: 'none',
        },
      })}
    >
      <Group px="md" py="sm" position="apart" align="center">
        <Group spacing="xs" onClick={goHome()} className="centerDivContainer" sx={{ cursor: 'pointer' }}>
          <Image src={siteLogo} alt="Site Logo" width={30} height={30} />
          <Text size="lg" weight={700}>
            Just Pick'em
          </Text>
        </Group>

        <Group spacing="xs">
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <IconMenu2 />
          </MenuButton>
          <ColorModeIconDropdown />
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} isAuthenticated={isAuthenticated} email={email} username={username} />
        </Group>
      </Group>
    </Box>
  );
}
