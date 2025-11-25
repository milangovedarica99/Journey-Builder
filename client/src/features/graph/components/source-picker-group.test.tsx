import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import SourcePickerGroup from '@/features/graph/components/source-picker-group';
import type { PrefillSourceGroup } from '@/features/graph/types';

const group: PrefillSourceGroup = {
  label: 'Form A',
  sources: [
    { type: 'formField', label: 'Form A.email', key: 'A.email' },
    { type: 'formField', label: 'Form A.id', key: 'A.id' },
  ],
};

describe('SourcePickerGroup', () => {
  it('toggles open/closed and invokes onToggle', async () => {
    const onToggle = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <SourcePickerGroup
        group={group}
        isOpen={false}
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByTestId('group-toggle-form-a'));
    expect(onToggle).toHaveBeenCalledWith('Form A');
    expect(screen.queryByText('Form A.email')).toBeNull();
  });

  it('renders sources when open and calls onSelect', async () => {
    const onToggle = vi.fn();
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <SourcePickerGroup
        group={group}
        isOpen
        onToggle={onToggle}
        onSelect={onSelect}
      />,
    );

    const sourceButton = screen.getByTestId('group-source-form-a-A.email');
    await user.click(sourceButton);
    expect(onSelect).toHaveBeenCalledWith(group.sources[0]);
  });
});
