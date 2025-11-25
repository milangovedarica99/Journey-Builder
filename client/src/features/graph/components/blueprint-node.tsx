import { memo } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';

import { FormIcon } from '@/assets';
import { NodeTypes } from '@/features/graph/enums';
import type { LayoutNodeData } from '@/features/graph/types';

export const BlueprintNode = memo((props: NodeProps<LayoutNodeData>) => {
  return (
    <div className="flex w-40 cursor-pointer gap-1 rounded-lg border bg-white p-1.5">
      <div className="rounded-md bg-journey-builder-light-blue p-2.5">
        <FormIcon className="size-3.5" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] text-gray-400">Form</p>
        <p className="text-xs">{props.data.label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="-right-1 border border-gray-400 bg-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="-left-1 border border-gray-400 bg-white"
      />
    </div>
  );
});

BlueprintNode.displayName = NodeTypes.Blueprint;
