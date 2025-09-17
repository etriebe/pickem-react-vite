import { Menu } from '@mantine/core';
import { IconDotsVertical, IconLogout } from '@tabler/icons-react';
import MenuButton from './MenuButton';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

export default function OptionsMenu() {
  const handleLogOut = async () => {
    await AuthenticationUtilities.logout();
  };

  return (
    <Menu withinPortal position="right-start" offset={8} onClose={() => {}}>
      <Menu.Target>
          <MenuButton aria-label="Open menu">
          <IconDotsVertical />
        </MenuButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => {}}>Profile</Menu.Item>
        <Menu.Item onClick={() => {}}>My account</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => {}}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={<IconLogout size={16} />} onClick={handleLogOut}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
