import { IconButton, Typography } from "@mui/material";
import { SiteUtilities } from "../utilities/SiteUtilities";
import { LeagueDTO } from "../services/PickemApiClient";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

type LeagueNavigationBreadcrumbsProps = {
    league: LeagueDTO;
    currentWeekNumber: number;
    navigationTitle: string;
}

export default function LeagueNavigationBreadcrumbs({ league, currentWeekNumber, navigationTitle }: LeagueNavigationBreadcrumbsProps) {
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
                        <IconButton href={previousWeekURL} size="small" sx={{ alignSelf: 'center' }} >
                            <ChevronLeft />
                        </IconButton>
                    </div>
                }
                <Typography variant='h5'>{navigationTitle}</Typography>
                {nextWeekNumber <= league.endingWeekNumber! &&
                    <div className="NavigationBreadcrumbs">
                        <IconButton href={nextWeekURL} size="small" sx={{ alignSelf: 'center' }} >
                            <ChevronRight />
                        </IconButton>
                    </div>
                }
            </div>
        </>
    )
}