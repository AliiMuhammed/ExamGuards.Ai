import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import { visuallyHidden } from "@mui/utils";
import { saveAs } from "file-saver";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
} from "@mui/material";
import http from "../../../../../../../../../../../../../Helper/http";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../../../../../../Redux/Slices/toastSlice";
import { triggerRefresh } from "../../../../../../../../../../../../../Redux/Slices/refreshSlice";
import PrintReport from "./PrintReport";
import { Link } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "id", numeric: false, disablePadding: true, label: "ID" },
  { id: "file", numeric: false, disablePadding: false, label: "Image" },
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: "First name",
  },
  { id: "lastName", numeric: false, disablePadding: false, label: "Last name" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  { id: "grade", numeric: true, disablePadding: false, label: "Grade" },
  { id: "status", numeric: false, disablePadding: false, label: "Status" },
  { id: "actions", numeric: false, disablePadding: false, label: "Actions" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    onDownload,
    filters,
    onFilterChange,
    showFilters,
    onFilterIconClick,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Students in this Exam
      </Typography>
      {showFilters && (
        <>
          <TextField
            label="First Name"
            variant="outlined"
            value={filters.firstName}
            onChange={(e) => onFilterChange("firstName", e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={filters.lastName}
            onChange={(e) => onFilterChange("lastName", e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={filters.email}
            onChange={(e) => onFilterChange("email", e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Status"
            variant="outlined"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            sx={{ mr: 2 }}
          />
        </>
      )}
      <Tooltip title="Download CSV">
        <IconButton onClick={onDownload}>
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Filter list">
        <IconButton onClick={onFilterIconClick}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  onDownload: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  onFilterIconClick: PropTypes.func.isRequired,
};

export default function EnhancedTable({ data = [], examTotalGrades = 0 }) {
  const [grade, setGrade] = useState({
    grade: "",
    loading: false,
    errorMsg: "",
  });
  const [open, setOpen] = useState({
    open: false,
    id: "",
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleGradeChange = (event) => {
    const value = event.target.value;
    setGrade((prevGrade) => ({
      ...prevGrade,
      grade: value,
    }));
  };

  const { Examid } = useParams();
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleUpdate = () => {
    if (
      isNaN(grade.grade) ||
      grade.grade < 0 ||
      grade.grade > examTotalGrades
    ) {
      setGrade((prevGrade) => ({
        ...prevGrade,
        errorMsg: `Grade must be a number between 0 and ${examTotalGrades}`,
      }));
      return;
    }
    setGrade((prevGrade) => ({
      ...prevGrade,
      loading: true,
    }));
    const newGrade = {
      grade: grade.grade,
    };

    http
      .PATCH(`grades/addGrade/${id}/${open.id}/${Examid}`, newGrade)
      .then((response) => {
        setGrade((prevGrade) => ({
          ...prevGrade,
          loading: false,
          errorMsg: "",
        }));
        dispatch(
          openToast({
            msg: "Grade added successfully",
            type: "success",
          })
        );
        setOpen((prevOpen) => ({
          ...prevOpen,
          open: false,
          id: "",
        }));
        dispatch(triggerRefresh());
      })
      .catch((error) => {
        setGrade((prevGrade) => ({
          ...prevGrade,
          loading: false,
          errorMsg: "something went wrong",
        }));
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadCSV = () => {
    const csvRows = [
      headCells.map((cell) => cell.label).join(","), // header row
      ...rows.map((row) =>
        [
          row.id,
          row.file,
          row.firstName,
          row.lastName,
          row.email,
          row.grade,
          row.status,
        ].join(",")
      ), // data rows
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "students.csv");
  };

  const handleFilterChange = (field, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleFilterIconClick = () => {
    setShowFilters((prevShowFilters) => !prevShowFilters);
  };

  const rows = data.map((item, index) => ({
    id: index + 1,
    file: item.student.file || "",
    firstName: item.student.firstName || "",
    lastName: item.student.lastName || "",
    email: item.student.email || "",
    grade: item.grade !== undefined ? item.grade : "",
    status: item.status || "",
    stuID: item.student._id,
  }));

  const filteredRows = rows.filter((row) => {
    return (
      row.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
      row.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
      row.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      row.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const handleDialogClose = () => {
    setGrade({ ...grade, grade: "", loading: false, errorMsg: "" });
    setOpen({ ...open, open: false, id: "" });
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          onDownload={handleDownloadCSV}
          filters={filters}
          onFilterChange={handleFilterChange}
          showFilters={showFilters}
          onFilterIconClick={handleFilterIconClick}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <img
                        src={row.file}
                        alt="profile"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    </TableCell>
                    <TableCell align="left">{row.firstName}</TableCell>
                    <TableCell align="left">{row.lastName}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="right">{row.grade}</TableCell>
                    <TableCell align="left">
                      <div
                        className={`status ${
                          row.status === "passed"
                            ? "pass"
                            : row.status === "failed"
                            ? "fail"
                            : ""
                        } ${row.status === "absent" ? "absent" : ""}`}
                      >
                        {row.status}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className="more-btns">
                        <button
                          className="main-btn sm"
                          // onClick={() => handleGrade(row.stuID)}
                          onClick={() => setOpen({ open: true, id: row.stuID })}
                        >
                          Update Grade
                        </button>
                        <Link
                          className="main-btn sm"
                          // onClick={() => handleGrade(row.stuID)}
                          // onClick={() => handelCheatingReport(row.stuID)}
                          to={`/${Examid}/cheatingReport/${row.stuID}`}
                        >
                          Cheating Report
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/* update grade */}

      <Dialog open={open.open} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Update Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="grade"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={grade.grade}
            onChange={handleGradeChange}
            error={grade.errorMsg !== ""}
            helperText={grade.errorMsg}
          />
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            className="main-btn sm update"
            onClick={handleDialogClose}
          >
            Cancel
          </button>
          <button
            className="main-btn sm"
            type="submit"
            disabled={grade.loading}
            onClick={handleUpdate}
          >
            {grade.loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

EnhancedTable.defaultProps = {
  data: [],
};

EnhancedTable.propTypes = {
  data: PropTypes.array.isRequired,
};
