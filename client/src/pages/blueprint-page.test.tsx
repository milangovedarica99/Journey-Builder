import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import blueprintGraph from '@/features/graph/__fixtures__/blueprint-graph.json';
import { toCamelCaseDeep } from '@/lib/casing';
import BlueprintPage from '@/pages/blueprint-page';
import type { BlueprintSliceState } from '@/stores/blueprint-slice';
import type { RootState } from '@/stores/store';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

interface MockReactFlowProps {
  children: React.ReactNode;
  onNodeClick?: (event: unknown, node: { id: string; data: unknown }) => void;
  onPaneClick?: (event: unknown) => void;
}

const graph = toCamelCaseDeep<ActionBlueprintGraph>(blueprintGraph);
const targetNodeId = graph.nodes[0].id;

let mockHasGraph = true;
let mockBlueprintState: BlueprintSliceState = {
  actionBlueprintGraph: graph,
  isFetchBlueprintInProgress: false,
  blueprintFetchError: null as string | null,
};

vi.mock('@/features/graph/hooks/use-graph-layout', () => ({
  useGraphLayout: () => ({
    nodes: [
      { id: targetNodeId, position: { x: 0, y: 0 }, data: { label: 'Form' } },
    ],
    edges: [],
    onNodesChange: vi.fn(),
    onEdgesChange: vi.fn(),
    hasGraph: mockHasGraph,
  }),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: <TSelected,>(selector: (state: RootState) => TSelected) =>
    selector({ blueprint: mockBlueprintState } as RootState),
}));

vi.mock('reactflow', () => ({
  Background: () => null,
  Controls: () => null,
  ReactFlow: ({ children, onNodeClick, onPaneClick }: MockReactFlowProps) => (
    <div>
      <button
        data-testid="mock-node"
        onClick={() => onNodeClick?.({}, { id: targetNodeId, data: {} })}
      >
        mock-node
      </button>
      <button data-testid="mock-pane" onClick={() => onPaneClick?.({})}>
        mock-pane
      </button>
      {children}
    </div>
  ),
}));

const renderPage = () =>
  render(
    <MemoryRouter>
      <BlueprintPage />
    </MemoryRouter>,
  );

describe('BlueprintPage', () => {
  it('shows loading screen while fetching', () => {
    mockHasGraph = false;
    mockBlueprintState = {
      ...mockBlueprintState,
      isFetchBlueprintInProgress: true,
    };
    renderPage();
    expect(screen.getByTestId('loading-screen')).toBeTruthy();
  });

  it('shows empty state when no graph data', () => {
    mockHasGraph = false;
    mockBlueprintState = {
      ...mockBlueprintState,
      isFetchBlueprintInProgress: false,
      actionBlueprintGraph: null,
    };
    renderPage();
    expect(screen.getByTestId('graph-empty-state')).toBeTruthy();
  });

  it('renders dock after selecting a node and closes on pane click', async () => {
    mockHasGraph = true;
    mockBlueprintState = {
      ...mockBlueprintState,
      isFetchBlueprintInProgress: false,
      actionBlueprintGraph: graph,
    };
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByTestId('mock-node'));
    expect(screen.getByTestId('prefill-dock')).toBeTruthy();

    await user.click(screen.getByTestId('mock-pane'));
    expect(screen.queryByTestId('prefill-dock')).toBeNull();
  });
});
