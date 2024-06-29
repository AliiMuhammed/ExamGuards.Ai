import React, { useEffect, useState } from "react";
import "./style/allStudentExams.css";
import http from "./../../../../../../../../Helper/http";
import { useNavigate, useParams } from "react-router";
import examImg from "../../../../../../../../Assets/Images/Exams/exam-img.png";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { openToast } from "../../../../../../../../Redux/Slices/toastSlice";
import { useDispatch } from "react-redux";
const AllStudentExams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [exams, setExams] = useState({
    loading: false,
    data: [],
    errorMsg: "",
  });
  const [check, setCheck] = useState({
    loading: false,
    errorMsg: "",
  });
  const { id } = useParams();
  const { name } = useParams();
  useEffect(() => {
    setExams({ ...exams, loading: true, errorMsg: "" });
    http
      .GET(`courses/${id}/exams`)
      .then((response) => {
        setExams({
          ...exams,
          loading: false,
          data: response.data.data.data,
          errorMsg: "",
        });
      })
      .catch((error) => {
        setExams({
          ...exams,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, []);
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
  const handelCheck = (Examid) => {
    setCheck({ ...check, loading: true, errorMsg: "" });
    http
      .POST(`exams/check/${Examid}`)
      .then((response) => {
        setCheck({
          ...check,
          loading: false,
          errorMsg: "",
        });

        if (response.data.massage === false) {
          dispatch(
            openToast({ type: "error", msg: "You Enterd this Exam before" })
          );
        } else {
          navigate(`/${id}/${Examid}`);
        }
      })
      .catch((error) => {
        console.log(error);
        setCheck({
          ...check,
          loading: false,
          errorMsg: "Something went wrong",
        });
        dispatch(openToast({ type: "error", msg: "Something went wrong" }));
      });
  };

  return (
    <section className="allStudentExams-section">
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
              </div>
              <div className="exams-cards">
                {exams.data.map((exam) => (
                  <div className="exam-card" key={exam._id}>
                    <div className="exam-img">
                      <img src={examImg} loading="lazy" alt="exam" />
                    </div>
                    <div className="exam-header">
                      <h2>{exam.title} </h2>
                      <span className={`tag ${exam.status}`}>{`${
                        exam.status === "open"
                          ? "on going"
                          : exam.status === "ended"
                          ? "ended"
                          : "coming soon"
                      }`}</span>
                    </div>
                    <p>
                      <span>Type:</span>
                      {exam.ExamType}
                    </p>
                    <p>
                      <span>Duration:</span>
                      {exam.duration} minutes
                    </p>
                    <p>
                      <span>Start Time: </span> {formatDate(exam.startedAt)}
                    </p>
                    <p>
                      <span>End Time: </span> {formatDate(exam.expiredAt)}
                    </p>
                    {exam.status === "open" && (
                      <button
                        onClick={() => handelCheck(exam._id)}
                        className="delete-btn main-btn sm"
                        disabled={check.loading}
                      >
                        {check.loading ? (
                          <CircularProgress
                            sx={{
                              margin: "auto",
                              display: "block",
                            }}
                            size={20}
                            color="inherit"
                          />
                        ) : (
                          "Take Exam"
                        )}
                      </button>
                    )}
                    {exam.status === "ended" && (
                      <Link
                        to={`/student/${name}/${id}/exams/${exam._id}`}
                        className="delete-btn main-btn sm"
                      >
                        More Details
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </section>
  );
};

export default AllStudentExams;
