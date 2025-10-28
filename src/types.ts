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
  updated_at: string;
}

export interface Space {
  id: string;
  name: string;
  slug: string;
  position: number;
  // ToDo - more
}

export interface SpaceMaker {
  id: string;
  name: string;
  editable: boolean;
}

export type SpaceArray = Space[] | [...Space[], SpaceMaker];
