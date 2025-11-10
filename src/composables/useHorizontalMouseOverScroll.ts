import { onUnmounted } from 'vue';
import type { Nullable } from '@/types.ts';

export function useHorizontalMouseOverScroll() {
  let animationFrameId: number;
  let containerRef: HTMLElement | null = null;
  let scrollDirection = 0;

  const createScrollStep = () => {
    let lastTime: Nullable<DOMHighResTimeStamp> = null;

    const step = () => {
      if (!containerRef) return;

      if (scrollDirection !== 0) {
        const speed = 7;
        const now = performance.now();

        if (lastTime === null) {
          lastTime = now;
        }

        const delta = now - lastTime;
        lastTime = now;

        containerRef.scrollLeft += speed * delta * scrollDirection;
      } else {
        lastTime = null;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    return step;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const container = containerRef;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const leftZone = width * 0.35;
    const rightZone = width * 0.35;

    if (x < leftZone) {
      const intensity = 1 - x / leftZone;
      scrollDirection = -intensity; // left
    } else if (x > rightZone) {
      scrollDirection = (x - rightZone) / (width - rightZone); // right
    } else {
      scrollDirection = 0;
    }
  };

  const handleMouseLeave = () => {
    scrollDirection = 0;
  };

  const unInitialize = () => {
    if (animationFrameId === null) {
      return;
    }

    cancelAnimationFrame(animationFrameId);

    if (containerRef) {
      containerRef.scrollLeft = 0;
      containerRef.removeEventListener('mousemove', handleMouseMove);
      containerRef.removeEventListener('mouseleave', handleMouseLeave);
    }
  };

  const initiate = (containerRefPassed: HTMLElement) => {
    unInitialize(); // ensure a clean start

    containerRef = containerRefPassed;

    const horizontalScrollbarVisible = containerRef.scrollWidth > containerRef.clientWidth;
    if (!horizontalScrollbarVisible) {
      // Guard against having no relevant element upon which to use this code
      return;
    }

    animationFrameId = requestAnimationFrame(createScrollStep());

    containerRef?.addEventListener('mousemove', handleMouseMove);
    containerRef?.addEventListener('mouseleave', handleMouseLeave);
  };

  onUnmounted(() => {
    unInitialize();
  });

  return { initiate };
}
