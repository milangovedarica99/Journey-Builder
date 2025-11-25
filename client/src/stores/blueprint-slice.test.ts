import { describe, expect, it } from 'vitest';

import blueprintGraph from '@/features/graph/__fixtures__/blueprint-graph.json';
import { toCamelCaseDeep } from '@/lib/casing';
import reducer, { setPrefillMapping } from '@/stores/blueprint-slice';
import type {
  ActionBlueprintGraph,
  PrefillMapping,
} from '@/types/domain/blueprint';

describe('blueprint-slice setPrefillMapping', () => {
  it('updates node inputMapping when graph exists', () => {
    const graph = toCamelCaseDeep<ActionBlueprintGraph>(blueprintGraph);
    const targetNodeId = graph.nodes[0].id;
    const mapping: PrefillMapping = {
      email: {
        fieldKey: 'email',
        source: { type: 'formField', label: 'x', key: 'A.email' },
      },
    };

    const stateWithGraph = {
      actionBlueprintGraph: graph,
      isFetchBlueprintInProgress: false,
      blueprintFetchError: null,
    };

    const next = reducer(
      stateWithGraph,
      setPrefillMapping({ nodeId: targetNodeId, mapping }),
    );

    expect(
      next.actionBlueprintGraph?.nodes.find((n) => n.id === targetNodeId)?.data
        .inputMapping,
    ).toEqual(mapping);
  });
});
