/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Outlet } from "react-router-dom";
import "./style/singleExam.css";

const SingleExam = () => {
  return (
    <section className="single-exam-section">
      <Outlet />
    </section>
  );
};

export default SingleExam;
