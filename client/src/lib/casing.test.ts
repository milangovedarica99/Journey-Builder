import { describe, expect, it } from 'vitest';

import { toCamelCaseDeep } from '@/lib/casing';

describe('toCamelCaseDeep', () => {
  it('converts snake_case keys recursively', () => {
    const input = {
      form_id: '1',
      nested_obj: { inner_key: 'value' },
      array_items: [{ child_id: 2 }],
    };

    const result = toCamelCaseDeep(input);

    expect(result).toEqual({
      formId: '1',
      nestedObj: { innerKey: 'value' },
      arrayItems: [{ childId: 2 }],
    });
  });
});
