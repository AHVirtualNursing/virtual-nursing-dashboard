import React, {useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';

type ConditionsProps = {
  conditionsList: string[];
}

function Conditions({conditionsList}: ConditionsProps) {
  const [conditions, setConditions] = useState<string[]>(conditionsList);

  function handleDelete(index: number) {
    
  }

  return (
    <ul className="space-y-2">
      {conditions.map((item, index) => (
        <div key={index} className="bg-amber-100 p-2 rounded-lg shadow-lg flex justify-between">
          {item}
          <DeleteIcon fontSize={'small'} onClick={() => handleDelete(index)}/>
        </div>
      ))}
    </ul>
  )
}

export default Conditions;