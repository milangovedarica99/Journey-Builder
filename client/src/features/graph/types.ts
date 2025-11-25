import type { Edge, Node } from 'reactflow';

import type {
  BlueprintForm,
  BlueprintNode,
  PrefillSource,
} from '@/types/domain/blueprint';

export interface LayoutNodeData {
  label: string;
  componentId: string;
  componentKey: string;
}

export type LayoutNode = Node<LayoutNodeData>;

export type LayoutEdge = Edge;

export interface GraphLayout {
  layoutNodes: LayoutNode[];
  layoutEdges: LayoutEdge[];
}

export interface UpstreamData {
  node: BlueprintNode;
  form: BlueprintForm;
}

export interface PrefillSourceGroup {
  label: string;
  sources: PrefillSource[];
}

export interface SelectedBlueprintDetails extends UpstreamData {
  upstreamData: UpstreamData[];
}
