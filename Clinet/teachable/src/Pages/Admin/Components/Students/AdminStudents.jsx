/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/adminStudents.css";
import http from "./../../../../Helper/http";
import userimg from "../../../../Assets/Images/user.png";
import MainTabel from "../MainTabel/MainTabel";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import MyToast from "../../../../Shared/Components/MyToast";
import { getAuthUser } from "../../../../Helper/Storage";
function AdminStudents() {
  const user = getAuthUser();
  const [loadingStates, setLoadingStates] = useState({});
  const [reloadData, setReloadData] = useState(true);
  const [ToastOpen, setToastOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    type: "",
  });
  const [openDeleteDilog, setOpenDeleteDilog] = useState({
    open: false,
    id: "",
  });
  const [openUpdateDilog, setOpenUpdateDilog] = useState({
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

  const [updateStudent, setUpdateStudent] = useState({
    loading: false,
    errorMsg: "",
  });

  //handel udate user dialog
  const handleCloseUpdateDilog = () => {
    setOpenUpdateDilog({ open: false, id: "" });
    setUpdateStudent((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  const handleClickOpenUpdateDilog = (id) => {
    setOpenUpdateDilog({ open: true, id: id });
    setUpdateStudent((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };

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
          msg: "Student deleted successfully",
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

    http
      .PATCH(`users/activate/${id}`)
      .then((res) => {
        console.log(res);
        setReloadData(true);
        setLoadingStates({ ...loadingStates, [id]: false });
      })
      .catch((err) => {
        setLoadingStates({ ...loadingStates, [id]: false });
      });
  };

  // handel update user
  const updateUser = (data) => {
    setUpdateStudent({ ...updateStudent, loading: true });

    http
      .PATCH(`users/${openUpdateDilog.id}`, data)
      .then((res) => {
        setUpdateStudent({
          ...updateStudent,
          loading: false,
          errorMsg: "",
        });
        setReloadData(true);
        setToastMsg({
          ...toastMsg,
          msg: "Student updated successfully",
          type: "success",
        });
        handleCloseUpdateDilog();
        handleToastOpen();
      })
      .catch((err) => {
        setUpdateStudent({
          ...updateStudent,
          loading: false,
          errorMsg: "Please enter valid data",
        });

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
          const userImg = users.data[tableMeta.rowIndex]?.file;
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
              className={value ? " main-btn sm update" : " main-btn sm delete"}
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

  //call all admins
  useEffect(() => {
    if (reloadData) {
      setUsers({ ...users, loading: true });
      const params = new URLSearchParams({
        // page: 2,
        // limit: 2,
        role: "student",
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
          console.log(users.data);
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

  return (
    <section className="admin-students-section">
      <div className="container">
        {users.errorMsg !== "" && (
          <Alert severity="error">{users.errorMsg}</Alert>
        )}
        {users.data.length === 0 &&
          users.errorMsg === "" &&
          users.loading === false && (
            <>
              <Alert severity="info">No Students Found</Alert>
              <MainTabel
                title={"Students"}
                data={users.data}
                columns={columns}
              />
            </>
          )}
        {users.data.length > 0 &&
          users.errorMsg === "" &&
          users.loading === false && (
            <MainTabel title={"Students"} data={users.data} columns={columns} />
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
                setUpdateStudent((prevState) => ({
                  ...prevState,
                  errorMsg: "You must enter valid data to update",
                }));
              } else {
                updateStudent.errorMsg = "";
                updateUser(filteredObj);
              }
            },
          }}
        >
          <DialogTitle>Udate Instractor</DialogTitle>
          <DialogContent>
            {updateStudent.errorMsg !== "" && (
              <Alert severity="error">{updateStudent.errorMsg}</Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
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
              disabled={updateStudent.loading}
            >
              {updateStudent.loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "update"
              )}
            </Button>
          </DialogActions>
        </Dialog>
        {/* delete admin dialog */}
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
      </div>
    </section>
  );
}

export default AdminStudents;
