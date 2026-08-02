import { Menu } from '@mantine/core';
import { IconDotsVertical, IconLogout } from '@tabler/icons-react';
import MenuButton from './MenuButton';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';
import { SiteUtilities } from '../utilities/SiteUtilities';

export default function OptionsMenu() {
  const handleChangePassword = () => {
    window.location.href = SiteUtilities.getChangePasswordLink();
  };

  const handleLogOut = async () => {
    await AuthenticationUtilities.logout();
  };

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <MenuButton aria-label="Open menu">
          <IconDotsVertical />
        </MenuButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={handleChangePassword}>Change Password</Menu.Item>
        <Menu.Divider />
        <Menu.Item icon={<IconLogout size={16} />} onClick={handleLogOut}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
