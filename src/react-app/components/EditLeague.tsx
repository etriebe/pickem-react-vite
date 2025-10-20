import { useQuery } from "@tanstack/react-query";
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import Loading from "./Loading";
import { Box, Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography, useMediaQuery } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { timezones } from "../utilities/TimeZoneUtilities";
import { CreateLeagueRequest, LeagueDTO, LeagueSettings, SeasonDateInformation2, UpdateLeagueSettingsRequest, UserInfo, UserSettings } from "../services/PickemApiClient";
import { LeagueUtilities } from "../utilities/LeagueUtilities";
import { LeagueType, LeagueTypes, SiteUtilities, Sports } from "../utilities/SiteUtilities";
import { useParams } from "react-router";
import { DataGrid, GridColDef, GridRenderCellParams, GridTreeNodeWithRender } from "@mui/x-data-grid";

type Props = {}

function EditLeague({ }: Props) {
    const [leagueName, setLeagueName] = useState('');
    const [sport, setSport] = useState(1);
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
    const { leagueId } = useParams();
    const [endingWeekNumberLabel, setEndingWeekNumberLabel] = useState('');
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const userColumnWidth = 200;

    const handleRemoveAdmin = async (userId: string) => {
        const pickemClient = PickemApiClientFactory.createClient();
        const userIndex = league?.leagueAdminIds?.indexOf(userId);
        if (userIndex && userIndex > -1) {
            league?.leagueAdminIds?.splice(userIndex, 1);
        }
        await pickemClient.removeUserAsAdmin(leagueId, userId);
    };
    const handleMakeAdmin = async (userId: string) => {
        const pickemClient = PickemApiClientFactory.createClient();
        league?.leagueAdminIds?.push(userId);
        await pickemClient.makeUserAsAdmin(leagueId, userId);
    };
    const handleKickUser = async (userId: string) => {
        const pickemClient = PickemApiClientFactory.createClient();
        await pickemClient.kickUser(leagueId, userId);
    };
    const renderUserCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>): React.ReactNode => {
        const user = params.row;
        return <div className='centerDivContainer standingsUserName'><span>{user.email}</span></div>;
    }

    const renderAdminCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>): React.ReactNode => {
        const user = params.row;

        if (league?.leagueCreatorId === user.id) {
            return <div className='centerDivContainer standingsUserName'><span>League Creator</span></div>;
        }

        if (league?.leagueAdminIds?.find(a => a === user.id)) {
            return <Button variant="outlined" fullWidth onClick={() => { handleRemoveAdmin(user.id!) }}>
                Remove Admin
            </Button>
        }
        return <Button variant="outlined" fullWidth onClick={() => { handleMakeAdmin(user.id!) }}>
            Make Admin
        </Button>
    }

    const renderKickCell = (params: GridRenderCellParams<UserInfo, any, any, GridTreeNodeWithRender>): React.ReactNode => {
        const user = params.row;

        if (league?.leagueCreatorId === user.id) {
            return <></>;
        }

        return <Button variant="outlined" fullWidth onClick={() => { handleKickUser(user.id!) }}>
            Kick User
        </Button>
    }

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

    useEffect(() => {
        const fetchData = async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            const data = await pickemClient.getLeagueByIdWithUserMapping(leagueId);
            const league = data.league;
            const settings = data.league?.settings;
            const max = LeagueUtilities.getCurrentMaxWeeksForSeason(league?.seasonInformation);1
            setLeague(league);
            setUsers(data.users);
            setEndWeek(max);
            setMaxWeeks(max);
            setEndingWeekNumberLabel(LeagueUtilities.getEndingWeekLabel(max));
            setLeagueName(data.league?.leagueName!);
            setStartWeek(data.league?.startingWeekNumber!);
            setEndWeek(data.league?.endingWeekNumber!);
            setIsArchived(league?.isArchived!);
            setIsPublic(league?.isPublic!);
            setTotalPicks(settings?.totalPicks!);
            setKeyPicks(settings?.keyPicks!);
            setKeyPickBonus(settings?.keyPickBonus!);
            setWeekStartingMoney(settings?.weekStartingMoney!);
            setMinimumGamesToPick(settings?.minimumGamesToPick!);
            setAllowParlays(settings?.allowParlays!);
            setAllowWinningsForBetting(settings?.allowWinningsForBetting!);
            setLockPicksAfterTheyAreMade(settings?.lockPicksAfterTheyAreMade!);
            setLockSpreadsDuringWeek(settings?.lockSpreadsDuringWeek!);
            setLeagueType(SiteUtilities.getLeagueTypeFromNumber(data.league?.type!));
        }

        fetchData();
    }, []);

    const columnList: GridColDef<(UserInfo[])[number]>[] = [
        {
            field: 'user',
            headerName: 'User',
            width: userColumnWidth,
            minWidth: userColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return renderUserCell(params);
            },
            disableColumnMenu: true,
            sortable: true,
            pinnable: true,
        },
        {
            field: 'admin',
            headerName: "Make Admin",
            width: userColumnWidth,
            minWidth: userColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return renderAdminCell(params);
            },
            disableColumnMenu: true,
            sortable: true,
            pinnable: true,
        },
        {
            field: 'kick',
            headerName: "Kick User",
            width: userColumnWidth,
            minWidth: userColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return renderKickCell(params);
            },
            disableColumnMenu: true,
            sortable: true,
            pinnable: true,
        },
    ];

    return (
        <Box maxWidth={600} mx="auto" mt={4} sx={{
            '& .MuiTextField-root': { m: 1 },
            '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                background: 'var(--template-palette-background-default)',
                padding: '0 4px',
                zIndex: 1,
            },
        }}>
            <Typography variant="h4" gutterBottom>Edit League</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={4}>
                        <TextField
                            label="League Name"
                            value={leagueName}
                            onChange={e => setLeagueName(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label="Starting Week Number"
                            type="number"
                            value={startWeek}
                            onChange={e => setStartWeek(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={6}>
                        <TextField
                            label={endingWeekNumberLabel}
                            type="number"
                            value={endWeek}
                            onChange={e => setEndWeek(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: startWeek, max: maxWeeks }}
                            variant="outlined"
                        />
                        <Typography variant="caption" display="block" gutterBottom sx={{ ml: 1 }}>
                        </Typography>
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            label="Total Number of Picks"
                            type="number"
                            value={totalPicks}
                            onChange={e => setTotalPicks(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            label="Total Number of Key Picks"
                            type="number"
                            value={keyPicks}
                            onChange={e => setKeyPicks(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            label="Key Pick Bonus"
                            type="number"
                            value={keyPickBonus}
                            onChange={e => setKeyPickBonus(Number(e.target.value))}
                            fullWidth
                            required
                            inputProps={{ min: 0 }}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormControlLabel
                            label="Is Archived"
                            control={<Checkbox />}
                            checked={isArchived}
                            onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => { setIsArchived(checked); }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormControlLabel
                            label="Is Public"
                            control={<Checkbox />}
                            checked={isPublic}
                            onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => { setIsPublic(checked); }}
                        />
                    </Grid>

                    {
                        leagueType && leagueType.label === 'All Bet Types' &&
                        <>
                            <Grid size={4}>
                                <FormControlLabel
                                    label="Allow Parlays"
                                    control={<Checkbox />}
                                    checked={allowParlays}
                                    onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => { setAllowParlays(checked); }}
                                />
                            </Grid>
                            <Grid size={4}>
                                <FormControlLabel
                                    label="Allow Winnings For Betting"
                                    control={<Checkbox />}
                                    checked={allowWinningsForBetting}
                                    onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => { setAllowWinningsForBetting(checked); }}
                                />
                            </Grid>
                        </>
                    }

                    <Grid size={4}>
                        <FormControlLabel
                            label="Lock picks after they are made"
                            control={<Checkbox />}
                            checked={lockPicksAfterTheyAreMade}
                            onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => { setLockPicksAfterTheyAreMade(checked); }}
                        />
                    </Grid>
                    <Grid size={4}>
                        <FormControlLabel
                            label="Lock spreads during the week"
                            control={<Checkbox />}
                            checked={lockSpreadsDuringWeek}
                            onChange={(event: SyntheticEvent<Element, Event>, checked: boolean) => { setLockSpreadsDuringWeek(checked); }}
                        />
                    </Grid>
                    <Grid size={12}>
                        <DataGrid
                            sx={{
                                border: '1px solid #7e7e7eff', // Darker gray border
                                '& .MuiDataGrid-row': {
                                    borderBottom: '1px solid #7e7e7eff', // Darker row border
                                },
                                '& .MuiDataGrid-iconSeparator': {
                                    color: '#7e7e7eff', // Darker row border
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    borderBottom: '1px solid #7e7e7eff', // Darker row border
                                },
                                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                                    outline: "none !important",
                                },
                                '& .MuiIconButton-root': {
                                    fontSize: '0.8rem',
                                    padding: '2px',
                                    width: '24px',
                                    height: '24px',
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1rem',
                                },
                            }}
                            rows={users}
                            columns={columnList}
                            rowSelection={false}
                            columnHeaderHeight={175}
                            scrollbarSize={10}
                            getRowClassName={isSmallScreen ? () => 'makePickContainerSmall' : () => 'makePickContainer'}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'weekPoints', sort: 'desc' }],
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default EditLeague