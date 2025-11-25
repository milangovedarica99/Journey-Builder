import { describe, expect, it } from 'vitest';

import type { PrefillSourceGroup, UpstreamData } from '@/features/graph/types';
import { buildPrefillSourceGroups } from '@/features/graph/utils/prefill-source-groups';

const upstreamEntry = (
  nodeId: string,
  formId: string,
  fields: string[],
): UpstreamData => ({
  node: {
    id: nodeId,
    type: 'form',
    position: { x: 0, y: 0 },
    data: {
      id: nodeId,
      componentKey: `${nodeId}-key`,
      componentType: 'form',
      componentId: formId,
      name: `Form ${nodeId}`,
      prerequisites: [],
      permittedRoles: [],
      slaDuration: { number: 0, unit: 'minutes' },
      approvalRequired: false,
      approvalRoles: [],
    },
  },
  form: {
    id: formId,
    name: `Form ${nodeId}`,
    description: '',
    isReusable: false,
    fieldSchema: {
      type: 'object',
      properties: Object.fromEntries(
        fields.map((field) => [
          field,
          { avantosType: 'short-text', title: field, type: 'string' },
        ]),
      ),
    },
    uiSchema: { type: 'object', elements: [] },
    dynamicFieldConfig: {},
  },
});

describe('buildPrefillSourceGroups', () => {
  it('returns global groups followed by form groups with field sources', () => {
    const groups = buildPrefillSourceGroups([
      upstreamEntry('A', 'formA', ['fa1', 'fa2']),
      upstreamEntry('B', 'formB', ['fb1']),
    ]);

    const labels = groups.map((g) => g.label);
    expect(labels.slice(0, 2)).toEqual([
      'Action Properties',
      'Client Organisation Properties',
    ]);
    expect(labels.slice(2)).toEqual(['Form A', 'Form B']);

    const formAGroup = groups.find(
      (g) => g.label === 'Form A',
    ) as PrefillSourceGroup;
    expect(formAGroup.sources.map((s) => s.label)).toEqual([
      'Form A.fa1',
      'Form A.fa2',
    ]);
    expect(formAGroup.sources.map((s) => s.key)).toEqual(['A.fa1', 'A.fa2']);
  });
});
