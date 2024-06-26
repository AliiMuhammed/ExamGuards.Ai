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
import { userImage } from "../../../../Assets/Images/user.png";
function AdminInstructors() {
  const user = getAuthUser();
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({});
  const [open, setOpen] = useState(false);
  const [reloadData, setReloadData] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFile, setSelectedFile] = useState(""); // State to hold the selected file name

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
    setSelectedFile("");
  };
  //add new instructor
  const addInstructor = (data) => {
    // Initialize error message
    let errorMsg = "";

    // Validate required fields
    if (!data.firstName) {
      errorMsg = "First name is required";
    } else if (!data.lastName) {
      errorMsg = "Last name is required";
    } else if (!data.email) {
      errorMsg = "Email is required";
    } else if (!data.password) {
      errorMsg = "Password is required";
    } else if (!data.passwordConfirm) {
      errorMsg = "Password confirmation is required";
    } else if (data.password !== data.passwordConfirm) {
      errorMsg = "Passwords do not match";
    } else if (!data.role) {
      errorMsg = "Role is required";
    } else if (!data.photo[0] === "" || !(data.photo instanceof File)) {
      errorMsg = "Photo is required and should be a valid file";
    }

    // If there are validation errors, set error message and return early
    if (errorMsg) {
      setNewInstructor({
        ...newInstructor,
        loading: false,
        errorMsg: errorMsg,
      });
      return;
    }

    // Proceed with setting loading state and making the HTTP POST request
    setNewInstructor({ ...newInstructor, loading: true });
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("passwordConfirm", data.passwordConfirm);
    formData.append("role", data.role);
    formData.append("photo", data.photo); // Append the photo file

    http
      .POST("users/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setNewInstructor({ ...newInstructor, loading: false });
        setReloadData(true);
        setSelectedFile("");

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
          errorMsg: err?.response?.data?.message || "An error occurred",
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
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0].name); // Update selected file name when a new file is selected
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add new Instructor</DialogTitle>

        <DialogContent>
          {newInstructor.errorMsg && (
            <Alert severity="error">{newInstructor.errorMsg}</Alert>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              addInstructor({
                firstName: data.get("firstName"),
                lastName: data.get("lastName"),
                email: data.get("email"),
                password: data.get("password"),
                passwordConfirm: data.get("passwordConfirm"),
                role: "instructor",
                photo: data.get("photo"), // Include the photo in the data sent
              });
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="firstName"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="lastName"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="password"
              name="password"
              label="Password"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              id="passwordConfirm"
              name="passwordConfirm"
              label="Confirm Password"
              type="text"
              fullWidth
              variant="outlined"
            />
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="photo"
              name="photo"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="photo">
              <Button
                variant="contained"
                size="small"
                style={{ margin: "1rem 0", marginRight: "1rem" }}
                component="span"
              >
                Upload Photo
              </Button>
            </label>
            {selectedFile && <span>Selected file: {selectedFile}</span>}{" "}
            {/* Display selected file name */}
            <DialogActions>
              <button
                type="button"
                className="main-btn sm delete"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="main-btn sm update"
                type="submit"
                disabled={newInstructor.loading}
              >
                {newInstructor.loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Add Instructor"
                )}
              </button>
            </DialogActions>
          </form>
        </DialogContent>
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
