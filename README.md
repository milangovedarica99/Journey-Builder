# Journey Builder (React + Vite)

Fetch a blueprint graph, render it with React Flow, and manage prefill mappings for downstream forms.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3033
```

Environment (see `.env.example`):

```
VITE_JOURNEY_BUILDER_SERVER_BASE_URL=http://localhost:3000
```

## Project Layout

- `src/App.tsx`, `app-router.tsx`, `pages/blueprint-page.tsx`: app shell, routing, graph page.
- `src/apis/`: axios client (`api.ts`) and blueprint fetch (`blueprint-api.ts`).
- `src/stores/`: Redux store + blueprint slice (graph fetch, prefill mapping updates).
- `src/features/graph/`:
  - `components/`: graph canvas node, prefill dock, source picker, etc.
  - `hooks/use-graph-layout.ts`: wires graph data to React Flow state.
  - `utils/`: layout builder, upstream traversal, source grouping.
  - `types.ts`, `enums.ts`.
- `src/components/`: shared UI
  - `layout/panel-shell.tsx`
  - `inputs/search-input.tsx`
  - `feedback/error-page.tsx`, `feedback/loading-screen.tsx`
- `src/lib/`: helpers (`casing`, `useDebouncedValue`).
- `src/types/`: API/domain shapes.
- `src/assets/`: icons.

## Extending with New Data Sources

- Upstream traversal: `prefill-upstream-forms.ts` builds incoming adjacency and walks parents (BFS) with dedupe. To add new upstream/global sources, extend `prefill-source-groups.ts`; the picker consumes groups, so UI stays unchanged.
- Prefill updates: keep the graph as the source of truth via `setPrefillMapping` in the slice. The page owns the current selection and passes `onPrefillChange` down to children.
- Global data: add new groups in `prefill-source-groups.ts` to surface additional sources without touching components.

## Patterns to Notice

- Feature-based structure (`features/graph`) + shared UI (`components/`) + API/domain types in `types/api` and `types/domain`.
- Reusable shells/inputs (`PanelShell`, `SearchInput`) and debounced search (`useDebouncedValue`).
- Upstream resolution with precomputed maps, cycle/duplicate guards, and explicit ordering.
- App-level Suspense and `react-error-boundary` for error/loading feedback components.
- Data flow: graph data + mapping live in the store; selection stays local to the page and is passed to children; `setPrefillMapping` keeps the graph as the source of truth. Graph layout wiring lives in `use-graph-layout` custom hook.

## Notes

- API: point `VITE_JOURNEY_BUILDER_SERVER_BASE_URL` to the mock server from the challenge repo to exercise the fetch; requests hit `/api/v1/{tenantId}/actions/blueprints/{actionBlueprintId}/graph/`.

## Tests

Vitest + Testing Library. Tests are colocated with code (utils, components, slice). Run with `npm run test`.
Graph-driven tests use the fixture in `src/features/graph/__fixtures__/` for stable upstream/grouping assertions.
