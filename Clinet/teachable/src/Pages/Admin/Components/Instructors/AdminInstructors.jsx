/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/adminInstructors.css";
import http from "./../../../../Helper/http";
import MainTabel from "../MainTabel/MainTabel";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import Alert from "@mui/material/Alert";
import MyToast from "../../../../Shared/Components/MyToast";

function AdminInstructors() {
  const [loadingStates, setLoadingStates] = useState({});
  const [deleteLoadingStates, setDeleteLoadingStates] = useState({});
  const [open, setOpen] = useState(false);
  const [SucessOpen, setSucessOpen] = useState(false);
  const [reloadData, setReloadData] = useState(true);
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    type: "",
  });
  const [openDeleteDilog, setOpenDeleteDilog] = useState({
    open: false,
    id: "",
  });
  const [users, setUsers] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
  const [deleteUser, setDeleteUser] = useState({
    loading: false,
  });
  const [newInstractor, setNewInstractor] = useState({
    loading: false,
    errorMsg: "",
  });

  //call all instructors
  useEffect(() => {
    if (reloadData) {
      setUsers({ ...users, loading: true });
      const params = new URLSearchParams({
        role: "instructor",
      }).toString();

      http
        .GET(`users?${params}`)
        .then((res) => {
          const localUsers = res?.data?.data?.data?.map((user) => ({
            ...user,
            name: user.firstName + " " + user.lastName,
          }));

          setUsers({ data: localUsers, loading: false });
          setReloadData(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reloadData]);

  // handle open and colse toaster
  const handleSucessOpen = () => {
    setSucessOpen(true);
  };
  const handleSucessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSucessOpen(false);
  };

  // handel activation user
  const handelActivation = (id) => {
    setLoadingStates({ ...loadingStates, [id]: true });

    setUsers({ ...users, loading: true });
    http
      .PATCH(`users/activate/${id}`)
      .then((res) => {
        setReloadData(true);
        setUsers({ ...users, loading: false });
        setLoadingStates({ ...loadingStates, [id]: false });
        setToastMsg({
          ...toastMsg,
          msg: "Operation was completed successfully",
          type: "success",
        });
        handleSucessOpen();
      })
      .catch((err) => {
        console.log(err);
        setUsers({ ...users, loading: false });
        setLoadingStates({ ...loadingStates, [id]: false });
      });
  };

  //handel delete user dilog
  const handleCloseDeleteDilog = () => {
    setOpenDeleteDilog({ open: false, id: "" });
  };
  const handleClickOpenDeleteDilog = (id) => {
    setOpenDeleteDilog({ open: true, id: id });
  };
  // handel delete user
  const handleDelete = () => {
    setDeleteUser({ ...deleteUser, loading: true });
    http
      .DELETE(`users/${openDeleteDilog.id}`)
      .then((res) => {
        setReloadData(true);
        setDeleteUser({
          ...deleteUser,
          loading: false,
        });
        handleCloseDeleteDilog();
        setToastMsg({
          ...toastMsg,
          msg: "Instructor deleted successfully",
          type: "success",
        });
        handleSucessOpen();
      })

      .catch((err) => {
        setDeleteUser({
          ...deleteUser,
          loading: false,
        });
        handleCloseDeleteDilog();
        setToastMsg({
          ...toastMsg,
          msg: "Something went wrong",
          type: "error",
        });
        handleSucessOpen();
      });
  };

  //handle open and close dilog add instructor
  const handleClickOpen = () => {
    setOpen(true);
    newInstractor.errorMsg = "";
  };
  const handleClose = () => {
    setOpen(false);
    newInstractor.errorMsg = "";
  };

  //add new instructor
  const addInstractor = (data) => {
    setNewInstractor({ ...newInstractor, loading: true });
    data.role = "instructor";
    http
      .POST("users/signup", data)
      .then((res) => {
        setNewInstractor({ ...newInstractor, loading: false });
        setReloadData(true);
        handleClose();

        setToastMsg({
          ...toastMsg,
          msg: "Instructor added successfully",
          type: "success",
        });
        handleSucessOpen();
      })
      .catch((err) => {
        setNewInstractor({
          ...newInstractor,
          loading: false,
          errorMsg: err?.response?.data?.message,
        });
      });
  };

  // table column and options
  const columns = [
    {
      name: "photo",
      label: "Image",
      options: {
        customBodyRender: (value, tableMeta) => {
          const userImg = users.data[tableMeta.rowIndex]?.photo;
          return (
            <div
              className="user-table-img"
              style={{
                backgroundImage: `url(${userImg})`,
              }}
            ></div>
          );
        },
      },
    },
    {
      name: "name",
    },
    {
      name: "email",
    },
    {
      name: "active",
      options: {
        customBodyRender: (value, tableMeta) => {
          const userId = users.data[tableMeta.rowIndex]?._id;
          const isLoading = loadingStates[userId];

          return (
            <button
              onClick={() => handelActivation(userId)}
              disabled={isLoading}
              className={value ? "active-user" : "inactive-user"}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : value ? (
                "Activated"
              ) : (
                "Inactive"
              )}
            </button>
          );
        },
      },
    },
    {
      name: "action",
      options: {
        customBodyRender: (value, tableMeta) => {
          const userId = users.data[tableMeta.rowIndex]?._id;
          const isLoading = deleteLoadingStates[userId];

          return (
            <div className="actions-btns">
              <button className="main-btn sm">Assign</button>
              <button
                className="main-btn sm delete"
                onClick={() => {
                  handleClickOpenDeleteDilog(userId);
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    customToolbar: () => (
      <>
        <Tooltip title="Add Instructor">
          <IconButton onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
    filterType: "multiselect",
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 7,
    rowsPerPageOptions: [7, 50, 100],
  };

  return (
    <section className="admin-instructors-section">
      <div className="container">
        {users.data.length === 0 && (
          <Alert severity="info">No Instructors Found</Alert>
        )}
        <MainTabel
          title={"Instructors"}
          data={users.data}
          columns={columns}
          customOptions={options}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            addInstractor(formJson);
          },
        }}
      >
        <DialogTitle>Add New Instractor</DialogTitle>
        <DialogContent>
          {newInstractor.errorMsg !== "" && (
            <Alert severity="error">{newInstractor.errorMsg}</Alert>
          )}
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="name"
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            disabled={newInstractor.loading}
          >
            {newInstractor.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={openDeleteDilog.open}
        onClose={handleCloseDeleteDilog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to delete this user?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you delete this user, you will not be able to recover it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDeleteDilog}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={deleteUser.loading}
            color="error"
          >
            {deleteUser.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      ;
      <MyToast
        handleClose={handleSucessClose}
        open={SucessOpen}
        msg={toastMsg}
      />
    </section>
  );
}

export default AdminInstructors;
