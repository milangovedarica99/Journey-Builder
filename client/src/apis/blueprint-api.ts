import apiClient from '@/apis/api';
import { toCamelCaseDeep } from '@/lib/casing';
import type { ActionBlueprintGraphResponse } from '@/types/api/blueprint';
import type { ActionBlueprintGraph } from '@/types/domain/blueprint';

export const getActionBlueprintGraph = async (
  tenantId: number,
  actionBlueprintId: string,
): Promise<ActionBlueprintGraph> => {
  const response = await apiClient.get<ActionBlueprintGraphResponse>(
    `/${tenantId}/actions/blueprints/${actionBlueprintId}/graph/`,
  );
  return toCamelCaseDeep<ActionBlueprintGraph>(response.data);
};
