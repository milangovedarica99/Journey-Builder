import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import { getActionBlueprintGraph } from '@/apis/blueprint-api';
import type { ActionBlueprintGraphRequest } from '@/types/api/blueprint';
import type {
  ActionBlueprintGraph,
  PrefillMapping,
} from '@/types/domain/blueprint';

export interface BlueprintSliceState {
  actionBlueprintGraph: ActionBlueprintGraph | null;
  isFetchBlueprintInProgress: boolean;
  blueprintFetchError: string | null;
}

const initialState: BlueprintSliceState = {
  actionBlueprintGraph: null,
  isFetchBlueprintInProgress: false,
  blueprintFetchError: null,
};

const SLICE = 'blueprint';

export const fetchBlueprintThunk = createAsyncThunk<
  ActionBlueprintGraph,
  ActionBlueprintGraphRequest
>(`${SLICE}/get`, async (request) => {
  return await getActionBlueprintGraph(
    request.tenantId,
    request.actionBlueprintId,
  );
});

const blueprintSlice = createSlice({
  name: SLICE,
  initialState,
  reducers: {
    clear: () => initialState,
    setPrefillMapping: (
      state,
      action: PayloadAction<{ nodeId: string; mapping: PrefillMapping }>,
    ) => {
      if (!state.actionBlueprintGraph) return;

      const updatedNodes = state.actionBlueprintGraph.nodes.map((node) => {
        if (node.id !== action.payload.nodeId) {
          return node;
        }
        return {
          ...node,
          data: { ...node.data, inputMapping: action.payload.mapping },
        };
      });

      state.actionBlueprintGraph = {
        ...state.actionBlueprintGraph,
        nodes: updatedNodes,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlueprintThunk.pending, (state) => {
        state.isFetchBlueprintInProgress = true;
        state.blueprintFetchError = null;
      })
      .addCase(fetchBlueprintThunk.fulfilled, (state, action) => {
        state.actionBlueprintGraph = action.payload;
        state.isFetchBlueprintInProgress = false;
        state.blueprintFetchError = null;
      })
      .addCase(fetchBlueprintThunk.rejected, (state, action) => {
        state.isFetchBlueprintInProgress = false;
        state.blueprintFetchError =
          action.error.message ?? 'Failed to load blueprint.';
      });
  },
});

export const { clear, setPrefillMapping } = blueprintSlice.actions;
export default blueprintSlice.reducer;
