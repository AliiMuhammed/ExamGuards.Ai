import mimetypes
from flask import Flask, request, jsonify
import logging
import tempfile
import os
from werkzeug.utils import secure_filename
from datasets import load_dataset, Audio
from transformers import pipeline
import librosa
import soundfile as sf
import cloudinary
import cloudinary.uploader

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Set TensorFlow to only display errors and suppress all other messages
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
tf.config.set_soft_device_placement(True)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Cloudinary configuration
def configure_cloudinary():
    cloudinary.config(
        cloud_name="hcvu40dvj",
        api_key="523379171599888",
        api_secret="pD2VU84Ew_KMETn0o-6kdbjPFnU"
    )

configure_cloudinary()

# Function to load an audio file and resample it
def load_and_resample_audio(file_path, target_sr=48000):
    audio, sr = librosa.load(file_path, sr=None)
    if sr != target_sr:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=target_sr)
    return audio, sr

# Function to initialize the zero-shot audio classification pipeline
def initialize_zero_shot_pipeline(model_name):
    return pipeline(task="zero-shot-audio-classification", model=model_name, device=0)  # device=0 for GPU

# Function to classify an audio sample
def classify_audio_sample(classifier, audio_sample, candidate_labels):
    return classifier(audio_sample, candidate_labels=candidate_labels, return_all_scores=True)

# Function to detect classes and their timestamps in the audio
def detect_classes(audio, sampling_rate, classifier, candidate_labels, threshold=0.5):
    segment_length = 5  # seconds
    detected_classes = []

    # Segment the audio
    for i in range(0, len(audio), segment_length * sampling_rate):
        segment = audio[i:i + segment_length * sampling_rate]

        # Classify the segment
        classification_result = classify_audio_sample(classifier, segment, candidate_labels)

        # Filter out detections below the threshold
        detected_classes_segment = [{
            "label": class_result['label'],
            "score": class_result['score']
        } for class_result in classification_result if class_result['score'] >= threshold]

        # If no class above threshold, record as 'No detection'
        if not detected_classes_segment:
            detected_classes.append({
                "start_time": i / sampling_rate,
                "end_time": min((i + segment_length * sampling_rate) / sampling_rate, len(audio) / sampling_rate),
                "detected_classes": ["No detection"],
                "confidence_scores": [0.0]
            })
        else:
            detected_classes.append({
                "start_time": i / sampling_rate,
                "end_time": min((i + segment_length * sampling_rate) / sampling_rate, len(audio) / sampling_rate),
                "detected_classes": [class_info['label'] for class_info in detected_classes_segment],
                "confidence_scores": [class_info['score'] for class_info in detected_classes_segment]
            })

    return detected_classes

# Customize candidate labels for talking detection
candidate_labels = [
    "Sneezing", "Clapping", "Breathing", "Coughing", "Laughing", 
    "Snoring", "Drinking, sipping", "Mouse click", "Keyboard typing", "No sound", "Talking"
]

# Customize model name
model_name = "laion/clap-htsat-unfused"  # You can change the model here
zero_shot_classifier = initialize_zero_shot_pipeline(model_name)

@app.route('/upload', methods=['POST'])
def upload_file():
    logging.info("Received upload request")
    if 'file' not in request.files:
        logging.error("No file part in the request")
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        logging.error("No selected file")
        return jsonify({"error": "No selected file"}), 400

    # Check file format
    mime_type, _ = mimetypes.guess_type(file.filename)
    if not mime_type or not mime_type.startswith('audio/'):
        return jsonify({"error": "Unsupported file format"}), 400

    try:
        if file:
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                file_path = temp_file.name
                file.save(file_path)
            
            # Load and resample the audio file
            audio_sample, sampling_rate = load_and_resample_audio(file_path)

            # Set the threshold for classification
            threshold = 0.8

            # Detect classes and their timestamps in the audio
            detected_classes = detect_classes(audio_sample, sampling_rate, zero_shot_classifier, candidate_labels, threshold)

            # Check for "Talking" in detected classes
            talking_detected = any("Talking" in detection["detected_classes"] for detection in detected_classes)

            if talking_detected:
                # Upload the file to Cloudinary with resource_type set to 'video'
                upload_result = cloudinary.uploader.upload(file_path, resource_type="video")
                file_url = upload_result.get("secure_url")
                return jsonify({"talking_detected": True, "file_url": file_url}), 200
            else:
                return jsonify({"talking_detected": False, "message": "No talking detected"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(file_path)
        logging.info(f"Temporary file deleted: {file_path}")


if __name__ == '__main__':
    app.run(debug=False)
