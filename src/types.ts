import { TabGroupColor } from '@/utilities/enums.ts';

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

export interface WindowI {
  // added I suffix to avoid clashes with the global browser window object's type (Window)
  id: string;
  name: string;
  position: number;
  updatedAt: string;
  tabGroups: TabGroup[];
}

export interface TabGroup {
  id: string;
  name: string;
  color: keyof typeof TabGroupColor;
  position: number;
  updatedAt: string;
  tabs: Tab[];
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  icon: Nullable<string>;
  color: Nullable<TabGroupColor>;
  position: number;
  updatedAt: string;
}
