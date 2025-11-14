import { ref, computed } from 'vue';

export function useLoading() {
  const loadingCount = ref(0);

  const startLoading = () => {
    loadingCount.value++;
  };

  // Due to the count-based nature of this loading code, 'stopLoading' may not literally put a stop
  // to 'isLoading'. Think of 'stop' as: "stop the contribution of the fn calling stopLoading()"
  const stopLoading = () => {
    if (loadingCount.value > 0) {
      loadingCount.value--;
    }
  };

  const isLoading = computed(() => loadingCount.value > 0);

  return {
    startLoading,
    stopLoading,
    isLoading,
  };
}
