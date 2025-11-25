import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useDebouncedValue } from '@/lib/debounce';

describe('useDebouncedValue', () => {
  it('debounces updates by the specified delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'a', delay: 100 } },
    );

    expect(result.current).toBe('a');

    rerender({ value: 'ab', delay: 100 });
    expect(result.current).toBe('a'); // still old value during debounce

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('ab'); // updated after delay

    vi.useRealTimers();
  });

  it('cancels previous debounce when value changes before delay', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: 'x' } },
    );

    rerender({ value: 'y' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('x');
    rerender({ value: 'z' }); // change before first delay elapses

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('x');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('z');

    vi.useRealTimers();
  });
});
