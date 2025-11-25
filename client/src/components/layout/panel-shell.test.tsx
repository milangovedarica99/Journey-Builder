import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PanelShell from '@/components/layout/panel-shell';

describe('PanelShell', () => {
  it('renders side placement with header/body/footer', () => {
    const { container, getByText } = render(
      <PanelShell
        placement="side"
        title="Title"
        subtitle="Subtitle"
        actions={<div>Action</div>}
      >
        <div>Body</div>
      </PanelShell>,
    );

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('w-80');
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Subtitle')).toBeTruthy();
    expect(getByText('Body')).toBeTruthy();
    expect(getByText('Action')).toBeTruthy();
  });

  it('renders bottom placement classes', () => {
    const { container } = render(
      <PanelShell placement="bottom">Body</PanelShell>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('max-h-[40vh]');
  });
});
