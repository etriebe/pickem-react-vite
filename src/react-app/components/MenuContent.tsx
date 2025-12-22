import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Add as AddIcon } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

const mainListItems = [
  { text: 'My Leagues', icon: <HomeRoundedIcon />, path: '/' },
  { text: 'Create League', icon: <AddIcon />, path: '/createleague' },
  { text: 'Browse Leagues', icon: <SearchIcon />, path: '/browseleagues' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/settings' },
];

export default function MenuContent() {
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
