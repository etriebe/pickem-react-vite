import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { ActionIcon, Menu } from '@mantine/core';
import useColorScheme from './useColorScheme';

export default function ColorModeIconDropdown() {
  const { mode, systemMode, setMode } = useColorScheme();
  const resolvedMode = (systemMode || mode) as 'light' | 'dark';
  const icon = resolvedMode === 'light' ? <IconSun /> : <IconMoonStars />;

  return (
    <Menu withinPortal>
      <Menu.Target>
        <ActionIcon size="sm">{icon}</ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => setMode('system')}>System</Menu.Item>
        <Menu.Item onClick={() => setMode('light')}>Light</Menu.Item>
        <Menu.Item onClick={() => setMode('dark')}>Dark</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
