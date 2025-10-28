import { defineStore } from 'pinia';
import type { UserCredentials } from '@/services/auth/types.ts';
import { type ApiErrorPayload, type Nullable, type User } from '@/types.ts';
import { AuthService } from '@/services/auth/AuthService.ts';
import { ApiError } from '@/errors/ApiError.ts';

// ToDo - introduce use of a service container later
const authService = new AuthService();

interface StoreState {
  loading: boolean;
  user: Nullable<User>;
  token: Nullable<string>;
  errors: { [key: string]: ApiErrorPayload };
}

export const useAuthStore = defineStore('authStore', {
  state: (): StoreState => {
    return {
      loading: true,
      user: null,
      token: null,
      errors: {},
    };
  },
  actions: {
    async login(credentials: UserCredentials) {
      this.loading = true;
      const error: Nullable<ApiError> = await authService.login(credentials);

      if (error !== null) {
        this.errors.login = error.payload;
        this.loading = false;
        return;
      }

      await this.syncToken();
      await this.getAuthUser();
      this.loading = false;
    },
    async getAuthUser() {
      this.loading = true;
      try {
        this.user = await authService.getUser();
      } catch (e) {
        if (e instanceof ApiError) {
          this.errors.loginUser = e.payload;
        }

        throw e;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await authService.logout();
      await this.syncToken();
    },
    async syncToken() {
      this.token = await authService.getToken();
    },
    async syncAuthUser() {
      this.loading = true;
      this.token = await authService.getToken();

      if (this.token !== null) {
        await this.getAuthUser();
      }

      this.loading = false;
    },
  },
});
