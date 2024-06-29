import React, { useState, useEffect } from "react";
import http from "../../../../Helper/http";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";
import { triggerRefresh } from "../../../../Redux/Slices/refreshSlice";
import "./style/adminApprovedCourses.css";

const AdminApprovedCourses = () => {
  const [courses, setCourses] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
  const [loadingIds, setLoadingIds] = useState(new Set());
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.refresh);

  useEffect(() => {
    setCourses({ ...courses, loading: true });
    http
      .GET(`courses/pending`)
      .then((res) => {
        setCourses({ ...courses, loading: false, data: res.data.data });
        console.log(res.data.data);
      })
      .catch((err) => {
        setCourses({ ...courses, loading: false, errorMsg: err.message });
      });
  }, [refresh]);

  const handleApprove = (courseId, studentId) => {
    const id = `${courseId}-${studentId}`;
    setLoadingIds((prev) => new Set(prev).add(id));

    http
      .PATCH(`courses/approve/${studentId}/${courseId}`)
      .then((res) => {
        setLoadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        dispatch(openToast({ msg: "Course approved successfully", type: "success" }));
        dispatch(triggerRefresh());
      })
      .catch((err) => {
        setLoadingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        dispatch(openToast({ msg: "Something went wrong", type: "error" }));
      });
  };

  return (
    <section className="admin-approved-courses">
      <div className="container">
        {courses.errorMsg && <Alert severity="error">{courses.errorMsg}</Alert>}
        {courses.loading ? (
          <CircularProgress sx={{ margin: "auto", display: "block" }} size={60} color="inherit" />
        ) : (
          <>
            <div className="header">
              <h3>Approved Courses</h3>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course Name</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Student Email</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.data.map((row) => (
                    <TableRow key={row.courseId + row.studentId}>
                      <TableCell>{row.courseName}</TableCell>
                      <TableCell>{row.studentName}</TableCell>
                      <TableCell>{row.studentEmail}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleApprove(row.courseId, row.studentId)}
                          disabled={loadingIds.has(`${row.courseId}-${row.studentId}`)}
                        >
                          {loadingIds.has(`${row.courseId}-${row.studentId}`) ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Approve"
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminApprovedCourses;
