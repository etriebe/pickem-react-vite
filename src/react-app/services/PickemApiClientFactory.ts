import  * as All from './PickemApiClient';

const baseURL = import.meta.env.VITE_PICKEM_API_URL;


class PickemApiClientFactory {
  static createClient() {
    return new All.Client(baseURL);
  }
}

export default PickemApiClientFactory;