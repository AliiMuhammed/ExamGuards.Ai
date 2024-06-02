import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddQuestions from "./components/AddQuestions";
import ShowQuestions from "./components/ShowQuestions";
import ExamOptions from "./components/ExamOptions";
import "./style/addExam.css";
import { FaPlus } from "react-icons/fa";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";
import Alert from "@mui/material/Alert";
import http from "./../../../../../../../../../../Helper/http";

export const AddExam = () => {
  const dispatch = useDispatch();
  const [showError, setShowError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [examOptions, setExamOptions] = useState({
    ExamType: "",
    course: id,
    startedAt: "",
    expiredAt: "",
    duration: "",
    title: "",
    totalpoints: 0,
    visiable: null,
  });
  const [questions, setQuestions] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [addExam, setAddExam] = useState({
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

  const handleExamOptionChange = (field, value) => {
    setExamOptions((prevOptions) => ({
      ...prevOptions,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(examOptions)
    if (questions.length === 0) {
      setShowError("Please add at least one question");
    } else {
      setAddExam({ loading: true, errorMsg: "" });
      const Exam = {
        ...examOptions,
        Questions: questions,
      };
      http
        .POST("exams", Exam)
        .then((res) => {
          setAddExam({ loading: false, errorMsg: "" });
          setExamOptions({
            ExamType: "",
            course: id,
            startedAt: "",
            expiredAt: "",
            title: "",
            totalpoints: 0,
            visiable: null,
          });
          setQuestions([]);
          dispatch(
            openToast({
              msg: "Exam Created successfully",
              type: "success",
            })
          );
          navigate(`/instructor/course/${id}/exams`);
        })
        .catch((err) => {
          setAddExam({ loading: false, errorMsg: "Something went wrong" });
        });
    }
  };

  return (
    <section className="add-exam-section">
      <div className="container">
        <div className="exam-content">
          <div className="exam-content-header">
            <h1>Add New Exam</h1>
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
            {addExam.errorMsg !== "" && (
              <Alert severity="error">{addExam.errorMsg}</Alert>
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
          handleSubmit={handleSubmit}
          loading={addExam.loading}
          details={false}
        />
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
