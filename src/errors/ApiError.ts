import type { ApiErrorPayload } from '@/types.ts';

export class ApiError extends Error {
  public status: number;
  public payload: ApiErrorPayload;

  constructor(message: string, status: number, payload: ApiErrorPayload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
