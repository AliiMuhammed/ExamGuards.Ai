import React, { useEffect, useState } from "react";
import http from "../../../../Helper/http";
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
        console.log("Fetched courses:", res.data.data.courses); // Debug log for fetched data
      })
      .catch((err) => {
        setMyCourses({
          courses: [],
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, []);

  // Check if all courses are inactive
  const allCoursesInactive = myCourses.courses.some(
    (course) => !course.status
  );
  console.log("All courses inactive:", allCoursesInactive); // Debug log for allCoursesInactive

  return (
    <section className="studentPendingCourses-section">
      <div className="container">
        <div className="pendingCourses-header">
          <h1>My Pending Courses</h1>
        </div>
        
        {myCourses.errorMsg && (
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

        {!myCourses.loading && myCourses.courses.length === 0 && (
          <div className="no-courses">
            <span>You are not registered for any course</span>
            <HiOutlineArchiveBoxXMark />
          </div>
        )}

        {!myCourses.loading && myCourses.courses.length > 0 && (
          <div className="courses-content">
            {!allCoursesInactive ? (
              <div className="no-courses">
                <span>
                  You are not registered for any course or there are some courses pending
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
                          {course.instructors.length > 0 && (
                            <div className="name">
                              {course.instructors.length > 1
                                ? "Instructors: "
                                : "Instructor: "}
                              {course.instructors.map((instructor) => (
                                <span key={instructor._id}>
                                  {instructor.firstName +
                                    " " +
                                    instructor.lastName}
                                  ,
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="duration">{course.duration} hr</div>
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
