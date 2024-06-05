/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/courseModules.css";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
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
import { Link } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa6";
import { RiVideoFill } from "react-icons/ri";
import UpdateDialog from "./components/Update/UpdateDialog";
import AddMaterials from "./components/Add/AddMaterials";
import DeleteDialog from "./components/Delete/DeleteDialog";
import AddModule from "./components/Add Module/AddModule";
import { getAuthUser } from "../../../../../../../../Helper/Storage";

const CourseModules = () => {
  const { id } = useParams();
  const user = getAuthUser().data?.data?.user?.role;

  const [openAdd, setOpenAdd] = useState({
    open: false,
    id: id,
  });
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

  const [OpenAddMaterials, setOpenAddMaterials] = useState({
    open: false,
    id: "",
  });

  const [OpenUpdateMaterials, setOpenUpdateMaterials] = useState({
    open: false,
    id: "",
  });

  // call all modules
  useEffect(() => {
    if (reloadData) {
      setModules({ ...modules, loading: true });
      http
        .GET("courses/" + id + "/modules")
        .then((res) => {
          console.log(res.data.data.data);
          setModules({
            ...modules,
            loading: false,
            data: res.data.data.data.reverse(),
          });
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
                {user === "instructor" && (
                  <button
                    className="add-modules-btn main-btn sm"
                    onClick={() => setOpenAdd({ ...openAdd, open: true })}
                  >
                    Add Modules
                  </button>
                )}
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
                {user === "instructor" && (
                  <button
                    className="add-modules-btn main-btn sm"
                    onClick={() => setOpenAdd({ ...openAdd, open: true })}
                  >
                    Add Modules
                  </button>
                )}
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
                      {user === "instructor" && (
                        <div className="module-btns">
                          {module.file === "" && module.video === "" && (
                            <button
                              onClick={() =>
                                setOpenAddMaterials({
                                  ...OpenAddMaterials,
                                  open: true,
                                  id: module._id,
                                })
                              }
                              className="main-btn update sm"
                            >
                              Add Materials <IoAdd />
                            </button>
                          )}
                          {module.file !== "" && module.video !== "" && (
                            <button
                              onClick={() =>
                                setOpenUpdateMaterials({
                                  ...OpenUpdateMaterials,
                                  id: module._id,
                                  open: true,
                                })
                              }
                              className="main-btn update sm"
                            >
                              Edit <CiEdit />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setOpenDelete({
                                ...openDelete,
                                open: true,
                                id: module._id,
                              })
                            }
                            className="main-btn delete sm"
                          >
                            Delete <MdDelete />
                          </button>
                        </div>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            </>
          )}
      </div>

      {/* Add Module Dialog */}
      <AddModule open={openAdd} setOpen={setOpenAdd} reload={setReloadData} />
      {/* Delete Dialog */}
      <DeleteDialog
        open={openDelete}
        setOpen={setOpenDelete}
        reload={setReloadData}
      />
      {/* Add Materials Dialog */}
      <AddMaterials
        open={OpenAddMaterials}
        setOpen={setOpenAddMaterials}
        reload={setReloadData}
      />

      {/* Update Dialog */}
      <UpdateDialog
        open={OpenUpdateMaterials}
        setOpen={setOpenUpdateMaterials}
        reload={setReloadData}
      />
    </section>
  );
};

export default CourseModules;
