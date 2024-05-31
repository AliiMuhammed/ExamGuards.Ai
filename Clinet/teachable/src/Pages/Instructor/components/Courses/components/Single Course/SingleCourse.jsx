import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import "./style/singleCourse.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function LinkTab(props) {
  return <Tab component={NavLink} to={props.href} {...props} />;
}

const SingleCourse = () => {
  const { id } = useParams();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    
    if (path.includes("/modules")) {
      setValue(0);
    } else if (path.includes("/lectures")) {
      setValue(1);
    } else if (path.includes("/assignments")) {
      setValue(2);
    } else if (path.includes("/exams")) {
      setValue(3);
    } else if (path.includes("/setGrades")) {
      setValue(4);
    } else {
      setValue(0); // Default to the first tab if no match is found
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section className="single-course-section">
      <div className="Tabs">
        <Tabs
          value={value}
          onChange={handleChange}
          className="course-tabs-container"
          variant="scrollable"
          scrollButtons={"auto"}
          aria-label="scrollable auto tabs example"
          allowScrollButtonsMobile
          role="navigation"
        >
          <LinkTab
            className="course-tabs"
            label="Modules"
            href={`/instructor/course/${id}/modules`}
          />
          <LinkTab
            className="course-tabs"
            label="Lectures"
            href={`/instructor/course/${id}/lectures`}
          />
          <LinkTab
            className="course-tabs"
            label="Assignments"
            href={`/instructor/course/${id}/assignments`}
          />
          <LinkTab
            className="course-tabs"
            label="Exams"
            href={`/instructor/course/${id}/exams`}
          />
          <LinkTab
            className="course-tabs"
            label="Set Grades"
            href={`/instructor/course/${id}/setGrades`}
          />
        </Tabs>
      </div>
      <div className="course-content">
        <Outlet />
      </div>
    </section>
  );
};

export default SingleCourse;
