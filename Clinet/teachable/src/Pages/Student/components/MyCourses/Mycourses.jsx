import React, { useEffect, useState } from "react";
import "./style/myCourses.css";
import { Link } from "react-router-dom";
import http from "./../../../../Helper/http";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";

const Mycourses = () => {
  const [myCourses, setMyCourses] = useState({
    courses: [],
    loading: false,
    errorMsg: "",
  });

  useEffect(() => {
    setMyCourses({ ...myCourses, loading: true });
    http
      .GET(`courses/coursesPerStudent`)
      .then((res) => {
        setMyCourses({
          courses: res.data.data.courses,
          loading: false,
          errorMsg: "",
        });
      })
      .catch((err) => {
        setMyCourses({
          courses: [],
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, []);

  const allCoursesInactive = myCourses.courses.every(
    (course) => !course.status
  );

  return (
    <section className="mycourses-section">
      <div className="container">
        <div className="mycourses-header">
          <h1>My Courses</h1>
          <Link to={"/student/pending"} className="main-btn sm">
            Pending Courses
          </Link>
        </div>
        {myCourses.errorMsg !== "" && (
          <Alert severity="error">{myCourses.errorMsg}</Alert>
        )}
        {myCourses.loading && (
          <CircularProgress
            sx={{
              margin: "auto",
              display: "block",
            }}
            size={60}
            color="inherit"
          />
        )}
        {!myCourses.loading && (
          <div className="courses-content">
            {allCoursesInactive ? (
              <div className="no-courses">
                <span>
                  You are not registered for any course or there is some courses
                  are pending
                </span>
                <HiOutlineArchiveBoxXMark />
              </div>
            ) : (
              <div className="my-courses">
                {myCourses.courses.map((course) =>
                  course.status ? (
                    <div className="one-course" key={course._id}>
                      <div
                        style={{ backgroundImage: `url(${course.file})` }}
                        className="course-img"
                      ></div>
                      <div className="body">
                        <h3>{course.name}</h3>
                        <p>
                          {course.description.length > 90
                            ? `${course.description.slice(0, 90)}...`
                            : course.description}
                        </p>
                        <div className="name-and-duration">
                          <div className="name">Instructor: Ali Muhammed</div>
                          <div className="duration">45hr</div>
                        </div>
                        <Link
                          to={`/student/${course.name}/${course._id}`}
                          className="view-course"
                        >
                          Show
                        </Link>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Mycourses;
