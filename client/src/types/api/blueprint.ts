export interface ActionBlueprintGraphRequest {
  tenantId: number;
  actionBlueprintId: string;
}

export interface ActionBlueprintGraphResponse {
  $schema: string;
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: BlueprintNodeResponse[];
  edges: BlueprintEdgeResponse[];
  forms: BlueprintFormResponse[];
  branches: BranchResponse[];
  triggers: TriggerResponse[];
}

export interface BlueprintNodeResponse {
  id: string;
  type: 'form' | string;
  position: PositionResponse;
  data: BlueprintNodeDataResponse;
}

export interface PositionResponse {
  x: number;
  y: number;
}

export interface BlueprintNodeDataResponse {
  id: string;
  component_key: string;
  component_type: 'form' | string;
  component_id: string;
  name: string;
  prerequisites: string[];
  permitted_roles: string[];
  input_mapping: PrefillMappingResponse;
  sla_duration: SlaDurationResponse;
  approval_required: boolean;
  approval_roles: string[];
}

export interface SlaDurationResponse {
  number: number;
  unit: 'minutes' | 'hours' | 'days' | string;
}

export interface BlueprintEdgeResponse {
  source: string;
  target: string;
}

export interface BlueprintFormResponse {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: FieldSchemaResponse;
  ui_schema: UiSchemaResponse;
  dynamic_field_config: DynamicFieldConfigResponse;
}

export interface FieldSchemaResponse {
  type: 'object';
  properties: Record<string, FieldPropertyResponse>;
  required?: string[];
}

export type AvantosFieldTypeResponse =
  | 'button'
  | 'checkbox-group'
  | 'object-enum'
  | 'short-text'
  | 'multi-select'
  | 'multi-line-text';

export interface FieldPropertyResponse {
  avantos_type: AvantosFieldTypeResponse;
  title: string;
  type: string;
  format?: string;
  items?: {
    enum: string[];
    type: string;
  };
  enum?: string[] | null;
  uniqueItems?: boolean;
}

export interface UiSchemaResponse {
  type: string;
  elements: UiSchemaElementResponse[];
}

export type UiSchemaElementResponse =
  | UiControlElementResponse
  | UiButtonElementResponse;

export interface UiBaseElementResponse {
  type: string;
  scope: string;
  label?: string;
}

export interface UiControlElementResponse extends UiBaseElementResponse {
  type: 'Control';
  options?: {
    format?: string;
    [key: string]: unknown;
  };
}

export interface UiButtonElementResponse extends UiBaseElementResponse {
  type: 'Button';
}

export interface DynamicFieldConfigResponse {
  [fieldKey: string]: DynamicFieldConfigEntryResponse;
}

export interface DynamicFieldConfigEntryResponse {
  selector_field: string;
  payload_fields: Record<string, DynamicPayloadFieldResponse>;
  endpoint_id: string;
}

export interface DynamicPayloadFieldResponse {
  type: 'form_field' | string;
  value: string;
}

export interface BranchResponse {
  [key: string]: unknown;
}
export interface TriggerResponse {
  [key: string]: unknown;
}

export type PrefillSourceTypeResponse = 'formField' | 'global' | 'custom';

export interface PrefillSourceResponse {
  type: PrefillSourceTypeResponse;
  label: string;
  ref: string;
}

export interface PrefillFieldMappingResponse {
  fieldKey: string;
  source: PrefillSourceResponse;
}

export interface PrefillMappingResponse {
  [key: string]: PrefillFieldMappingResponse | undefined;
}
