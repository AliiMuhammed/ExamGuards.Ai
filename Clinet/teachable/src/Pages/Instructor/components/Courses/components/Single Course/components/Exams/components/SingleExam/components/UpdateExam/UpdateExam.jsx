/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../../AddExam/style/addExam.css";
import { FaPlus } from "react-icons/fa";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import AddQuestions from "../../../AddExam/components/AddQuestions";
import ShowQuestions from "../../../AddExam/components/ShowQuestions";
import http from "../../../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../../../Redux/Slices/toastSlice";
import { triggerRefresh } from "../../../../../../../../../../../../Redux/Slices/refreshSlice";
import ExamOptions from "../../../AddExam/components/ExamOptions";
import CircularProgress from "@mui/material/CircularProgress";

const UpdateExam = () => {
  const refresh = useSelector((state) => state.refresh);
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
    duration: "",
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
        const examData = res.data.data.data;
        setExamOptions({
          ExamType: examData.ExamType,
          course: examData.course,
          startedAt: examData.startedAt,
          expiredAt: examData.expiredAt,
          title: examData.title,
          totalpoints: examData.totalpoints,
          duration: examData.duration,
          visiable: examData.visiable,
        });
        setLastUpdate(examData.updatedAt);
        setQuestions(examData.Questions);
        setShowExam({ loading: false, errorMsg: "" });
      })
      .catch((err) => {
        setShowExam({ loading: false, errorMsg: "Something went wrong" });
      });
  }, [refresh]);

  const handleExamOptionChange = (field, value) => {
    setExamOptions((prevOptions) => ({
      ...prevOptions,
      [field]: value,
    }));
  };

  const handleUpdate = () => {
    setShowError("");
    if (questions.length === 0) {
      setShowError("Please add at least one question");
      return;
    }

    const totalQuestionPoints = questions.reduce(
      (acc, question) => acc + parseInt(question.Points),
      0
    );
    console.log(totalQuestionPoints);
    console.log(examOptions.totalpoints);
    if (totalQuestionPoints !== examOptions.totalpoints) {
      setShowError(
        "Total points of all questions must equal the total points in exam options"
      );
      return;
    }

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
        dispatch(triggerRefresh());
        setShowError("");
      })
      .catch((err) => {
        setShowExam({ loading: false, errorMsg: "Something went wrong" });
      });
  };

  return (
    <section className="add-exam-section">
      {questions.length === 0 &&
        showExam.errorMsg === "" &&
        showExam.loading === true && (
          <CircularProgress
            sx={{ margin: "auto", display: "block" }}
            size={60}
            color="inherit"
          />
        )}
      {questions.length > 0 &&
        showExam.errorMsg === "" &&
        showExam.loading === true && (
          <CircularProgress
            sx={{ margin: "auto", display: "block" }}
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
                {showError && <Alert severity="error">{showError}</Alert>}
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

export default UpdateExam;
