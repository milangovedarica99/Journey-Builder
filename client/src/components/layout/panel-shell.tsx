import type { ReactNode } from 'react';

type PanelPlacement = 'side' | 'bottom';

interface PanelShellProps {
  placement?: PanelPlacement;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  'data-testid'?: string;
}

const containerClasses: Record<PanelPlacement, string> = {
  side: 'h-full w-80 bg-white border-r border-gray-400 shadow-xl flex flex-col',
  bottom:
    'fixed inset-x-0 bottom-0 z-30 max-h-[40vh] w-full bg-white border-t shadow-xl flex flex-col',
};

const PanelShell = ({
  placement = 'side',
  title,
  subtitle,
  actions,
  children,
  'data-testid': dataTestId,
}: PanelShellProps) => {
  return (
    <div className={containerClasses[placement]} data-testid={dataTestId}>
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col">
            {title ? (
              <h2 className="text-base font-semibold">{title}</h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm text-gray-600">{subtitle}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : null}
        </div>
      )}

      <div className="flex-1 overflow-auto px-4 py-3">{children}</div>
    </div>
  );
};

export default PanelShell;
