import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router";
import "./style/askFullScreen.css";

const AskFullScreen = ({ open, setOpen, onFullScreenAccepted }) => {
  const navigate = useNavigate();

  const [isFullScreen, setLocalFullScreen] = useState(false);
  const [examCanceled, setExamCanceled] = useState(false);
  const [showFullScreenDialog, setShowFullScreenDialog] = useState(true);

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setLocalFullScreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setLocalFullScreen(false);
        })
        .catch((err) => {
          console.error(
            `Error attempting to disable full-screen mode: ${err.message} (${err.name})`
          );
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (!isFullScreen) {
      setExamCanceled(true);
      setShowFullScreenDialog(false);
    }
  };

  const handleContinue = () => {
    setOpen(false);
    if (isFullScreen && onFullScreenAccepted) {
      onFullScreenAccepted();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setLocalFullScreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setExamCanceled(true);
        setShowFullScreenDialog(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [setOpen]);

  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      {!examCanceled && showFullScreenDialog && (
        <Dialog
          open={open}
          onClose={null}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Enable Fullscreen Mode"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This application requires fullscreen mode to proceed. Please
              enable fullscreen mode.
            </DialogContentText>
            {!isFullScreen ? (
              <button
                className="main-btn sm update fullScreen-btn "
                onClick={handleFullScreen}
              >
                Go Fullscreen
              </button>
            ) : null}
          </DialogContent>
          <DialogActions>
            {!isFullScreen && (
              <button className="main-btn sm" onClick={handleClose}>
                Close
              </button>
            )}
            {isFullScreen && (
              <button className="main-btn sm update" onClick={handleContinue}>
                Continue
              </button>
            )}
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={examCanceled}>
        <DialogTitle>{"Exam Canceled"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The exam has been canceled because you exited fullscreen mode or did
            not follow instructions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="main-btn sm"
            onClick={() => navigate(`/student/home`)}
          >
            Go Home
          </button>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
};

export default AskFullScreen;
