import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import blueprintGraph from '@/features/graph/__fixtures__/blueprint-graph.json';
import SourcePickerPanel from '@/features/graph/components/source-picker-panel';
import { collectUpstreamData } from '@/features/graph/utils/prefill-upstream-forms';
import { toCamelCaseDeep } from '@/lib/casing';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

const graph = toCamelCaseDeep<ActionBlueprintGraph>(blueprintGraph);
const targetNode = graph.nodes.find(
  (n) => n.id === 'form-bad163fd-09bd-4710-ad80-245f31b797d5',
)!;
const targetForm = graph.forms.find(
  (f) => f.id === targetNode.data.componentId,
)!;
const upstreamData = collectUpstreamData(graph, targetNode.id);

const renderPanel = () => {
  const onPrefillChange = () => undefined;
  const onClose = () => undefined;
  const setModalFieldKey = () => undefined;
  render(
    <SourcePickerPanel
      fieldKey="email"
      selectedBlueprintDetails={{
        node: targetNode,
        form: targetForm,
        upstreamData,
      }}
      setModalFieldKey={setModalFieldKey}
      onPrefillChange={onPrefillChange}
      onClose={onClose}
    />,
  );
  return { onPrefillChange, setModalFieldKey, onClose };
};

describe('SourcePickerPanel', () => {
  it('filters groups by search label (debounced)', async () => {
    const user = userEvent.setup();
    renderPanel();

    expect(screen.getByText('Form A')).toBeTruthy();
    const input = screen.getByTestId('search-input');
    await user.type(input, 'Form B');

    // allow debounce to settle
    await waitFor(() => {
      expect(screen.queryByText('Form A')).toBeNull();
      expect(screen.getByText('Form B')).toBeTruthy();
    });
  });

  it('prunes open groups that no longer match filter', async () => {
    const user = userEvent.setup();
    renderPanel();

    await user.click(screen.getByText('Form A')); // open Form A
    expect(screen.getByText('Form A')).toBeTruthy();

    const input = screen.getByTestId('search-input');
    await user.clear(input);
    await user.type(input, 'Form B');

    await waitFor(() => {
      expect(screen.queryByText('Form A')).toBeNull();
    });
  });
});
