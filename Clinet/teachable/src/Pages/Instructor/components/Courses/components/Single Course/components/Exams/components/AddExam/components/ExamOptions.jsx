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
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../../../../../../../../../Helper/http";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../../../../Redux/Slices/toastSlice";

const ExamOptions = ({
  handleUpdate,
  examOptions,
  handleExamOptionChange,
  handleSubmit,
  loading,
  details,
  lastUpdate,
}) => {
  const { title, ExamType, startedAt, expiredAt, totalpoints, visiable } =
    examOptions;
  const [errors, setErrors] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteState, setDeleteState] = useState({
    open: false,
    loading: false,
    errorMsg: "",
  });

  const dispatch = useDispatch();
  const { id, Examid } = useParams();
  const navigate = useNavigate();

  const parseDate = (date) => (date ? new Date(date) : null);
  const formatDateForSave = (date) => (date ? date.toISOString() : "");

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
    if (validate() && !details) {
      handleSubmit();
    } else if (validate() && details) {
      handleUpdate();
    } else {
      console.log("Form has errors.");
    }
  };

  const handleDateChange = (key, date) => {
    handleExamOptionChange(key, formatDateForSave(date));
  };

  const handleDelete = () => {
    setDeleteState({ ...deleteState, loading: true });

    http
      .DELETE(`exams/${Examid}`)
      .then((res) => {
        dispatch(
          openToast({ msg: "Exam deleted successfully", type: "success" })
        );
        setDeleteState({ open: false, loading: false, errorMsg: "" });
        navigate(`/instructor/course/${id}/exams`);
      })
      .catch((err) => {
        dispatch(openToast({ msg: "Something went wrong", type: "error" }));
        setDeleteState({
          ...deleteState,
          loading: false,
          errorMsg: "Something went wrong. Please try again.",
        });
      });
  };
  const formatDateToNormal = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // This will format the time in 12-hour AM/PM format
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="exam-options">
      <div className="exam-header">
        <div className="exam-title">Exam Options</div>
        {details && (
          <div className="delete-exam-btn">
            <span>Last updated at: </span>
            {formatDateToNormal(lastUpdate)}
          </div>
        )}
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
        {details ? (
          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="add-exam-btn main-btn sm"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </button>
        ) : (
          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="add-exam-btn main-btn sm"
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create"
            )}
          </button>
        )}
        <button
          className="cancel-exam-btn main-btn sm"
          onClick={() => setConfirmDialogOpen(true)}
        >
          Cancel
        </button>
        {details && (
          <button
            className="delete main-btn sm"
            onClick={() => setDeleteState({ open: true })}
          >
            Delete
          </button>
        )}
      </div>
      {/* confirm cancel dialog */}
      <Dialog
        fullWidth
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to cancel?"}
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
            onClick={() => setConfirmDialogOpen(false)}
          >
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
      {/* confirm delete dialog */}
      <Dialog
        fullWidth
        open={deleteState.open}
        onClose={() => setDeleteState({ ...deleteState, open: false })}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to delete the exam?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this exam? All data will be lost and
            you will not be able to recover it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="main-btn sm"
            variant="contained"
            onClick={() => setDeleteState({ ...deleteState, open: false })}
          >
            Cancel
          </button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteState.loading}
          >
            {deleteState.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Yes, I am sure"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExamOptions;
