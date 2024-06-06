import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import "./style/examInstructions.css";
const ExamInstructions = ({ open, setOpen, onAgree }) => {
  const handleAgree = () => {
    setOpen(false);
    onAgree();
  };

  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <Dialog
        open={open}
        onClose={null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Exam Instructions"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div>
              <ul className="list-instructions">
                <li>
                  Students are required to keep their webcam and microphone on
                  all the time throughout the examination.
                </li>
                <li>
                  The student’s front side needs to be visible in front of the
                  camera.
                </li>
                <li>
                  The students are advised to not move their head or eye without
                  necessity. (looking center most of the time)
                </li>
                <li>
                  During the exam, no talking is allowed, that is reading
                  questions out loud is not allowed.
                </li>
                <li>
                  Objects like phones, smartwatches, sunglasses, masks,
                  headphones, hats, books are not allowed.
                </li>
                <li>
                  Multiple faces on the screen are not allowed, and if there’s
                  no face detected too.
                </li>
                <li>
                  Screenshots and changing windows are blocked during the exam.
                </li>
              </ul>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="main-btn sm" onClick={handleAgree}>
            Agree
          </button>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
};

export default ExamInstructions;
