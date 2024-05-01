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

const AddMaterials = ({ open, setOpen, reload }) => {
  const dispatch = useDispatch();
  const [addMaterials, setAddMaterials] = useState({
    loading: false,
    errorMsg: "",
  });
  const close = () => {
    setOpen({ ...open, open: false, id: "" });
    setAddMaterials({ ...addMaterials, errorMsg: "" });
  };

  // add materials
  const handleAddMaterials = (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    console.log(data);
    setAddMaterials({ ...addMaterials, loading: true });
    http
      .PATCH(`modules/${open.id}`, formData)
      .then((res) => {
        setAddMaterials({ ...addMaterials, loading: false, errorMsg: "" });
        reload(true);
        close();
        dispatch(
          openToast({
            msg: "Materials added successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setAddMaterials((prevState) => ({
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
        const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(
          formData.get("video")
        );

        // Check if any field is empty
        if (Object.values(formJson).some((value) => value === "")) {
          setAddMaterials((prevState) => ({
            ...prevState,
            errorMsg: "All fields are required",
          }));
          return;
        }

        // Check if file is selected
        const fileInput = document.getElementById("file-input");
        if (fileInput.files.length === 0 || fileInput.files[0].size === 0) {
          setAddMaterials((prevState) => ({
            ...prevState,
            errorMsg: "You must select a file",
          }));
          return;
        }

        if (!isValidUrl) {
          setAddMaterials((prevState) => ({
            ...prevState,
            errorMsg: "Invalid video URL",
          }));
          return;
        }

        // Reset error message
        setAddMaterials((prevState) => ({
          ...prevState,
          errorMsg: "",
        }));

        // Proceed with adding materials
        handleAddMaterials(formJson);
      }}
    >
      <DialogTitle>Add Materials</DialogTitle>
      <DialogContent>
        {addMaterials.errorMsg !== "" && (
          <Alert severity="error">{addMaterials.errorMsg}</Alert>
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
            Choose a Lecture file
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
          disabled={addMaterials.loading}
        >
          {addMaterials.loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Add Materials"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
AddMaterials.propTypes = {
  open: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
  }),
  setOpen: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
};
export default AddMaterials;
