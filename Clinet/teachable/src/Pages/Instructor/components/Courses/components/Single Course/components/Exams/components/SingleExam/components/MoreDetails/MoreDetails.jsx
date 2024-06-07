/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import http from "../../../../../../../../../../../../Helper/http";
import { useParams } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import "./style/moreDetails.css";
import { RiBook2Line } from "react-icons/ri";
import {
  BsPersonCheck,
  BsPersonExclamation,
  BsPersonX,
  BsPerson,
  BsQuestionLg,
} from "react-icons/bs";
import { IoFlagOutline } from "react-icons/io5";
import MainTable from "./Components/MainTable";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MoreDetails = () => {
  const refresh = useSelector((state) => state.refresh);

  const { Examid } = useParams();
  const { id } = useParams();
  const [examInfo, setExamInfo] = useState({
    data: null,
    loading: true,
    errorMsg: "",
  });
  const [students, setStudents] = useState({
    data: null,
    loading: true,
    errorMsg: "",
  });
  const [exam, setExam] = useState({
    data: null,
    loading: true,
    errorMsg: "",
  });
  // get exam data
  useEffect(() => {
    setExam({ ...exam, loading: true, errorMsg: "" });
    http
      .GET(`exams/${Examid}`)
      .then((res) => {
        setExam({
          data: res.data.data.data,
          loading: false,
          errorMsg: "",
        });
      })
      .catch((err) => {
        setExam({
          data: null,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [refresh]);
  // get sudents  data
  useEffect(() => {
    setStudents({ ...students, loading: true, errorMsg: "" });
    http
      .GET(`grades/oneExam/${id}/${Examid}`)
      .then((res) => {
        console.log(res.data.data.grades)
        setStudents({
          data: res.data.data.grades,
          loading: false,
          errorMsg: "",
        });
      })
      .catch((err) => {
        setStudents({
          data: null,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [refresh]);
  // get exam info
  useEffect(() => {
    setExamInfo({ ...examInfo, loading: true, errorMsg: "" });
    http
      .GET(`exams/examInfo/${Examid}`)
      .then((res) => {
        setExamInfo({
          data: res.data.data,
          loading: false,
          errorMsg: "",
        });
      })
      .catch((err) => {
        setExamInfo({
          data: null,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [refresh]);
  // formate the dates
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
    <section className="more-details-exam">
      <div className="container">
        {/* if loading */}
        {exam.loading && (
          <CircularProgress
            sx={{
              margin: "auto",
              display: "block",
            }}
            size={60}
            color="inherit"
          />
        )}
        {/* if not loading and no data */}
        {!exam.loading && exam.data === null && examInfo.data === null && (
          <div>No data available</div>
        )}
        {/* if not loading and there is data */}
        {!exam.loading && exam.data && examInfo.data && (
          <>
            <div className="exam-spics">
              <div className="body">
                <div className="created-and-updated">
                  <div className="created">
                    Created : {formatDate(exam.data.createdAt)}
                  </div>
                  <div className="updated">
                    Updated : {formatDate(exam.data.updatedAt)}
                  </div>
                </div>
              </div>
              <div className="header">
                <h1>{exam.data.title}</h1>
                <div className="mark-and-duration-and-type">
                  <div className="duration">
                    <FaRegClock />
                    {exam.data.duration} Min
                  </div>
                  <div className="mark">
                    <FaRegCheckCircle />
                    {exam.data.totalpoints} Marks (Pass Mark :
                    {exam.data.totalpoints / 2})
                  </div>
                  <div className="type">
                    <RiBook2Line />
                    {exam.data.ExamType}
                  </div>
                  <Link
                    className="main-btn sm update-exam update"
                    to={`/instructor/course/${id}/exams/${Examid}/update`}
                  >
                    Update
                  </Link>
                </div>
              </div>
              <div className="exam-stat">
                <div className="total-stu">
                  <div className="icon">
                    <BsPerson />
                  </div>
                  <div className="text">
                    <span>Total Students</span>
                    {examInfo.data.totalRegisteredStudents}
                  </div>
                </div>
                <div className="ave-score">
                  <div className="icon">
                    <BsQuestionLg />
                  </div>
                  <div className="text">
                    <span>Total Questions</span>
                    {exam.data.Questions.length}
                  </div>
                </div>
                <div className="total-absent">
                  <div className="icon">
                    <BsPersonExclamation />
                  </div>
                  <div className="text">
                    <span>Total Absent Students</span>
                    {examInfo.data.studentsAbsent}
                  </div>
                </div>
                <div className="total-attend">
                  <div className="icon">
                    <BsPersonCheck />
                  </div>
                  <div className="text">
                    <span>Total Attended Students</span>
                    {examInfo.data.studentsAttended}
                  </div>
                </div>
                <div className="total-passed">
                  <div className="icon">
                    <IoFlagOutline />
                  </div>
                  <div className="text">
                    <span>Total Passed Students</span>
                    {examInfo.data.studentsPassed}
                  </div>
                </div>
                <div className="total-fail">
                  <div className="icon">
                    <BsPersonX />
                  </div>
                  <div className="text">
                    <span>Total Failed Students</span>
                    {examInfo.data.studentsFailed}
                  </div>
                </div>
              </div>
            </div>
            {students.data !== null && (
              <div className="all-students-exam">
                <MainTable
                  data={students.data}
                  examTotalGrades={exam.data.totalpoints}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MoreDetails;
