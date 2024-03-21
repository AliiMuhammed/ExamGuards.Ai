import React from "react";
import "../Style/mainSpinner.css";
const MainSpinner = ({ className }) => {
  return (
    <div className="centerd-spinner">
      <div className={`MainSpinner ${className}`}></div>
    </div>
  );
};

export default MainSpinner;
