import React from "react";
import "../Style/backdrop.css";
import CircularProgress from "@mui/material/CircularProgress";

const Backdrop = () => {
  return (
    <div className="backdrop">
      <CircularProgress size={80} color="white" />
    </div>
  );
};

export default Backdrop;
