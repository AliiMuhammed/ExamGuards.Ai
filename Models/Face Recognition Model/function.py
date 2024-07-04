import face_recognition
import cv2
import cloudinary
import cloudinary.uploader
import numpy as np
import logging

class SimpleFacerec:
    def __init__(self):
        self.known_face_encodings = []
        self.known_face_names = []
        self.frame_resizing = 0.25
        self.reference_face_encoding = None

        cloudinary.config(
            cloud_name="hcvu40dvj",
            api_key="523379171599888",
            api_secret="pD2VU84Ew_KMETn0o-6kdbjPFnU"
        )

    def load_reference_image(self, image_path):
        try:
            img = cv2.imread(image_path)
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            face_encodings = face_recognition.face_encodings(rgb_img)
            if not face_encodings:
                logging.error("No face found in the reference image")
                return "no face found"
            self.reference_face_encoding = face_encodings[0]
            logging.debug("Reference image encoded successfully")
        except Exception as e:
            logging.error("Error loading reference image: %s", e)
            raise e

    def compare_with_reference(self, image_path):
        try:
            if self.reference_face_encoding is None:
                logging.error("Reference face encoding is None")
                return "reference face encoding is not set"

            img = cv2.imread(image_path)
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            face_encodings = face_recognition.face_encodings(rgb_img)

            if not face_encodings:
                return "no face found"

            new_face_encoding = face_encodings[0]
            match = face_recognition.compare_faces([self.reference_face_encoding], new_face_encoding)[0]

            if match:
                return "match"
            else:
                upload_result = cloudinary.uploader.upload(image_path)
                url = upload_result['url']
                return f"not match - image uploaded to {url}"
        except Exception as e:
            logging.error("Error comparing faces: %s", e)
            raise e
