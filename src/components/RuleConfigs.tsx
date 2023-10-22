import {closestCenter, closestCorners, DndContext, DragEndEvent, DragOverEvent} from "@dnd-kit/core";
import React from "react";
import ConditionsDroppable from "@/components/ConditionsDroppable";
import ConditionDraggable from "@/components/ConditionDraggable";

function RuleConfigs() {
  const conditions = [
    {title: "Measurement result"},
    {title: "Measurement % deviation"},
    {title: "Measurement by time of day"},
    {title: "Survey result level"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},
    {title: "Survey result score"},


  ];
  const [allConditions, setAllConditions] = React.useState<string[]>([])

  const addConditionsToRules = (event: DragEndEvent) => {
    console.log(event)
    const newCondition = event.active.data.current?.title;
    if (event.over) {
      const temp = [...allConditions];
      temp.push(newCondition);
      setAllConditions(temp);
    }
  }

  return (
    <div className="flex flex-col h-full gap-y-1">
      <h4 className="flex flex-start">Conditions</h4>
      <DndContext onDragEnd={addConditionsToRules}>
        <div
          id="rules-conditions"
          className="bg-white rounded-2xl h-1/2 flex shadow-lg "
        >
          <div className="w-1/4 text-center pt-2 flex flex-col">
            <h4 className={"p-2"}>
              Measurements
            </h4>
            <div className="bg-slate-200 text-center h-full overflow-auto scrollbar">
              <ul>
                {conditions.map((condition, index) => (
                  <ConditionDraggable key={condition.title}>
                    <div key={index} className="rounded-lg p-1">
                      {condition.title}
                    </div>
                  </ConditionDraggable>
                ))}
              </ul>
            </div>

          </div>

          <div className="w-3/4">
            <ConditionsDroppable conditions={allConditions}/>
          </div>
        </div>
      </DndContext>
      <h4 className="flex flex-start">Actions</h4>
      <div
        id="rules-actions"
        className="bg-white rounded-2xl h-1/2 p-4 shadow-lg"
      ></div>
    </div>
  );
}

export default RuleConfigs;
