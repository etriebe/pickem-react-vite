import PickemApiClientFactory from "../services/PickemApiClientFactory";
import { League, SeasonDateInformation2 } from "../services/PickemApiClient";
import { Sports } from "./SiteUtilities";

export class LeagueUtilities {
  static async getLeaguesForCurrentUser(showArchivedLeagues: boolean): Promise<League[]> {
    const pickemClient = PickemApiClientFactory.createClient();
    return pickemClient.getLeaguesForCurrentUser(showArchivedLeagues);
  }

  static isOffSeason(league: League): boolean {
    const numberOfDaysBuffer = 14;
    const startOfWeekOne = new Date(league.seasonInformation!.startOfWeekOne!);
    const endOfSeason = new Date(league.seasonInformation!.endOfSeason!);
    const currentDate = new Date();
    startOfWeekOne.setDate(startOfWeekOne.getDate() - numberOfDaysBuffer);
    endOfSeason.setDate(endOfSeason.getDate() - numberOfDaysBuffer);
    if (currentDate < startOfWeekOne || currentDate > endOfSeason) {
      return true;
    }
    else {
      return false;
    }
  }

  static getEndingWeekLabel(max: number): React.SetStateAction<string> {
      return `Ending Week Number (Max:${max})`;
  }

  static getSportNameFromNumber(sportNumber: number): string {
      return Sports.find(s => s.value === sportNumber)?.label!;
  }

  static getCurrentMaxWeeksForSport(sportSeasonInformation: { [key: string]: SeasonDateInformation2; } | undefined, sportName: string) {
      return sportSeasonInformation ? sportSeasonInformation[sportName].weekStartTimes?.length! : -1;
  }

  static getCurrentMaxWeeksForSeason(seasonInformation: SeasonDateInformation2 | undefined) {
      return seasonInformation ? seasonInformation.weekStartTimes?.length! : -1;
  }
}