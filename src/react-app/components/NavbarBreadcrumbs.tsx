import { Breadcrumbs, Anchor } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { PageType, SiteUtilities } from '../utilities/SiteUtilities';
import { Link } from 'react-router';

export default function NavbarBreadcrumbs() {
  const currentUrl = window.location.pathname;
  const currentPageType = SiteUtilities.getPageTypeFromUrl(currentUrl);
  const leagueId = SiteUtilities.getLeagueIdFromUrl(currentUrl);
  const leagueType = SiteUtilities.getLeagueTypeFromUrl(currentUrl);
  const weekNumber = SiteUtilities.getWeekNumberFromUrl(currentUrl);
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

  const items = [
    { to: '/', label: 'Home' },
    ...(currentPageType !== PageType.LeagueStandingsPage && leagueStandingLink ? [{ to: leagueStandingLink, label: 'League Standings' }] : []),
    ...(currentPageType !== PageType.WeekStandingsPage && weekStandingLink ? [{ to: weekStandingLink, label: 'Week Standings' }] : []),
    ...(currentPageType !== PageType.MakePicksPage && makePicksLink ? [{ to: makePicksLink, label: 'Make Picks' }] : []),
  ];

  return (
    <Breadcrumbs separator={<IconChevronRight size={14} />}>
      {items.map((it) => (
        <Anchor<'a'> component={Link as any} to={it.to} key={it.to} sx={{ display: 'inline-flex', alignItems: 'center' }}>
          {it.label}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}
