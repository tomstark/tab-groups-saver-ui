import { defineStore } from 'pinia';
import type { Space } from '@/types.ts';
import { SpacesService } from '@/services/spaces/SpacesService.ts';

// ToDo - introduce use of a service container later
const spacesService = new SpacesService();

interface SpacesState {
  loadingCount: number;
  newSpaceName: string;
  userSpaces: Space[];
}

const defaultSpaces = [
  { id: 'a', name: 'Open', slug: 'open', position: 1, system_default: true },
  { id: 'b', name: 'Staging', slug: 'staging', position: 2, system_default: true },
];

export const useSpacesStore = defineStore('spacesStore', {
  state: (): SpacesState => ({
    loadingCount: 0,
    newSpaceName: 'New Space',
    userSpaces: [],
  }),
  getters: {
    spaces: (state: SpacesState) => [...defaultSpaces, ...state.userSpaces],
    isLoading: (state) => state.loadingCount > 0,
  },
  actions: {
    async withLoading<T>(fn: () => Promise<T>): Promise<T> {
      try {
        this.loadingCount++;
        return await fn();
      } finally {
        this.loadingCount--;
      }
    },
    async loadUserSpaces() {
      await this.withLoading(async () => {
        this.userSpaces = await spacesService.getSpaces();
      });
    },
    async createNewSpace(name: string): Promise<Space> {
      return await this.withLoading(async (): Promise<Space> => {
        const newSpace = await spacesService.createNewSpace(name);
        this.userSpaces.push(newSpace);
        return newSpace;
      });
    },
    async updateSpacePosition(slug: string, newPosition: number) {
      await this.withLoading(async () => {
        await spacesService.updateSpacePosition(slug, newPosition);
        return await this.loadUserSpaces();
      });
    },
  },
});
