import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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
import TextField from "@mui/material/TextField";

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
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
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
    numSelected,
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
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Students in this Exam
        </Typography>
      )}

      {showFilters && (
        <>
          <TextField
            label="First Name"
            variant="standard"
            value={filters.firstName}
            onChange={(e) => onFilterChange("firstName", e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Last Name"
            variant="standard"
            value={filters.lastName}
            onChange={(e) => onFilterChange("lastName", e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Email"
            variant="standard"
            value={filters.email}
            onChange={(e) => onFilterChange("email", e.target.value)}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Status"
            variant="standard"
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
  numSelected: PropTypes.number.isRequired,
  onDownload: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  onFilterIconClick: PropTypes.func.isRequired,
};

export default function EnhancedTable({ data = [] }) {
  data = data || [];
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filters, setFilters] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "",
  });
  const [showFilters, setShowFilters] = React.useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
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
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox"></TableCell>
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
    </Box>
  );
}

EnhancedTable.propTypes = {
  data: PropTypes.array.isRequired,
};
