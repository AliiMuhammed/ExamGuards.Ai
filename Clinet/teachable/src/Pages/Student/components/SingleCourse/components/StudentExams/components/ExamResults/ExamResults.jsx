import React, { useEffect, useState } from "react";
import http from "../../../../../../../../Helper/http";
import { useParams } from "react-router";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import "./style/examResults.css";
const ExamResults = () => {
  const [showResults, setShowResults] = useState({
    exam: {},
    loading: false,
    errorMsg: "",
  });
  const [studentResult, setStudentResult] = useState({
    loading: false,
    result: {},
    errorMsg: "",
  });
  const { Examid } = useParams();

  useEffect(() => {
    setShowResults({ ...showResults, loading: true, errorMsg: "" });
    http
      .GET(`exams/${Examid}`)
      .then((response) => {
        setShowResults({
          ...showResults,
          loading: false,
          exam: response.data.data.data,
          errorMsg: "",
        });
      })
      .catch((error) => {
        setShowResults({
          ...showResults,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [Examid]);

  useEffect(() => {
    setStudentResult({ ...studentResult, loading: true, errorMsg: "" });
    http
      .GET(`grades/gradesForExam/${Examid}`)
      .then((response) => {
        setStudentResult({
          ...studentResult,
          loading: false,
          result: response.data.data,
          errorMsg: "",
        });
      })
      .catch((error) => {
        setStudentResult({
          ...studentResult,
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [Examid]);

  return (
    <section className="studentExamResults-section">
      <div className="container">
        {/* handelErrors */}
        {showResults.errorMsg !== "" || studentResult.errorMsg !== "" ? (
          <>
            <Alert severity="error">{showResults.errorMsg}</Alert>
            <Alert severity="error">{studentResult.errorMsg}</Alert>
          </>
        ) : null}

        {/* Loading state */}
        {(showResults.loading || studentResult.loading) && (
          <CircularProgress
            sx={{ margin: "auto", display: "block" }}
            size={60}
            color="inherit"
          />
        )}

        {/* Loaded state */}
        {!showResults.loading && !studentResult.loading && (
          <>
            <div className="header">
              <h1>Exam Results</h1>
              {showResults.exam.ExamType && (
                <div className="score-status-type">
                  <div className="score">
                 Your Score: {studentResult.result.grade} / {showResults.exam.totalpoints}
                  </div>
                  <div className="type">{showResults.exam.ExamType}</div>
                  <div
                    className={`status ${
                      studentResult.result.status === "failed"
                        ? "failed"
                        : "passed"
                    }`}
                  >
                    {studentResult.result.status}
                  </div>
                </div>
              )}
            </div>
            <div className="exam-model">
              {showResults.exam.Questions &&
                showResults.exam.Questions.map((question, index) => (
                  <div key={index} className="question-container">
                    <div className="question-header">
                      <h3 className="question-title">Question {index + 1}:</h3>
                      <p className="points"> {question.Points} Points</p>
                    </div>
                    <p className="question"> {question.QuestionTitle}</p>
                    {question.type === "ChooseQuestion" && (
                      <div className="answers-container">
                        <p>Choices:</p>
                        <ul>
                          {question.Answers.map((answer, ansIndex) => (
                            <li key={ansIndex}>
                              {answer.body}
                              {answer.correct && <IoMdCheckmarkCircleOutline />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {question.type === "WrittenQuestion" && (
                      <div className="answers-container">
                        <p>
                          <span>Model Answer:</span> {question.Answer}
                        </p>
                      </div>
                    )}
                    <div className="question-footer">
                      <p className="question-type">
                        <span>Question Type: </span>
                        {question.type}
                      </p>
                      {question.type === "WrittenQuestion" &&
                        question.Keywords && (
                          <div className="question-keywords">
                            <span>Keywords: </span>
                            {question.Keywords.map((keyword, kwIndex) => (
                              <span className="keyword" key={kwIndex}>
                                {keyword.keyword}: {keyword.weight}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ExamResults;
