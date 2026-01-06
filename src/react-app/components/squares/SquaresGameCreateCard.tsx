import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material'
import { GameDTO } from '../../services/PickemApiClient'
import { SiteUtilities } from '../../utilities/SiteUtilities'
import { Add, } from '@mui/icons-material'
import TeamIcon from '../TeamIcon'
import PickemApiClientFactory from '../../services/PickemApiClientFactory'

type SquaresGameCreateCardProps = {
    leagueId: string,
    game: GameDTO,
    isSmallScreen: boolean,
}

function SquaresGameCreateCard({ leagueId, game, isSmallScreen }: SquaresGameCreateCardProps) {
    const homeImagePath = SiteUtilities.getTeamIconPathFromTeam(game.homeTeam!, game.sport!);
    const homeAltText = SiteUtilities.getAltTextFromTeam(game.homeTeam!);
    const awayImagePath = SiteUtilities.getTeamIconPathFromTeam(game.awayTeam!, game.sport!);
    const awayAltText = SiteUtilities.getAltTextFromTeam(game.awayTeam!);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const pickemClient = PickemApiClientFactory.createClient();
        const createResponse = await pickemClient.createSquaresBoard(leagueId, game.id);
        const boardId = createResponse.boardId;
        const newBoardLink = SiteUtilities.getSquaresBoardLink(leagueId, boardId);
        window.location.href = `${window.location.origin}${newBoardLink}`;
    };
    
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
                    <Button size="large" startIcon={<Add />} onClick={handleSubmit}>Create Board</Button>
                </CardActions>
            </Card>
        </>
    )
}

export default SquaresGameCreateCard