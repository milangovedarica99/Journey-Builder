import { describe, expect, it } from 'vitest';

import blueprintGraph from '@/features/graph/__fixtures__/blueprint-graph.json';
import { buildGraphLayout } from '@/features/graph/utils/graph-layout';
import { toCamelCaseDeep } from '@/lib/casing';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

const sampleGraph = toCamelCaseDeep<ActionBlueprintGraph>(blueprintGraph);

describe('buildGraphLayout', () => {
  it('creates a node for each blueprint node with component metadata', () => {
    const { layoutNodes } = buildGraphLayout(sampleGraph);
    expect(layoutNodes).toHaveLength(6);
    expect(layoutNodes[0].data.componentId).toBe(
      'f_01jk7ap2r3ewf9gx6a9r09gzjv',
    );
  });

  it('creates an edge for each blueprint edge', () => {
    const { layoutEdges } = buildGraphLayout(sampleGraph);
    expect(layoutEdges).toHaveLength(6);
    expect(layoutEdges[0].source).toBe(
      'form-0f58384c-4966-4ce6-9ec2-40b96d61f745',
    );
    expect(layoutEdges[0].target).toBe(
      'form-bad163fd-09bd-4710-ad80-245f31b797d5',
    );
  });
});
