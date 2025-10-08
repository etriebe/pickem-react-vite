import { GameDTO, LeagueDTO, SeasonDateInformation, Spread, TeamDTO, UserInfo } from '../services/PickemApiClient';

export class SiteUtilities {
    static getWeekStandingLink(leagueType: number, leagueId: string, weekNumber: number): string {
        switch (leagueType) {
            // both 1 and 2 are pickem against the spread and pickem straight up and have the same pick pages
            case 1:
            case 2:
                return `/pickem/week/${leagueId}/${weekNumber}`;
            case 3:
                return `/survivor/week/${leagueId}/${weekNumber}`;
            case 4:
                return `/allbets/week/${leagueId}/${weekNumber}`;
            case 5:
                return `/squares/week/${leagueId}/${weekNumber}`;
            default:
                throw new Error("Unknown league type");
        }
    }

    static getLeagueStandingLink(leagueType: number, leagueId: string): string {
        switch (leagueType) {
            // both 1 and 2 are pickem against the spread and pickem straight up and have the same pick pages
            case 1:
            case 2:
                return `/pickem/standings/${leagueId}`;
            case 3:
                return `/survivor/standings/${leagueId}`;
            case 4:
                return `/allbets/standings/${leagueId}`;
            case 5:
                return `/squares/standings/${leagueId}`;
            default:
                throw new Error("Unknown league type");
        }
    }

    static getNavigationLinkForPageType(pageType: PageType, leagueType: number, leagueId: string, weekNumber: number): string {
        switch (pageType) {
            case PageType.MakePicksPage:
                return SiteUtilities.getMakePicksLink(leagueType, leagueId, weekNumber);
            case PageType.WeekStandingsPage:
                return SiteUtilities.getWeekStandingLink(leagueType, leagueId, weekNumber);
            default:
                return SiteUtilities.getLeagueStandingLink(leagueType, leagueId);
        }
    }

    static getMakePicksLink(leagueType: number, leagueId: string, weekNumber: number): string {
        switch (leagueType) {
            // both 1 and 2 are pickem against the spread and pickem straight up and have the same pick pages
            case 1:
            case 2:
                return `/pickem/makepicks/${leagueId}/${weekNumber}`;
            case 3:
                return `/survivor/makepicks/${leagueId}/${weekNumber}`;
            case 4:
                return `/allbets/makepicks/${leagueId}/${weekNumber}`;
            case 5:
                return `/squares/makepicks/${leagueId}/${weekNumber}`;
            default:
                throw new Error("Unknown league type");
        }
    }

    static getEmojiForPickStatus(picksSubmitted: boolean): string {
        if (picksSubmitted) {
            return "✅ - Submitted";
        }
        else {
            return "❌ - Not Submitted";
        }
    }

    static getWeekDescriptionFromWeekNumber(season: SeasonDateInformation, weekNumber: number, longDescription: boolean): string {
        if (season == null) {
            return "";
        }
        if (weekNumber > season.weekStartTimes?.length! || weekNumber < 1) {
            throw new Error(`Invalid weekNumber requested: ${weekNumber}`);
        }

        if (season.weekStartTimes == null || season.weekStartTimes.length == 0) {
            return `Week ${weekNumber}`;
        }
        else {
            const requestedWeek = season.weekStartTimes[weekNumber - 1];
            if (longDescription && requestedWeek.weekStartTime && requestedWeek.weekEndTime) {
                return `${requestedWeek.weekDescription!}: ${(new Date(requestedWeek.weekStartTime).toLocaleDateString())} - ${(new Date(requestedWeek.weekEndTime).toLocaleDateString())}`;
            }
            else {
                return requestedWeek.weekDescription!;
            }
        }
    }

    static getFormattedGameTime(gameStart: Date, isSmallScreen: boolean): string {
        let options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };

        if (isSmallScreen) {
            options = {
                month: "numeric",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
        }

        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(gameStart);
        return formattedDate;
    }

    static getWeekStandingsHeaderGameTimeInProgress(game: GameDTO): string {
        let periodSuffix = SiteUtilities.getNumberWithOrdinalSuffix(game.result?.currentPeriod!);
        if (game.sport === 3) { // MLB
            
            return `${game.result?.currentPeriod!}${periodSuffix}`;
        }
        return `${game.result?.currentPeriod!}${periodSuffix} - ${game.result?.periodTimeRemaining!}`
    }

    static getWeekStandingsHeaderGameTime(gameStart: Date): string {
        let options: Intl.DateTimeFormatOptions = {
            month: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };

        if (gameStart === null || gameStart === undefined) {
            return "";
        }
        try {
            const gameStartDate = new Date(gameStart);
            const formattedDate = new Intl.DateTimeFormat("en-US", options).format(gameStartDate);
            return formattedDate;
        }
        catch (e) {
            return "";
        }
    }

    static getNumberWithOrdinalSuffix(n: number): string {
        let suffix = "th";
        if (n === 1) {
            suffix = "st";
        }
        else if (n === 2) {
            suffix = "nd";
        }
        else if (n === 3) {
            suffix = "rd";
        }
        return suffix;
    }

    static getFormattedSpreadAmount(currentSpread: Spread): string {
        //string prefix = currentSpread >= 0 ? "+" : "";
        // return $"{prefix}{currentSpread}";
        const prefix = currentSpread.spreadAmount! >= 0 ? "+" : "";
        return `${prefix}${currentSpread.spreadAmount?.toFixed(1)}`
    }

    static getTeamIconPathFromTeam(team: TeamDTO, league: LeagueDTO): string {
        const city = team.city?.replace(" ", "_").replace(".", "");
        const name = team.name?.replace(" ", "_").replace(".", "");
        const imagePath = `/TeamIcons/${SiteUtilities.getSportFolderNameFromSportNumber(league?.sport!)}/${city}_${name}.svg`;
        return imagePath;
    }

    static getAltTextFromTeam(team: TeamDTO): string {
        const city = team.city!;
        const name = team.name!;
        return `${city} ${name} team logo`;
    }

    static getSportFolderNameFromSportNumber(sportNumber: number): string {
        switch (sportNumber) {
            // both 1 and 2 are pickem against the spread and pickem straight up and have the same pick pages
            case 1:
                return `NFL`;
            case 2:
                return `NHL`;
            case 3:
                return `MLB`;
            case 4:
                return `NBA`;
            case 5:
            case 6:
                return `NCAA`;
            default:
                throw new Error("Unknown league type");
        }
    }

    static getGameHeaderStatusDescription(game: GameDTO): string {
        switch (game.result?.status) {
            case 0: // scheduled
                return SiteUtilities.getWeekStandingsHeaderGameTime(game.gameStartTime!);
            case 1: // in progress
                return SiteUtilities.getWeekStandingsHeaderGameTimeInProgress(game);
            case 2: // final
                return "FINAL";
            case 3: // canceled
                return "CANCELED";
            case 4: // delayed
                return "DELAYED";
            case 5: // suspended
                return "SUSPENDED";
            default:
                break;
        }
        return "ERROR";
    }

    static getPageTypeFromUrl(url: string): PageType {
        if (url.includes("/makepicks/")) {
            return PageType.MakePicksPage;
        }
        else if (url.includes("/week/")) {
            return PageType.WeekStandingsPage;
        }
        else if (url.includes("/standings/")) {
            return PageType.LeagueStandingsPage;
        }
        else {
            return PageType.OtherPage;
        }
    }

    static getLeagueIdFromUrl(url: string): string | undefined {
        const urlParts = url.split("/");
        const leagueIdIndex = urlParts.findIndex(part => part === "makepicks" || part === "week" || part === "standings") + 1;
        if (leagueIdIndex > 0 && leagueIdIndex < urlParts.length) {
            return urlParts[leagueIdIndex];
        }
        else {
            return undefined;
        }
    }

    static getLeagueTypeFromUrl(url: string): LeagueType | undefined {
        const urlParts = url.split("/");
        const leagueType = LeagueTypes.find(lt => urlParts[1] == lt.urlPart);
        if (leagueType) {
            return leagueType;
        }
        else {
            return undefined;
        }
    }

    static getWeekNumberFromUrl(url: string): number | undefined {
        const urlParts = url.split("/");
        const weekNumberIndex = urlParts.findIndex(part => part === "makepicks" || part === "week") + 2;
        if (weekNumberIndex > 1 && weekNumberIndex < urlParts.length) {
            return Number(urlParts[weekNumberIndex]);
        }
        else {
            return undefined;
        }
    }

    static getShortenedUserNameFromId(userMapping: UserInfo[], userId: string | undefined, email: string | undefined) {
        let userName = userMapping?.find(u => u.id === userId)?.userName ?? "Unknown User";
        if (userName === email) {
            userName = userName?.split('@')[0];
        }
        return userName;
    }
}

export const Sports: SportType[] = [
    { value: 1, label: 'NFL' },
    { value: 2, label: 'NHL' },
    { value: 3, label: 'MLB' },
    { value: 4, label: 'NBA' },
    { value: 5, label: 'NCAAF' },
    { value: 6, label: 'NCAAB' },
];

export const LeagueTypes: LeagueType[] = [
    { value: 1, label: 'Pickem Against the Spread', urlPart: 'pickem' },
    { value: 2, label: 'Pickem Straight up', urlPart: 'pickem' },
    { value: 3, label: 'Survivor Pool', urlPart: 'survivor' },
    { value: 4, label: 'All Bet Types', urlPart: 'allbets' },
    { value: 5, label: 'Squares', urlPart: 'squares' },
];

export interface LeagueType {
    value: number;
    label: string;
    urlPart: string;
}

export interface SportType {
    value: number;
    label: string;
}

export enum PageType {
    MakePicksPage = "MakePicksPage",
    WeekStandingsPage = "WeekStandingsPage",
    LeagueStandingsPage = "LeagueStandingsPage",
    OtherPage = "OtherPage"
}