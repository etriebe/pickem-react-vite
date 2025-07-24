const baseURL = import.meta.env.VITE_PICKEM_API_URL;

class AuthenticationService {
  
  static async login(email: string, password: string): Promise<Response> {
    const requestURL = `${baseURL}/login?useCookies=true&useSessionCookies=true`;
    try{
      const authResult = await fetch(
        requestURL,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: email,
            password: password,
            twoFactorCode: null,
            twoFactorRecoveryCode: null,
          }),
        },
      );
      return authResult;
    }
    catch (error) {
      console.error('Error during login:', error);
      return new Response(null, { status: 500, statusText: 'Internal Server Error' });
    }
  }

  static async logout(): Promise<Response> {
    const requestURL = `${baseURL}/Account/logout`;
    const authResult = await fetch(
      requestURL,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    return authResult;
  }

  // Add more static methods as needed, e.g.:
  // static logout(): Promise<AxiosResponse<any>> { ... }
  // static register(email: string, password: string): Promise<AxiosResponse<any>> { ... }
}

export default AuthenticationService;