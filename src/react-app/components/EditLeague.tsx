import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Checkbox, Container, Grid, NumberInput, Paper, ScrollArea, Stack, Table, Text, TextInput, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { LeagueDTO, LeagueSettings, UpdateLeagueSettingsRequest, UserInfo } from '../services/PickemApiClient';
import { LeagueUtilities } from '../utilities/LeagueUtilities';
import { LeagueType, SiteUtilities } from '../utilities/SiteUtilities';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import Loading from './Loading';

type Props = {}

function EditLeague({}: Props) {
    const [leagueName, setLeagueName] = useState('');
    const [startWeek, setStartWeek] = useState(1);
    const [endWeek, setEndWeek] = useState(17);
    const [isArchived, setIsArchived] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [totalPicks, setTotalPicks] = useState(6);
    const [keyPicks, setKeyPicks] = useState(1);
    const [keyPickBonus, setKeyPickBonus] = useState(1);
    const [weekStartingMoney, setWeekStartingMoney] = useState(-1);
    const [minimumGamesToPick, setMinimumGamesToPick] = useState(-1);
    const [allowParlays, setAllowParlays] = useState(false);
    const [allowWinningsForBetting, setAllowWinningsForBetting] = useState(false);
    const [lockPicksAfterTheyAreMade, setLockPicksAfterTheyAreMade] = useState(false);
    const [lockSpreadsDuringWeek, setLockSpreadsDuringWeek] = useState(false);
    const [league, setLeague] = useState<LeagueDTO>();
    const [users, setUsers] = useState<UserInfo[]>();
    const [leagueType, setLeagueType] = useState<LeagueType>();
    const [maxWeeks, setMaxWeeks] = useState(-1);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [endingWeekNumberLabel, setEndingWeekNumberLabel] = useState('');
    const { leagueId } = useParams();
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const data = await pickemClient.getLeagueByIdWithUserMapping(leagueId);
            const leagueData = data.league;
            const settings = data.league?.settings;
            const max = LeagueUtilities.getCurrentMaxWeeksForSeason(leagueData?.seasonInformation);
            setLeague(leagueData);
            setUsers(data.users);
            setMaxWeeks(max);
            setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(max));
            setLeagueName(leagueData?.leagueName ?? '');
            setStartWeek(leagueData?.startingWeekNumber ?? 1);
            setEndWeek(leagueData?.endingWeekNumber ?? max);
            setIsArchived(leagueData?.isArchived ?? false);
            setIsPublic(leagueData?.isPublic ?? false);
            setTotalPicks(settings?.totalPicks ?? 6);
            setKeyPicks(settings?.keyPicks ?? 1);
            setKeyPickBonus(settings?.keyPickBonus ?? 1);
            setWeekStartingMoney(settings?.weekStartingMoney ?? 0);
            setMinimumGamesToPick(settings?.minimumGamesToPick ?? 0);
            setAllowParlays(settings?.allowParlays ?? false);
            setAllowWinningsForBetting(settings?.allowWinningsForBetting ?? false);
            setLockPicksAfterTheyAreMade(settings?.lockPicksAfterTheyAreMade ?? false);
            setLockSpreadsDuringWeek(settings?.lockSpreadsDuringWeek ?? false);
            setLeagueType(SiteUtilities.getLeagueTypeFromNumber(leagueData?.type ?? 0));
            setDataLoaded(true);
        };

        fetchData();
    }, [leagueId]);

    const handleRemoveAdmin = async (userId: string) => {
        const pickemClient = PickemApiClientFactory.createClient();
        const userIndex = league?.leagueAdminIds?.indexOf(userId) ?? -1;
        if (userIndex > -1) {
            league?.leagueAdminIds?.splice(userIndex, 1);
        }
        await pickemClient.removeUserAsAdmin(leagueId, userId);
    };

    const handleMakeAdmin = async (userId: string) => {
        const pickemClient = PickemApiClientFactory.createClient();
        if (league?.leagueAdminIds && !league.leagueAdminIds.includes(userId)) {
            league.leagueAdminIds.push(userId);
        }
        await pickemClient.makeUserAsAdmin(leagueId, userId);
    };

    const handleKickUser = async (userId: string) => {
        const pickemClient = PickemApiClientFactory.createClient();
        await pickemClient.kickUser(leagueId, userId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const updateLeagueSettings = new UpdateLeagueSettingsRequest();
        updateLeagueSettings.isArchived = isArchived;
        updateLeagueSettings.isPublic = isPublic;
        updateLeagueSettings.leagueId = leagueId!;
        updateLeagueSettings.leagueName = leagueName;
        updateLeagueSettings.startingWeekNumber = startWeek;
        updateLeagueSettings.endingWeekNumber = endWeek;

        const leagueSettings = new LeagueSettings();
        leagueSettings.allowParlays = allowParlays;
        leagueSettings.allowWinningsForBetting = allowWinningsForBetting;
        leagueSettings.keyPickBonus = keyPickBonus;
        leagueSettings.keyPicks = keyPicks;
        leagueSettings.lockPicksAfterTheyAreMade = lockPicksAfterTheyAreMade;
        leagueSettings.lockSpreadsDuringWeek = lockSpreadsDuringWeek;
        leagueSettings.minimumGamesToPick = minimumGamesToPick;
        leagueSettings.totalPicks = totalPicks;
        leagueSettings.weekStartingMoney = weekStartingMoney;
        updateLeagueSettings.settings = leagueSettings;
        await pickemClient.updateLeagueSettings(updateLeagueSettings);
        window.location.href = '/';
    };

    const renderUserName = (user: UserInfo) => {
        return SiteUtilities.getShortenedUserNameFromId(users ?? [], user.id, user.email);
    };

    if (!dataLoaded) {
        return <Loading />;
    }

    return (
        <Container size="xl" py="xl">
            <Paper withBorder p="xl" radius="md">
                <Stack spacing="xl">
                    <Title order={2}>Edit League</Title>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing="lg">
                            <Grid gutter="md">
                                <Grid.Col xs={12} md={6}>
                                    <TextInput
                                        label="League Name"
                                        value={leagueName}
                                        onChange={(event) => setLeagueName(event.currentTarget.value)}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <NumberInput
                                        label="Starting Week Number"
                                        value={startWeek}
                                        onChange={(value) => setStartWeek(typeof value === 'number' ? value : 1)}
                                        min={1}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <NumberInput
                                        label={endingWeekNumberLabel || 'Ending Week Number'}
                                        value={endWeek}
                                        onChange={(value) => setEndWeek(typeof value === 'number' ? value : 1)}
                                        min={startWeek}
                                        max={maxWeeks}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={4}>
                                    <NumberInput
                                        label="Total Number of Picks"
                                        value={totalPicks}
                                        onChange={(value) => setTotalPicks(typeof value === 'number' ? value : 1)}
                                        min={1}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={4}>
                                    <NumberInput
                                        label="Total Number of Key Picks"
                                        value={keyPicks}
                                        onChange={(value) => setKeyPicks(typeof value === 'number' ? value : 1)}
                                        min={0}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <NumberInput
                                        label="Key Pick Bonus"
                                        value={keyPickBonus}
                                        onChange={(value) => setKeyPickBonus(typeof value === 'number' ? value : 1)}
                                        min={0}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <Checkbox
                                        label="Is Archived"
                                        checked={isArchived}
                                        onChange={(event) => setIsArchived(event.currentTarget.checked)}
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <Checkbox
                                        label="Is Public"
                                        checked={isPublic}
                                        onChange={(event) => setIsPublic(event.currentTarget.checked)}
                                    />
                                </Grid.Col>
                                {leagueType && leagueType.label === 'All Bet Types' && (
                                    <>
                                        <Grid.Col xs={12} md={6}>
                                            <Checkbox
                                                label="Allow Parlays"
                                                checked={allowParlays}
                                                onChange={(event) => setAllowParlays(event.currentTarget.checked)}
                                            />
                                        </Grid.Col>
                                        <Grid.Col xs={12} md={6}>
                                            <Checkbox
                                                label="Allow Winnings For Betting"
                                                checked={allowWinningsForBetting}
                                                onChange={(event) => setAllowWinningsForBetting(event.currentTarget.checked)}
                                            />
                                        </Grid.Col>
                                    </>
                                )}
                                <Grid.Col xs={12} md={6}>
                                    <Checkbox
                                        label="Lock picks after they are made"
                                        checked={lockPicksAfterTheyAreMade}
                                        onChange={(event) => setLockPicksAfterTheyAreMade(event.currentTarget.checked)}
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <Checkbox
                                        label="Lock spreads during the week"
                                        checked={lockSpreadsDuringWeek}
                                        onChange={(event) => setLockSpreadsDuringWeek(event.currentTarget.checked)}
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12}>
                                    <Button type="submit" fullWidth>
                                        Save
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </Stack>
                    </form>
                    <Text size="lg" weight={500}>League Users</Text>
                    <ScrollArea>
                        <Table striped highlightOnHover verticalSpacing="md" fontSize="sm">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Make Admin</th>
                                    <th>Kick User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((user) => (
                                    <tr key={user.id} className={isSmallScreen ? 'makePickContainerSmall' : 'makePickContainer'}>
                                        <td className="centerDivContainer standingsUserName">{renderUserName(user)}</td>
                                        <td className="centerDivContainer">
                                            {league?.leagueCreatorId === user.id ? (
                                                <Text>League Creator</Text>
                                            ) : user.id && league?.leagueAdminIds?.includes(user.id) ? (
                                                <Button variant="outline" onClick={() => handleRemoveAdmin(user.id!)}>
                                                    Remove Admin
                                                </Button>
                                            ) : (
                                                <Button variant="outline" onClick={() => handleMakeAdmin(user.id!)}>
                                                    Make Admin
                                                </Button>
                                            )}
                                        </td>
                                        <td className="centerDivContainer">
                                            {league?.leagueCreatorId !== user.id && (
                                                <Button variant="outline" onClick={() => handleKickUser(user.id!)}>
                                                    Kick User
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </ScrollArea>
                </Stack>
            </Paper>
        </Container>
    );
}

export default EditLeague;
