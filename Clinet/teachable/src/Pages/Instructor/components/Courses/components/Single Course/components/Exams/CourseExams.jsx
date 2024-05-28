/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./style/courseExam.css";
import http from "./../../../../../../../../Helper/http";
import { useParams } from "react-router";
import examImg from "../../../../../../../../Assets/Images/Exams/exam-img.png";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";

const CourseExams = () => {
  const id = useParams().id;
  const [exams, setExams] = useState({
    loading: false,
    data: [],
    errorMsg: "",
  });
  // call all exams

  useEffect(() => {
    setExams({ ...exams, loading: true });
    http
      .GET(`/courses/${id}/exams`)
      .then((res) => {
        setExams({ ...exams, loading: false, data: res.data.data.data });
      })
      .catch((err) => {
        setExams({
          ...exams,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, []);

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <section className="course-exams-section">
      <div className="container">
        {/* handelErrors */}
        {exams.errorMsg !== "" && (
          <Alert severity="error">{exams.errorMsg}</Alert>
        )}
        {/* if no exams */}
        {exams.data.length === 0 &&
          exams.errorMsg === "" &&
          exams.loading === false && (
            <>
              <div className="header">
                <h3>Course Exams</h3>
                <button className="add-exam-btn main-btn sm">Add Exam</button>
              </div>
              <div className="no-exams">
                <span>No Exams</span>
                <HiOutlineArchiveBoxXMark />
              </div>
            </>
          )}
        {/* if loading and there is data*/}
        {exams.data.length > 0 &&
          exams.errorMsg === "" &&
          exams.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}

        {/* if loading and there is no data */}
        {exams.data.length === 0 &&
          exams.errorMsg === "" &&
          exams.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {/* if there is exams */}
        {exams.data.length > 0 &&
          exams.errorMsg === "" &&
          exams.loading === false && (
            <>
              <div className="header">
                <h3>Course Exams</h3>
                <button className="add-exam-btn main-btn sm">Add Exam</button>
              </div>
              <div className="exams-cards">
                {exams.data.map((exam) => (
                  <div className="exam-card" key={exam._id}>
                    <div className="exam-img">
                      <img src={examImg} alt="exam" />
                    </div>
                    <h3>
                      {exam.title}
                      <span>{formatDate(exam.createdAt)}</span>
                    </h3>
                    <p>
                      <span>Type:</span>
                      {exam.ExamType}
                    </p>
                    <p>
                      <span>Status:</span>
                      {exam.status}
                    </p>
                    <p>
                      <span>Visibility:</span>
                      {exam.visiable ? "Public" : "Private"}
                    </p>
                    <button className="delete-btn main-btn sm">
                      More Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </section>
  );
};

export default CourseExams;
