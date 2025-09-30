import PickemApiClientFactory from "../services/PickemApiClientFactory";
import { League } from "../services/PickemApiClient";

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
}