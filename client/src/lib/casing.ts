export const toCamelCaseDeep = <T>(input: unknown): T => {
  if (Array.isArray(input)) {
    return input.map((value) => toCamelCaseDeep(value)) as unknown as T;
  }

  if (input && typeof input === 'object') {
    const entries = Object.entries(input as Record<string, unknown>).map(
      ([key, value]) => [camelKey(key), toCamelCaseDeep(value)],
    );
    return Object.fromEntries(entries) as T;
  }

  return input as T;
};

const camelKey = (key: string) =>
  key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
