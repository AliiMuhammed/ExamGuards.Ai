/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import "./style/singleExam.css";
import { useDispatch } from "react-redux";
import Alert from "@mui/material/Alert";
import http from "../../../../../../../../../../Helper/http";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";
import { triggerRefresh } from "../../../../../../../../../../Redux/Slices/refreshSlice";
import { useSelector } from "react-redux";

const SingleExam = () => {
  const refresh = useSelector((state) => state.refresh);

  const dispatch = useDispatch();

  const { Examid } = useParams();
const {id} = useParams();
  const [exam, setExam] = useState({
    Exam: [],
    loading: false,
    errorMsg: "",
  });

  useEffect(() => {
    setExam({ loading: true, errorMsg: "" });
    http
      .GET(`exams/${Examid}`)
      .then((res) => {
        setExam({ loading: false, errorMsg: "", Exam: res.data.data.data });
      })
      .catch((err) => {
        setExam({ loading: false, errorMsg: "Something went wrong" });
      });
  }, [refresh]);

  return <section className="single-exam-section">
<div className="container">
  <div className="single-exam-header">
    
  </div>
</div>
    <Outlet/>
  </section>;
};

export default SingleExam;
