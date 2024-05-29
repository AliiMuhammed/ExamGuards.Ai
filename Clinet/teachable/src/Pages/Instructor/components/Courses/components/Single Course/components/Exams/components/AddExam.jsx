import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style/addExam.css";
import { FaCalendarAlt } from "react-icons/fa";

export const AddExam = () => {
  const [examTitle, setExamTitle] = useState(""); // State for exam title
  const [examType, setExamType] = useState("");
  const [examVisibility, setExamVisibility] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [totalGrades, setTotalGrades] = useState(""); // State for total grades
  const [errorGrade, setErrorGrade] = useState(""); // State for validation error message

  const handleExamTitleChange = (event) => {
    setExamTitle(event.target.value);
  };

  const handleExamTypeChange = (event) => {
    setExamType(event.target.value);
    console.log(examType);
  };

  const handleExamVisibilityChange = (event) => {
    setExamVisibility(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log("Start Date & Time:", date.toISOString());
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    setEndDate(date);
    console.log("End Date & Time:", date.toISOString());
  };

  const handleTotalGradesChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value <= 100) {
      setTotalGrades(value);
      setErrorGrade(""); // Clear the error message if the value is valid
    } else {
      setErrorGrade("Please enter a valid number between 0 and 100");
    }
  };

  return (
    <section className="add-exam-section">
      <div className="container">
        <div className="exam-content">test</div>

        <div className="exam-options">
          <div className="exam-header">
            <div className="exam-title">Exam Options</div>
          </div>
          <div className="exam-title">
            <FormControl fullWidth>
              <FormLabel>
                <span className="required-star">*</span>Exam Title
              </FormLabel>
              <TextField
                id="exam-title"
                onChange={handleExamTitleChange}
                value={examTitle}
                variant="outlined"
                className="exam-title-input"
                placeholder="Enter exam title"
                size="small"
              />
            </FormControl>
          </div>
          <div className="exam-type">
            <FormControl fullWidth>
              <FormLabel>
                <span className="required-star">*</span>Select Exam Type
              </FormLabel>
              <RadioGroup
                aria-label="exam-type"
                name="exam-type"
                value={examType}
                onChange={handleExamTypeChange}
                className="radio-group-btns-exam-type"
              >
                <FormControlLabel
                  value="midterm"
                  control={<Radio />}
                  label="Midterm"
                />
                <FormControlLabel
                  value="final"
                  control={<Radio />}
                  label="Final"
                />
                <FormControlLabel
                  value="quiz"
                  control={<Radio />}
                  label="Quiz"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <FormControl fullWidth>
            <FormLabel>
              <span className="required-star">*</span>Exam Open & Close time
            </FormLabel>
          </FormControl>
          <div className="date-picker">
            <DatePicker
              className="custom-date-picker"
              selected={startDate}
              onChange={handleStartDateChange}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Start Date & Time"
              showTimeInput
              timeInputLabel="Time:"
              showIcon
              icon={<FaCalendarAlt />}
              withPortal
            />
            <span>-</span>
            <DatePicker
              className="custom-date-picker"
              selected={endDate}
              onChange={handleEndDateChange}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="End Date & Time"
              showTimeInput
              timeInputLabel="Time:"
              showIcon
              icon={<FaCalendarAlt />}
              withPortal
            />
          </div>
          <div className="exam-visibility">
            <FormControl fullWidth>
              <FormLabel>
                <span className="required-star">*</span>Select Exam Visibility
              </FormLabel>
              <RadioGroup
                aria-label="exam-visibility"
                name="exam-visibility"
                value={examVisibility}
                onChange={handleExamVisibilityChange}
                className="radio-group-btns-exam-type"
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Private"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="total-grades">
            <FormControl fullWidth>
              <FormLabel>
                <span className="required-star">*</span>Total Grades
              </FormLabel>
              <TextField
                id="outlined-basic"
                onChange={handleTotalGradesChange}
                value={totalGrades}
                variant="outlined"
                className="total-grades-input"
                placeholder="Enter total grades"
                size="small"
                error={Boolean(errorGrade)}
                helperText={errorGrade}
              />
            </FormControl>
          </div>
        </div>
      </div>
    </section>
  );
};
