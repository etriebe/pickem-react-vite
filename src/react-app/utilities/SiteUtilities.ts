import * as React from 'react';
import { SeasonDateInformation, WeekInformation } from '../services/PickemApiClient';

export class SiteUtilities {
    static getWeekStandingLink(leagueType: number, leagueId: string): string {
        switch (leagueType) {
            // both 1 and 2 are pickem against the spread and pickem straight up and have the same pick pages
            case 1:
            case 2:
                return `/pickem/week/${leagueId}`;
            case 3:
                return `/survivor/week/${leagueId}`;
            case 4:
                return `/allbets/week/${leagueId}`;
            case 5:
                return `/squares/week/${leagueId}`;
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

    static getMakePicksLink(leagueType: number, leagueId: string): string {
        switch (leagueType) {
            // both 1 and 2 are pickem against the spread and pickem straight up and have the same pick pages
            case 1:
            case 2:
                return `/pickem/makepicks/${leagueId}`;
            case 3:
                return `/survivor/makepicks/${leagueId}`;
            case 4:
                return `/allbets/makepicks/${leagueId}`;
            case 5:
                return `/squares/makepicks/${leagueId}`;
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
        if (weekNumber > season.weekStartTimes?.length! || weekNumber <= 1) {
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
}