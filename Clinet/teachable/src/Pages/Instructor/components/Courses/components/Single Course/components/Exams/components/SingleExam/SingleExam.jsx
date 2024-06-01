import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "../AddExam/style/addExam.css";
import { FaPlus } from "react-icons/fa";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import Alert from "@mui/material/Alert";
import AddQuestions from "../AddExam/components/AddQuestions";
import ShowQuestions from "../AddExam/components/ShowQuestions";
import http from "../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";
import ExamOptions from "../AddExam/components/ExamOptions";
import CircularProgress from "@mui/material/CircularProgress";

const SingleExam = () => {
  const dispatch = useDispatch();
  const [showError, setShowError] = useState("");
  const { Examid } = useParams();
  const [lastUpdate, setLastUpdate] = useState("");
  const [examOptions, setExamOptions] = useState({
    ExamType: "",
    course: "",
    startedAt: "",
    expiredAt: "",
    title: "",
    totalpoints: 0,
    visiable: null,
  });

  const [questions, setQuestions] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [showExam, setShowExam] = useState({
    loading: false,
    errorMsg: "",
  });

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "All data will be lost and you will not be able to recover it if you refresh.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    setShowExam({ loading: true, errorMsg: "" });
    http
      .GET(`exams/${Examid}`)
      .then((res) => {
        setExamOptions({
          ExamType: res.data.data.data.ExamType,
          course: res.data.data.data.course,
          startedAt: res.data.data.data.startedAt,
          expiredAt: res.data.data.data.expiredAt,
          title: res.data.data.data.title,
          totalpoints: res.data.data.data.totalpoints,
          visiable: res.data.data.data.visiable,
        });
        setLastUpdate(res.data.data.data.updatedAt);
        setQuestions(res.data.data.data.Questions);
        setShowExam({ loading: false, errorMsg: "" });
      })
      .catch((err) => {
        setShowExam({ loading: false, errorMsg: "Something went wrong" });
      });
  }, []);
  const handleExamOptionChange = (field, value) => {
    setExamOptions((prevOptions) => ({
      ...prevOptions,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    if (questions.length === 0) {
      setShowError("Please add at least one question");
    } else {
      setShowExam({ loading: true, errorMsg: "" });
      const Exam = {
        ...examOptions,
        Questions: questions,
      };
      http
        .PATCH(`exams/${Examid}`, Exam)
        .then((res) => {
          setShowExam({ loading: false, errorMsg: "" });
          dispatch(
            openToast({
              msg: "Exam Updated successfully",
              type: "success",
            })
          );
        })
        .catch((err) => {
          setShowExam({ loading: false, errorMsg: "Something went wrong" });
        });
    }
  };
  return (
    <section className="add-exam-section">
      {/* if loading and there is no data */}
      {questions.length === 0 &&
        showExam.errorMsg === "" &&
        showExam.loading === true && (
          <CircularProgress
            sx={{
              margin: "auto",
              display: "block",
            }}
            size={60}
            color="inherit"
          />
        )}
      {/* if loading and there is data*/}
      {questions.length > 0 &&
        showExam.errorMsg === "" &&
        showExam.loading === true && (
          <CircularProgress
            sx={{
              margin: "auto",
              display: "block",
            }}
            size={60}
            color="inherit"
          />
        )}
      <div className="container">
        {showExam.errorMsg === "" && showExam.loading === false && (
          <>
            <div className="exam-content">
              <div className="exam-content-header">
                <h1>{examOptions.title}</h1>
                <button
                  className="add-question-btn main-btn sm"
                  onClick={() => setOpenAdd(true)}
                >
                  <FaPlus />
                  Add Question
                </button>
              </div>
              <div className="error-message">
                {showError && questions.length === 0 && (
                  <Alert severity="error">{showError}</Alert>
                )}
                {showExam.errorMsg !== "" && (
                  <Alert severity="error">{showExam.errorMsg}</Alert>
                )}
              </div>
              <div className="exam-questions">
                {questions.length === 0 ? (
                  <div className="no-question">
                    <p>No questions added</p>
                    <HiOutlineArchiveBoxXMark />
                  </div>
                ) : (
                  <ShowQuestions
                    questions={questions}
                    setQuestions={setQuestions}
                  />
                )}
              </div>
            </div>

            <ExamOptions
              examOptions={examOptions}
              handleExamOptionChange={handleExamOptionChange}
              handleUpdate={handleUpdate}
              loading={showExam.loading}
              details={true}
              lastUpdate={lastUpdate}
            />
          </>
        )}
      </div>
      <AddQuestions
        open={openAdd}
        setOpen={setOpenAdd}
        questions={questions}
        setQuestions={setQuestions}
      />
    </section>
  );
};

export default SingleExam;
