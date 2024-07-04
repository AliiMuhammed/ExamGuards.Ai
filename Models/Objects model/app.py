from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
import numpy as np
import cv2
from ultralytics import YOLO
import cloudinary
import cloudinary.uploader
from datetime import datetime
import pandas as pd
import logging
import sys
import contextlib
import torch  # Add this import statement

app = Flask(__name__)
CORS(app)

# Correct model path
model_path = r"best.pt"

# Configuration for Cloudinary
def configure_cloudinary():
    cloudinary.config(
        cloud_name="hcvu40dvj",
        api_key="523379171599888",
        api_secret="pD2VU84Ew_KMETn0o-6kdbjPFnU"
    )

# Load the YOLO model
def load_model(model_path):
    model = YOLO(model_path)
    
    # Check for GPU availability and set the device
    if torch.cuda.is_available():
        model.to('cuda')  # Use GPU
    else:
        model.to('cpu')  # Fallback to CPU

    return model

# Suppress output
@contextlib.contextmanager
def suppress_output():
    with open(os.devnull, 'w') as devnull:
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        sys.stdout = devnull
        sys.stderr = devnull
        try:
            yield
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

# Process a single image
def process_image(image_path, model):
    frame = cv2.imread(image_path)
    if frame is None:
        print(f"Error loading image {image_path}")
        return None

    with suppress_output():
        detections = model(image_path, conf=0.5)

    return np.array(detections[0].boxes.data.cpu())

# Map detected classes and upload image if needed
def map_and_upload(image_path, detected_objects, class_names):
    detected_classes = [int(row[5]) for row in detected_objects]
    mapped_values = [class_names.get(num, 'Unknown') for num in detected_classes]
    
    if len(mapped_values) > 0:
        upload_result = cloudinary.uploader.upload(image_path, folder="detected_objects/")
        timestamp = datetime.now().timestamp()
        return (mapped_values, timestamp, upload_result["secure_url"])
    else:
        timestamp = datetime.now().timestamp()
        return (mapped_values, timestamp, "No objects detected, no upload")

# Main processing function
def process_images(image_paths, model_path, class_names):
    model = load_model(model_path)
    all_detections = []
    
    for image_path in image_paths:
        detected_objects = process_image(image_path, model)
        if detected_objects is not None and detected_objects.size != 0:
            result_entry = map_and_upload(image_path, detected_objects, class_names)
            all_detections.append(result_entry)
    
    return all_detections

# Convert results to DataFrame and serialize to dictionary
def results_to_dataframe(all_detections):
    df = pd.DataFrame(all_detections, columns=['objects', 'Timestamp', 'URL'])
    return df, df.to_dict()

# Define class names and image paths
class_names = {
    0: 'Book', 1: 'Earphone', 2: 'headset', 3: 'Mobile_phone', 4: 'smart_watch', 5: 'cap', 6: 'sunglasses'
}

def detect_cheating(image_paths):
    configure_cloudinary()
    detections = process_images(image_paths, "best.pt", class_names)
    results_df, results_dict = results_to_dataframe(detections)
    results_dict = results_df.to_dict(orient='records')
    return results_dict

@app.route('/detect', methods=['POST'])
def detect():
    if request.method == 'POST':
        if 'imagefiles' not in request.files:
            return jsonify({'error': 'No files uploaded'})

        imagefiles = request.files.getlist('imagefiles')
        if len(imagefiles) == 0:  
            return jsonify({'error': 'No files uploaded'})

        temp_file_paths = []
        for image_file in imagefiles:  
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
            temp_file_paths.append(temp_file.name)
            image_file.save(temp_file)
            temp_file.close()

        results_dict = detect_cheating(temp_file_paths)

        for temp_file_path in temp_file_paths:
            os.unlink(temp_file_path)

        return jsonify(results_dict)  # Return the results_dict directly

if __name__ == '__main__':
    app.run(debug=False,port=5001)
