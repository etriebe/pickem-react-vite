import { useEffect, useState, ReactElement } from 'react';
import { useParams } from 'react-router';
import { LeagueDTO, SpreadWeekPickDTO, GameDTO, SpreadGamePickDTO } from '../../services/PickemApiClient';
import PickemApiClientFactory from '../../services/PickemApiClientFactory';
import { Table, ScrollArea, Paper, Title, Text, Button, Group, Badge } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import MakePicksTeamCell from '../MakePicksTeamCell';
import LeagueNavigationBreadcrumbs from '../LeagueNavigationBreadcrumbs';
import Loading from '../Loading';
import { SiteUtilities } from '../../utilities/SiteUtilities';

export default function PickemMakePicks(): ReactElement {
  const { leagueId, weekNumber } = useParams();
  const weekNumberConverted = parseInt(weekNumber ?? '0');
  const [league, setLeague] = useState<LeagueDTO | undefined>(undefined);
  const [games, setGames] = useState<GameDTO[] | undefined>(undefined);
  const [picks, setPicks] = useState<SpreadWeekPickDTO | undefined>(undefined);
  const [weekDescription, setWeekDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const client = PickemApiClientFactory.createClient();
        const leagueResp = await client.getLeagueById(leagueId);
        setLeague(leagueResp);

        const picksResp = await client.getSpreadWeekPicksForUser(leagueId, weekNumberConverted);
        // If server returns null, create an empty DTO
        const currentPicks = picksResp ?? new SpreadWeekPickDTO();
        // Ensure required fields are present
        currentPicks.leagueId = leagueId;
        currentPicks.weekNumber = weekNumberConverted;
        currentPicks.year = leagueResp?.seasonInformation?.year?.toString() ?? leagueResp?.year;
        currentPicks.sport = leagueResp?.sport;

        const returnOnlyGamesThatHaveStarted = false;
        const gamesResp = await client.queryGames(weekNumberConverted, leagueResp?.year, leagueResp?.sport, returnOnlyGamesThatHaveStarted);
        setGames(gamesResp);

        // Initialize game picks for any missing games
        if (!currentPicks.gamePicks) {
          currentPicks.gamePicks = [] as SpreadGamePickDTO[];
        }
        for (const g of gamesResp ?? []) {
          if (!currentPicks.gamePicks.find(gp => gp.gameID === g.id)) {
            const gp = new SpreadGamePickDTO();
            gp.gameID = g.id;
            gp.sidePicked = undefined;
            gp.isKeyPicked = false;
            currentPicks.gamePicks.push(gp);
          }
        }

        const longDescription = true;
        const desc = SiteUtilities.getWeekDescriptionFromWeekNumber(leagueResp.seasonInformation!, leagueResp.currentWeekNumber!, longDescription);
        setWeekDescription(desc);

        setPicks(currentPicks);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load make picks data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leagueId, weekNumber]);

  const countSelectedPicks = (): number => {
    if (!picks?.gamePicks) return 0;
    return picks.gamePicks.filter(gp => gp.sidePicked === 0 || gp.sidePicked === 1).length;
  };

  const countKeyPicks = (): number => {
    if (!picks?.gamePicks) return 0;
    return picks.gamePicks.filter(gp => gp.isKeyPicked).length;
  };

  const togglePick = (gameId: string | undefined, side: 0 | 1) => {
    setPicks(prev => {
      if (!prev || !prev.gamePicks) return prev;
      const clone = SpreadWeekPickDTO.fromJS(prev.toJSON());
      const gp = clone.gamePicks!.find(g => g.gameID === gameId);
      if (!gp) return prev;
      gp.sidePicked = gp.sidePicked === side ? undefined : side;
      if (gp.sidePicked === undefined) gp.isKeyPicked = false;
      return clone;
    });
  };

  const toggleKeyPick = (gameId: string | undefined) => {
    setPicks(prev => {
      if (!prev || !prev.gamePicks) return prev;
      const clone = SpreadWeekPickDTO.fromJS(prev.toJSON());
      const gp = clone.gamePicks!.find(g => g.gameID === gameId);
      if (!gp) return prev;
      if (gp.sidePicked === undefined) return prev;
      gp.isKeyPicked = !gp.isKeyPicked;
      return clone;
    });
  };

  const handleSubmit = async () => {
    if (!picks) return;
    try {
      const client = PickemApiClientFactory.createClient();
      await client.upsertSpreadWeekPick(picks);
      // Simple feedback
      // eslint-disable-next-line no-alert
      alert('Picks saved');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save picks', err);
      // eslint-disable-next-line no-alert
      alert('Failed to save picks');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Title order={3}>{league?.leagueName}</Title>
      <LeagueNavigationBreadcrumbs league={league!} currentWeekNumber={weekNumberConverted} navigationTitle={weekDescription} />
      <Paper shadow="sm" padding="md" mt="md">
        <Group position="apart" align="center" mb="sm">
          <Text weight={700}>Make your picks</Text>
          <div>
            <Badge color="blue">Selected: {countSelectedPicks()}</Badge>
            <Badge ml="sm" color="teal">Key: {countKeyPicks()}</Badge>
          </div>
        </Group>

        <ScrollArea style={{ maxHeight: 600 }}>
          <Table striped highlightOnHover verticalSpacing="sm" horizontalSpacing="sm">
            <thead>
              <tr>
                <th>Time</th>
                <th>Away</th>
                <th></th>
                <th>Home</th>
                <th>Key</th>
              </tr>
            </thead>
            <tbody>
              {(games ?? []).map((g) => {
                const gp = picks?.gamePicks?.find(x => x.gameID === g.id);
                return (
                  <tr key={g.id} className={isSmallScreen ? 'makePickContainerSmall' : 'makePickContainer'}>
                    <td>{g.gameStartTime ? new Date(g.gameStartTime).toLocaleString() : ''}</td>
                    <td onClick={() => togglePick(g.id, 0)} style={{ cursor: 'pointer' }}>
                      <MakePicksTeamCell imagePath={SiteUtilities.getTeamIconPathFromTeam(g.awayTeam!, league!)} altText={SiteUtilities.getAltTextFromTeam(g.awayTeam!)} isSmallScreen={isSmallScreen} cellText={g.awayTeam?.name ?? ''} />
                    </td>
                    <td style={{ textAlign: 'center' }}>{g.currentSpread?.spreadAmount ?? '-'}</td>
                    <td onClick={() => togglePick(g.id, 1)} style={{ cursor: 'pointer' }}>
                      <MakePicksTeamCell imagePath={SiteUtilities.getTeamIconPathFromTeam(g.homeTeam!, league!)} altText={SiteUtilities.getAltTextFromTeam(g.homeTeam!)} isSmallScreen={isSmallScreen} cellText={g.homeTeam?.name ?? ''} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Button size="xs" variant={gp?.isKeyPicked ? 'filled' : 'outline'} onClick={() => toggleKeyPick(g.id)} disabled={gp?.sidePicked === undefined}>
                        {gp?.isKeyPicked ? 'Key' : 'Set'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ScrollArea>

        <Group position="right" mt="md">
          <Button onClick={handleSubmit}>Save Picks</Button>
        </Group>
      </Paper>
    </>
  );
}