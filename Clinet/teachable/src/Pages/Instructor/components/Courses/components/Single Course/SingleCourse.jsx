import React, { useState } from "react";
import "./style/singleCourse.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CourseModules from "./components/Modules/CourseModules";
import CouresLec from "./components/Lectures/CouresLec";
import CourseAss from "./components/Assignments/CourseAss";
import CourseExams from "./components/Exams/CourseExams";
import SetGrades from "./components/Grades/SetGrades";
const SingleCourse = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <CourseModules />;
      case 1:
        return <CouresLec />;
      case 2:
        return <CourseAss />;
      case 3:
        return <CourseExams />;
      case 4:
        return <SetGrades />;
      default:
        return null;
    }
  };
  return (
    <section className="single-course-section">
      <div className="Tabs">
        <Tabs
          value={value}
          onChange={handleChange}
          className="course-tabs-contaienr"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          allowScrollButtonsMobile
        >
          <Tab label="Modules" className="course-tabs" />
          <Tab label="Lectures" className="course-tabs" />
          <Tab label="Assignments" className="course-tabs" />
          <Tab label="exams" className="course-tabs" />
          <Tab label="set grades" className="course-tabs" />
        </Tabs>
      </div>
      <div className="course-content">{renderTabContent()}</div>
    </section>
  );
};

export default SingleCourse;
