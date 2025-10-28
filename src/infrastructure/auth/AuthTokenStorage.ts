import type { TokenStorageStrategy } from '@/infrastructure/auth/types.ts';
import { ExtensionStorageStrategy } from '@/infrastructure/auth/token-strategies/ExtensionTokenStorageStrategy.ts';
import { LocalStorageStrategy } from '@/infrastructure/auth/token-strategies/LocalTokenStorageStrategy.ts';

class AuthTokenStorage {
  static #instance: AuthTokenStorage;

  private strategy: TokenStorageStrategy;

  constructor(isExtension: boolean) {
    this.strategy = isExtension ? new ExtensionStorageStrategy() : new LocalStorageStrategy();
  }
  public static get instance(): AuthTokenStorage {
    if (!AuthTokenStorage.#instance) {
      AuthTokenStorage.#instance = new AuthTokenStorage(
        typeof window.chrome !== 'undefined' && !!window.chrome.storage,
      );
    }

    return AuthTokenStorage.#instance;
  }

  getToken() {
    return this.strategy.getToken();
  }

  setToken(tokenValue: string) {
    return this.strategy.setToken(tokenValue);
  }

  deleteToken() {
    return this.strategy.deleteToken();
  }
}

export default AuthTokenStorage.instance;
