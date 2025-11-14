import { defineStore } from 'pinia';
import type { UserCredentials } from '@/services/auth/types.ts';
import { type ApiErrorPayload, type Nullable, type User } from '@/types.ts';
import { AuthService } from '@/services/auth/AuthService.ts';
import { ApiError } from '@/errors/ApiError.ts';
import { type Ref, ref } from 'vue';
import { useLoading } from '@/composables/useLoading.ts';

// ToDo - introduce use of a service container later
const authService = new AuthService();

export const useAuthStore = defineStore('authStore', () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const user: Ref<Nullable<User>> = ref(null);
  const errors: Ref<{ [key: string]: ApiErrorPayload }> = ref({});

  const getAuthUser = async () => {
    startLoading();

    try {
      user.value = await authService.getUser();
    } catch (e) {
      if (e instanceof ApiError) {
        errors.value.getAuthUser = e.payload;
      }

      throw e;
    } finally {
      stopLoading();
    }
  };

  const token: Ref<Nullable<string>> = ref(null);
  const syncToken = async () => {
    token.value = await authService.getToken();
  };

  const login = async (credentials: UserCredentials) => {
    startLoading();
    const error: Nullable<ApiError> = await authService.login(credentials);

    if (error !== null) {
      errors.value.login = error.payload;
      stopLoading();
      return;
    }

    await syncToken();
    await getAuthUser();
    stopLoading();
  };

  const syncAuthUser = async () => {
    startLoading();

    try {
      token.value = await authService.getToken();

      if (token.value !== null) {
        await getAuthUser();
      }
    } catch (e) {
      if (e instanceof ApiError) {
        errors.value.syncAuthUser = e.payload;
      }

      throw e;
    } finally {
      stopLoading();
    }
  };

  const logout = async () => {
    await authService.logout();
    await syncToken();
  };

  return {
    // state
    isLoading,
    user,
    token,
    errors,

    // actions
    login,
    syncAuthUser,
    logout,
  };
});
