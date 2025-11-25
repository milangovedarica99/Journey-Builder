import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PrefillMappingRow from '@/features/graph/components/prefill-mapping-row';
import type { PrefillFieldMapping } from '@/types/domain/blueprint';

const mapped: PrefillFieldMapping = {
  fieldKey: 'email',
  source: { type: 'formField', label: 'Form A.email', key: 'A.email' },
};

describe('PrefillMappingRow', () => {
  it('renders unmapped state and calls onSelectEmpty when clicked', async () => {
    const onSelectEmpty = vi.fn();
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(
      <PrefillMappingRow
        fieldKey="email"
        onSelectEmpty={onSelectEmpty}
        onClear={onClear}
      />,
    );

    const button = screen.getByTestId('prefill-row-email');
    expect(button).toBeTruthy();
    await user.click(button);
    expect(onSelectEmpty).toHaveBeenCalledWith('email');
    expect(onClear).not.toHaveBeenCalled();
  });

  it('renders mapped state and calls onClear when clicked', async () => {
    const onSelectEmpty = vi.fn();
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(
      <PrefillMappingRow
        fieldKey="email"
        mapping={mapped}
        onSelectEmpty={onSelectEmpty}
        onClear={onClear}
      />,
    );

    const button = screen.getByTestId('prefill-row-email');
    expect(button).toBeTruthy();
    await user.click(button);
    expect(onClear).toHaveBeenCalledWith('email');
    expect(onSelectEmpty).not.toHaveBeenCalled();
  });
});
