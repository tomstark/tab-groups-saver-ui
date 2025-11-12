import { ref, computed } from 'vue';

export function useLoading() {
  const loadingCount = ref(0);

  const startLoading = () => {
    loadingCount.value++;
  };

  // Due to the count-based nature of this loading code, 'stopLoading' may not literally put a stop to 'isLoading'
  // Think of 'stop' here meaning: "stopping the contribution of the function that calls stopLoading()"
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
