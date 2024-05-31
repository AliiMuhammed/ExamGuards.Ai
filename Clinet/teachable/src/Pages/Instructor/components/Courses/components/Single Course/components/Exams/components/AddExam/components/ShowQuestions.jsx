import React, { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "../style/showQuestions.css";
import EditQuestions from "./EditQuestions";

const ShowQuestions = ({ questions, setQuestions }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);

  const handleOpenEditDialog = (question) => {
    setQuestionToEdit(question);
    setOpenEditDialog(true);
  };
  console.log(questions);
  return (
    <div className="question-added">
      {questions.map((question, index) => (
        <div key={index} className="question-container">
          <div className="question-header">
            <h3 className="question-title">Question {index + 1}:</h3>
            <p className="points"> {question.Points} Points</p>
            <div className="questions-btns">
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
              <button
                className="main-btn sm update"
                onClick={() => handleOpenEditDialog(question)}
              >
                Update
              </button>
            </div>
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
      {/* Edit dialog */}
      {questionToEdit && (
        <EditQuestions
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          questionToEdit={questionToEdit}
          setQuestions={setQuestions}
          questions={questions}
        />
      )}
    </div>
  );
};

export default ShowQuestions;
