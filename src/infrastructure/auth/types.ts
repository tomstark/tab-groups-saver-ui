export interface TokenStorageStrategy {
  getToken(): Promise<string | null | undefined>;
  setToken(tokenValue: string): Promise<void>;
  deleteToken(): Promise<void>;
}

export enum AuthItemNames {
  Token = 'token',
}
