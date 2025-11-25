import { useEffect, useMemo } from 'react';
import { useEdgesState, useNodesState } from 'reactflow';

import type {
  LayoutEdge,
  LayoutNode,
  LayoutNodeData,
} from '@/features/graph/types';
import { buildGraphLayout } from '@/features/graph/utils/graph-layout';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

type UseGraphLayoutResult = {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  onNodesChange: ReturnType<typeof useNodesState<LayoutNodeData>>[2];
  onEdgesChange: ReturnType<typeof useEdgesState<LayoutEdge>>[2];
  hasGraph: boolean;
};

export const useGraphLayout = (
  graph: ActionBlueprintGraph | null,
): UseGraphLayoutResult => {
  const [nodes, setNodes, onNodesChange] = useNodesState<LayoutNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<LayoutEdge>([]);

  const layout = useMemo(() => {
    if (!graph) return null;
    return buildGraphLayout(graph);
  }, [graph]);

  useEffect(() => {
    if (!layout) {
      setNodes([]);
      setEdges([]);
      return;
    }
    setNodes(layout.layoutNodes);
    setEdges(layout.layoutEdges);
  }, [layout, setNodes, setEdges]);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    hasGraph: nodes.length > 0 && edges.length > 0,
  };
};
