import type { AuthTokenInterface } from '@/services/auth/types.ts';
import { AuthItemNames } from '@/infrastructure/auth/types.ts';

export class ExtensionStorageStrategy implements AuthTokenInterface {
  async getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      window.chrome.storage.local.get(AuthItemNames.Token, ({ token }) => resolve(token));
    });
  }

  async setToken(tokenValue: string): Promise<void> {
    return new Promise((resolve) => {
      window.chrome.storage.local.set({ [AuthItemNames.Token]: tokenValue }, () => resolve());
    });
  }

  async deleteToken(): Promise<void> {
    return new Promise((resolve) => {
      window.chrome.storage.local.remove(AuthItemNames.Token as string, () => {
        console.log('Removed Token, logged out');
        resolve();
      });
    });
  }
}
