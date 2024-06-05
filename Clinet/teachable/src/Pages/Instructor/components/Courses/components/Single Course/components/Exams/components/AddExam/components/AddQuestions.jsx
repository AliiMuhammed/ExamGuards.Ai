import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../../../../Redux/Slices/toastSlice";
import "../style/addQuestions.css";

const AddQuestions = ({ open, setOpen, questions, setQuestions }) => {
  const dispatch = useDispatch();

  const getNextQuestionNumber = () => questions.length + 1;

  const [newQuestion, setNewQuestion] = useState({
    type: "ChooseQuestion",
    QuestionTitle: "",
    Points: "",
    numberOfQuestion: getNextQuestionNumber(),
    Answers: [{ body: "", correct: false }],
    Keywords: [{ keyword: "", weight: "" }],
    Answer: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (open) {
      setNewQuestion({
        type: "ChooseQuestion",
        QuestionTitle: "",
        Points: "",
        numberOfQuestion: getNextQuestionNumber(),
        Answers: [{ body: "", correct: false }],
        Keywords: [{ keyword: "", weight: "" }],
        Answer: "",
      });
      setErrorMsg("");
    }
  }, [open, questions]);

  const close = () => {
    setOpen(false);
  };

  const handleAddQuestion = () => {
    const questionToAdd = { ...newQuestion };

    // Remove Answers if the question type is WrittenQuestion
    if (newQuestion.type === "WrittenQuestion") {
      delete questionToAdd.Answers;
    }
    if (newQuestion.type === "ChooseQuestion") {
      delete questionToAdd.Keywords;
      delete questionToAdd.Answer;
    }

    setQuestions([...questions, questionToAdd]);
    dispatch(
      openToast({
        msg: "Question added successfully!",
        type: "success",
      })
    );
    close();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset Answers, Keywords, and Answer when question type changes
    if (name === "type") {
      setNewQuestion((prevState) => ({
        ...prevState,
        type: value,
        Answers:
          value === "ChooseQuestion" ? [{ body: "", correct: false }] : [],
        Keywords:
          value === "WrittenQuestion" ? [{ keyword: "", weight: "" }] : [],
        Answer: value === "WrittenQuestion" ? "" : null,
      }));
    } else if (name === "Points") {
      // Only allow numbers and limit to 0-100
      if (/^\d*$/.test(value) && value >= 0 && value <= 100) {
        setNewQuestion((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        setErrorMsg("");
      } else {
        setErrorMsg("Please enter a valid number between 0 and 100.");
      }
    } else {
      setNewQuestion((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrorMsg("");
    }
  };

  const handleAnswerChange = (index, e) => {
    const { value } = e.target;
    const updatedAnswers = [...newQuestion.Answers];
    updatedAnswers[index] = { ...updatedAnswers[index], body: value };
    setNewQuestion((prevState) => ({
      ...prevState,
      Answers: updatedAnswers,
    }));
  };

  const handleCorrectChange = (index) => {
    const updatedAnswers = newQuestion.Answers.map((answer, i) =>
      i === index
        ? { ...answer, correct: !answer.correct }
        : { ...answer, correct: false }
    );
    setNewQuestion((prevState) => ({
      ...prevState,
      Answers: updatedAnswers,
    }));
  };

  const addAnswerOption = () => {
    setNewQuestion((prevState) => ({
      ...prevState,
      Answers: [...prevState.Answers, { body: "", correct: false }],
    }));
  };

  const removeAnswerOption = (index) => {
    const updatedAnswers = [...newQuestion.Answers];
    updatedAnswers.splice(index, 1);
    setNewQuestion((prevState) => ({
      ...prevState,
      Answers: updatedAnswers,
    }));
  };

  const handleKeywordChange = (index, e) => {
    const { name, value } = e.target;

    // Validate input to allow only float and real numbers for the weight field
    if (name === "weight" && !/^\d*\.?\d*$/.test(value)) {
      setErrorMsg("Please enter a valid number.");
      return;
    }

    const updatedKeywords = [...newQuestion.Keywords];
    updatedKeywords[index] = { ...updatedKeywords[index], [name]: value };
    setNewQuestion((prevState) => ({
      ...prevState,
      Keywords: updatedKeywords,
    }));
    setErrorMsg("");
  };

  const addKeyword = () => {
    setNewQuestion((prevState) => ({
      ...prevState,
      Keywords: [...prevState.Keywords, { keyword: "", weight: "" }],
    }));
  };

  const removeKeyword = (index) => {
    const updatedKeywords = [...newQuestion.Keywords];
    updatedKeywords.splice(index, 1);
    setNewQuestion((prevState) => ({
      ...prevState,
      Keywords: updatedKeywords,
    }));
  };

  const validateForm = () => {
    const { QuestionTitle, Points, Keywords, type, Answer, Answers } =
      newQuestion;
    if (!QuestionTitle || Points === "" || Points < 0 || Points > 100) {
      setErrorMsg(
        "All fields are required and Points should be between 0 and 100."
      );
      return false;
    }
    if (
      type === "ChooseQuestion" &&
      (Answers.length < 2 || Answers.some((answer) => !answer.body.trim()))
    ) {
      setErrorMsg("Please add at least two options with content.");
      return false;
    }
    // Check if at least one answer is marked as correct
    if (
      type === "ChooseQuestion" &&
      !Answers.some((answer) => answer.correct)
    ) {
      setErrorMsg("Please mark at least one option as correct.");
      return false;
    }
    if (
      type === "WrittenQuestion" &&
      Keywords.some(
        (keyword) => !keyword.keyword.trim() || keyword.weight === ""
      )
    ) {
      setErrorMsg("All fields are required.");
      return false;
    }
    if (type === "WrittenQuestion" && !Answer.trim()) {
      setErrorMsg("Answer field is required for written questions.");
      return false;
    }
    return true;
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          if (validateForm()) {
            handleAddQuestion();
          }
        },
      }}
    >
      <DialogTitle>Add New Question</DialogTitle>
      <DialogContent>
        <div className="form-qusetions">
          <div className="error-message">
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          </div>
          <TextField
            select
            margin="dense"
            id="type"
            name="type"
            label="Question Type"
            fullWidth
            variant="outlined"
            value={newQuestion.type}
            onChange={handleChange}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => selected || "Select",
            }}
          >
            <MenuItem value="ChooseQuestion">Multiple Choice</MenuItem>
            <MenuItem value="WrittenQuestion">Written</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            id="title"
            name="QuestionTitle"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newQuestion.QuestionTitle}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="points"
            name="Points"
            label="Points"
            type="text"
            fullWidth
            variant="outlined"
            value={newQuestion.Points}
            onChange={handleChange}
            inputProps={{ min: 0, max: 100 }}
          />

          {newQuestion.type === "ChooseQuestion" &&
            newQuestion.Answers.map((answer, index) => (
              <div className="answer-option" key={index}>
                <TextField
                  margin="dense"
                  id={`answer-${index}`}
                  name="body"
                  label={`Option ${index + 1}`}
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={answer.body}
                  onChange={(e) => handleAnswerChange(index, e)}
                  className="answer-input"
                />
                <button
                  type="button"
                  className={`${
                    answer.correct ? "update" : ""
                  } main-btn sm mark-btn`}
                  onClick={() => handleCorrectChange(index)}
                >
                  Correct
                </button>
                {newQuestion.Answers.length > 1 && (
                  <button
                    className="main-btn sm delete"
                    type="button"
                    onClick={() => removeAnswerOption(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

          {newQuestion.type === "ChooseQuestion" && (
            <button
              type="button"
              className="main-btn sm add-more update"
              onClick={addAnswerOption}
            >
              Add Answer Option
            </button>
          )}

          {newQuestion.type === "WrittenQuestion" && (
            <>
              <TextField
                margin="dense"
                id="answer"
                name="Answer"
                label="Answer"
                type="text"
                fullWidth
                variant="outlined"
                value={newQuestion.Answer}
                onChange={handleChange}
                multiline
                rows={4}
              />
              {newQuestion.Keywords.map((keyword, index) => (
                <div className="answer-keywords" key={index}>
                  <TextField
                    margin="dense"
                    id={`keyword-${index}`}
                    name="keyword"
                    label={`Keyword ${index + 1}`}
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={keyword.keyword}
                    onChange={(e) => handleKeywordChange(index, e)}
                  />
                  <TextField
                    margin="dense"
                    id={`weight-${index}`}
                    name="weight"
                    label={`Weight ${index + 1}`}
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={keyword.weight}
                    onChange={(e) => handleKeywordChange(index, e)}
                    inputProps={{ step: "0.1" }}
                  />
                  {newQuestion.Keywords.length > 1 && (
                    <button
                      className="main-btn sm delete"
                      type="button"
                      onClick={() => removeKeyword(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="main-btn sm add-more update"
                onClick={addKeyword}
              >
                Add Keyword
              </button>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <button
          type="button"
          className="main-btn sm cancle-add"
          variant="contained"
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="main-btn sm add-question"
          type="submit"
          color="success"
        >
          Add
        </button>
      </DialogActions>
    </Dialog>
  );
};

AddQuestions.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  setQuestions: PropTypes.func.isRequired,
};

export default AddQuestions;
