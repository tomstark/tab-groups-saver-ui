import httpClient from '@/infrastructure/http-client/HttpClient.ts';
import type { ApiResponse, Space } from '@/types.ts';

export class SpacesService {
  async getSpaces(): Promise<Space[]> {
    const { data } = await httpClient.get<ApiResponse<Space[]>>('/spaces');

    return data;
  }

  async createNewSpace(name: string) {
    const { data } = await httpClient.post<ApiResponse<Space>>('/spaces', { name });

    return data;
  }

  async updateSpacePosition(slug: string, newPosition: number) {
    const { data } = await httpClient.patch<ApiResponse<Space>>(`/spaces/${slug}`, {
      position: newPosition,
    });

    return data;
  }
}
