export interface AuthTokenInterface {
  getToken(): Promise<string | null>;
  setToken(tokenValue: string): Promise<void>;
  deleteToken(): Promise<void>;
}

export interface UserCredentials {
  email: string;
  password: string;
}

interface AuthError {
  [key: string]: string;
}

export interface AuthErrors {
  login: AuthError; // ToDo - concentrate on more
}
