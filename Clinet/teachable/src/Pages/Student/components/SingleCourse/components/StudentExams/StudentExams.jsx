import React from "react";
import "./style/studentExam.css";
import { Outlet } from "react-router";
const StudentExams = () => {
  return (
    <section className="studentExam-section">
      <div className="contatiner">
        <Outlet />
      </div>
    </section>
  );
};

export default StudentExams;
