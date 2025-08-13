import PickemApiClientFactory from "../services/PickemApiClientFactory";
import { League } from "../services/PickemApiClient";

export class LeagueUtilities {
  static async getLeaguesForCurrentUser(showArchivedLeagues: boolean): Promise<League[]> {
    const pickemClient = PickemApiClientFactory.createClient();
    return pickemClient.getLeaguesForCurrentUser(showArchivedLeagues);
  }
}