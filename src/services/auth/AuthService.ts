import type { UserCredentials } from '@/services/auth/types.ts';
import httpClient from '@/infrastructure/http-client/HttpClient.ts';
import authTokenStorage from '@/infrastructure/auth/AuthTokenStorage.ts';
import type { User } from '@/types.ts';
import { ApiError } from '@/errors/ApiError.ts';

export class AuthService {
  async login(credentials: UserCredentials): Promise<ApiError | null> {
    // ToDo - move later
    interface LoginResponseShape {
      message: string;
      token: string;
    }

    try {
      const responseData = await httpClient.post<LoginResponseShape>('/login', credentials, {
        auth: false,
      });
      await authTokenStorage.setToken(responseData.token);
      return null;
    } catch (e) {
      if (e instanceof ApiError) {
        return e;
      }

      throw e;
    }
  }

  async getUser(): Promise<User> {
    return await httpClient.get<User>('/user');
  }

  async logout(): Promise<void> {
    await httpClient.post<{ message: string }>('/logout');
    await authTokenStorage.deleteToken();
  }

  async getToken(): Promise<string | null> {
    const token = await authTokenStorage.getToken();

    if (typeof token !== 'string') {
      return null;
    }

    return token;
  }
}
