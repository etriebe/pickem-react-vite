import { Breadcrumbs, Anchor, Box } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { PageType, SiteUtilities } from '../utilities/SiteUtilities';
import { Link } from 'react-router';

export interface NavbarBreadcrumbsProps {
  leagueId: string | undefined;
  weekNumber: number | undefined;
}

export default function NavbarBreadcrumbs({ leagueId, weekNumber }: NavbarBreadcrumbsProps) {
  const currentUrl = window.location.pathname;
  const currentPageType = SiteUtilities.getPageTypeFromUrl(currentUrl);
  const leagueType = SiteUtilities.getLeagueTypeFromUrl(currentUrl);
  let leagueStandingLink: string | undefined = undefined;
  let weekStandingLink: string | undefined = undefined;
  let makePicksLink: string | undefined = undefined;

  if (leagueType && leagueId) {
    leagueStandingLink = SiteUtilities.getLeagueStandingLink(leagueType?.value!, leagueId);
    if (weekNumber) {
      weekStandingLink = SiteUtilities.getWeekStandingLink(leagueType?.value!, leagueId, weekNumber);
      makePicksLink = SiteUtilities.getMakePicksLink(leagueType?.value!, leagueId, weekNumber);
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <Breadcrumbs separator={<IconChevronRight size={14} />}>
        {currentPageType !== PageType.LeagueStandingsPage && leagueStandingLink && (
          <Anchor component={Link} to={leagueStandingLink}>
            League Standings
          </Anchor>
        )}
        {currentPageType !== PageType.WeekStandingsPage && weekStandingLink && (
          <Anchor component={Link} to={weekStandingLink}>
            Week Standings
          </Anchor>
        )}
        {currentPageType !== PageType.MakePicksPage && makePicksLink && (
          <Anchor component={Link} to={makePicksLink}>
            Make Picks
          </Anchor>
        )}
      </Breadcrumbs>
    </Box>
  );
}
