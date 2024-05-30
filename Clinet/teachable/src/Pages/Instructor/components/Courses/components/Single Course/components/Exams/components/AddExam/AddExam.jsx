import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AddQuestions from "./components/AddQuestions";
import ShowQuestions from "./components/ShowQuestions";
import ExamOptions from "./components/ExamOptions";
import "./style/addExam.css";
import { FaPlus } from "react-icons/fa";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";
import Alert from "@mui/material/Alert";

export const AddExam = () => {
  const dispatch = useDispatch();
  const [showError, setShowError] = useState("");
  const { id } = useParams();
  const [examOptions, setExamOptions] = useState({
    ExamType: "",
    course: id,
    startedAt: "",
    expiredAt: "",
    title: "",
    totalpoints: 0,
    visiable: null,
  });
  const [questions, setQuestions] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  const handleExamOptionChange = (field, value) => {
    setExamOptions((prevOptions) => ({
      ...prevOptions,
      [field]: value,
    }));
  };
  const handleSubmit = () => {
    if (questions.length === 0) {
      setShowError("Please add at least one question");
      dispatch(
        openToast({
          msg: "something went wrong",
          type: "error",
        })
      );
    }
    console.log(examOptions);
  };
  console.log(questions)
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
            {showError && questions.length === 0 && <Alert severity="error">{showError}</Alert>}
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
