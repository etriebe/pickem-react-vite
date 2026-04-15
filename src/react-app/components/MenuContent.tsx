import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Add as AddIcon, } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import { Menu, MenuItem, useColorScheme } from '@mui/material';
import React from 'react';

const mainListItems = [
  { text: 'My Leagues', icon: <HomeRoundedIcon />, path: '/' },
  { text: 'Create League', icon: <AddIcon />, path: '/createleague' },
  { text: 'Browse Leagues', icon: <SearchIcon />, path: '/browseleagues' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

const goHome = () => () => {
  window.location.href = '/';
};


export default function MenuContent() {
  const { mode, systemMode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMode = (targetMode: 'system' | 'light' | 'dark') => () => {
    setMode(targetMode);
    handleClose();
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton selected={index === 0} component="a" href={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List dense>
          <ListItem key='lightMode' disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon><LightModeIcon /></ListItemIcon>
              <ListItemText primary='Light/Dark Mode' />
            </ListItemButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  variant: 'outlined',
                  elevation: 0,
                  sx: {
                    my: '4px',
                  },
                },
              }}
              transformOrigin={{ horizontal: 'center', vertical: 'center'}}
              anchorOrigin={{ horizontal: 'center', vertical: 'center'}}
              // transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              // anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem selected={mode === 'system'} onClick={handleMode('system')}>
                System
              </MenuItem>
              <MenuItem selected={mode === 'light'} onClick={handleMode('light')}>
                Light
              </MenuItem>
              <MenuItem selected={mode === 'dark'} onClick={handleMode('dark')}>
                Dark
              </MenuItem>
            </Menu>
          </ListItem>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton component="a" href={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
    </>
  );
}
