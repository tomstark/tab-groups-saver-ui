import authTokenStorage from '@/infrastructure/auth/AuthTokenStorage.ts';
import { ApiError } from '@/errors/ApiError.ts';

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

class HttpClient {
  static #instance: HttpClient;

  readonly #apiBaseUrl;

  private constructor(apiBaseUrl: string) {
    this.#apiBaseUrl = apiBaseUrl;
  }

  public static get instance(): HttpClient {
    if (!HttpClient.#instance) {
      HttpClient.#instance = new HttpClient(import.meta.env.VITE_API_BASE_URL ?? '');
    }

    return HttpClient.#instance;
  }

  public get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: this.getStringifiableBody(body),
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: this.getStringifiableBody(body),
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: this.getStringifiableBody(body),
    });
  }

  public delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  private getStringifiableBody(body?: unknown): string | undefined {
    return body ? JSON.stringify(body) : undefined;
  }

  private async buildHeaders(auth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (auth) {
      const token = await authTokenStorage.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { auth = true, ...fetchOptions } = options;

    const response = await fetch(`${this.#apiBaseUrl}${endpoint}`, {
      ...fetchOptions,
      headers: {
        ...(await this.buildHeaders(auth)),
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorResponseBody = await response.json();
      throw new ApiError('Request failed', response.status, errorResponseBody);
    }

    try {
      return (await response.json()) as T;
    } catch {
      return {} as T;
    }
  }
}

export default HttpClient.instance;
