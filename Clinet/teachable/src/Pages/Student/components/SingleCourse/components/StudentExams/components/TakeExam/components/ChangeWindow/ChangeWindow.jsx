import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router";

const ChangeWindow = ({ SetChangeWindow }) => {
  const [examCanceled, setExamCanceled] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examCanceled) {
        setExamCanceled(true);
        setOpen(true);
        SetChangeWindow(true);
      }
    };

    const handleBlur = () => {
      if (!examCanceled) {
        setExamCanceled(true);
        setOpen(true);
        SetChangeWindow(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [examCanceled]);

  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
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

export default ChangeWindow;
