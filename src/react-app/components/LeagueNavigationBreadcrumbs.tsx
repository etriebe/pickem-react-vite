import { IconButton, Typography } from "@mui/material";
import { PageType, SiteUtilities } from "../utilities/SiteUtilities";
import { LeagueDTO } from "../services/PickemApiClient";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

type LeagueNavigationBreadcrumbsProps = {
    league: LeagueDTO;
    currentWeekNumber: number;
    navigationTitle: string;
    pageType: PageType;
    isSmallScreen: boolean;
}

export default function LeagueNavigationBreadcrumbs({ league, currentWeekNumber, navigationTitle, pageType, isSmallScreen }: LeagueNavigationBreadcrumbsProps) {
    if (!league) {
        return <></>;
    }
    const previousWeekNumber = currentWeekNumber - 1;
    const previousWeekURL = SiteUtilities.getNavigationLinkForPageType(pageType, league.type!, league.id!, previousWeekNumber);
    const nextWeekNumber = currentWeekNumber + 1;
    const nextWeekURL = SiteUtilities.getNavigationLinkForPageType(pageType, league.type!, league.id!, nextWeekNumber);
    const navTypographySize = isSmallScreen ? 'body1' : 'h5';
    const navBreadcrumbClassName = isSmallScreen ? 'NavigationBreadcrumbsSmall' : 'NavigationBreadcrumbs';
    const buttonHeight = isSmallScreen ? 20 : 'auto';
    return (
        <>
            <div className="NavigationBreadcrumbsContainer">
                {previousWeekNumber >= league.startingWeekNumber! &&
                    <div className={navBreadcrumbClassName}>
                        <IconButton href={previousWeekURL} size="small" sx={{
                            alignSelf: 'center',
                            height: buttonHeight,
                        }} >
                            <ChevronLeft />
                        </IconButton>
                    </div>
                }
                <div className='centerDivContainerHorizontally'>
                    <Typography variant={navTypographySize}>{navigationTitle}</Typography>
                </div>
                {nextWeekNumber <= league.endingWeekNumber! &&
                    <div className={navBreadcrumbClassName}>
                        <IconButton href={nextWeekURL} size="small" sx={{
                            alignSelf: 'center',
                            height: buttonHeight,
                        }} >
                            <ChevronRight />
                        </IconButton>
                    </div>
                }
            </div>
        </>
    )
}