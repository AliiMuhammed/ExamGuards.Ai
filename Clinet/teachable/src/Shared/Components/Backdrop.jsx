import React from "react";
import "../Style/backdrop.css";
import { PacmanLoader } from "react-spinners";
const Backdrop = () => {
  return (
    <div className="backdrop">
      <PacmanLoader color="#20ad96" loading size={30} speedMultiplier={1} />{" "}
    </div>
  );
};

export default Backdrop;
