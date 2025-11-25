import { useMemo } from 'react';

import PanelShell from '@/components/layout/panel-shell';
import PrefillMappingRow from '@/features/graph/components/prefill-mapping-row';
import type { SelectedBlueprintDetails } from '@/features/graph/types';
import type { PrefillMapping } from '@/types/domain/blueprint';

interface PrefillDockProps {
  setModalFieldKey: (fieldKey: string | null) => void;
  selectedBlueprintDetails: SelectedBlueprintDetails;
  onPrefillChange: (nodeId: string, mapping: PrefillMapping) => void;
}

const PrefillDock = ({
  setModalFieldKey,
  selectedBlueprintDetails,
  onPrefillChange,
}: PrefillDockProps) => {
  const fields = useMemo(
    () =>
      Object.keys(selectedBlueprintDetails.form.fieldSchema.properties ?? {}),
    [selectedBlueprintDetails.form.fieldSchema.properties],
  );

  const handleClear = (fieldKey: string) => {
    const currentMapping =
      selectedBlueprintDetails.node.data.inputMapping ?? {};
    const { [fieldKey]: _removed, ...nextMapping } = currentMapping;

    onPrefillChange(selectedBlueprintDetails.node.id, nextMapping);
  };

  const handleSelectEmpty = (fieldKey: string) => {
    setModalFieldKey(fieldKey);
  };

  return (
    <PanelShell
      placement="bottom"
      title="Prefill"
      subtitle={`Prefill fields for ${selectedBlueprintDetails.form.name}`}
      data-testid="prefill-dock"
    >
      <div className="flex flex-col gap-2">
        {fields.map((fieldKey) => (
          <PrefillMappingRow
            key={fieldKey}
            fieldKey={fieldKey}
            mapping={
              (selectedBlueprintDetails.node.data.inputMapping ?? {})[fieldKey]
            }
            onSelectEmpty={handleSelectEmpty}
            onClear={handleClear}
          />
        ))}
      </div>
    </PanelShell>
  );
};

export default PrefillDock;
