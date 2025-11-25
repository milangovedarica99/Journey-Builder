export type PrefillSourceType = 'formField' | 'global' | 'custom';

export interface PrefillSource {
  type: PrefillSourceType;
  label: string;
  key: string;
}

export interface PrefillFieldMapping {
  fieldKey: string;
  source: PrefillSource;
}

export interface PrefillMapping {
  [key: string]: PrefillFieldMapping | undefined;
}

export interface ActionBlueprintGraph {
  schema: string;
  id: string;
  tenantId: string;
  name: string;
  description: string;
  category: string;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
  forms: BlueprintForm[];
  branches: Branch[];
  triggers: Trigger[];
}

export interface BlueprintNode {
  id: string;
  type: 'form' | string;
  position: Position;
  data: BlueprintNodeData;
}

export interface Position {
  x: number;
  y: number;
}

export interface BlueprintNodeData {
  id: string;
  componentKey: string;
  componentType: 'form' | string;
  componentId: string;
  name: string;
  prerequisites: string[];
  permittedRoles: string[];
  inputMapping?: PrefillMapping;
  slaDuration: SlaDuration;
  approvalRequired: boolean;
  approvalRoles: string[];
}

export interface SlaDuration {
  number: number;
  unit: 'minutes' | 'hours' | 'days' | string;
}

export interface BlueprintEdge {
  source: string;
  target: string;
}

export interface BlueprintForm {
  id: string;
  name: string;
  description: string;
  isReusable: boolean;
  fieldSchema: FieldSchema;
  uiSchema: UiSchema;
  dynamicFieldConfig: DynamicFieldConfig;
}

export interface FieldSchema {
  type: 'object';
  properties: Record<string, FieldProperty>;
  required?: string[];
}

export type AvantosFieldType =
  | 'button'
  | 'checkbox-group'
  | 'object-enum'
  | 'short-text'
  | 'multi-select'
  | 'multi-line-text';

export interface FieldProperty {
  avantosType: AvantosFieldType;
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

export interface UiSchema {
  type: string;
  elements: UiSchemaElement[];
}

export type UiSchemaElement = UiControlElement | UiButtonElement;

export interface UiBaseElement {
  type: string;
  scope: string;
  label?: string;
}

export interface UiControlElement extends UiBaseElement {
  type: 'Control';
  options?: {
    format?: string;
    [key: string]: unknown;
  };
}

export interface UiButtonElement extends UiBaseElement {
  type: 'Button';
}

export interface DynamicFieldConfig {
  [fieldKey: string]: DynamicFieldConfigEntry;
}

export interface DynamicFieldConfigEntry {
  selectorField: string;
  payloadFields: Record<string, DynamicPayloadField>;
  endpointId: string;
}

export interface DynamicPayloadField {
  type: 'form_field' | string;
  value: string;
}

export interface Branch {
  [key: string]: unknown;
}
export interface Trigger {
  [key: string]: unknown;
}
