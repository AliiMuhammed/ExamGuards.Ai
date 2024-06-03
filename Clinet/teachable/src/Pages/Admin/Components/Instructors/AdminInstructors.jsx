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
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAuthUser } from "../../../../Helper/Storage";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";

function AdminInstructors() {
  const user = getAuthUser();
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({});
  const [open, setOpen] = useState(false);
  const [reloadData, setReloadData] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [openDeleteDilog, setOpenDeleteDilog] = useState({
    open: false,
    id: "",
  });
  const [openUpdateDilog, setOpenUpdateDilog] = useState({
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
  const [newInstructor, setNewInstructor] = useState({
    loading: false,
    errorMsg: "",
  });
  const [updateInstructor, setUpdateInstructor] = useState({
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

  // handel activation user
  const handelActivation = (id) => {
    setLoadingStates({ ...loadingStates, [id]: true });

    http
      .PATCH(`users/activate/${id}`)
      .then((res) => {
        setReloadData(true);
        setLoadingStates({ ...loadingStates, [id]: false });
        dispatch(
          openToast({
            msg: "Operation was completed successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setLoadingStates({ ...loadingStates, [id]: false });
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  };

  //handel update user dilog
  const handleCloseUpdateDilog = () => {
    setOpenUpdateDilog({ open: false, id: "" });
    setUpdateInstructor((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  const handleClickOpenUpdateDilog = (id) => {
    setOpenUpdateDilog({ open: true, id: id });
    setUpdateInstructor((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  // handel update user
  const updateUser = (data) => {
    setUpdateInstructor({ ...updateInstructor, loading: true });

    http
      .PATCH(`users/${openUpdateDilog.id}`, data)
      .then((res) => {
        setUpdateInstructor({
          ...updateInstructor,
          loading: false,
          errorMsg: "",
        });
        setReloadData(true);
        handleCloseUpdateDilog();
        dispatch(
          openToast({
            msg: "Instructor updated successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setUpdateInstructor({
          ...updateInstructor,
          loading: false,
          errorMsg: "Please enter valid data",
        });

        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
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
        dispatch(
          openToast({
            msg: "Instructor deleted successfully",
            type: "success",
          })
        );
      })

      .catch((err) => {
        setDeleteUser({
          ...deleteUser,
          loading: false,
        });
        handleCloseDeleteDilog();
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  };

  //handle open and close dilog add instructor
  const handleClickOpen = () => {
    setOpen(true);
    setNewInstructor((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  const handleClose = () => {
    setOpen(false);
    setNewInstructor((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  //add new instructor
  const addInstructor = (data) => {
    setNewInstructor({ ...newInstructor, loading: true });
    http
      .POST("users/signup", data)
      .then((res) => {
        setNewInstructor({ ...newInstructor, loading: false });
        setReloadData(true);
        handleClose();
        dispatch(
          openToast({
            msg: "Instructor added successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        setNewInstructor({
          ...newInstructor,
          loading: false,
          errorMsg: err?.response?.data?.message,
        });
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  };
  // table column and options
  const columns = [
    {
      name: "photo",
      label: "Image",
      options: {
        customBodyRender: (value, tableMeta) => {
          const userImg = users.data[tableMeta.rowIndex]?.file;
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
          let status;
          if (isLoading) {
            status = <CircularProgress size={20} color="inherit" />;
          } else {
            status = value ? "Activated" : "Inactive";
          }

          return (
            <button
              onClick={() => handelActivation(userId)}
              disabled={isLoading}
              className={value ? " main-btn sm update" : " main-btn sm delete"}
            >
              {status}
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
              <button
                className="main-btn sm update"
                onClick={() => {
                  handleClickOpenUpdateDilog(userId);
                }}
              >
                Update
              </button>
            </div>
          );
        },
      },
    },
  ];
  const options = {
    customToolbar: () => (
      <Tooltip title="Add Instructor">
        <IconButton onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
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
        {users.errorMsg !== "" && (
          <Alert severity="error">{users.errorMsg}</Alert>
        )}
        {users.data.length === 0 &&
          users.errorMsg === "" &&
          users.loading === false && (
            <>
              <Alert severity="info">No Instructors Found</Alert>
              <MainTabel
                title={"Instructors"}
                data={users.data}
                columns={columns}
                customOptions={options}
              />
            </>
          )}
        {users.data.length > 0 &&
          users.errorMsg === "" &&
          users.loading === false && (
            <MainTabel
              title={"Instructors"}
              data={users.data}
              columns={columns}
              customOptions={options}
            />
          )}
        {users.data.length === 0 &&
          users.errorMsg === "" &&
          users.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {users.data.length > 0 &&
          users.errorMsg === "" &&
          users.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
      </div>
      {/* update dialog */}
      <Dialog
        open={openUpdateDilog.open}
        onClose={handleCloseUpdateDilog}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            formJson.role = selectedRole;
            console.log(formJson);
            const filteredObj = Object.fromEntries(
              Object.entries(formJson).filter(([key, value]) => value !== "")
            );
            if (Object.keys(filteredObj).length === 0) {
              setUpdateInstructor((prevState) => ({
                ...prevState,
                errorMsg: "You must enter data to update",
              }));
            } else {
              updateInstructor.errorMsg = "";
              updateUser(filteredObj);
            }
          },
        }}
      >
        <DialogTitle>Udate Instructor</DialogTitle>
        <DialogContent>
          {updateInstructor.errorMsg !== "" && (
            <Alert severity="error">{updateInstructor.errorMsg}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="phone"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel htmlFor="role">Role</InputLabel>
            <Select
              id="role"
              name="role"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
              {user?.data.data.user.role === "super admin" && (
                <MenuItem value="super admin">super admin</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseUpdateDilog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            disabled={updateInstructor.loading}
          >
            {updateInstructor.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "update"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* add dialog */}
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
            const filteredObj = Object.fromEntries(
              Object.entries(formJson).filter(([key, value]) => value !== "")
            );
            if (Object.keys(filteredObj).length === 0) {
              setNewInstructor((prevState) => ({
                ...prevState,
                errorMsg: "You must enter data to add new instructor",
              }));
            } else {
              newInstructor.errorMsg = "";
              formJson.role = "instructor";
              addInstructor(formJson);
            }
          },
        }}
      >
        <DialogTitle>Add New Instructor</DialogTitle>
        <DialogContent>
          {newInstructor.errorMsg !== "" && (
            <Alert severity="error">{newInstructor.errorMsg}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="phone"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            id="name"
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
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
            disabled={newInstructor.loading}
          >
            {newInstructor.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* confirm delete dialog */}
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
    </section>
  );
}

export default AdminInstructors;
