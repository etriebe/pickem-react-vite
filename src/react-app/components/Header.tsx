import { Group, Stack } from '@mantine/core';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';

export interface NavbarBreadcrumbsProps {
  leagueId: string | undefined;
  weekNumber: number | undefined;
  isSmallScreen: boolean;
}
export default function Header({ leagueId, weekNumber, isSmallScreen }: NavbarBreadcrumbsProps) {
  return (
    <Group
      position="apart"
      align="flex-start"
      sx={{
        width: '100%',
        maxWidth: '1700px',
        flexWrap: 'wrap',
        padding: 0,
      }}
    >
      <NavbarBreadcrumbs leagueId={leagueId} weekNumber={weekNumber} />
      {!isSmallScreen && (
        <Stack spacing="xs">
          <ColorModeIconDropdown />
        </Stack>
      )}
    </Group>
  );
}
