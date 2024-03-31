/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./style/adminStudents.css";
import http from "./../../../../Helper/http";
import userimg from "../../../../Assets/Images/user.png";
import MainTabel from "../MainTabel/MainTabel";
import MainSpinner from "../../../../Shared/Components/MainSpinner";
function AdminStudents() {
  const [loadingStates, setLoadingStates] = useState({});
  const [users, setUsers] = useState({
    data: [],
    loading: false,
    errorMsg: "",
  });

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

  const columns = [
    {
      name: "photo",
      label: "Image",
      options: {
        customBodyRender: (value) => {
          return (
            <div
              className="user-table-img"
              style={{ backgroundImage: `url(${userimg})` }}
            ></div>
          );
        },
      },
    },
    {
      name: "name",
    },
    {
      name: "email",
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

  const [reloadData, setReloadData] = useState(true);
  useEffect(() => {
    if (reloadData) {
      setUsers({ ...users, loading: true });
      const params = new URLSearchParams({
        // page: 2,
        // limit: 2,
        role: "student",
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
          console.log(users.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [reloadData]);

  return (
    <section className="admin-students-section">
      <div className="container">
        {users.data.length === 0 && <MainSpinner />}
        {users.data.length !== 0 && (
          <>
            <MainTabel title={"Students"} data={users.data} columns={columns} />
          </>
        )}
      </div>
    </section>
  );
}

export default AdminStudents;
