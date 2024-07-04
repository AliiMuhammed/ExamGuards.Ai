const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

async function uploadToCloudinary(req, res, next) {
  try {
    if (req.file) {
      // Determine the resource type based on the file extension
      let resourceType;
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      if (fileExtension === 'pdf') {
        resourceType = 'raw';
      } else {
        resourceType = 'auto';
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      // Attach Cloudinary result to the request object
      req.cloudinaryResult = result;
    }

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    return res.status(500).json({ error: "Error uploading file to Cloudinary" });
  }
}

module.exports = uploadToCloudinary;
