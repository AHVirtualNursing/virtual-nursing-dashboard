import React from "react";
import Conditions from "@/components/Conditions";

function RuleConfigs() {
  const conditions = [
    {title: "Measurement result"},
    {title: "Measurement % deviation"},
    {title: "Measurement by time of day"},
  ];
  const [allConditions, setAllConditions] = React.useState<string[]>([])

  function handleOnDrag(event: React.DragEvent, title: string) {
    event.dataTransfer.setData("title", title);
  }

  function handleDropOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent) {
    const title = event.dataTransfer.getData('title');
    setAllConditions([...allConditions, title]);
  }

  return (
    <div className="flex flex-col h-full gap-y-1">
      <h4 className="flex flex-start">Conditions</h4>
      <div
        id="rules-conditions"
        className="bg-white rounded-2xl h-1/2 flex shadow-lg "
      >
        <div className="w-1/4 text-center pt-2 flex flex-col">
          <h4 className={"p-2"}>
            Measurements
          </h4>
          <div className="bg-slate-200 text-center h-full overflow-y-scroll scrollbar">
            <ul>
              {conditions.map((condition, index) => (
                <div key={index} className="rounded-lg p-1 hover:cursor-grab" draggable
                     onDragStart={(e) => handleOnDrag(e, condition.title)}>
                  {condition.title}
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-3/4 p-2 overflow-y-scroll scrollbar" onDragOver={handleDropOver} onDrop={handleDrop}>
          <Conditions conditionsList={allConditions}/>
        </div>
      </div>
      <h4 className="flex flex-start">Actions</h4>
      <div
        id="rules-actions"
        className="bg-white rounded-2xl h-1/2 p-4 shadow-lg"
      ></div>
    </div>
  );
}

export default RuleConfigs;
