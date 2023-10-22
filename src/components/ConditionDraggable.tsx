import {useDraggable} from "@dnd-kit/core";
import {CSS} from '@dnd-kit/utilities';

type ConditionDraggableProps = {
  children: any;
}

function ConditionDraggable(props: ConditionDraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.children,
    data: {
      title: props.children
    }
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  )
}

export default ConditionDraggable;