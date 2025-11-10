import type { Space } from '@/types.ts';

export function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Value must be a string');
  }
}

export function assertNumber(value: unknown): asserts value is number {
  if (!Number.isInteger(value)) {
    throw new Error('Value must be a number');
  }
}
export function assertSpace(value: unknown): asserts value is Space {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`Expected object for Space, got ${typeof value}`);
  }

  const item = value as Record<string, unknown>;

  if (typeof item.id !== 'string') throw new Error("Invalid or missing 'id' in Space");
  if (typeof item.name !== 'string') throw new Error("Invalid or missing 'name' in Space");
  if (typeof item.slug !== 'string') throw new Error("Invalid or missing 'slug' in Space");
  if (typeof item.position !== 'number') throw new Error("Invalid or missing 'position' in Space");
  if (typeof item.composing !== 'boolean')
    throw new Error("Invalid or missing 'composing' in Space");
  if (typeof item.draggable !== 'boolean')
    throw new Error("Invalid or missing 'draggable' in Space");
}
