import * as React from 'react';
import PickemApiClientFactory from "../services/PickemApiClientFactory";
import { LoginRequest } from "../services/PickemApiClient";

export class AuthenticationUtilities {
  static async isAuthenticated(): Promise<boolean> {
    const pickemClient = PickemApiClientFactory.createClient();
    try {
        await pickemClient.isAuthorized();
        return true;
    }
    catch {
      return false;
    }
  }

  static clearAuthenticationStorage(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('email', '');
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
        const requestObject = await pickemClient.login(useCookies, useSessionCookies, requestInfo);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('email', email);
        return new ApiResponse(true, "");
    }
    catch (err)
    {
        console.error(`Failed to login: ${err}`);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('email', "");
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
}

export class ApiResponse {
    result: boolean;
    message?: string;
    
    constructor(result: boolean, message?: string) {
        this.result = result;
        this.message = message;
    }
}