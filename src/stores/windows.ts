import { defineStore } from 'pinia';
import type { WindowI } from '@/types.ts';
import { WindowsService } from '@/services/windows/WindowsService.ts';
import { type Ref, ref } from 'vue';
import { useLoading } from '@/composables/useLoading.ts';

// ToDo - introduce use of a service container later
const windowsService = new WindowsService();

export const useWindowsStore = defineStore('windowsStore', () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const windows: Ref<{ [key: string]: WindowI[] }> = ref({});

  const loadWindows = async (spaceId: string) => {
    startLoading();
    // ToDo - consider caching strategies when ready
    windows.value = { ...windows.value, [spaceId]: await windowsService.getWindows(spaceId) };
    stopLoading();
  };

  return {
    // state
    isLoading,
    windows,

    // actions
    loadWindows,
  };
});
