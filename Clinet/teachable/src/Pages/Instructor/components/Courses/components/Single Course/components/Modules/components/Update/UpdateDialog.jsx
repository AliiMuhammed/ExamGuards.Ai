import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import http from "../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";

const UpdateDialog = ({ open, setOpen, reload  }) => {
  const dispatch = useDispatch();
  const [UpdateMaterials, setUpdateMaterials] = useState({
    loading: false,
    errorMsg: "",
  });

  // update module

  const close = () => {
    setOpen({ ...open, open: false, id: "" });
    setUpdateMaterials({ ...UpdateMaterials, errorMsg: "" });
  };

  const handleUpdateModule = (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    setUpdateMaterials({ ...UpdateMaterials, loading: true });
    http
      .PATCH(`modules/${open.id}`, formData)
      .then((res) => {
        setUpdateMaterials({
          ...UpdateMaterials,
          loading: false,
          errorMsg: "",
        });
        reload(true);
        close();
        dispatch(
          openToast({
            msg: "Module updated successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setUpdateMaterials((prevState) => ({
          ...prevState,
          loading: false,
          errorMsg: "Something went wrong",
        }));
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  };
  return (
    <Dialog
      open={open.open}
      onClose={close}
      fullWidth
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const filteredObj = Object.fromEntries(
          Object.entries(formJson).filter(([key, value]) => value !== "")
        );

        // Check if a file is selected
        const fileInput = document.getElementById("file-input");
        if (fileInput.files.length === 0 || fileInput.files[0].size === 0) {
          delete filteredObj["file"];
        }

        // Check if any field is empty
        if (Object.keys(filteredObj).length === 0) {
          setUpdateMaterials((prevState) => ({
            ...prevState,
            errorMsg: "You must enter valid data to update",
          }));
        } else {
          if (formData.get("video") !== "") {
            const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(
              formData.get("video")
            );
            if (!isValidUrl) {
              setUpdateMaterials((prevState) => ({
                ...prevState,
                errorMsg: "Invalid video URL",
              }));
              return;
            }
          }

          setUpdateMaterials((prevState) => ({
            ...prevState,
            errorMsg: "",
          }));
          handleUpdateModule(filteredObj);
        }
      }}
    >
      <DialogTitle>Udate Materials</DialogTitle>
      <DialogContent>
        {UpdateMaterials.errorMsg !== "" && (
          <Alert severity="error">{UpdateMaterials.errorMsg}</Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="courseName"
          name="video"
          label="Video URL"
          type="text"
          fullWidth
          variant="standard"
        />
        <FormControl fullWidth sx={{ marginTop: "1.5rem" }}>
          <Input
            id="file-input"
            variant="standard"
            name="file"
            type="file"
            accept=".pdf"
            onChange={() => {}}
          />
          <FormHelperText sx={{ margin: "0.5rem 0" }}>
            Choose a Lecture file to update
          </FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={close}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="success"
          disabled={UpdateMaterials.loading}
        >
          {UpdateMaterials.loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Update Materials"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateDialog.propTypes = {
  open: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
  }),
  setOpen: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
};

export default UpdateDialog;
