/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import "./style/allExams.css";
import { useParams } from "react-router";
import examImg from "../../../../../../../../../../Assets/Images/Exams/exam-img.png";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { Link } from "react-router-dom";
import http from "../../../../../../../../../../Helper/http";

const AllExams = () => {
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
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
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
                <Link
                  to={"/instructor/course/" + id + "/exams/add"}
                  className="add-exam-btn main-btn sm"
                >
                  Add Exam
                </Link>
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
                <Link
                  to={"/instructor/course/" + id + "/exams/add"}
                  className="add-exam-btn main-btn sm"
                >
                  Add Exam
                </Link>
              </div>
              <div className="exams-cards">
                {exams.data.map((exam) => (
                  <div className="exam-card" key={exam._id}>
                    <div className="exam-img">
                      <img src={examImg} loading="lazy" alt="exam" />
                    </div>
                    <h2>{exam.title}</h2>
                    <p>
                      <span>Type:</span>
                      {exam.ExamType}
                    </p>
                    <p>
                      <span>Duration:</span>
                      {exam.duration} minutes
                    </p>
                    <p>
                      <span>Created At:</span>
                      {formatDate(exam.createdAt)}
                    </p>
                    <p>
                      <span>Status:</span>
                      {exam.status}
                    </p>
                    <p>
                      <span>Visibility:</span>
                      {exam.visiable ? "Public" : "Private"}
                    </p>
                    <Link
                      to={"/instructor/course/" + id + "/exams/" + exam._id}
                      className="delete-btn main-btn sm"
                    >
                      More Details
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </section>
  );
};

export default AllExams;
