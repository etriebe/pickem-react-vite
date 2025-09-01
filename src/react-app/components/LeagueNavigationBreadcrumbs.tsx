import { Link } from "@mui/material";
import { SiteUtilities } from "../utilities/SiteUtilities";
import { LeagueDTO } from "../services/PickemApiClient";

type LeagueNavigationBreadcrumbsProps = {
    league: LeagueDTO;
    currentWeekNumber: number;
}

export default function LeagueNavigationBreadcrumbs({ league, currentWeekNumber }: LeagueNavigationBreadcrumbsProps) {
    if (!league) {
        return <></>;
    }
    const previousWeekNumber = currentWeekNumber - 1;
    const previousWeekURL = SiteUtilities.getMakePicksLink(league.type!, league.id!, previousWeekNumber);
    const nextWeekNumber = currentWeekNumber + 1;
    const nextWeekURL = SiteUtilities.getMakePicksLink(league.type!, league.id!, nextWeekNumber);
    return (
        <>
            <div className="NavigationBreadcrumbsContainer">
                {previousWeekNumber >= league.startingWeekNumber! &&
                    <div className="NavigationBreadcrumbs">
                        <Link
                            href={previousWeekURL}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Week {previousWeekNumber} Picks
                        </Link>
                    </div>
                }
                {nextWeekNumber <= league.endingWeekNumber! &&
                    <div className="NavigationBreadcrumbs">
                        <Link
                            href={nextWeekURL}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                        >
                            Week {nextWeekNumber} Picks
                        </Link>
                    </div>
                }
            </div>
        </>
    )
}