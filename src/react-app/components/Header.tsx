import { Group, MediaQuery, Box } from '@mantine/core';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';

export default function Header() {
  return (
    <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
      <Group position="apart" style={{ width: '100%', alignItems: 'center', paddingTop: 12, maxWidth: '1700px' }}>
        <NavbarBreadcrumbs />
        <Box style={{ display: 'flex', gap: 8 }}>
          <ColorModeIconDropdown />
        </Box>
      </Group>
    </MediaQuery>
  );
}
