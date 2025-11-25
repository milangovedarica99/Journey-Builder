import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import SearchInput from '@/components/inputs/search-input';

describe('SearchInput', () => {
  it('renders and calls onChange with typed value', async () => {
    const onChange = vi.fn((val: string) => val);
    const user = userEvent.setup();

    const Wrapper = () => {
      const [value, setValue] = useState('');
      return (
        <SearchInput
          value={value}
          placeholder="Search things"
          onChange={(val) => {
            setValue(val);
            onChange(val);
          }}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByTestId('search-input');
    await user.type(input, 'abc');

    expect(onChange).toHaveBeenLastCalledWith('abc');
  });
});
