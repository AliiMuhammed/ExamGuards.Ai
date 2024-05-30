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
  const [value, setValue] = useState(0);
  const location = useLocation();
  const [lastWord, setLastWord] = useState("");

  useEffect(() => {
    const path = location.pathname;
    const parts = path.split("/");
    const lastPart = parts[parts.length - 1];
    setLastWord(lastPart);
  }, [location.pathname]);

  useEffect(() => {
    switch (lastWord) {
      case "modules":
        setValue(0);
        break;
      case "lectures":
        setValue(1);
        break;
      case "assignments":
        setValue(2);
        break;
      case "exams":
        setValue(3);
        break;
      case "add":
        setValue(3);
        break;
      case "setGrades":
        setValue(4);
        break;
      default:
        setValue(0); // Default to the first tab if the last word doesn't match any case
        break;
    }
  }, [lastWord]);

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
