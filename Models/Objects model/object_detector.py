import numpy as np
import cv2
from ultralytics import YOLO
import cloudinary
import cloudinary.uploader
from datetime import datetime
import pandas as pd

# Configuration for Cloudinary
def configure_cloudinary():
    cloudinary.config(
        cloud_name="hcvu40dvj",
        api_key="523379171599888",
        api_secret="pD2VU84Ew_KMETn0o-6kdbjPFnU"
    )

# Load the YOLO model
def load_model(model_path):
    return YOLO(model_path)

# Process a single image
def process_image(image_path, model):
    frame = cv2.imread(image_path)
    if frame is None:
        print(f"Error loading image {image_path}")
        return None
    detections = model(image_path, conf=0.5)
    return np.array(detections[0].boxes.data.numpy())

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
        print(type(detected_objects))
        if detected_objects.size != 0:
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
#image_paths = ['../loaded_photos/test1.jpg', '../loaded_photos/test2.jpg', '../loaded_photos/test3.jpg', '../loaded_photos/test4.jpg']

def detect_cheating(image_paths):
    configure_cloudinary()
    detections = process_images(image_paths, "best.pt", class_names)
    results_df, results_dict = results_to_dataframe(detections)
    results_dict = results_df.to_dict(orient='records')
    #print("DataFrame:\n", results_df)
    print(detections)
    return results_dict

