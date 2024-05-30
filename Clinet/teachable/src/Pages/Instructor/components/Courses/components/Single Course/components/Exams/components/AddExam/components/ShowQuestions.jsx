import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "../style/showQuestions.css";
const ShowQuestions = ({ questions, setQuestions }) => {
  return (
    <div className="question-added">
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <div className="question-header">
            <h3 className="question-title">Question {index + 1}:</h3>
            <p className="points"> {question.Points} Points</p>
            <button
              className="main-btn sm delete"
              onClick={() => {
                const newQuestions = [...questions];
                newQuestions.splice(index, 1);
                setQuestions(newQuestions);
              }}
            >
              Delete
            </button>
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
            {question.type === "WrittenQuestion" && (
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
  );
};

export default ShowQuestions;
