import React, { useEffect, useState } from "react";
import "../style/printReport.css";
import logo from "../../../../../../../../../../../../../Assets/Images/Logos/h-logo.png";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import http from "../../../../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../../../../Redux/Slices/toastSlice";

const PrintReport = ({ data, student }) => {
  const [report, setReport] = useState({
    loading: false,
    errorMsg: "",
    student: null,
    data: [],
  });

  const { Examid, stuID } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    setReport({ ...report, loading: true, errorMsg: "" });
    http
      .GET(`detect/fraudCases/${Examid}/${stuID}`)
      .then((response) => {
        console.log(response);
        setReport({
          ...report,
          loading: false,
          errorMsg: "",
          data: response.data.data.cheatingDetails,
          student: response.data.data.student,
        });
        dispatch(
          openToast({
            msg: "Cheating report sent successfully",
            type: "success",
          })
        );
      })
      .catch((error) => {
        setReport({
          ...report,
          loading: false,
          errorMsg: "something went wrong",
        });
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });
  }, [Examid, stuID, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (report.data?.length > 0 && report.student) {
        handlePrint();
      }
    }, 5000); // 5 seconds
    return () => clearTimeout(timer);
  }, [report.data, report.student]);

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const dateTimeString = `${formattedDate}, ${formattedTime}`;

  return (
    <div className="print-report">
      {report.data?.length > 0 && report.student && (
        <div className="container">
          <div className="first-page">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <h1>Exam Cheating Report</h1>
            <p>Date: {dateTimeString}</p>
          </div>
          <div className="report-content">
            <div className="header">
              <div className="student-data">
                <div className="left">
                  <h1>{`Cheating report for:`}</h1>
                  <p>
                    <span>Name:</span>
                    {`${report.student.firstName} ${report.student.lastName}`}
                  </p>
                  <p>
                    <span>Email:</span>
                    {report.student.email}
                  </p>
                  <p>
                    <span>ID:</span>
                    {report.student._id}
                  </p>
                </div>
                <div className="right">
                  <div className="student-img">
                    <img src={report.student.file} alt="user" />
                  </div>
                </div>
              </div>
            </div>
            <div className="cheating-results">
              <h1>Cheating Results</h1>
              {report.data.length > 0 && (
                <table className="cheating-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Details</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.cheatingDetalis.join(", ")}</td>
                        <td>
                          {item.image && !item.image.endsWith(".webm") ? (
                            <img
                              src={item.image}
                              alt={`Cheating evidence ${index + 1}`}
                              className="cheating-image"
                            />
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintReport;
