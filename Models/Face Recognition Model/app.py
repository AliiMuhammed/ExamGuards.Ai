from flask import Flask, request, jsonify
import tempfile
import os
import cv2
import cloudinary
import cloudinary.uploader
from function import SimpleFacerec
import requests
import logging

app = Flask(__name__)

sfr = SimpleFacerec()

logging.basicConfig(level=logging.DEBUG)

@app.route('/detect', methods=['POST'])
def detect():
    logging.debug("Request headers: %s", request.headers)
    logging.debug("Request form data: %s", request.form)

    # Check if the request contains any files
    if 'imagefiles' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    imagefiles = request.files.getlist('imagefiles')
    if len(imagefiles) == 0:
        return jsonify({'error': 'No files uploaded'}), 400

    # Get the reference image URL from the form data
    reference_image_url = request.form.get('reference_image_url')
    if not reference_image_url:
        return jsonify({'error': 'No reference image URL provided'}), 400

    logging.debug("Reference image URL from form data: %s", reference_image_url)

    # Download the reference image
    try:
        response = requests.get(reference_image_url, stream=True)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logging.error("Failed to download reference image: %s", e)
        return jsonify({'error': 'Failed to download reference image', 'details': str(e)}), 400

    # Create a temporary file to store the reference image
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    temp_file_path = temp_file.name
    with open(temp_file_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    temp_file.close()

    # Load the reference image
    load_result = sfr.load_reference_image(temp_file_path)
    if load_result == "no face found":
        os.unlink(temp_file_path)
        return jsonify({'error': 'No face found in the reference image'}), 400

    # Delete the temporary file
    os.unlink(temp_file_path)

    # Compare each image with the reference image
    results = []
    for image_file in imagefiles:
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        temp_file_path = temp_file.name
        image_file.save(temp_file_path)
        temp_file.close()

        result = sfr.compare_with_reference(temp_file_path)
        if result == "match":
            results.append({'result': result})
        else:
            upload_result = cloudinary.uploader.upload(temp_file_path)
            url = upload_result['url']
            results.append({'result': "not match", 'image': url})

        os.unlink(temp_file_path)

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
