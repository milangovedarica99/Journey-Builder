import { describe, expect, it } from 'vitest';

import blueprintGraph from '@/features/graph/__fixtures__/blueprint-graph.json';
import { collectUpstreamData } from '@/features/graph/utils/prefill-upstream-forms';
import { toCamelCaseDeep } from '@/lib/casing';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

const graph = toCamelCaseDeep<ActionBlueprintGraph>(blueprintGraph);

describe('collectUpstreamData', () => {
  it('returns upstream nodes/forms in reverse BFS discovery order with dedupe', () => {
    const upstream = collectUpstreamData(
      graph,
      'form-bad163fd-09bd-4710-ad80-245f31b797d5',
    );
    expect(upstream.map((u) => u.node.id)).toEqual([
      'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
      'form-7c26f280-7bff-40e3-b9a5-0533136f52c3',
      'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
      'form-e15d42df-c7c0-4819-9391-53730e6d47b3',
      'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
    ]);
  });

  it('skips nodes without forms but still traverses their parents', () => {
    const graphWithMissingForm: ActionBlueprintGraph = {
      ...graph,
      nodes: [
        ...graph.nodes,
        {
          id: 'missing-node',
          type: 'form',
          position: { x: 0, y: 0 },
          data: {
            id: 'missing-node',
            componentKey: 'missing-node',
            componentType: 'form',
            componentId: 'missing-form-id',
            name: 'Missing Form Node',
            prerequisites: [],
            permittedRoles: [],
            slaDuration: { number: 0, unit: 'minutes' },
            approvalRequired: false,
            approvalRoles: [],
          },
        },
      ],
      edges: [
        ...graph.edges,
        {
          source: 'missing-node',
          target: 'form-bad163fd-09bd-4710-ad80-245f31b797d5',
        },
      ],
      // forms unchanged; missing-node has no form
    };

    const upstream = collectUpstreamData(
      graphWithMissingForm,
      'form-bad163fd-09bd-4710-ad80-245f31b797d5',
    );
    expect(upstream.some((u) => u.node.id === 'missing-node')).toBe(false);
  });

  it('dedupes shared ancestors in the fixture graph (e.g., Form A across branches)', () => {
    const upstream = collectUpstreamData(
      graph,
      'form-bad163fd-09bd-4710-ad80-245f31b797d5',
    );
    expect(upstream.filter((u) => u.node.data.name === 'Form A')).toHaveLength(
      1,
    );
  });

  it('handles cycles without infinite loops', () => {
    const cyclicGraph: ActionBlueprintGraph = {
      ...graph,
      edges: [
        {
          source: 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
          target: 'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
        },
        {
          source: 'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
          target: 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
        }, // cycle A <-> B
      ],
    };

    const upstream = collectUpstreamData(
      cyclicGraph,
      'form-a4750667-d774-40fb-9b0a-44f8539ff6c4',
    );
    expect(upstream.length).toBeGreaterThan(0);
    expect(
      upstream.filter(
        (u) => u.node.id === 'form-47c61d17-62b0-4c42-8ca2-0eff641c9d88',
      ),
    ).toHaveLength(1);
  });
});
