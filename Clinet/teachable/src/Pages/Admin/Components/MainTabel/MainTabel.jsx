import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./style/mainTabel.css";


const MainTabel = ({ data, columns, title, customOptions }) => {
  const options = {
    filterType: "multiselect",
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 7,
    rowsPerPageOptions: [7, 50, 100],
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

  return (
    <section className="main-tabel-section">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={customOptions ? customOptions : options}
        />
      </ThemeProvider>

    </section>
  );
};

export default MainTabel;
