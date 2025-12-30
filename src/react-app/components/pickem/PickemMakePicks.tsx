import * as React from 'react';
import { useState } from "react";
import { useParams } from 'react-router';
import { SpreadWeekPickDTO, GameDTO, SpreadGamePickDTO, TeamDTO, ApiException } from '../../services/PickemApiClient';
import PickemApiClientFactory from "../../services/PickemApiClientFactory";
import { DataGrid, GridColDef, GridEventListener, GridRenderCellParams, GridTreeNodeWithRender, useGridApiRef } from '@mui/x-data-grid';
import { PageType, SiteUtilities } from '../../utilities/SiteUtilities';
import { Typography, Snackbar, SnackbarCloseReason, Button } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import MakePicksTeamCell from '../MakePicksTeamCell';
import LeagueNavigationBreadcrumbs from '../LeagueNavigationBreadcrumbs';
import Loading from '../Loading';
import { useQuery } from '@tanstack/react-query';
import Header from '../Header';


enum MakePicksColumnType {
    AwayTeam = 1,
    HomeTeam = 2,
    KeyPick = 3,
    GameStartTime = 4,
}

export default function PickemMakePicks() {
    const [selectedPicksCount, setSelectedPicksCount] = useState(-1);
    const [selectedKeyPicksCount, setSelectedKeyPicksCount] = useState(-1);
    const { leagueId, weekNumber } = useParams();
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const weekNumberConverted = parseInt(weekNumber!);
    const apiRef = useGridApiRef();
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down("md"));
    const awayTeamColumnWidth = isSmallScreen ? 85 : 200;
    const homeTeamColumnWidth = isSmallScreen ? 110 : 220;
    const gameStartColumnWidth = isSmallScreen ? 110 : 200;
    const keyPickColumnWidth = isSmallScreen ? 75 : 125;

    const makePicksQuery = useQuery({
        queryKey: ['makepicks', leagueId, weekNumberConverted],
        queryFn: async () => {
            const pickemClient = PickemApiClientFactory.createClient();
            return pickemClient.getMakePicks(leagueId!, weekNumberConverted);
        },
    });

    const longDescription = true;
    const weekDescription = `${SiteUtilities.getWeekDescriptionFromWeekNumber(makePicksQuery.data?.league!.seasonInformation!, weekNumberConverted, longDescription)} Picks`;
    let currentPicks = makePicksQuery.data?.picks!;
    let selectedPicksOriginal = currentPicks?.gamePicks?.length ?? 0;
    let selectedKeyPicksOriginal = currentPicks?.gamePicks?.filter(p => p.isKeyPicked).length ?? 0;
    const weekInformation = makePicksQuery.data?.league?.seasonInformation?.weekStartTimes?.find(w => w.weekNumber == weekNumber);

    const formatCell = (params: GridRenderCellParams<GameDTO, any, any, GridTreeNodeWithRender>, cellType: MakePicksColumnType): React.ReactNode => {
        const teamChosen = (params.value as TeamDTO);
        if (cellType === MakePicksColumnType.AwayTeam ||
            cellType === MakePicksColumnType.HomeTeam) {
            let cellText = isSmallScreen ? `${teamChosen.abbreviation}` : `${teamChosen.name}`;

            const gameSpread = makePicksQuery.data?.league?.settings?.lockSpreadsDuringWeek ? params.row.spreadAtLockTime : params.row.currentSpread;
            console.log(`Game spread: ${JSON.stringify(gameSpread)}`);
            if (cellType === MakePicksColumnType.HomeTeam) {
                cellText += ` (${SiteUtilities.getFormattedSpreadAmount(gameSpread!)})`
            }

            if (currentPicks && currentPicks.gamePicks) {
                const selectedGameId = params.row.id;
                const gamePick = currentPicks.gamePicks.find(g => g.gameID === selectedGameId);
                if (gamePick) {
                    const isTeamSelected = (gamePick.sidePicked === 0 && cellType === MakePicksColumnType.HomeTeam) ||
                        (gamePick.sidePicked === 1 && cellType === MakePicksColumnType.AwayTeam);

                    if (isTeamSelected) {
                        cellText += ` ☑️`;
                    }
                }
            }
            const imagePath = SiteUtilities.getTeamIconPathFromTeam(teamChosen, makePicksQuery.data?.league!);
            const altText = SiteUtilities.getAltTextFromTeam(teamChosen);
            return (
                <>
                    <MakePicksTeamCell imagePath={imagePath} altText={altText} isSmallScreen={isSmallScreen} cellText={cellText} />
                </>);
        }
        else if (cellType === MakePicksColumnType.GameStartTime) {
            const gameStartTime = params.value;
            let lockSymbol = "";
            if (gameStartTime <= new Date()) {
                lockSymbol = "🔒";
            }
            return <>{lockSymbol}{SiteUtilities.getFormattedGameTime(params.value, isSmallScreen)}</>;
        }
        else if (cellType === MakePicksColumnType.KeyPick) {
            if (currentPicks && currentPicks.gamePicks) {
                const selectedGameId = params.row.id;
                const gamePick = currentPicks.gamePicks.find(g => g.gameID === selectedGameId);
                if (gamePick?.isKeyPicked) {
                    return <>🔑</>
                }
            }
            return <></>;
        }
        else {
            return <></>;
        }
    }

    const columns: GridColDef<(GameDTO[])[number]>[] = [
        {
            field: 'awayTeam',
            headerName: 'Away',
            width: awayTeamColumnWidth,
            minWidth: awayTeamColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return formatCell(params, MakePicksColumnType.AwayTeam);
            },
            disableColumnMenu: true,
        },
        {
            field: 'homeTeam',
            headerName: 'Home',
            width: homeTeamColumnWidth,
            minWidth: homeTeamColumnWidth,
            cellClassName: "centerDivContainer",
            renderCell: (params) => {
                return formatCell(params, MakePicksColumnType.HomeTeam);
            },
            disableColumnMenu: true,
        },
        {
            field: 'gameStartTime',
            headerName: 'Game Time',
            minWidth: gameStartColumnWidth,
            flex: 1,
            renderCell: (params) => {
                return formatCell(params, MakePicksColumnType.GameStartTime);
            },
            disableColumnMenu: true,
        },
        {
            field: 'keyPick',
            headerName: 'Key',
            minWidth: keyPickColumnWidth,
            flex: 0.75,
            renderCell: (params) => {
                return formatCell(params, MakePicksColumnType.KeyPick);
            },
            disableColumnMenu: true,
        },
    ];

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleCellClick: GridEventListener<"cellClick"> = (params) => {
        let picksAllowed = makePicksQuery.data?.league?.settings?.totalPicks!;
        let keyPicksAllowed = makePicksQuery.data?.league?.settings?.keyPicks!;
        if (weekInformation && weekInformation.allowAllPicks) {
            picksAllowed = -1;
            keyPicksAllowed = 0;
        }
        console.log("Cell clicked:", params);
        if (!currentPicks) {
            throw new Error("currentPicks should not be able to be null here.");
        }
        if (!currentPicks.gamePicks) {
            throw new Error("currentPicks.gamePicks should not be able to be null here.");
        }
        let currentGame = makePicksQuery.data?.games!.find(g => g.id === params.row.id);
        if (!currentGame) {
            throw new Error("Couldn't find the correct game");
        }

        if (currentGame.gameStartTime && currentGame.gameStartTime <= new Date()) {
            setSnackbarMessage("You cannot change your pick for a game that has already started.");
            setOpen(true);
            return;
        }

        let currentPick = currentPicks.gamePicks.find(g => g.gameID === params.row.id);

        if (params.field === "keyPick") {
            if (currentPick === undefined) {
                setSnackbarMessage("You cannot select a key pick unless you have selected the game first.")
                setOpen(true);
                return;
            }

            if (currentPick.isKeyPicked) {
                currentPick.isKeyPicked = false;
            }
            else {
                let currentKeyPickCount = currentPicks.gamePicks.filter(g => g.isKeyPicked).length;
                if (currentKeyPickCount >= keyPicksAllowed) {
                    setSnackbarMessage("You have selected too many picks. Please unselect one before selecting again.")
                    setOpen(true);
                    return;
                }
                currentPick.isKeyPicked = !currentPick.isKeyPicked;
            }
            setSelectedKeyPicksCount(getSelectedKeyPicksCount(currentPicks));
            return;
        }

        if (!currentPick) {
            // Picking a brand new game
            if (picksAllowed != -1 && currentPicks.gamePicks.length >= picksAllowed) {
                setSnackbarMessage("You have selected too many picks. Please unselect one before selecting again.")
                setOpen(true);
                return;
            }
            currentPick = createPickObject(currentGame, params.value as TeamDTO);
            currentPicks.gamePicks.push(currentPick);
        }
        else {
            console.log(`Side picked: ${currentPick.sidePicked}`);

            // If they picked home or away and are clicking this again, we should remove
            if ((currentPick.sidePicked === 0 && currentGame?.homeTeam === params.value) ||
                (currentPick.sidePicked === 1 && currentGame?.awayTeam === params.value)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                currentPicks.gamePicks.splice(indexOfPick, 1);
            }
            // If they are picking the opposite side now. TODO: THIS CASE ISN'T WORKING
            else if ((currentPick.sidePicked === 0 && currentGame?.awayTeam === params.value) ||
                (currentPick.sidePicked === 1 && currentGame?.homeTeam === params.value)) {
                const indexOfPick = currentPicks.gamePicks.indexOf(currentPick);
                currentPicks.gamePicks.splice(indexOfPick, 1);
                currentPick = createPickObject(currentGame, params.value as TeamDTO);
                currentPicks.gamePicks.push(currentPick);
            }
        }

        setSelectedPicksCount(getSelectedPicksCount(currentPicks));
        setSelectedKeyPicksCount(getSelectedKeyPicksCount(currentPicks));
        apiRef.current?.selectRow(params.id);
        apiRef.current?.autosizeColumns();
    };

    const handleSubmitPicks = async () => {
        if (!currentPicks) {
            throw new Error("currentPicks should not be able to be null here.");
        }

        const pickemClient = PickemApiClientFactory.createClient();
        try {
            await pickemClient.upsertSpreadWeekPick(currentPicks);
            setSnackbarMessage("Your picks have been submitted successfully!");
            setOpen(true);
        }
        catch (error: ApiException | any) {
            setSnackbarMessage(`There was an error submitting your picks. ${error.response}`);
            setOpen(true);
        }
    }

    React.useEffect(() => {
        const handleResizeWindow = () => {
            // setWidth(window.innerWidth);
            apiRef.current?.autosizeColumns();
        };
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);
    const gridHeight = "100vh";
    const rowHeight = isSmallScreen ? 30 : 52;
    const typoGraphyLeagueTitle = isSmallScreen ? 'h5' : 'h4';
    const typoGraphyLeaguePicks = isSmallScreen ? 'body1' : 'h6';

    return (
        <>
            <div style={{ height: '100%', width: '100%' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: gridHeight
                    }}>
                    <Header leagueId={leagueId} weekNumber={weekNumberConverted} isSmallScreen={isSmallScreen} />
                    <div className='centerDivContainerHorizontally'>
                        <Typography variant={typoGraphyLeagueTitle}>{makePicksQuery.data?.league?.leagueName}</Typography>
                    </div>
                    <div className='centerDivContainerHorizontally'>
                        <LeagueNavigationBreadcrumbs
                            league={makePicksQuery.data?.league!}
                            currentWeekNumber={weekNumberConverted}
                            navigationTitle={weekDescription}
                            pageType={PageType.MakePicksPage}
                            isSmallScreen={isSmallScreen}
                        />
                    </div>
                    <Snackbar
                        open={open}
                        autoHideDuration={5000}
                        onClose={handleClose}
                        message={snackbarMessage}
                    />
                    <Typography variant={typoGraphyLeaguePicks}>{selectedPicksCount == -1 ? selectedPicksOriginal : selectedPicksCount} / {weekInformation?.allowAllPicks ? "All" : makePicksQuery.data?.league?.settings?.totalPicks} Picks, {selectedKeyPicksCount == -1 ? selectedKeyPicksOriginal : selectedKeyPicksCount} / {makePicksQuery.data?.league?.settings?.keyPicks} Key Picks</Typography>
                    {makePicksQuery.isPending ?
                        <Loading /> :
                        <>
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
                                }}
                                rows={makePicksQuery.data?.games!}
                                columns={columns}
                                onCellClick={handleCellClick}
                                apiRef={apiRef}
                                rowSelection={false}
                                rowHeight={rowHeight}
                                getRowClassName={() => getRowClassName(isSmallScreen)}
                            />
                            <div className='makePicksButtonsDiv'>
                                <Button className='submitPicksButton' variant='contained' color='primary' onClick={handleSubmitPicks}>Submit Picks</Button>
                                <Button className='cancelPicksButton' variant='outlined' href='/'>Cancel</Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );

    function createPickObject(currentGame: GameDTO, chosenTeam: TeamDTO) {
        const currentPick = new SpreadGamePickDTO();
        currentPick.gameID = currentGame?.id;
        currentPick.gameStartTime = currentGame?.gameStartTime;
        currentPick.sidePicked = currentGame?.homeTeam === chosenTeam ? 0 : 1;
        currentPick.isKeyPicked = false;
        currentPick.spreadWhenPicked = currentGame?.currentSpread!;
        currentPick.isEdited = false;
        currentPick.isLocked = false;
        currentPick.timeOfPick = new Date();
        currentPick.pickType = makePicksQuery.data?.league?.type;
        return currentPick;
    }
}

function getSelectedPicksCount(picks: SpreadWeekPickDTO): React.SetStateAction<number> {
    return picks.gamePicks!.length;
}

function getSelectedKeyPicksCount(currentPicks: SpreadWeekPickDTO): React.SetStateAction<number> {
    if (!currentPicks || !currentPicks.gamePicks) {
        return 0;
    }
    return currentPicks.gamePicks.filter(p => p.isKeyPicked).length;
}

function getRowClassName(isSmallScreen: boolean): string {
    let cssClasses = [];
    cssClasses.push(isSmallScreen ? 'makePickContainerSmall' : 'makePickContainer');
    return cssClasses.join(' ');
}