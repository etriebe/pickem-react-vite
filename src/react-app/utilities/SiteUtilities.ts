import { ReactElement, ReactNode } from 'hono/jsx';
import { LeagueDTO, SeasonDateInformation, Spread, TeamDTO } from '../services/PickemApiClient';
import React from 'react';

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

    static getWeekDescriptionFromWeekNumber(season: SeasonDateInformation, weekNumber: number): string {
        if (weekNumber > season.weekStartTimes?.length! || weekNumber < 1) {
            throw new Error(`Invalid weekNumber requested: ${weekNumber}`);
        }

        if (season.weekStartTimes == null || season.weekStartTimes.length == 0) {
            return `Week ${weekNumber}`;
        }
        else {
            const requestedWeek = season.weekStartTimes[weekNumber - 1];
            return requestedWeek.weekDescription!;
        }
    }

    static getFormattedGameTime(gameStart: Date): string {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        };

        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(gameStart);
        return formattedDate;
    }

    static getFormattedSpreadAmount(currentSpread: Spread): string {
        //string prefix = currentSpread >= 0 ? "+" : "";
        // return $"{prefix}{currentSpread}";
        const prefix = currentSpread.spreadAmount! >= 0 ? "+" : "";
        return `${prefix}${currentSpread.spreadAmount?.toFixed(1)}`
    }

    static getTeamIconPathFromTeam(team: TeamDTO, league: LeagueDTO): string {
        const city = team.city?.replace(" ", "_").toLocaleLowerCase();
        const name = team.name?.replace(" ", "_").toLocaleLowerCase();
        const imagePath = `/public/TeamIcons/${SiteUtilities.getSportFolderNameFromSportNumber(league?.sport!)}/${city}_${name}.svg`;
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
}