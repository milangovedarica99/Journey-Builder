import { useEffect, useMemo, useState } from 'react';

import SearchInput from '@/components/inputs/search-input';
import PanelShell from '@/components/layout/panel-shell';
import SourcePickerGroup from '@/features/graph/components/source-picker-group';
import type {
  PrefillSourceGroup,
  SelectedBlueprintDetails,
} from '@/features/graph/types';
import { buildPrefillSourceGroups } from '@/features/graph/utils/prefill-source-groups';
import { useDebouncedValue } from '@/lib/debounce';
import type { PrefillMapping, PrefillSource } from '@/types/domain/blueprint';

type SourcePickerPanelProps = {
  fieldKey: string;
  setModalFieldKey: (fieldKey: string | null) => void;
  selectedBlueprintDetails: SelectedBlueprintDetails;
  onPrefillChange: (nodeId: string, mapping: PrefillMapping) => void;
  onClose: () => void;
};

const SourcePickerPanel = ({
  fieldKey,
  onClose,
  selectedBlueprintDetails,
  setModalFieldKey,
  onPrefillChange,
}: SourcePickerPanelProps) => {
  const sourceGroups = useMemo<PrefillSourceGroup[]>(() => {
    return buildPrefillSourceGroups(selectedBlueprintDetails.upstreamData);
  }, [selectedBlueprintDetails.upstreamData]);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 200);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const filteredGroups = useMemo(
    () =>
      sourceGroups.filter((group) =>
        group.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, sourceGroups],
  );

  useEffect(() => {
    const allowed = new Set(filteredGroups.map((g) => g.label));
    setOpenGroups((prev) => {
      const next = new Set<string>();
      prev.forEach((label) => {
        if (allowed.has(label)) next.add(label);
      });
      return next;
    });
  }, [filteredGroups]);

  const toggleGroup = (label: string) => {
    const next = new Set(openGroups);
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }

    setOpenGroups(next);
  };

  const onSelect = (source: PrefillSource) => {
    if (!fieldKey) return;
    const currentMapping =
      selectedBlueprintDetails.node.data.inputMapping ?? {};
    const nextMapping: PrefillMapping = {
      ...currentMapping,
      [fieldKey]: { fieldKey, source },
    };

    onPrefillChange(selectedBlueprintDetails.node.id, nextMapping);
    setModalFieldKey(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <PanelShell
        placement="side"
        title="Select data element to map"
        subtitle={`Field: ${fieldKey}`}
        actions={
          <button
            className="rounded-full bg-journey-builder-light-blue px-2 py-1 text-xs text-white"
            onClick={onClose}
          >
            Close
          </button>
        }
        data-testid="source-picker-panel"
      >
        <div className="mb-3">
          <SearchInput value={search} onChange={setSearch} />
        </div>
        <div className="text-sm">
          <p className="font-semibold">Available Data</p>
          <ul className="mt-2 flex flex-col gap-2">
            {filteredGroups.map((group) => (
              <SourcePickerGroup
                key={group.label}
                group={group}
                isOpen={openGroups.has(group.label)}
                onToggle={toggleGroup}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </div>
      </PanelShell>
      <div className="flex-1 bg-black/30" onClick={onClose} />
    </div>
  );
};

export default SourcePickerPanel;
