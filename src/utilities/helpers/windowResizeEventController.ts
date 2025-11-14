import { debounce } from '@/utilities/helpers/debounce.ts';

export function windowResizeEventController() {
  const createResizeController = (callback: () => void, delay = 200) => {
    const handler = debounce(callback, delay);

    return {
      start() {
        window.addEventListener('resize', handler);
      },
      stop() {
        window.removeEventListener('resize', handler);
      },
    };
  };

  return {
    createResizeController,
  };
}
