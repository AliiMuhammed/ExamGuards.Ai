import React, { useState } from "react";
import { useParams } from "react-router";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowUp } from "react-icons/io";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style/addExam.css";
import { FaCalendarAlt } from "react-icons/fa";

export const AddExam = () => {
  const [examType, setExamType] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleExamTypeChange = (event) => {
    setExamType(event.target.value);
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

  return (
    <section className="add-exam-section">
      <div className="container">
        <Accordion className="exam-accordion">
          <AccordionSummary
            expandIcon={<IoIosArrowUp />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <div className="exam-header">
              <div className="exam-title">Exam Options</div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="exam-type">
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <span className="required-star">*</span>Select Exam Type
                </FormLabel>
                <RadioGroup
                  aria-label="exam-type"
                  name="exam-type"
                  value={examType}
                  onChange={handleExamTypeChange}
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
            <div className="date-picker">
              <FormLabel component="legend">
                <span className="required-star">*</span>Exam Open & Close time
              </FormLabel>
              <div className="dates">
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Start Date & Time"
                  showIcon
                  icon={<FaCalendarAlt />}
                  withPortal
                />
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="End Date & Time"
                  showIcon
                  icon={<FaCalendarAlt />}
                  withPortal
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </section>
  );
};
