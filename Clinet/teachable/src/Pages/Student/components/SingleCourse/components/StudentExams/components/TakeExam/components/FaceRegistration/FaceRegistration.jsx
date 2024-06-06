import React, { useRef, useCallback, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import Webcam from "react-webcam";
import "./style/faceRegistration.css";
import http from "../../../../../../../../../../Helper/http";
import { getAuthUser } from "../../../../../../../../../../Helper/Storage";
import CircularProgress from "@mui/material/CircularProgress";

const FaceRegistrationDialog = ({ open, setOpen }) => {
  const [userReg, setUserReg] = useState({
    loading: false,
    errorMsg: "",
    match: null,
  });
  const { Examid } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const userImg = getAuthUser().data.data.user.file;
  console.log(userImg);
  const handleClose = () => {
    setOpen(false);
    navigate("/student/home");
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const saveImage = () => {
    setUserReg({
      loading: true,
      errorMsg: "",
    });

    if (capturedImage) {
      // Convert base64 to file
      const byteString = atob(capturedImage.split(",")[1]);
      const mimeString = capturedImage.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "capturedImage.jpg");

      // Create form data
      const formData = new FormData();
      formData.append("image_files", file);
      formData.append("reference_image_url", userImg);

      // Send form data to server
      http
        .POST(`detect/faceRecognition/${Examid}`, formData)
        .then((response) => {
          console.log(response.data.message);
          setUserReg({
            loading: false,
            errorMsg: "",
            match: response.data.message === "Matching" ? true : false,
          });
          if (response.data.message === "Matching") {
            setOpen(false);
          }
          console.log(response.data.message);
        })
        .catch((error) => {
          setUserReg({
            loading: false,
            errorMsg: "some error occurred",
            match: null,
          });
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Face Registration</DialogTitle>
      <DialogContent>
        {userReg.match === false && userReg.match !== null && (
          <p className="errorMsg">You can't be registered to this exam</p>
        )}
        <div className="camera-registering">
          {!capturedImage && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "100%" }} // Webcam will be displayed when not captured
            />
          )}
          {capturedImage && (
            <img src={capturedImage} alt="Captured" style={{ width: "100%" }} />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        {!capturedImage && (
          <button className="main-btn sm" onClick={capture}>
            Capture Image
          </button>
        )}
        {capturedImage && (
          <button className="main-btn sm" onClick={saveImage}>
            {userReg.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Register"
            )}
          </button>
        )}
        <button className="main-btn sm delete" onClick={handleClose}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default FaceRegistrationDialog;
