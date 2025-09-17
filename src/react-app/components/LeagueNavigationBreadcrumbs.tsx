import { ActionIcon, Text } from '@mantine/core';
import { SiteUtilities } from "../utilities/SiteUtilities";
import { LeagueDTO } from "../services/PickemApiClient";
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

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
                        <ActionIcon component="a" href={previousWeekURL} size="sm">
                            <IconChevronLeft />
                        </ActionIcon>
                    </div>
                }
                <Text size="lg" weight={700}>{navigationTitle}</Text>
                {nextWeekNumber <= league.endingWeekNumber! &&
                    <div className="NavigationBreadcrumbs">
                        <ActionIcon component="a" href={nextWeekURL} size="sm">
                            <IconChevronRight />
                        </ActionIcon>
                    </div>
                }
            </div>
        </>
    )
}