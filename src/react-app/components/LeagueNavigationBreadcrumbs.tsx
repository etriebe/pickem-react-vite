import { ActionIcon, Group, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { PageType, SiteUtilities } from '../utilities/SiteUtilities';
import { LeagueDTO } from '../services/PickemApiClient';

type LeagueNavigationBreadcrumbsProps = {
    league: LeagueDTO;
    currentWeekNumber: number;
    navigationTitle: string;
    pageType: PageType;
    isSmallScreen: boolean;
};

export default function LeagueNavigationBreadcrumbs({ league, currentWeekNumber, navigationTitle, pageType, isSmallScreen }: LeagueNavigationBreadcrumbsProps) {
    if (!league) {
        return null;
    }
    const previousWeekNumber = currentWeekNumber - 1;
    const previousWeekURL = SiteUtilities.getNavigationLinkForPageType(pageType, league.type!, league.id!, previousWeekNumber);
    const nextWeekNumber = currentWeekNumber + 1;
    const nextWeekURL = SiteUtilities.getNavigationLinkForPageType(pageType, league.type!, league.id!, nextWeekNumber);
    const textSize = isSmallScreen ? 'md' : 'xl';
    return (
        <Group className="NavigationBreadcrumbsContainer" position="apart" align="center" sx={{ width: '100%' }}>
            {previousWeekNumber >= league.startingWeekNumber! && (
                <ActionIcon component="a" href={previousWeekURL} size="lg">
                    <IconChevronLeft />
                </ActionIcon>
            )}
            <Text size={textSize} align="center" sx={{ flex: 1 }}>
                {navigationTitle}
            </Text>
            {nextWeekNumber <= league.endingWeekNumber! && (
                <ActionIcon component="a" href={nextWeekURL} size="lg">
                    <IconChevronRight />
                </ActionIcon>
            )}
        </Group>
    );
}
