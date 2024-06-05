import React, { useState } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import "../style/showQuestions.css";
import EditQuestions from "./EditQuestions";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
const ShowQuestions = ({ questions, setQuestions }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [open, setOpen] = useState({
    open: false,
    index: "",
  });
  console.log(questions);
  const handleOpenEditDialog = (question) => {
    setQuestionToEdit(question);
    setOpenEditDialog(true);
  };
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
                  setOpen({ open: true, index: index });
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
      <Dialog
        fullWidth
        open={open.open}
        onClose={() => setOpen({ open: false, index: "" })}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to delete this question?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you don't need to create this exam? All data will be
            lost and you will not be able to recover it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="main-btn sm"
            variant="contained"
            onClick={() => setOpen({ open: false, index: "" })}
          >
            Cancel
          </button>
          <Button
            onClick={() => {
              const newQuestions = [...questions];
              newQuestions.splice(open.index, 1);
              setQuestions(newQuestions);
              setOpen({ open: false, index: "" });
            }}
            variant="contained"
            color="error"
          >
            Yes, I am sure
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShowQuestions;
