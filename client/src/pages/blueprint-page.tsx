import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { DefaultEdgeOptions, NodeMouseHandler, Viewport } from 'reactflow';
import { Background, Controls, ReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';

import LoadingScreen from '@/components/feedback/loading-screen';
import { BlueprintNode } from '@/features/graph/components/blueprint-node';
import PrefillDock from '@/features/graph/components/prefill-dock';
import SourcePickerPanel from '@/features/graph/components/source-picker-panel';
import { useGraphLayout } from '@/features/graph/hooks/use-graph-layout';
import type { SelectedBlueprintDetails } from '@/features/graph/types';
import { collectUpstreamData } from '@/features/graph/utils/prefill-upstream-forms';
import {
  fetchBlueprintThunk,
  setPrefillMapping,
} from '@/stores/blueprint-slice';
import type { AppDispatch, RootState } from '@/stores/store';
import type { PrefillMapping } from '@/types/domain/blueprint';

const DEFAULT_MIN_ZOOM = 0.1;
const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 0.3 };
const DEFAULT_EDGE_OPTIONS: DefaultEdgeOptions = {
  animated: false,
  style: { stroke: '#cbd5e1', strokeWidth: 1 },
};
const TENANT_ID = 1;
const ACTION_BLUEPRINT_ID = '1ab';

const nodeTypes = { blueprint: BlueprintNode };

const BlueprintPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    actionBlueprintGraph,
    blueprintFetchError,
    isFetchBlueprintInProgress: isLoadingBlueprint,
  } = useSelector((state: RootState) => state.blueprint);

  const { nodes, edges, onNodesChange, onEdgesChange, hasGraph } =
    useGraphLayout(actionBlueprintGraph);

  const [modalFieldKey, setModalFieldKey] = useState<string | null>(null);
  const [selectedBlueprintDetails, setSelectedBlueprintDetails] =
    useState<SelectedBlueprintDetails | null>(null);

  useEffect(() => {
    dispatch(
      fetchBlueprintThunk({
        tenantId: TENANT_ID,
        actionBlueprintId: ACTION_BLUEPRINT_ID,
      }),
    );
  }, [dispatch]);

  const handleNodeClick: NodeMouseHandler = (_, layoutNode) => {
    if (!actionBlueprintGraph) return;
    const node = actionBlueprintGraph.nodes.find((n) => n.id === layoutNode.id);
    if (!node) {
      return;
    }

    const form = actionBlueprintGraph.forms.find(
      (f) => f.id === node.data.componentId,
    );
    if (!form) {
      return;
    }

    const upstreamData = collectUpstreamData(actionBlueprintGraph, node.id);
    setSelectedBlueprintDetails({ node, form, upstreamData });
  };

  const handlePrefillChange = (nodeId: string, mapping: PrefillMapping) => {
    if (!selectedBlueprintDetails) {
      return;
    }

    dispatch(setPrefillMapping({ nodeId, mapping }));
    const updatedNode = {
      ...selectedBlueprintDetails.node,
      data: {
        ...selectedBlueprintDetails.node.data,
        inputMapping: mapping,
      },
    };
    setSelectedBlueprintDetails({
      ...selectedBlueprintDetails,
      node: updatedNode,
    });
  };

  const closePrefill = () => {
    setSelectedBlueprintDetails(null);
  };

  if (!isLoadingBlueprint && blueprintFetchError) {
    throw new Error(blueprintFetchError);
  }

  return (
    <div className="relative h-screen w-screen">
      {isLoadingBlueprint && <LoadingScreen message="Loading blueprint..." />}

      {hasGraph && (
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={DEFAULT_MIN_ZOOM}
          defaultViewport={DEFAULT_VIEWPORT}
          defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
          onNodeClick={handleNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneClick={closePrefill}
          onEdgeClick={closePrefill}
        >
          <Background />
          <Controls />
        </ReactFlow>
      )}

      {!isLoadingBlueprint && !hasGraph && (
        <div
          data-testid="graph-empty-state"
          className="flex size-full items-center justify-center"
        >
          No graph data available.
        </div>
      )}

      {selectedBlueprintDetails && actionBlueprintGraph && (
        <PrefillDock
          setModalFieldKey={setModalFieldKey}
          selectedBlueprintDetails={selectedBlueprintDetails}
          onPrefillChange={handlePrefillChange}
        />
      )}

      {modalFieldKey && selectedBlueprintDetails && (
        <SourcePickerPanel
          fieldKey={modalFieldKey}
          selectedBlueprintDetails={selectedBlueprintDetails}
          onPrefillChange={handlePrefillChange}
          setModalFieldKey={setModalFieldKey}
          onClose={() => setModalFieldKey(null)}
        />
      )}
    </div>
  );
};

export default BlueprintPage;
