import { clsx } from 'clsx';

import { DatabaseIcon } from '@/assets';
import type { PrefillFieldMapping } from '@/types/domain/blueprint';

type PrefillMappingRowProps = {
  fieldKey: string;
  mapping?: PrefillFieldMapping;
  onSelectEmpty: (fieldKey: string) => void;
  onClear: (fieldKey: string) => void;
};

const PrefillMappingRow = ({
  fieldKey,
  mapping,
  onSelectEmpty,
  onClear,
}: PrefillMappingRowProps) => {
  const handleClick = () =>
    mapping ? onClear(fieldKey) : onSelectEmpty(fieldKey);

  return (
    <button
      type="button"
      data-testid={`prefill-row-${fieldKey}`}
      className={clsx(
        'flex w-full items-center text-left text-gray-600 transition',
        mapping
          ? 'justify-between gap-3 rounded-full bg-gray-200 px-4 py-2'
          : 'gap-3 rounded-md border border-dashed border-gray-400 bg-gray-200 px-4 py-3 hover:border-journey-builder-light-blue hover:bg-gray-100',
      )}
      onClick={handleClick}
      aria-label={
        mapping
          ? `Clear prefill for ${fieldKey}`
          : `Select prefill for ${fieldKey}`
      }
    >
      {mapping ? (
        <>
          <span className="text-sm font-medium">
            {fieldKey}: {mapping.source.label}
          </span>
          <span className="flex size-6 items-center justify-center rounded-full bg-gray-400 text-sm text-gray-200">
            ✕
          </span>
        </>
      ) : (
        <>
          <DatabaseIcon className="size-7" />
          <span className="font-medium">{fieldKey}</span>
        </>
      )}
    </button>
  );
};

export default PrefillMappingRow;
