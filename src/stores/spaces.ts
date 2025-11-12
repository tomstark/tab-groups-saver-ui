import { defineStore } from 'pinia';
import type { Space } from '@/types.ts';
import { SpacesService } from '@/services/spaces/SpacesService.ts';
import { computed, type ComputedRef, type Ref, ref } from 'vue';
import { useLoading } from '@/composables/useLoading.ts';

// ToDo - introduce use of a service container later
const spacesService = new SpacesService();

const defaultSpaces: Space[] = [
  { id: 'x', name: 'Open', slug: 'open', position: 1, composing: false, draggable: false },
  {
    id: 'xx',
    name: 'Staging',
    slug: 'staging',
    position: 2,
    composing: false,
    draggable: false,
  },
];

export const useSpacesStore = defineStore('spacesStore', () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const newSpaceName = ref('New Space');
  const userSpaces: Ref<Space[]> = ref([]);

  const spaces: ComputedRef<Space[]> = computed(() => {
    return [
      ...defaultSpaces,
      ...userSpaces.value.map((item): Space => ({ ...item, composing: false, draggable: true })),
    ];
  });

  const loadUserSpaces = async () => {
    startLoading();
    userSpaces.value = await spacesService.getSpaces();
    stopLoading();
  };

  const createNewSpace = async (name: string): Promise<Space> => {
    startLoading();
    const newSpace = await spacesService.createNewSpace(name);
    userSpaces.value.push(newSpace);
    stopLoading();
    return newSpace;
  };

  const updateSpacePosition = async (slug: string, newPosition: number): Promise<Space> => {
    startLoading();
    const updatedSpace = await spacesService.updateSpacePosition(slug, newPosition);
    stopLoading();
    return updatedSpace;
  };

  return {
    // state
    isLoading,
    newSpaceName,
    userSpaces,

    // getters
    spaces,

    // actions
    startLoading,
    stopLoading,
    loadUserSpaces,
    createNewSpace,
    updateSpacePosition,
  };
});
