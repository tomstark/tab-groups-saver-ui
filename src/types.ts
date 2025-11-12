export type Nullable<T> = T | null;

export interface ApiErrorPayload {
  detail: string;
  instance: string;
  status: number;
  title: string;
  type: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  name: string;
  slug: string;
  position: number;
  composing: boolean;
  draggable: boolean;
}
