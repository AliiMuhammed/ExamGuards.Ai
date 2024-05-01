import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import http from "../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";

const AddModule = ({ open, setOpen, reload }) => {
  const dispatch = useDispatch();
  const [newModule, setNewModule] = useState({
    loading: false,
    errorMsg: "",
  });
  const close = () => {
    setOpen({ ...open, open: false});
    setNewModule({ ...newModule, errorMsg: "" });
  };

  // add new module
  const handleAddModule = (data) => {
    setNewModule({ ...newModule, loading: true });
    http
      .POST(`courses/${open.id}/modules`, data)
      .then((res) => {
        setNewModule({ ...newModule, loading: false, errorMsg: "" });
        reload(true);
        close();
        dispatch(
          openToast({
            msg: "Module added successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setNewModule((prevState) => ({
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
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const filteredObj = Object.fromEntries(
            Object.entries(formJson).filter(([key, value]) => value !== "")
          );
          if (Object.keys(filteredObj).length === 0) {
            setNewModule((prevState) => ({
              ...prevState,
              errorMsg: "You must enter data to add new Module",
            }));
          } else {
            newModule.errorMsg = "";
            handleAddModule(formData);
          }
        },
      }}
    >
      <DialogTitle>Add New Module</DialogTitle>
      <DialogContent>
        {newModule.errorMsg !== "" && (
          <Alert severity="error">{newModule.errorMsg}</Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="title"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={close}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="success"
          disabled={newModule.loading}
        >
          {newModule.loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Add"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
AddModule.propTypes = {
  open: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
  }),
  setOpen: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
};
export default AddModule;
