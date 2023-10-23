import React from "react";

type ConditionsProps = {
  conditionsList: string[];
}

function Conditions({conditionsList}: ConditionsProps) {
  return (
    <ul>
      {
        conditionsList.map((item, index) => (
          <div key={index} className="bg-amber-100 p-2 rounded-lg shadow-lg">{item}</div>
        ))
      }
    </ul>
  )
}

export default Conditions;