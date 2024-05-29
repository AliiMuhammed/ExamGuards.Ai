import React, { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import "./style/singleCourse.css";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function LinkTab(props) {
  return <Tab component={NavLink} to={props.href} {...props} />;
}

const SingleCourse = () => {
  const { id } = useParams();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section className="single-course-section">
      <div className="Tabs">
        <Box>
          <Tabs
            centered
            value={value}
            onChange={handleChange}
            className="course-tabs-container"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            allowScrollButtonsMobile
            role="navigation"
            c
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
        </Box>
      </div>
      <div className="course-content">
        <Outlet />
      </div>
    </section>
  );
};

export default SingleCourse;
