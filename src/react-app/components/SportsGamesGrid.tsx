import React from 'react'
import { GameDTO } from '../services/PickemApiClient';
import { Card, Grid, Stack, Typography, ListItem } from '@mui/material';
import TeamIcon from './TeamIcon';
import { SiteUtilities, Sports } from '../utilities/SiteUtilities';

export interface SportsGamesGridProps {
    games: GameDTO[];
    sport: string;
    sportNumber: number;
}

function SportsGamesGrid({ games, sport, sportNumber }: SportsGamesGridProps) {
    return (
        <>
            <Card>
                <Typography variant='h6'>{sport}</Typography>
                <Grid
                    container
                    spacing={2}
                    padding={2}
                    sx={{
                        mb: (theme) => theme.spacing(2),
                        width: '100%',
                    }}
                >
                    {
                        games.map((g) => {
                            const homeImagePath = SiteUtilities.getTeamIconPathFromTeam(g.homeTeam!, sportNumber);
                            const homeAltText = SiteUtilities.getAltTextFromTeam(g.homeTeam!);
                            const awayImagePath = SiteUtilities.getTeamIconPathFromTeam(g.awayTeam!, sportNumber);
                            const awayAltText = SiteUtilities.getAltTextFromTeam(g.awayTeam!);

                            return <React.Fragment key={g.id}>
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                    <Card>
                                        <div className='gameCard'>
                                            <Stack direction="row">
                                                <div className='teamInformation'>
                                                    <div className='awayTeam'>
                                                        <Stack direction='row'>
                                                            <TeamIcon imagePath={awayImagePath} altText={awayAltText} useSmallLogo={true} />
                                                            <div className='teamAbbreviation'>
                                                                {g.awayTeam?.abbreviation}
                                                            </div>
                                                        </Stack>

                                                    </div>
                                                    <div className='homeTeam'>
                                                        <Stack direction='row'>
                                                            <TeamIcon imagePath={homeImagePath} altText={homeAltText} useSmallLogo={true} />
                                                            <div className='teamAbbreviation'>
                                                                {g.homeTeam?.abbreviation}
                                                            </div>
                                                        </Stack>
                                                    </div>
                                                </div>
                                                <div className='scoreInformation'>
                                                    {SiteUtilities.isGameScheduled(g) ?
                                                        <div className='gameSchedule'>
                                                            <Stack direction='row'>
                                                                <div className='gameSpread'>
                                                                    {SiteUtilities.getFormattedSpreadAmount(g.currentSpread!)}
                                                                </div>
                                                                <div className='gameStartTime'>
                                                                    <Stack>
                                                                        <div className='gameDate'>
                                                                            {SiteUtilities.getFormattedGameDate(g.gameStartTime!, true)}
                                                                        </div>
                                                                        <div className='gameTime'>
                                                                            {SiteUtilities.getFormattedGameTimeOnly(g.gameStartTime!)}
                                                                        </div>
                                                                    </Stack>
                                                                </div>
                                                            </Stack>
                                                        </div>
                                                        :
                                                        <div className='scoreDiv'>
                                                            <Stack direction='row'>
                                                                <div className='gameScore'>
                                                                    <div className='awayScore'>
                                                                        {g.result?.awayScore}
                                                                    </div>
                                                                    <div className='homeScore'>
                                                                        {g.result?.homeScore}
                                                                    </div>
                                                                </div>
                                                                {
                                                                    SiteUtilities.isGameInProgress(g) ?
                                                                        <div className='gameStatus'>
                                                                            <div className='gamePeriod'>
                                                                                {SiteUtilities.getGamePeriod(g)}
                                                                            </div>
                                                                            <div className='gameTimeLeft'>
                                                                                {SiteUtilities.getGameTimeLeft(g)}
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div className='gameStatus'>
                                                                            {SiteUtilities.getGameHeaderStatusDescription(g)}
                                                                        </div>
                                                                }
                                                            </Stack>
                                                        </div>
                                                    }
                                                </div>
                                            </Stack>
                                        </div>
                                    </Card>
                                </Grid>
                            </React.Fragment>
                        })
                    }
                </Grid>
            </Card>
        </>
    )
}

export default SportsGamesGrid