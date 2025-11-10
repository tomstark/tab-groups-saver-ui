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
