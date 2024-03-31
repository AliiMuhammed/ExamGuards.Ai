/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/admins.css";
import http from "./../../../../Helper/http";
import userimg from "../../../../Assets/Images/user.png";
import MainTabel from "../MainTabel/MainTabel";
import MainSpinner from "../../../../Shared/Components/MainSpinner";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import Alert from "@mui/material/Alert";

const Admins = () => {
  const [loadingStates, setLoadingStates] = useState({});
  const [open, setOpen] = React.useState(false);
  const [reloadData, setReloadData] = useState(true);

  const [users, setUsers] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
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
      })
      .catch((err) => {
        console.log(err);
        setUsers({ ...users, loading: false });
        setLoadingStates({ ...loadingStates, [id]: false });
      });
  };

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
              {isLoading ? "Loading..." : value ? "Activated" : "Inactive"}
            </button>
          );
        },
      },
    },
  ];

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

          setUsers({ data: localUsers, loading: false });
          setReloadData(false);
          console.log(users.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reloadData]);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [newAdmin, setNewAdmin] = useState({
    loading: false,
    errorMsg: "",
    successMsg: "",
  });

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
      })
      .catch((err) => {
        console.log(err);
        setNewAdmin({
          ...newAdmin,
          loading: false,
          errorMsg: err?.response?.data?.message,
        });
      });
  };

  return (
    <section className="admin-admins-section">
      <div className="container">
        {users.data.length === 0 && <MainSpinner />}
        {users.data.length !== 0 && (
          <>
            <MainTabel
              title={"Admins"}
              data={users.data}
              columns={columns}
              customOptions={options}
            />
          </>
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
    </section>
  );
};

export default Admins;
