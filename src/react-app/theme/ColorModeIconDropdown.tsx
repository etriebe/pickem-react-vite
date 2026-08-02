import { useState, type ComponentProps } from 'react';
import { ActionIcon, Menu, Box, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

export default function ColorModeIconDropdown(props: ComponentProps<typeof ActionIcon>) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, setOpened] = useState(false);
  const resolvedMode = colorScheme === 'dark' ? 'dark' : 'light';
  const icon = resolvedMode === 'dark' ? <IconMoonStars size={18} /> : <IconSun size={18} />;

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Menu
        opened={opened}
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        withinPortal
        position="bottom-end"
        shadow="md"
        width={160}
      >
        <Menu.Target>
          <ActionIcon
            size="lg"
            variant="default"
            onClick={() => setOpened((o) => !o)}
            {...props}
          >
            {icon}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => toggleColorScheme('light')}>Light</Menu.Item>
          <Menu.Item onClick={() => toggleColorScheme('dark')}>Dark</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
