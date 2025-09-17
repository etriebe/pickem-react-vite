import { League } from '../services/PickemApiClient';
import { Card, Button, Text, Group, Stack } from '@mantine/core';
import { SiteUtilities } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

export interface LeagueCardProps {
    league: League;
    picksSubmitted: boolean;
}

export default function LeagueCard({ league, picksSubmitted }: LeagueCardProps) {
    const weekStandingLink = SiteUtilities.getWeekStandingLink(league.type, league.id!, league.currentWeekNumber!);
    const leagueStandingLink = SiteUtilities.getLeagueStandingLink(league.type, league.id!);
    const myPicksLink = SiteUtilities.getMakePicksLink(league.type, league.id!, league.currentWeekNumber!);
    const pickStatus = SiteUtilities.getEmojiForPickStatus(picksSubmitted);
    const longDescription = true;
    const weekDescription = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, league.currentWeekNumber!, longDescription);
    const leagueYear = league.year?.replace("_", "-");
    const isOffSeason = LeagueUtilities.isOffSeason(league);
    const userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
    const isAdmin = league.leagueAdminIds?.find(a => a === userInfo.id);
    return (
        <Card shadow="sm" radius="md" withBorder>
          <Stack spacing="xs">
            <div>
              <Text weight={700} size="lg">{league.leagueName} - {leagueYear}</Text>
              <Text color="dimmed" size="xs">{weekDescription}</Text>
              <Text size="sm">Picks: {pickStatus}</Text>
            </div>

            <Group spacing="xs">
              <Button component="a" variant="light" size="sm" href={leagueStandingLink}>League Standings</Button>
              <Button component="a" variant="light" size="sm" href={weekStandingLink}>Week Standings</Button>
              {isOffSeason ? (
                <Button variant="filled" size="md">Renew League{!isAdmin && ' - Notify League Admin'}</Button>
              ) : (
                <Button component="a" variant="filled" size="md" href={myPicksLink}>Make Picks</Button>
              )}
            </Group>
          </Stack>
        </Card>
    );
}
