import httpClient from '@/infrastructure/http-client/HttpClient.ts';
import type { ApiResponse, Space } from '@/types.ts';
import camelcaseKeys from 'camelcase-keys';
import { camelCaseKeysConfig } from '@/config/camlecase-keys.ts';

export class SpacesService {
  async getSpaces(): Promise<Space[]> {
    const { data } = await httpClient.get<ApiResponse<Space[]>>('/spaces');

    return camelcaseKeys(data, camelCaseKeysConfig);
  }

  async createNewSpace(name: string): Promise<Space> {
    const { data } = await httpClient.post<ApiResponse<Space>>('/spaces', { name });

    return camelcaseKeys(data, camelCaseKeysConfig);
  }

  async updateSpacePosition(slug: string, newPosition: number): Promise<Space> {
    const { data } = await httpClient.patch<ApiResponse<Space>>(`/spaces/${slug}`, {
      position: newPosition,
    });

    return camelcaseKeys(data, camelCaseKeysConfig);
  }
}
