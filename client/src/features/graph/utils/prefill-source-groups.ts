import type { PrefillSourceGroup, UpstreamData } from '@/features/graph/types';
import type { PrefillSource } from '@/types/domain/blueprint';

const globalGroups: PrefillSourceGroup[] = [
  {
    label: 'Action Properties',
    sources: [
      { type: 'global', label: 'action.status', key: 'action.status' },
      { type: 'global', label: 'action.id', key: 'action.id' },
    ],
  },
  {
    label: 'Client Organisation Properties',
    sources: [
      { type: 'global', label: 'clientOrg.name', key: 'clientOrg.name' },
      { type: 'global', label: 'clientOrg.id', key: 'clientOrg.id' },
    ],
  },
];

export const buildPrefillSourceGroups = (
  upstreamData: UpstreamData[],
): PrefillSourceGroup[] => {
  const formGroups: PrefillSourceGroup[] = upstreamData.map(
    (upstreamEntry) => ({
      label: upstreamEntry.node.data.name,
      sources: Object.keys(
        upstreamEntry.form.fieldSchema.properties ?? {},
      ).map<PrefillSource>((fieldKey) => ({
        type: 'formField',
        label: `${upstreamEntry.node.data.name}.${fieldKey}`,
        key: `${upstreamEntry.node.id}.${fieldKey}`,
      })),
    }),
  );

  return [...globalGroups, ...formGroups];
};
