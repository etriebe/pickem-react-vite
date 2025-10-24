import { useQuery } from "@tanstack/react-query";
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import Loading from "./Loading";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { timezones } from "../utilities/TimeZoneUtilities";
import { UserSettings } from "../services/PickemApiClient";

type Props = {}

function EditUserSettings({ }: Props) {
    const [userName, setUserName] = useState<string>();
    const [discordUserId, setDiscordUserId] = useState<string>();
    const [timeZone, setTimeZone] = useState<string>();

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
    
    const userSettingsQuery = useQuery({
        queryKey: ['usersettings'],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getUserSettingFromUserId();
        },
    });

    return (
        <>
            {userSettingsQuery.isPending && <Loading />}
            {userSettingsQuery.isError &&
                <Typography variant="h4" gutterBottom>Failed to load user settinsg</Typography>
            }
            {userSettingsQuery.isSuccess &&
                <Box maxWidth={600} mx="auto" mt={4} sx={{
                    '& .MuiTextField-root': { m: 1 },
                    '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                        background: 'var(--template-palette-background-default)',
                        padding: '0 4px',
                        zIndex: 1,
                    },
                }}>
                    <Typography variant="h4" gutterBottom>User Settings</Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6}}>
                                <TextField
                                    label="User Name"
                                    name="username"
                                    defaultValue={userSettingsQuery.data.userName}
                                    onChange={e => setUserName(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6}}>
                                <TextField
                                    label="Discord User Id"
                                    name="discorduserid"
                                    defaultValue={userSettingsQuery.data.discordUserId}
                                    onChange={e => setDiscordUserId(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6}}>
                                <TextField
                                    select
                                    label="Time Zone:"
                                    name="timezone"
                                    defaultValue={userSettingsQuery.data.timeZoneInfoId}
                                    onChange={e => setTimeZone(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                >
                                    {timezones.map(tz =>
                                        <MenuItem key={tz.id} value={tz.id}>{tz.label}</MenuItem>
                                    )}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            }
        </>
    )
}

export default EditUserSettings