import React from 'react';
import {useDroppable} from "@dnd-kit/core";

type ConditionsDroppableProps = {
  conditions: string[];
}

const ConditionsDroppable = ({conditions}: ConditionsDroppableProps) => {
  const {setNodeRef, isOver} = useDroppable({
    id: "conditions-droppable"
  });
  const style = {color: isOver ? 'green' : undefined}
  return (
    <ul ref={setNodeRef} style={style} className=" h-1/2">
      {conditions.map((condition, index) => (
        <div key={index}>
          {condition}
        </div>
      ))}
    </ul>
  )

}

export default ConditionsDroppable;