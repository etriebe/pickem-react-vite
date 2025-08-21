import PickemApiClientFactory from "../services/PickemApiClientFactory";
import { LoginRequest, UserInfo } from "../services/PickemApiClient";
import { ApiResponse } from './ApiUtilities';

export class AuthenticationUtilities {
  static async isAuthenticated(): Promise<boolean> {
    const pickemClient = PickemApiClientFactory.createClient();
    try {
        await pickemClient.isAuthorized();
        return true;
    }
    catch {
      // AuthenticationUtilities.clearLocalStorage();
      return false;
    }
  }

  static async login(email: string, password: string): Promise<ApiResponse> {
    const pickemClient = PickemApiClientFactory.createClient();
    let requestInfo = new LoginRequest();
    requestInfo.email = email;
    requestInfo.password = password;
    const useCookies = true;
    const useSessionCookies = true;
    try
    {
        const responseToken = await pickemClient.login(useCookies, useSessionCookies, requestInfo);
        console.log(JSON.stringify(responseToken));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', email);
        return new ApiResponse(true, "");
    }
    catch (err)
    {
        console.error(`Failed to login: ${err}`);
        AuthenticationUtilities.clearLocalStorage();
        let message: string;
        if (typeof err === "string") {
            // TypeScript should know it's a string here
            message = err;
        } else if (err instanceof Error) {
            // Check that it's an actually Error object, before trying to access the error message
            message = err.message;
        } else {
            throw err;
        }
        return new ApiResponse(false, message);
    }
  }

  static async logout(): Promise<void> {
    const pickemClient = PickemApiClientFactory.createClient();
    
    try
    {
        await pickemClient.logout();
        this.clearLocalStorage();
        window.location.href = '/';
        return;
    }
    catch (err)
    {
        console.error(`Failed to logout: ${err}`);
        AuthenticationUtilities.clearLocalStorage();
        return;
    }
  }

  private static clearLocalStorage(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('email', "");
    localStorage.setItem('username', "");
    localStorage.setItem('userid', "");
  }

  static getUserInfoFromLocalStorage(): UserInfo {
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');
    const userid = localStorage.getItem('userid');
    
    const currentUserInfo = <UserInfo>({
      email: email,
      userName: username,
      id: userid,
    });
    return currentUserInfo;
  }

  static async getUserInfo(): Promise<UserInfo> {
    const pickemClient = PickemApiClientFactory.createClient();
    const userInfo = await pickemClient.getUserInfo();
    if (userInfo.userName)
    {
      localStorage.setItem('username', userInfo.userName);
    }
    if (userInfo.id)
    {
      localStorage.setItem('userid', userInfo.id);
    }
    return userInfo;
  }
}
