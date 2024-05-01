/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/courseModules.css";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
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
import http from "../../../../../../../../Helper/http";
import { useParams } from "react-router";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowUp } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoAdd } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../Redux/Slices/toastSlice";
import { Link } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
import { RiVideoFill } from "react-icons/ri";

const CourseModules = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState({
    open: false,
    id: "",
  });
  const [reloadData, setReloadData] = useState(true);

  const [modules, setModules] = useState({
    loading: false,
    data: [],
    errorMsg: "",
  });
  const [deleteModule, setDeleteModule] = useState({
    loading: false,
  });
  const [newModule, setNewModule] = useState({
    loading: false,
    errorMsg: "",
  });
  const [OpenAddMaterials, setOpenAddMaterials] = useState({
    open: false,
    id: "",
  });
  const [addMaterials, setAddMaterials] = useState({
    loading: false,
    errorMsg: "",
  });
  // add new module
  const openAddModules = () => {
    setOpen(true);
  };
  const closeAddModules = () => {
    setOpen(false);
    setNewModule({ ...newModule, errorMsg: "" });
  };
  // add new module
  const openAddMaterials = (id) => {
    setOpenAddMaterials({ ...OpenAddMaterials, open: true, id: id });
  };
  const closeAddMaterials = () => {
    setOpenAddMaterials({ ...OpenAddMaterials, open: false, id: "" });
    setAddMaterials({ ...addMaterials, errorMsg: "" });
  };
  // delete module
  const openDeleteModules = (id) => {
    setOpenDelete({ ...openDelete, open: true, id: id });
  };
  const closeDeleteModules = () => {
    setOpenDelete({ ...openDelete, open: false, id: "" });
    setDeleteModule({ ...deleteModule, errorMsg: "" });
  };

  // add new module
  const handleAddModule = (data) => {
    setNewModule({ ...newModule, loading: true });
    http
      .POST(`courses/${id}/modules`, data)
      .then((res) => {
        setNewModule({ ...newModule, loading: false, errorMsg: "" });
        setReloadData(true);
        closeAddModules();
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
  // delete module
  const handleDeleteModule = () => {
    setDeleteModule({ ...deleteModule, loading: true });
    http
      .DELETE(`modules/${openDelete.id}`)
      .then((res) => {
        setDeleteModule({ ...deleteModule, loading: false });
        setReloadData(true);
        closeDeleteModules();
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

  // add materials
  const handleAddMaterials = (data) => {
    console.log(data);
    // setAddMaterials({ ...addMaterials, loading: true });
    // http
    //   .POST(`modules/${OpenAddMaterials.id}/materials`, data)
    //   .then((res) => {
    //     setAddMaterials({ ...addMaterials, loading: false, errorMsg: "" });
    //     setReloadData(true);
    //     closeAddMaterials();
    //     dispatch(
    //       openToast({
    //         msg: "Materials added successfully",
    //         type: "success",
    //       })
    //     );
    //   })
    //   .catch((err) => {
    //     setAddMaterials((prevState) => ({
    //       ...prevState,
    //       loading: false,
    //       errorMsg: "Something went wrong",
    //     }));
    //     dispatch(
    //       openToast({
    //         msg: "Something went wrong",
    //         type: "error",
    //       })
    //     );
    //   });
  };

  // call all modules
  useEffect(() => {
    if (reloadData) {
      setModules({ ...modules, loading: true });
      http
        .GET("courses/" + id + "/modules")
        .then((res) => {
          console.log(res.data.data.data);
          setModules({ ...modules, loading: false, data: res.data.data.data });
          setReloadData(false);
        })
        .catch((err) => {
          console.log(err);
          setModules({
            ...modules,
            loading: false,
            errorMsg: "Something went wrong",
          });
          setReloadData(false);
        });
    }
  }, [reloadData]);

  return (
    <section className="course-modules-section">
      <div className="container">
        {/* handelErrors */}
        {modules.errorMsg !== "" && (
          <Alert severity="error">{modules.errorMsg}</Alert>
        )}
        {/* if no modules */}
        {modules.data.length === 0 &&
          modules.errorMsg === "" &&
          modules.loading === false && (
            <>
              <div className="header">
                <h3>Course Modules</h3>
                <button
                  className="add-modules-btn main-btn sm"
                  onClick={openAddModules}
                >
                  Add Modules
                </button>
              </div>
              <div className="no-modules">
                <span>No Modules</span>
                <HiOutlineArchiveBoxXMark />
              </div>
            </>
          )}
        {/* if loading and there is data*/}
        {modules.data.length > 0 &&
          modules.errorMsg === "" &&
          modules.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {/* if loading and there is no data */}
        {modules.data.length === 0 &&
          modules.errorMsg === "" &&
          modules.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {/* if there is modules */}
        {modules.data.length > 0 &&
          modules.errorMsg === "" &&
          modules.loading === false && (
            <>
              <div className="header">
                <h3>Course Modules</h3>
                <button
                  className="add-modules-btn main-btn sm"
                  onClick={openAddModules}
                >
                  Add Modules
                </button>
              </div>
              <div className="modules">
                {modules.data.map((module) => (
                  <Accordion key={module._id} className="module-accordion">
                    <AccordionSummary
                      expandIcon={<IoIosArrowUp />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      <div className="module-header">
                        <div className="module-title">{module.title}</div>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      {module.file === "" && module.video === "" ? (
                        <div className="no-content">No Content</div>
                      ) : (
                        <div className="module-content">
                          <div className="file">
                            <FaFilePdf />
                            <Link to={module.file} target="_blank">
                              {module.title}
                            </Link>
                          </div>
                          <div className="video">
                            <RiVideoFill />
                            <Link to={module.video} target="_blank">
                              {module.title}
                            </Link>
                          </div>
                        </div>
                      )}
                      <div className="module-btns">
                        {module.file === "" && module.video === "" && (
                          <button
                            onClick={() => openAddMaterials(module._id)}
                            className="main-btn update sm"
                          >
                            Add Materials <IoAdd />
                          </button>
                        )}

                        <button className="main-btn update sm">
                          Edit <CiEdit />
                        </button>
                        <button
                          onClick={() => openDeleteModules(module._id)}
                          className="main-btn delete sm"
                        >
                          Delete <MdDelete />
                        </button>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </>
          )}
      </div>

      {/* Add Module Dialog */}
      <Dialog
        open={open}
        onClose={closeAddModules}
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
          <Button variant="contained" onClick={closeAddModules}>
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
      {/* confirm delete dialog */}
      <Dialog
        fullWidth
        open={openDelete.open}
        onClose={closeDeleteModules}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to delete this Module?"}
        </DialogTitle>
        <DialogContent>
          If you delete this module, you will not be able to recover it.
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeDeleteModules}>
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

      {/* add Materials dialog */}
      <Dialog
        open={OpenAddMaterials.open}
        onClose={closeAddMaterials}
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
              setAddMaterials((prevState) => ({
                ...prevState,
                errorMsg: "You must enter data to add Materials",
              }));
            } else {
              addMaterials.errorMsg = "";
              handleAddModule(formData);
            }
          },
        }}
      >
        <DialogTitle>Add New Materials</DialogTitle>
        <DialogContent>
          {addMaterials.errorMsg !== "" && (
            <Alert severity="error">{addMaterials.errorMsg}</Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="video"
            label="Video URL"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={closeAddMaterials}>
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
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={OpenAddMaterials.open}
        onClose={closeAddMaterials}
        fullWidth
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          const filteredObj = Object.fromEntries(
            Object.entries(formJson).filter(([key, value]) => value !== "")
          );
          const isValidUrl = /^(ftp|http|https):\/\/[^ "]+$/.test(
            formData.get("video")
          );

          // Check if a file is selected
          const fileInput = document.getElementById("file-input");
          if (fileInput.files.length === 0 || fileInput.files[0].size === 0) {
            delete filteredObj["file"];
          }

          // Check if any field is empty
          if (Object.keys(filteredObj).length === 0) {
            setAddMaterials((prevState) => ({
              ...prevState,
              errorMsg: "You must enter valid data to update",
            }));
          } else {
            if (!isValidUrl) {
              setAddMaterials((prevState) => ({
                ...prevState,
                errorMsg: "Invalid video URL",
              }));
              return;
            } else {
              setAddMaterials((prevState) => ({
                ...prevState,
                errorMsg: "",
              }));
            }
            addMaterials.errorMsg = "";
            console.log(filteredObj);
            handleAddMaterials(filteredObj);
          }
        }}
      >
        <DialogTitle>Udate Course</DialogTitle>
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
          <Button variant="contained" onClick={closeAddMaterials}>
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
    </section>
  );
};

export default CourseModules;
