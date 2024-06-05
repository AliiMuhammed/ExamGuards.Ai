/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./style/allcourses.css";
import Alert from "@mui/material/Alert";
import http from "./../../../../Helper/http";
import CircularProgress from "@mui/material/CircularProgress";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";
import { useSelector } from "react-redux";
import { triggerRefresh } from "../../../../Redux/Slices/refreshSlice";

const Allcourses = () => {
  const refresh = useSelector((state) => state.refresh);

  const dispatch = useDispatch();
  const [courses, setCourses] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });

  useEffect(() => {
    setCourses({ ...courses, loading: true, data: [] });
    http
      .GET(`courses/coursesForStudent`)
      .then((res) => {
        console.log(res);
        setCourses({
          ...courses,
          loading: false,
          data: res.data.data.courses,
          errorMsg: "",
        });
      })
      .catch((err) => {
        setCourses({
          ...courses,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [refresh]);

  const handleRegisterCourse = (CourseId) => {
    setCourses({ ...courses, loading: true });
    http
      .POST(`courses/register/${CourseId}`)
      .then((res) => {
        setCourses({ ...courses, loading: false });
        dispatch(
          openToast({
            msg: "Course registered successfully",
            type: "success",
          })
        );
        dispatch(triggerRefresh());
      })
      .catch((err) => {
        setCourses({
          ...courses,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  };
  return (
    <section className="allcourses-section">
      <div className="container">
        <div className="header">
          <h1>All Courses</h1>
        </div>
        {/* handelErrors */}
        {courses.errorMsg !== "" && (
          <Alert severity="error">{courses.errorMsg}</Alert>
        )}
        {/* if data is not empty and loading true */}
        {courses.data.length !== 0 && courses.loading && (
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
        {courses.data.length === 0 && courses.loading && (
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
        {!courses.loading && courses.data.length === 0 && (
          <div className="no-courses">
            <span>No courses available now you can register to</span>
            <HiOutlineArchiveBoxXMark />
          </div>
        )}
        {/* if data is not empty and not loading */}
        {courses.data.length !== 0 && !courses.loading && (
          <div className="courses-content">
            <div className="all-courses">
              {courses.data.map((course) => (
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

                    <button
                      onClick={() => {
                        handleRegisterCourse(course._id);
                      }}
                      className="view-course"
                    >
                      Register
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Allcourses;
