import React from "react";
import { redelegateAlert } from "./api/alerts_api";

function Test() {
  const id = "6553aa198656cefcd9f717c0";
  const handleRedelegateClick = () => {
    redelegateAlert(id)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <button onClick={handleRedelegateClick}>Redelegate</button>
    </div>
  );
}

export default Test;
