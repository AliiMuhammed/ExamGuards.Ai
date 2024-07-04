const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

module.exports = cloudinary;
