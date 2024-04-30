/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/adminCourses.css";
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
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";

const AdminCourses = () => {
  const dispatch = useDispatch();

  const [loadingStates, setLoadingStates] = useState({});
  const [open, setOpen] = useState(false);
  const [reloadData, setReloadData] = useState(true);
  const [SelectedIntsructor, setSelectedIntsructor] = useState("");
  const [openDeleteDilog, setOpenDeleteDilog] = useState({
    open: false,
    id: "",
  });
  const [openUpdateDilog, setOpenUpdateDilog] = useState({
    open: false,
    id: "",
  });
  const [openAssignDilog, setOpenAssignDilog] = useState({
    open: false,
    id: "",
  });

  const [courses, setCourses] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
  const [deleteCourse, setDeleteCourse] = useState({
    loading: false,
  });
  const [newCourse, setNewCourse] = useState({
    loading: false,
    errorMsg: "",
  });
  const [updateCourse, setUpdateCourse] = useState({
    loading: false,
    errorMsg: "",
  });
  const [assignCourse, setAssignCourse] = useState({
    loading: false,
    errorMsg: "",
  });

  const [allInstructors, setAllInstructors] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
  //call all Courses
  useEffect(() => {
    if (reloadData) {
      setCourses({ ...courses, loading: true });

      http
        .GET(`courses`)
        .then((res) => {
          setCourses({
            data: res.data.data.data,
            loading: false,
            errorMsg: "",
          });
          setReloadData(false);
        })
        .catch((err) => {
          setCourses({
            ...courses,
            loading: false,
            errorMsg: "Something went wrong!",
          });
        });
    }
  }, [reloadData]);

  //handel update course dilog
  const handleCloseUpdateDilog = () => {
    setOpenUpdateDilog({ open: false, id: "" });
    setUpdateCourse((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  //handel update course dilog
  const handleCloseAssignDilog = () => {
    setOpenAssignDilog({ open: false, id: "" });
    setAssignCourse((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  const handleClickOpenAssignDilog = (id) => {
    setOpenAssignDilog({ open: true, id: id });
    setAssignCourse((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  const handleClickOpenUpdateDilog = (id) => {
    setOpenUpdateDilog({ open: true, id: id });
    setUpdateCourse((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  // handel update course
  const updateCourses = (data) => {
    setUpdateCourse({ ...updateCourse, loading: true });
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    http
      .PATCH(`courses/${openUpdateDilog.id}`, formData)
      .then((res) => {
        setUpdateCourse({
          ...updateCourse,
          loading: false,
          errorMsg: "",
        });
        setReloadData(true);
        dispatch(
          openToast({
            msg: "Course updated successfully",
            type: "success",
          })
        );
        handleCloseUpdateDilog();
      })
      .catch((err) => {
        setUpdateCourse({
          ...updateCourse,
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
  //handel delete course dilog
  const handleCloseDeleteDilog = () => {
    setOpenDeleteDilog({ open: false, id: "" });
  };
  const handleClickOpenDeleteDilog = (id) => {
    setOpenDeleteDilog({ open: true, id: id });
  };
  // handel delete course
  const handleDelete = () => {
    setDeleteCourse({ ...deleteCourse, loading: true });
    http
      .DELETE(`courses/${openDeleteDilog.id}`)
      .then((res) => {
        setReloadData(true);
        setDeleteCourse({
          ...deleteCourse,
          loading: false,
        });
        handleCloseDeleteDilog();
        dispatch(
          openToast({
            msg: "Course deleted successfully",
            type: "success",
          })
        );
      })

      .catch((err) => {
        setDeleteCourse({
          ...deleteCourse,
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

  //handle open and close dilog add course
  const handleClickOpen = () => {
    setOpen(true);
    setNewCourse((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  const handleClose = () => {
    setOpen(false);
    setNewCourse((prevState) => ({
      ...prevState,
      errorMsg: "",
    }));
  };
  //add new course
  const addCourse = (data) => {
    setNewCourse({ ...newCourse, loading: true });
    http
      .POST("courses", data)
      .then((res) => {
        setNewCourse({ ...newCourse, loading: false });
        setReloadData(true);
        handleClose();
        dispatch(
          openToast({
            msg: "Course added successfully",
            type: "success",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        setNewCourse({
          ...newCourse,
          loading: false,
          errorMsg: err?.message,
        });
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  };

  // handel activation user
  const handelActivation = (id) => {
    setLoadingStates({ ...loadingStates, [id]: true });

    http
      .PATCH(`courses/status/${id}`)
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

  //assign the courses to instructor
  const AssignCourses = (id) => {
    const data = {
      courseId: openAssignDilog.id,
      instructorId: id,
    };
    console.log(data);
    setAssignCourse({ ...assignCourse, loading: true });

    http
      .POST(`courses/assign`, data)
      .then((res) => {
        setAssignCourse({
          ...assignCourse,
          loading: false,
          errorMsg: "",
        });
        setReloadData(true);
        dispatch(
          openToast({
            msg: "Course assigned successfully",
            type: "success",
          })
        );
        handleCloseAssignDilog();
      })
      .catch((err) => {
        setAssignCourse({
          ...assignCourse,
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

  //call all insturctors
  useEffect(() => {
    setAllInstructors({ ...allInstructors, loading: true });
    http
      .GET("/users?role=instructor")
      .then((response) => {
        setAllInstructors({
          data: response.data.data.data,
          loading: false,
          errorMsg: "",
        });
      })
      .catch((err) => {
        setAllInstructors({
          ...allInstructors,
          loading: false,
          errorMsg: "Something went wrong!",
        });
      });
  }, []);

  // table column and options
  const columns = [
    {
      name: "file",
      label: "Image",
      options: {
        customBodyRender: (value, tableMeta) => {
          const courseImg = courses.data[tableMeta.rowIndex]?.file;
          return (
            <div
              className="user-table-img"
              style={{
                backgroundImage: `url(${courseImg})`,
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
      name: "description",
      options: {
        customBodyRender: (value) => {
          return (
            <div>{value.length > 15 ? `${value.slice(0, 15)}...` : value}</div>
          );
        },
      },
    },
    {
      name: "duration",
    },
    {
      name: "durationWeeks",
      label: "lectures",
    },
    {
      name: "active",
      options: {
        customBodyRender: (value, tableMeta) => {
          const courseId = courses.data[tableMeta.rowIndex]?._id;
          const isLoading = loadingStates[courseId];
          let status;
          if (isLoading) {
            status = <CircularProgress size={20} color="inherit" />;
          } else {
            status = value ? "Activated" : "Inactive";
          }

          return (
            <button
              onClick={() => handelActivation(courseId)}
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
          const courseId = courses.data[tableMeta.rowIndex]?._id;

          return (
            <div className="actions-btns">
              <button
                className="main-btn sm"
                onClick={() => {
                  handleClickOpenAssignDilog(courseId);
                }}
              >
                Assign
              </button>
              <button
                className="main-btn sm delete"
                onClick={() => {
                  handleClickOpenDeleteDilog(courseId);
                }}
              >
                Delete
              </button>
              <button
                className="main-btn sm update"
                onClick={() => {
                  handleClickOpenUpdateDilog(courseId);
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
      <Tooltip title="Add Course">
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
    <section className="admin-courses-section">
      <div className="container">
        {courses.errorMsg !== "" && (
          <Alert severity="error">{courses.errorMsg}</Alert>
        )}
        {courses.data.length === 0 &&
          courses.errorMsg === "" &&
          courses.loading === false && (
            <>
              <Alert severity="info">No Courses Found</Alert>
              <MainTabel
                title={"Courses"}
                data={courses.data}
                columns={columns}
                customOptions={options}
              />
            </>
          )}
        {courses.data.length > 0 &&
          courses.errorMsg === "" &&
          courses.loading === false && (
            <MainTabel
              title={"Courses"}
              data={courses.data}
              columns={columns}
              customOptions={options}
            />
          )}
        {courses.data.length === 0 &&
          courses.errorMsg === "" &&
          courses.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {courses.data.length > 0 &&
          courses.errorMsg === "" &&
          courses.loading === true && (
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
      {/* assign dialog */}
      <Dialog
        open={openAssignDilog.open}
        onClose={handleCloseAssignDilog}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            formJson.role = SelectedIntsructor;
            if (formJson.role.length === 0) {
              setAssignCourse((prevState) => ({
                ...prevState,
                errorMsg: "Please select instructor",
              }));
            } else {
              assignCourse.errorMsg = "";
              AssignCourses(SelectedIntsructor);
            }
          },
        }}
      >
        <DialogTitle>Assign Course to Instructor</DialogTitle>
        <DialogContent>
          {assignCourse.errorMsg !== "" && (
            <Alert severity="error">{assignCourse.errorMsg}</Alert>
          )}

          {allInstructors.data.length > 0 && (
            <FormControl fullWidth variant="standard" margin="dense">
              <InputLabel htmlFor="instructor">Select a Instructor</InputLabel>
              <Select
                id="instructor"
                name="instructor"
                value={SelectedIntsructor}
                onChange={(event) => setSelectedIntsructor(event.target.value)}
              >
                {allInstructors.data?.map((instructor) => (
                  <MenuItem key={instructor._id} value={instructor._id}>
                    {`${instructor.firstName} ${instructor.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {allInstructors.data.length === 0 && (
            <Alert severity="info">There is no instructor to assign</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseAssignDilog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            disabled={assignCourse.loading}
          >
            {assignCourse.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Assign"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {/* update dialog */}
      <Dialog
        open={openUpdateDilog.open}
        onClose={handleCloseUpdateDilog}
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
            delete filteredObj["photo"];
          }

          if (Object.keys(filteredObj).length === 0) {
            setUpdateCourse((prevState) => ({
              ...prevState,
              errorMsg: "You must enter valid data to update",
            }));
          } else {
            updateCourses.errorMsg = "";
            console.log(filteredObj);
            updateCourses(filteredObj);
          }
        }}
      >
        <DialogTitle>Udate Course</DialogTitle>
        <DialogContent>
          {updateCourse.errorMsg !== "" && (
            <Alert severity="error">{updateCourse.errorMsg}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="courseName"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            id="outlined-multiline-static"
            margin="dense"
            label="Description"
            name="description"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="duration"
            name="duration"
            label="Duration Hours"
            type="number"
            fullWidth
            variant="standard"
          />
          <FormControl fullWidth sx={{ marginTop: "1.5rem" }}>
            <Input
              id="file-input"
              variant="standard"
              name="photo"
              type="file"
              accept="image/*"
              onChange={() => {}}
            />
            <FormHelperText sx={{ margin: "0.5rem 0" }}>
              Choose a file for the course thumbnail
            </FormHelperText>
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
            disabled={updateCourse.loading}
          >
            {updateCourse.loading ? (
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
        component="form" // Set the component to "form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          if (formData.has("photo") && formData.get("photo") !== "") {
            setNewCourse((prevState) => ({
              ...prevState,
              errorMsg: "",
            }));
            addCourse(formData);
          } else {
            setNewCourse((prevState) => ({
              ...prevState,
              errorMsg: "Please select a course thumbnail",
            }));
          }
        }}
      >
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          {newCourse.errorMsg !== "" && (
            <Alert severity="error">{newCourse.errorMsg}</Alert>
          )}
          <TextField
            autoFocus
            required
            margin="dense"
            id="courseName"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            id="outlined-multiline-static"
            margin="dense"
            label="Description"
            name="description"
            type="text"
            fullWidth
            variant="standard"
            required
          />
          <TextField
            required
            margin="dense"
            id="duration"
            name="duration"
            label="Duration Hours"
            type="number"
            fullWidth
            variant="standard"
          />
          <FormControl fullWidth sx={{ marginTop: "1.5rem" }}>
            <Input
              required
              id="file-input"
              variant="standard"
              name="photo"
              type="file"
              accept="image/*"
              onChange={() => {}}
            />
            <FormHelperText sx={{ margin: "0.5rem 0" }}>
              Choose a file for the course thumbnail
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            disabled={newCourse.loading}
          >
            {newCourse.loading ? (
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
          {"Do you want to delete this course?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you delete this course, you will not be able to recover it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDeleteDilog}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            disabled={deleteCourse.loading}
            color="error"
          >
            {deleteCourse.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default AdminCourses;
