import React, { useState, useEffect } from "react";
import "./style/takeExam.css";
import ExamInstructionsDialog from "./components/ExamInstructions/ExamInstructions";
import RequestCameraAndMicrophone from "./components/RequestCameraAndMicrophon/RequestCameraAndMicrophon";
import AskFullScreen from "./components/AskFullScreen/AskFullScreen";
import Camera from "./../../../../../../../Test/Camera";
import CountdownTimer from "./components/CountDown/CountdownTimer";
import http from "./../../../../../../../../Helper/http";
import { useParams, useNavigate } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../Redux/Slices/toastSlice";
import FaceRegistrationDialog from "./components/FaceRegistration/FaceRegistration";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ObjectDetecion from "./components/ObjectDetection/ObjectDetecion";
import EyeGaze from "./components/EyeGaze/EyeGaze";
import VoiceDetection from "./components/VoiceDetection/VoiceDetection";
import ChangeWindow from "./components/ChangeWindow/ChangeWindow";

const TakeExam = () => {
  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = sessionStorage.getItem("permissions");
    return savedPermissions ? JSON.parse(savedPermissions) : {};
  });
  const [changeWindow, SetChangeWindow] = useState(false);
  const [closeFullScreen, SetCloseFullScreen] = useState(false);
  const dispatch = useDispatch();
  const { Examid } = useParams();
  const { id } = useParams();
  const [instructionOpen, setInstructionOpen] = useState(true);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [fullScreenDialogOpen, setFullScreenDialogOpen] = useState(false);
  const [faceRegistrationOpen, setFaceRegistrationOpen] = useState(false);
  const [exam, setExam] = useState({
    loading: false,
    exam: null,
    errorMsg: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitError, setSubmitError] = useState(""); // New state for submit error message
  const navigate = useNavigate(); // useNavigate hook from react-router
  const [open, setOpen] = useState(false);
  const [check, setCheck] = useState({
    loading: false,
    errorMsg: "",
  });
  const handleInstructionsAgree = () => {
    setInstructionOpen(false);
    if (!permissions.camera || !permissions.microphone) {
      setPermissionDialogOpen(true);
    } else {
      setFullScreenDialogOpen(true);
    }
  };

  const handlePermissionsGranted = () => {
    setPermissionDialogOpen(false);
    setFullScreenDialogOpen(true);
  };

  const handleFullScreenAccepted = () => {
    setFullScreenDialogOpen(false);
    setFaceRegistrationOpen(true);
  };

  useEffect(() => {
    const handleCopyPaste = (event) => {
      event.preventDefault();
      return false;
    };

    const disableContextMenu = (event) => event.preventDefault();

    const disableShortcuts = (event) => {
      if (
        event.key === "PrintScreen" ||
        (event.ctrlKey && event.key === "p") ||
        (event.metaKey && event.key === "p")
      ) {
        event.preventDefault();
        alert("Screenshots are disabled on this page.");
      }
    };

    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableShortcuts);

    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableShortcuts);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // This triggers the browser's default confirmation dialog
      sessionStorage.setItem("isLeaving", "true"); // Set the flag to true when user attempts to leave
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("isLeaving") === "true") {
      sessionStorage.removeItem("isLeaving");
      navigate("/student/home"); // Navigate to home page if the user is leaving
    }
  }, [navigate]);

  useEffect(() => {
    setExam({
      loading: true,
      errorMsg: "",
    });
    http
      .GET(`exams/${Examid}`)
      .then((response) => {
        setExam({
          loading: false,
          exam: response.data.data.data,
          errorMsg: "",
        });
      })
      .catch((error) => {
        setExam({
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  }, [Examid]);

  const handleAnswerChange = (questionIndex, answerIndex) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerIndex,
    }));
  };
  const handelSetCheatingDetails = (condition) => {
    http
      .POST(`detect/addCheating/${Examid}`, {
        cheatingDetalis: condition,
      })
      .then((response) => {})
      .catch((error) => {
        setCheck({
          loading: false,
          errorMsg: "Something went wrong",
        });
      });
  };
  const handelIlligelActionTriggered = () => {
    setLoadingSubmit(true);
    http
      .POST(`exams/autoGrade/${Examid}`, {
        title: exam.exam.title,
        course: id,
        Questions: [],
      })
      .then((response) => {
        handelSetCheatingDetails(
          changeWindow ? "Change Window" : "close Full Screen"
        );
        setLoadingSubmit(false);
        setOpen(false);
        setSubmitError("");
      })
      .catch((error) => {
        dispatch(
          openToast({
            msg: "Something went wrong, please try again later.",
            type: "error",
          })
        );
        setLoadingSubmit(false);
        setOpen(false);
        setSubmitError("Something went wrong, please try again later.");
      });
  };
  const handleSubmit = () => {
    setLoadingSubmit(true);
    setSubmitError(""); // Clear any previous submit errors
    const unansweredQuestions = exam.exam.Questions.some(
      (question, index) => selectedAnswers[index] === undefined
    );

    if (unansweredQuestions) {
      setLoadingSubmit(false);
      setOpen(false);
      setSubmitError("Please answer all questions before submitting the exam.");
      return;
    }

    const formattedAnswers = exam.exam.Questions.map((question, index) => ({
      numberOfQuestion: index + 1,
      Points: question.Points,
      Answer: question.Answers[selectedAnswers[index]].body,
    }));
    const formattedExam = {
      title: exam.exam.title,
      course: id,
      Questions: formattedAnswers,
    };

    http
      .POST(`exams/autoGrade/${Examid}`, formattedExam)
      .then((response) => {
        setLoadingSubmit(false);
        setOpen(false);
        setSubmitError("");
        dispatch(
          openToast({
            msg: "Exam submitted successfully",
            type: "success",
          })
        );
        navigate("/student/home");
      })
      .catch((error) => {
        dispatch(
          openToast({
            msg: "Something went wrong, please try again later.",
            type: "error",
          })
        );
        setLoadingSubmit(false);
        setOpen(false);
        setSubmitError("Something went wrong, please try again later.");
      });
    // Submit the formatted exam
  };
  useEffect(() => {
    if (changeWindow || closeFullScreen) {
      handelIlligelActionTriggered();
    }
  }, [changeWindow, closeFullScreen]);

  const handelCheck = (Examid) => {
    setCheck({ ...check, loading: true, errorMsg: "" });
    http
      .POST(`exams/check/${Examid}`)
      .then((response) => {
        setCheck({
          ...check,
          loading: false,
          errorMsg: "",
        });

        if (response.data.massage === false) {
          dispatch(
            openToast({ type: "error", msg: "You Enterd this Exam before" })
          );
          navigate(`/student/home`);
        }
      })
      .catch((error) => {
        setCheck({
          ...check,
          loading: false,
          errorMsg: "Something went wrong",
        });
        dispatch(openToast({ type: "error", msg: "Something went wrong" }));
      });
  };

  useEffect(() => {
    handelCheck();
  }, []);
  return (
    <section className="takeExam-section">
      {exam.loading && (
        <CircularProgress
          sx={{
            margin: "auto",
            display: "block",
          }}
          size={60}
          color="inherit"
        />
      )}
      <div
        className={`container ${
          instructionOpen || permissionDialogOpen || fullScreenDialogOpen
            ? "blur"
            : ""
        }`}
      >
        {!instructionOpen &&
          !permissionDialogOpen &&
          !fullScreenDialogOpen &&
          !faceRegistrationOpen &&
          exam.exam &&
          !exam.loading && (
            <>
              <div className="right">
                {exam.errorMsg && (
                  <Alert severity="error">{exam.errorMsg}</Alert>
                )}
                {submitError && <Alert severity="error">{submitError}</Alert>}
                <div className="header">
                  <h1>{exam.exam.title}</h1>
                  <div
                    className="submit-btn main-btn sm"
                    onClick={() => setOpen(true)}
                  >
                    Submit
                  </div>
                </div>
                <div className="questions">
                  {exam.exam.Questions.map((question, index) => (
                    <div className="question" key={index}>
                      <div className="header">
                        <h2>Question {index + 1}:</h2>
                        <h3>({question.Points} Points)</h3>
                      </div>
                      <div className="question-title">
                        {question.QuestionTitle}
                      </div>
                      <div className="answers-container">
                        <ul>
                          {question.Answers.map((answer, ansIndex) => (
                            <li key={ansIndex}>
                              <label>
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  checked={selectedAnswers[index] === ansIndex}
                                  onChange={() =>
                                    handleAnswerChange(index, ansIndex)
                                  }
                                />
                                {answer.body}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="left">
                <div className="camera-and-timer">
                  <div className="camera">
                    <Camera />
                  </div>
                  <div className="timer">
                    <CountdownTimer startMinutes={exam.exam.duration} />
                  </div>
                </div>
              </div>
              {!changeWindow && !closeFullScreen && (
                <>
                  <FaceRecognition />
                  <ObjectDetecion />
                  <EyeGaze />
                  <VoiceDetection />
                </>
              )}
            </>
          )}
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Exam Instructions"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to submit the exam? if you are sure click on
            Yes I am sure
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="main-btn sm delete" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button
            disabled={loadingSubmit}
            className="main-btn sm"
            onClick={handleSubmit}
          >
            {loadingSubmit ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Yes I am sure"
            )}
          </button>
        </DialogActions>
      </Dialog>
      <ExamInstructionsDialog
        open={instructionOpen}
        setOpen={setInstructionOpen}
        onAgree={handleInstructionsAgree}
      />
      <RequestCameraAndMicrophone
        open={permissionDialogOpen}
        setOpen={setPermissionDialogOpen}
        permissions={permissions}
        setPermissions={setPermissions}
        onPermissionsGranted={handlePermissionsGranted}
      />
      <AskFullScreen
        open={fullScreenDialogOpen}
        setOpen={setFullScreenDialogOpen}
        onFullScreenAccepted={handleFullScreenAccepted} // Add this line
        SetCloseFullScreen={SetCloseFullScreen}
      />

      <FaceRegistrationDialog
        open={faceRegistrationOpen}
        setOpen={setFaceRegistrationOpen}
      />
      <ChangeWindow SetChangeWindow={SetChangeWindow} />
    </section>
  );
};

export default TakeExam;
