import React, { useState } from "react";
import { TextField, Button, FormHelperText } from "@mui/material";
import "./style/adminEditProfile.css";
import http from "./../../../../../../Helper/http";
import { getAuthUser } from "../../../../../../Helper/Storage";

const AdminEditProfile = () => {
  const Admin = getAuthUser()?.data?.data?.user;

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
    e.preventDefault();
    const formData = new FormData();
    if (formData.firstName !== "") {
      formData.append("firstName", formData.firstName);
    }
    if (formData.lastName !== "") {
      formData.append("lastName", formData.lastName);
    }
    if (formData.file !== null) {
      formData.append("file", formData.file);
    }

    http
      .PATCH("users/updateMe", formData)
      .then(() => {})
      .catch(() => {});
    // Add logic to submit form data
    console.log("Form submitted:", formData);
  };

  return (
    <div>
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
          value={Admin.email}
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
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default AdminEditProfile;
