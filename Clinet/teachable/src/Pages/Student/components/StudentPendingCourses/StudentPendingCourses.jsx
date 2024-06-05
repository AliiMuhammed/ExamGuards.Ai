import React, { useEffect, useState } from "react";
import http from "./../../../../Helper/http";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import "./style/studentPendingCourses.css";
const StudentPendingCourses = () => {
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
  console.log(myCourses.courses);

  return (
    <section className="studentPendingCourses-section">
      <div className="container">
        <div className="pendingCourses-header">
          <h1>My Pending Courses</h1>
        </div>
        {myCourses.errorMsg !== "" && (
          <Alert severity="error">{myCourses.errorMsg}</Alert>
        )}
        {/* if data is not empty and loading true */}
        {myCourses.courses.length !== 0 && myCourses.loading && (
          <CircularProgress
            sx={{
              margin: "auto",
              display: "block",
            }}
            size={60}
            color="inherit"
          />
        )}
        {/* if data is empty and loading  true*/}
        {myCourses.courses.length === 0 && myCourses.loading && (
          <CircularProgress
            sx={{
              margin: "auto",
              display: "block",
            }}
            size={60}
            color="inherit"
          />
        )}
        {/* if data empty and not loading */}
        {!myCourses.loading && myCourses.courses.length === 0 && (
          <div className="no-courses">
            <span>You are not registered for any course</span>
            <HiOutlineArchiveBoxXMark />
          </div>
        )}
        {/* if data is not empty and not loading */}
        {myCourses.courses.length !== 0 && !myCourses.loading && (
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
              <div className="pending-courses">
                {myCourses.courses.map((course) =>
                  !course.status ? (
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
                        <button disabled className="view-course">
                          Pending
                        </button>
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

export default StudentPendingCourses;
