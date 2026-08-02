import { League } from '../services/PickemApiClient';
import { useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Notification,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconListNumbers,
  IconRefresh,
  IconSettings,
  IconSend,
  IconSoccerField,
} from '@tabler/icons-react';
import { SiteUtilities } from '../utilities/SiteUtilities';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { AuthenticationUtilities } from '../utilities/AuthenticationUtilities';

export interface LeagueCardProps {
  league: League;
  picksSubmitted: boolean;
}

export default function LeagueCard({ league, picksSubmitted }: LeagueCardProps) {
  const currentWeekNumber = LeagueUtilities.getCurrentWeekNumber(league);
  const weekStandingLink = SiteUtilities.getWeekStandingLink(league.type, league.id!, currentWeekNumber!);
  const leagueStandingLink = SiteUtilities.getLeagueStandingLink(league.type, league.id!);
  const myPicksLink = SiteUtilities.getMakePicksLink(league.type, league.id!, currentWeekNumber!);
  const editLeagueLink = SiteUtilities.getEditLeagueLink(league.id!);
  const pickStatus = SiteUtilities.getEmojiForPickStatus(picksSubmitted);
  const longDescription = true;
  const weekDescription = SiteUtilities.getWeekDescriptionFromWeekNumber(league.seasonInformation!, currentWeekNumber!, longDescription);
  const leagueYear = league.year?.replace('_', '-');
  const isOffSeason = LeagueUtilities.isOffSeason(league);
  const userInfo = AuthenticationUtilities.getUserInfoFromLocalStorage();
  const isAdmin = league.leagueAdminIds?.find((a) => a === userInfo.id);
  const [copyInviteMessage, setCopyInviteMessage] = useState('');
  const [open, setOpen] = useState(false);

  const copyLeagueInvite = async () => {
    const fullCopyInviteLink = `${window.location.origin}${SiteUtilities.getInviteLink(league.id!)}`;
    await navigator.clipboard.writeText(fullCopyInviteLink);
    setCopyInviteMessage('Copied invite link!');
    setOpen(true);
  };

  return (
    <>
      <Card shadow="sm" radius="md" withBorder>
        <Stack spacing="sm" p="md">
          <Group position="apart" align="flex-start">
            <Stack spacing={0}>
              <Text weight={700} size="lg">
                {league.leagueName} - {leagueYear}
              </Text>
              <Text size="sm" color="dimmed">
                {weekDescription}
              </Text>
            </Stack>
            <Badge color={isOffSeason ? 'yellow' : 'blue'}>{pickStatus}</Badge>
          </Group>
          <Text size="sm">Picks: {pickStatus}</Text>

          {isAdmin && (
            <Group spacing="sm" grow>
              <Button component="a" href={editLeagueLink} leftIcon={<IconSettings size={16} />} variant="outline">
                Edit League
              </Button>
              <Button onClick={copyLeagueInvite} leftIcon={<IconSend size={16} />} variant="outline">
                Copy Invite
              </Button>
            </Group>
          )}

          <Group spacing="sm" grow>
            <Button component="a" href={leagueStandingLink} leftIcon={<IconListNumbers size={16} />} variant="outline">
              League Standings
            </Button>
            <Button component="a" href={weekStandingLink} leftIcon={<IconCalendarEvent size={16} />} variant="outline">
              Week Standings
            </Button>
          </Group>

          <Button
            component="a"
            href={isOffSeason ? undefined : myPicksLink}
            leftIcon={isOffSeason ? <IconRefresh size={16} /> : <IconSoccerField size={16} />}
            variant="filled"
          >
            {isOffSeason ? 'Renew League' : 'Make Picks'}
            {isOffSeason && !isAdmin ? ' - Notify League Admin' : ''}
          </Button>
        </Stack>
      </Card>
      {open && (
        <Notification onClose={() => setOpen(false)} color="teal" mt="sm">
          {copyInviteMessage}
        </Notification>
      )}
    </>
  );
}
