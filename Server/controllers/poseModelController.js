const tmPose = require("@teachablemachine/pose");
const catchAsync = require("../utils/catchAsync");

const MODEL_DIR = "../my-pose-model/";
let model, maxPredictions;

// Initialize the model
async function init() {
  const modelURL = MODEL_DIR + "model.json";
  const metadataURL = MODEL_DIR + "metadata.json";

  // Load the model and metadata from local files
  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
}

// Route to handle pose detection
exports.detectPose = catchAsync(async (req, res) => {
  // Assuming the client sends the image as form-data with key 'image'
  await init();
  const imageFile = req.files.image;
  const image = await loadImageFromFile(imageFile.path);

  // Predict poses on the loaded image
  const predictions = await predict(image);

  // Return the prediction results as response
  res.json(predictions);
});

// Function to perform pose detection
async function predict(image) {
  // Estimate pose from the loaded image
  const { pose, posenetOutput } = await model.estimatePose(image);
  // Run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  // Prepare prediction results
  const predictions = [];
  for (let i = 0; i < maxPredictions; i++) {
    predictions.push({
      className: prediction[i].className,
      probability: prediction[i].probability.toFixed(2),
    });
  }

  return predictions;
}
