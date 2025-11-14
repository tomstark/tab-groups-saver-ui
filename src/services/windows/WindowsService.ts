import httpClient from '@/infrastructure/http-client/HttpClient.ts';
import type { ApiResponse, WindowI } from '@/types.ts';
import camelcaseKeys from 'camelcase-keys';
import { camelCaseKeysConfig } from '@/utilities/configs/camlecase-keys.ts';

export class WindowsService {
  async getWindows(spaceId: string): Promise<WindowI[]> {
    const { data } = await httpClient.get<ApiResponse<WindowI[]>>(
      `/spaces/${spaceId}/windows?include=tab-groups.tabs`,
    );

    return camelcaseKeys(data, camelCaseKeysConfig);
  }
}
