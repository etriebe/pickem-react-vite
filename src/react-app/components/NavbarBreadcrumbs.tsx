import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { PageType, SiteUtilities } from '../utilities/SiteUtilities';
import { Link } from 'react-router';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

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

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Link to='/'>Home</Link>
      {currentPageType !== PageType.LeagueStandingsPage && leagueStandingLink && 
        <Link to={leagueStandingLink}>League Standings</Link>
      }
      {currentPageType !== PageType.WeekStandingsPage && weekStandingLink && 
        <Link to={weekStandingLink}>Week Standings</Link>
      }
      {currentPageType !== PageType.MakePicksPage && makePicksLink && 
        <Link to={makePicksLink}>Make Picks</Link>
      }
    </StyledBreadcrumbs>
  );
}
