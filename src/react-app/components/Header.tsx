import Stack from '@mui/material/Stack';
import ColorModeIconDropdown from '../theme/ColorModeIconDropdown';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';

export interface NavbarBreadcrumbsProps {
  leagueId: string | undefined;
  weekNumber: number | undefined;
  isSmallScreen: boolean;
}
export default function Header({ leagueId, weekNumber, isSmallScreen }: NavbarBreadcrumbsProps) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs leagueId={leagueId} weekNumber={weekNumber} />
      <Stack direction="row" sx={{ gap: 1 }}>
        {!isSmallScreen && <ColorModeIconDropdown />}
      </Stack>
    </Stack>
  );
}
