import dagre from 'dagre';
import { v4 as uuidv4 } from 'uuid';

import { NodeTypes } from '@/features/graph/enums';
import type {
  GraphLayout,
  LayoutEdge,
  LayoutNode,
} from '@/features/graph/types';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

const nodeWidth = 200;
const nodeHeight = 60;

export const buildGraphLayout = (
  response: ActionBlueprintGraph,
  direction: 'TB' | 'LR' = 'LR',
): GraphLayout => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  response.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  response.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutNodes: LayoutNode[] = response.nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      id: node.id,
      position: {
        x: dagreNode.x - nodeWidth / 2,
        y: dagreNode.y - nodeHeight / 2,
      },
      type: NodeTypes.Blueprint,
      data: {
        label: node.data.name,
        componentId: node.data.componentId,
        componentKey: node.data.componentKey,
      },
    };
  });

  const layoutEdges: LayoutEdge[] = response.edges.map((edge) => ({
    id: uuidv4(),
    source: edge.source,
    target: edge.target,
    animated: false,
  }));

  return { layoutNodes, layoutEdges };
};
