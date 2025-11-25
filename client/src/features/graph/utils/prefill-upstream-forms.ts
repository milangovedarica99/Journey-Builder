import type { UpstreamData } from '@/features/graph/types';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

// Example:
// Nodes: A -> B, A -> C, B -> D, C -> D
// Forms: formA on A, formB on B, formC on C, formD on D
// collectUpstreamData(graph, 'D')
// discovers via BFS [{ node: B, form: formB }, { node: C, form: formC }, { node: A, form: formA }]
// and returns it reversed.

export const collectUpstreamData = (
  graph: ActionBlueprintGraph,
  targetNodeId: string,
): UpstreamData[] => {
  // Build incoming adjacency: for each node, which nodes point into it.
  const incoming = new Map<string, string[]>();
  for (const { source, target } of graph.edges) {
    const list = incoming.get(target);
    if (list) list.push(source);
    else incoming.set(target, [source]);
  }

  // Precompute lookups to avoid repeated scans.
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const formById = new Map(graph.forms.map((f) => [f.id, f]));

  const visited = new Set<string>();
  const added = new Set<string>();
  const result: UpstreamData[] = [];
  const queue: string[] = [targetNodeId];

  // BFS over parents to collect upstream nodes/forms.
  while (queue.length) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    for (const parentId of incoming.get(current) ?? []) {
      const parentNode = nodeById.get(parentId);
      if (!parentNode || added.has(parentNode.id)) continue;

      const parentForm = formById.get(parentNode.data.componentId);
      if (parentForm) {
        // Preserve discovery order from BFS so upstream entries reflect edge traversal order.
        result.push({ node: parentNode, form: parentForm });
        added.add(parentId);
      }

      queue.push(parentId);
    }
  }

  return result.reverse();
};
