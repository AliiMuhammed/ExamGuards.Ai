import React, { useEffect, useState } from "react";
import "./style/adminStudents.css";
import http from "./../../../../Helper/http";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function AdminStudents() {
  const options = {
    filterType: "multiselect",
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 50, 100],
  };
  const [loadingStates, setLoadingStates] = useState({});

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

  const getMuiTheme = () =>
    createTheme({
      palette: {
        background: {
          paper: "#f5f5f5",
        },
        text: {
          primary: "#3f3a64",
        },
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            head: {
              padding: "10px 4px",
            },
            body: {
              padding: "7px 15px",
            },
            footer: {
              padding: "10px",
            },
          },
        },
      },
    });

  const [users, setUsers] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });
  const [reloadData, setReloadData] = useState(true);
  const columns = [
    {
      name: "name",
    },
    {
      name: "email",
    },
    {
      name: "role",
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
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reloadData]);

  return (
    <section className="admin-students-section">
      <div className="container">
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Users"}
            data={users.data}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </div>
    </section>
  );
}

export default AdminStudents;
