import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import http from "../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";

const DeleteDialog = ({ open, setOpen, reload }) => {
  const dispatch = useDispatch();
  const [deleteModule, setDeleteModule] = useState({
    loading: false,
  });
  const close = () => {
    setOpen({ ...open, open: false, id: "" });
    setDeleteModule({ ...deleteModule, errorMsg: "" });
  };

  // delete module
  const handleDeleteModule = () => {
    setDeleteModule({ ...deleteModule, loading: true });
    http
      .DELETE(`modules/${open.id}`)
      .then((res) => {
        setDeleteModule({ ...deleteModule, loading: false });
        reload(true);
        close();
        dispatch(
          openToast({
            msg: "Module deleted successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setDeleteModule({
          ...deleteModule,
          loading: false,
        });
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
      fullWidth
      open={open.open}
      onClose={close}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        {"Do you want to delete this Module?"}
      </DialogTitle>
      <DialogContent>
        If you delete this module, you will not be able to recover it.
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={close}>
          Cancel
        </Button>
        <Button
          onClick={handleDeleteModule}
          variant="contained"
          disabled={deleteModule.loading}
          color="error"
        >
          {deleteModule.loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
DeleteDialog.propTypes = {
  open: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
  }),
  setOpen: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
};
export default DeleteDialog;
