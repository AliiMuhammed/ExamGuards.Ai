import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./style/studentSingleCoures.css"
function LinkTab(props) {
  return <Tab component={NavLink} to={props.href} {...props} />;
}
const StudentSingleCourse = () => {
  const { id } = useParams();
  const { name } = useParams();
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
    } else {
      setValue(0); // Default to the first tab if no match is found
    }
  }, [location.pathname]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <section className="student-single-course-section">

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
            href={`/student/${name}/${id}/modules`}
          />
          <LinkTab
            className="course-tabs"
            label="Lectures"
            href={`/student/${name}/${id}/lectures`}
          />
          <LinkTab
            className="course-tabs"
            label="Assignments"
            href={`/student/${name}/${id}/assignments`}
          />
          <LinkTab
            className="course-tabs"
            label="Exams"
            href={`/student/${name}/${id}/exams`}
          />
        </Tabs>
      </div>
      <div className="course-content">
        <Outlet />
      </div>
    </section>
  );
};

export default StudentSingleCourse;
