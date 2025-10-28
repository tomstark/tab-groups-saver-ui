import type { AuthTokenInterface } from '@/services/auth/types.ts';
import { AuthItemNames } from '@/infrastructure/auth/types.ts';

export class LocalStorageStrategy implements AuthTokenInterface {
  async getToken(): Promise<string | null> {
    return localStorage.getItem(AuthItemNames.Token);
  }

  async setToken(tokenValue: string): Promise<void> {
    localStorage.setItem(AuthItemNames.Token, tokenValue);
  }

  async deleteToken(): Promise<void> {
    localStorage.removeItem(AuthItemNames.Token);
  }
}
