import axios from "axios";
import { getAuthUser } from "./Storage";

const http = {
  GET: async (url, config = {}) => {
    try {
      const token = await getAuthUser(); // Wait for the token to be retrieved
      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.data.token}`;
      }

      const response = await axios.get(url, config);
      return response;
    } catch (error) {
      // Handle error
      console.error("GET request error:", error);
      throw error;
    }
  },

  POST: async (url, data = {}, config = {}) => {
    try {
      const token = await getAuthUser(); // Wait for the token to be retrieved
      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.data.token}`;
      }

      const response = await axios.post(url, data, config);
      return response;
    } catch (error) {
      // Handle error
      console.error("POST request error:", error);
      throw error;
    }
  },

  PUT: async (url, data = {}, config = {}) => {
    try {
      const token = await getAuthUser(); // Wait for the token to be retrieved
      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.data.token}`;
      }

      const response = await axios.put(url, data, config);
      return response;
    } catch (error) {
      // Handle error
      console.error("PUT request error:", error);
      throw error;
    }
  },

  PATCH: async (url, data = {}, config = {}) => {
    try {
      const token = await getAuthUser(); // Wait for the token to be retrieved
      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.data.token}`;
      }

      const response = await axios.patch(url, data, config);
      return response;
    } catch (error) {
      // Handle error
      console.error("PATCH request error:", error);
      throw error;
    }
  },

  DELETE: async (url, config = {}) => {
    try {
      const token = await getAuthUser(); // Wait for the token to be retrieved
      if (token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token.data.token}`;
      }

      const response = await axios.delete(url, config);
      return response;
    } catch (error) {
      // Handle error
      console.error("DELETE request error:", error);
      throw error;
    }
  },
};

// axios.defaults.baseURL = "https://teachable-58941829a392.herokuapp.com/";
axios.defaults.baseURL = "http://127.0.0.1:4000/";
axios.defaults.withCredentials = true;

export default http;
