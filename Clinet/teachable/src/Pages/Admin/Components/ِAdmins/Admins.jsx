/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/admins.css";
import http from "./../../../../Helper/http";
import userimg from "../../../../Assets/Images/user.png";
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

const Admins = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const [open, setOpen] = React.useState(false);
  const [reloadData, setReloadData] = useState(true);
  const [ToastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    type: "",
  });
  const [openDeleteDilog, setOpenDeleteDilog] = useState({
    open: false,
    id: "",
  });
  const [deleteUser, setDeleteUser] = useState({
    loading: false,
  });
  const [users, setUsers] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
  const [newAdmin, setNewAdmin] = useState({
    loading: false,
    errorMsg: "",
    successMsg: "",
  });

  //call all admins
  useEffect(() => {
    if (reloadData) {
      setUsers({ ...users, loading: true });
      const params = new URLSearchParams({
        // page: 2,
        // limit: 2,
        role: "admin",
      }).toString();

      http
        .GET(`users?${params}`)
        .then((res) => {
          const localUsers = res?.data?.data?.data?.map((user) => ({
            ...user,
            name: user.firstName + " " + user.lastName,
          }));

          setUsers({ data: localUsers, loading: false, errorMsg: "" });
          setReloadData(false);
        })
        .catch((err) => {
          setUsers({
            ...users,
            loading: false,
            errorMsg: "Something went wrong!",
          });
        });
    }
  }, [reloadData]);

  // handle open and colse toaster
  const handleToastOpen = () => {
    setToastOpen(true);
  };

  const handleSucessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToastOpen(false);
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
          msg: "ِAdmin deleted successfully",
          type: "success",
        });
        handleToastOpen();
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
        handleToastOpen();
      });
  };

  // handel activation user
  const handelActivation = (id) => {
    setLoadingStates({ ...loadingStates, [id]: true });

    setUsers({ ...users, loading: true });
    http
      .PATCH(`users/activate/${id}`)
      .then((res) => {
        console.log(res);
        setReloadData(true);
        setUsers({ ...users, loading: false });
        setLoadingStates({ ...loadingStates, [id]: false });
        setToastMsg({
          ...toastMsg,
          msg: "Operation was completed successfully",
          type: "success",
        });
        handleToastOpen();
      })
      .catch((err) => {
        console.log(err);
        setUsers({ ...users, loading: false });
        setLoadingStates({ ...loadingStates, [id]: false });
        setToastMsg({
          ...toastMsg,
          msg: "Something went wrong",
          type: "error",
        });
        handleToastOpen();
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
              onError={(e) => {
                e.target.style.backgroundImage = `url(${userimg})`;
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

          return (
            <div className="actions-btns">
              <button
                className="main-btn sm delete"
                onClick={() => {
                  handleClickOpenDeleteDilog(userId);
                }}
              >
                Delete
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
        <Tooltip title="Add Admin">
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

  //handle open and close dilog add admin

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //add admin functoin
  const addAdmin = (data) => {
    setNewAdmin({ ...newAdmin, loading: true });
    data.role = "admin";
    console.log(data);
    http
      .POST("users/signup", data)
      .then((res) => {
        setNewAdmin({ ...newAdmin, loading: false });
        setReloadData(true);
        handleClose();
        setToastMsg({
          ...toastMsg,
          msg: "Admin added successfully",
          type: "success",
        });
        handleToastOpen();
      })
      .catch((err) => {
        console.log(err);
        setNewAdmin({
          ...newAdmin,
          loading: false,
          errorMsg: err?.response?.data?.message,
        });
        setToastMsg({
          ...toastMsg,
          msg: "Something went wrong",
          type: "error",
        });
        handleToastOpen();
      });
  };

  return (
    <section className="admin-admins-section">
      <div className="container">
        {users.errorMsg !== "" && (
          <Alert severity="error">{users.errorMsg}</Alert>
        )}
        {users.data.length === 0 && users.errorMsg === "" && (
          <>
            <Alert severity="info">No Admins Found</Alert>
            <MainTabel
              title={"Admins"}
              data={users.data}
              columns={columns}
              customOptions={options}
            />
          </>
        )}
        {users.data.length > 0 && users.errorMsg === "" && (
          <MainTabel
            title={"Admins"}
            data={users.data}
            columns={columns}
            customOptions={options}
          />
        )}
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
            addAdmin(formJson);
          },
        }}
      >
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          {newAdmin.errorMsg !== "" && (
            <Alert severity="error">{newAdmin.errorMsg}</Alert>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
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

      <MyToast
        handleClose={handleSucessClose}
        open={ToastOpen}
        msg={toastMsg}
      />
    </section>
  );
};

export default Admins;
