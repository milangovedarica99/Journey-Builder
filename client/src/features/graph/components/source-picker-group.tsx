import type { PrefillSourceGroup } from '@/features/graph/types';
import type { PrefillSource } from '@/types/domain/blueprint';

type SourcePickerGroupProps = {
  group: PrefillSourceGroup;
  isOpen: boolean;
  onToggle: (label: string) => void;
  onSelect: (source: PrefillSource) => void;
};

const SourcePickerGroup = ({
  group,
  isOpen,
  onToggle,
  onSelect,
}: SourcePickerGroupProps) => {
  const groupId = group.label.replace(/\s+/g, '-').toLowerCase();

  return (
    <li>
      <button
        type="button"
        data-testid={`group-toggle-${groupId}`}
        className="flex w-full items-center gap-2 rounded p-1 text-left font-semibold hover:bg-gray-200"
        onClick={() => onToggle(group.label)}
      >
        <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          &gt;
        </span>
        <span className="flex-1">{group.label}</span>
      </button>
      {isOpen && (
        <ul className="ml-5 mt-1 flex flex-col gap-1 font-semibold">
          {group.sources.map((source) => (
            <li key={source.key}>
              <button
                type="button"
                data-testid={`group-source-${groupId}-${source.key}`}
                className="w-full rounded px-1 py-0.5 text-left hover:bg-gray-200 hover:text-gray-900"
                onClick={() => onSelect(source)}
              >
                {source.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SourcePickerGroup;
