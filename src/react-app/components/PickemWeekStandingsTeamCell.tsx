import { GameDTO, LeagueDTO } from "../services/PickemApiClient";
import { SiteUtilities } from "../utilities/SiteUtilities";
import TeamIcon from "./TeamIcon";

export interface PickemWeekStandingsHeaderTeamCellProps {
    game: GameDTO;
    currentLeague: LeagueDTO;
    isSmallScreen: boolean;
}

export default function PickemWeekStandingsHeaderTeamCell({ game, currentLeague }: PickemWeekStandingsHeaderTeamCellProps) {
    let gameHeaderClass = "GameHeader ";

    const awayImagePath = SiteUtilities.getTeamIconPathFromTeam(game.awayTeam!, currentLeague!);
    const awayAltText = SiteUtilities.getAltTextFromTeam(game.awayTeam!);
    const homeImagePath = SiteUtilities.getTeamIconPathFromTeam(game.homeTeam!, currentLeague!);
    const homeAltText = SiteUtilities.getAltTextFromTeam(game.homeTeam!);
    const gameSpread = currentLeague.settings?.lockSpreadsDuringWeek ? game.spreadAtLockTime : game.currentSpread;

    switch (game.result?.status) {
        case 0: // scheduled
            gameHeaderClass += "GameScheduled";
            break;
        case 1: // in progress
            gameHeaderClass += "GameInProgress";
            break;
        case 2: // final
            gameHeaderClass += "GameFinal";
            break;
        case 3: // canceled
            gameHeaderClass += "GameCanceled";
            break;
        case 4: // delayed
            gameHeaderClass += "GameDelayed";
            break;
        case 5: // suspended
            gameHeaderClass += "GameSuspended";
            break;
        default:
            break;
    }

    return <>
        <div className={gameHeaderClass}>
            <div className="AwayTeam">
                {game.awayTeam?.abbreviation}
                <div className="AwayScore">
                    {game.result?.awayScore}
                </div>
                <div className="TeamIconHeaderDiv">
                    <TeamIcon imagePath={awayImagePath} altText={awayAltText} useSmallLogo={false} />
                </div>
            </div>
            <div className="HomeTeam">
                {game.homeTeam?.abbreviation}
                <div className="HomeScore">
                    {game.result?.homeScore}
                </div>
                <div className="TeamIconHeaderDiv">
                    <TeamIcon imagePath={homeImagePath} altText={homeAltText} useSmallLogo={false} />
                </div>
            </div>
            <div className="Spread">
                {SiteUtilities.getFormattedSpreadAmount(gameSpread!)}
            </div>
            <div className="GameStatus">
                {SiteUtilities.getGameHeaderStatusDescription(game)}
            </div>
        </div>
    </>;
}
