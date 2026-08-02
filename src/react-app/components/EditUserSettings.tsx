import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Container, Grid, Paper, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import PickemApiClientFactory from '../services/PickemApiClientFactory';
import Loading from './Loading';
import { timezones } from '../utilities/TimeZoneUtilities';
import { UserSettings } from '../services/PickemApiClient';

type Props = {}

function EditUserSettings({}: Props) {
    const [userName, setUserName] = useState<string>();
    const [discordUserId, setDiscordUserId] = useState<string>();
    const [timeZone, setTimeZone] = useState<string>();

    const userSettingsQuery = useQuery({
        queryKey: ['usersettings'],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getUserSettingFromUserId();
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const userSettings = new UserSettings();
        userSettings.userId = userSettingsQuery.data?.userId!;
        userSettings.partitionKey = userSettingsQuery.data?.partitionKey!;
        userSettings.userName = userName ?? userSettingsQuery.data!.userName;
        userSettings.discordUserId = discordUserId ?? userSettingsQuery.data!.discordUserId;
        userSettings.timeZoneInfoId = timeZone ?? userSettingsQuery.data!.timeZoneInfoId;
        await pickemClient.updateUserSettings(userSettings);
        window.location.href = '/';
    };

    const timeZoneOptions = timezones.map((tz) => ({ value: tz.id, label: tz.label }));

    return (
        <Container size="md" py="xl">
            <Paper withBorder p="xl" radius="md">
                <Stack spacing="xl">
                    <Title order={2}>User Settings</Title>
                    {userSettingsQuery.isPending && <Loading />}
                    {userSettingsQuery.isError && <Text color="red">Failed to load user settings</Text>}
                    {userSettingsQuery.isSuccess && (
                        <form onSubmit={handleSubmit}>
                            <Grid gutter="md">
                                <Grid.Col xs={12} md={6}>
                                    <TextInput
                                        label="User Name"
                                        defaultValue={userSettingsQuery.data.userName}
                                        onChange={(e) => setUserName(e.currentTarget.value)}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <TextInput
                                        label="Discord User Id"
                                        defaultValue={userSettingsQuery.data.discordUserId}
                                        onChange={(e) => setDiscordUserId(e.currentTarget.value)}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12} md={6}>
                                    <Select
                                        label="Time Zone"
                                        data={timeZoneOptions}
                                        value={timeZone ?? userSettingsQuery.data.timeZoneInfoId}
                                        onChange={(value) => setTimeZone(value ?? '')}
                                        required
                                    />
                                </Grid.Col>
                                <Grid.Col xs={12}>
                                    <Button type="submit" fullWidth>
                                        Save
                                    </Button>
                                </Grid.Col>
                            </Grid>
                        </form>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
}

export default EditUserSettings;
