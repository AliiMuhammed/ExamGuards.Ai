import React, { useState } from "react";
import { TextField, Button, FormHelperText } from "@mui/material";
import "./style/editProfile.css";
import http from "../../../../Helper/http";
import { getAuthUser, setAuthUser } from "../../../../Helper/Storage";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";
import { triggerRefresh } from "../../../../Redux/Slices/refreshSlice";

const EditProfile = ({ setValue }) => {
  
  const Admin = getAuthUser()?.data;
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    file: null, // Store the image file
  });
  const [updateAdmin, setUpdateAmdin] = useState({
    loading: false,
    errorMsg: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      file: file,
    }));
  };

  const handleSubmit = (e) => {
    setUpdateAmdin({ ...updateAdmin, loading: true });
    e.preventDefault();

    if (!formData.firstName && !formData.lastName && !formData.file) {
      setUpdateAmdin({
        ...updateAdmin,
        loading: false,
        errorMsg: "You must enter at least one field to update",
      });
      return;
    }
    const updatedFormData = new FormData();
    if (formData.firstName !== "") {
      updatedFormData.append("firstName", formData.firstName);
    }
    if (formData.lastName !== "") {
      updatedFormData.append("lastName", formData.lastName);
    }
    if (formData.file !== null) {
      updatedFormData.append("photo", formData.file);
    }
    http
      .PATCH("users/updateMe", updatedFormData)
      .then((res) => {
        setUpdateAmdin({ ...updateAdmin, loading: false, errorMsg: "" });
        dispatch(
          openToast({
            msg: "Profile updated successfully",
            type: "success",
          })
        );

        // res.token = Admin.token;
        let dataWithToken = res.data;
        dataWithToken.token = Admin.token;
        res.data = dataWithToken;
        setAuthUser(res, res?.data?.data?.user?.rememberMe);
        setFormData({
          firstName: "",
          lastName: "",
          file: null,
        });
        dispatch(triggerRefresh());
        setValue(0);
      })
      .catch((err) => {
        setUpdateAmdin({
          ...updateAdmin,
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
  };

  return (
    <div>
      {updateAdmin.errorMsg !== "" && (
        <Alert severity="error">{updateAdmin.errorMsg}</Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          disabled
          value={Admin.data?.user.email}
          fullWidth
          margin="normal"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ margin: "1rem 0" }}
        />
        <FormHelperText sx={{ margin: "0" }}>
          Choose an image for your profile
        </FormHelperText>
        <Button
          type="submit"
          size="large"
          className="update-admin-btn"
          variant="contained"
          color="primary"
          disabled={updateAdmin.loading}
        >
          {updateAdmin.loading ? (
            <CircularProgress
              size={20}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ED6B17",
              }}
            />
          ) : (
            "Update"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditProfile;
