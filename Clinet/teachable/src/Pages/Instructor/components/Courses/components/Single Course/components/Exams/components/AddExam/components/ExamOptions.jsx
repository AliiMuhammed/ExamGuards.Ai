import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import "../style/examOptions.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
const ExamOptions = ({
  examOptions,
  handleExamOptionChange,
  handleSubmit,
  loading,
}) => {
  const { title, ExamType, startedAt, expiredAt, totalpoints, visiable } =
    examOptions;
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const id = useParams().id;
  const navigate = useNavigate();
  const parseDate = (date) => {
    return date ? new Date(date) : null;
  };

  const formatDateForSave = (date) => {
    return date ? date.toISOString() : "";
  };

  const validate = () => {
    let tempErrors = {};
    if (!title) tempErrors.title = "Exam title is required.";
    if (!ExamType) tempErrors.ExamType = "Exam type is required.";
    if (!startedAt) tempErrors.startedAt = "Start date and time are required.";
    if (!expiredAt) tempErrors.expiredAt = "End date and time are required.";
    if (startedAt && expiredAt && new Date(expiredAt) < new Date(startedAt))
      tempErrors.date =
        "End date and time cannot be before start date and time.";
    if (!totalpoints) {
      tempErrors.totalpoints = "Total grades are required.";
    }
    if (isNaN(totalpoints) || totalpoints < 0 || totalpoints > 100) {
      tempErrors.totalpoints =
        "Total grades must be a number between 0 and 100.";
    } else if (visiable === undefined || visiable === null) {
      tempErrors.visiable = "Exam visibility is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (validate()) {
      handleSubmit();
    } else {
      console.log("Form has errors.");
    }
  };

  const handleDateChange = (key, date) => {
    handleExamOptionChange(key, formatDateForSave(date));
  };

  return (
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
            onChange={(e) => handleExamOptionChange("title", e.target.value)}
            value={title}
            variant="outlined"
            className="exam-title-input"
            placeholder="Enter exam title"
            size="small"
            error={!!errors.title}
            helperText={errors.title}
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
            value={ExamType}
            onChange={(e) => handleExamOptionChange("ExamType", e.target.value)}
            className="radio-group-btns-exam-type"
          >
            <FormControlLabel
              value="midterm"
              control={<Radio />}
              label="Midterm"
            />
            <FormControlLabel value="final" control={<Radio />} label="Final" />
            <FormControlLabel value="quiz" control={<Radio />} label="Quiz" />
          </RadioGroup>
          {errors.ExamType && (
            <div className="css-k4qjio-MuiFormHelperText-root Mui-error">
              {errors.ExamType}
            </div>
          )}
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
          selected={parseDate(startedAt)}
          onChange={(date) => handleDateChange("startedAt", date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="Start Date & Time"
          showTimeInput
          timeInputLabel="Time:"
          showIcon
          icon={<FaCalendarAlt />}
          closeOnScroll={true}
          withPortal
        />
        <span>-</span>
        <DatePicker
          className="custom-date-picker"
          selected={parseDate(expiredAt)}
          onChange={(date) => handleDateChange("expiredAt", date)}
          showTimeSelect
          dateFormat="Pp"
          placeholderText="End Date & Time"
          showTimeInput
          timeInputLabel="Time:"
          showIcon
          icon={<FaCalendarAlt />}
          closeOnScroll={true}
          withPortal
        />
      </div>
      {errors.date && (
        <div className="css-k4qjio-MuiFormHelperText-root Mui-error error-message">
          {errors.date}
        </div>
      )}
      <div className="exam-visibility">
        <FormControl fullWidth>
          <FormLabel>
            <span className="required-star">*</span>Select Exam Visibility
          </FormLabel>
          <RadioGroup
            aria-label="exam-visibility"
            name="exam-visibility"
            value={visiable}
            onChange={(e) =>
              handleExamOptionChange("visiable", e.target.value === "true")
            }
            className="radio-group-btns-exam-type"
          >
            <FormControlLabel value="true" control={<Radio />} label="Public" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>
        </FormControl>
      </div>
      {errors.visiable && (
        <div className="css-k4qjio-MuiFormHelperText-root Mui-error">
          {errors.visiable}
        </div>
      )}
      <div className="total-grades">
        <FormControl fullWidth>
          <FormLabel>
            <span className="required-star">*</span>Total Grades
          </FormLabel>
          <TextField
            id="outlined-basic"
            onChange={(e) =>
              handleExamOptionChange("totalpoints", e.target.value)
            }
            value={totalpoints}
            variant="outlined"
            className="total-grades-input"
            placeholder="Enter total grades"
            size="small"
            error={!!errors.totalpoints}
            helperText={errors.totalpoints}
          />
        </FormControl>
      </div>
      <div className="exam-btns">
        <button
          onClick={handleFormSubmit}
          disabled={loading}
          className="add-exam-btn main-btn sm"
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create Exam"
          )}
        </button>
        <button
          className="cancel-exam-btn main-btn sm"
          onClick={() => setOpen(true)}
        >
          Cancel
        </button>
      </div>
      <Dialog
        fullWidth
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to delete this course?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you don't need to create this exam? All data will be
            lost and you will not be able to recover it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button type="button" className="main-btn sm" variant="contained" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <Button
            onClick={() => {
              navigate(`/instructor/course/${id}/exams`);
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

export default ExamOptions;
