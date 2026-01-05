import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material'
import { GameDTO } from '../../services/PickemApiClient'
import { SiteUtilities } from '../../utilities/SiteUtilities'
import { Add, } from '@mui/icons-material'
import TeamIcon from '../TeamIcon'

type SquaresGameCardProps = {
    game: GameDTO,
    isSmallScreen: boolean,
}

function SquaresGameCard({ game, isSmallScreen }: SquaresGameCardProps) {
    const homeImagePath = SiteUtilities.getTeamIconPathFromTeam(game.homeTeam!, game.sport!);
    const homeAltText = SiteUtilities.getAltTextFromTeam(game.homeTeam!);
    const awayImagePath = SiteUtilities.getTeamIconPathFromTeam(game.awayTeam!, game.sport!);
    const awayAltText = SiteUtilities.getAltTextFromTeam(game.awayTeam!);

    return (
        <>
            <Card sx={{}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        <div className='squaresGameMatchup'>
                            <div className='squaresTeamIcon centerDivContainerHorizontally'>
                                <Stack>
                                    <div>
                                        {game.awayTeam?.name}
                                    </div>
                                    <div>
                                        <TeamIcon imagePath={awayImagePath} altText={awayAltText} useSmallLogo={false} />
                                    </div>
                                </Stack>
                            </div>
                            @
                            <div className='squaresTeamIcon centerDivContainerHorizontally'>
                                <Stack>
                                    <div>
                                        {game.homeTeam?.name}
                                    </div>
                                    <div>
                                        <TeamIcon imagePath={homeImagePath} altText={homeAltText} useSmallLogo={false} />
                                    </div>
                                </Stack>
                            </div>
                        </div>
                    </Typography>
                    <Typography variant="caption" gutterBottom>
                        Game Time: {SiteUtilities.getFormattedGameTime(game.gameStartTime!, isSmallScreen)}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="large" startIcon={<Add />}>Create Board</Button>
                </CardActions>
            </Card>
        </>
    )
}

export default SquaresGameCard