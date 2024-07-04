
import cv2
import numpy as np
import dlib
import pandas as pd
from math import hypot
from datetime import datetime, timedelta
from urllib.request import urlopen
import cloudinary
import cloudinary.uploader

def detect_cheating(image_paths):
    # Initialize Cloudinary
    cloudinary.config(
        cloud_name="hcvu40dvj",
        api_key="523379171599888",
        api_secret="pD2VU84Ew_KMETn0o-6kdbjPFnU"
    )

    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(r"shape_predictor_68_face_landmarks.dat")
    font = cv2.FONT_HERSHEY_PLAIN

    def midpoint(p1, p2):
        return int((p1.x + p2.x) / 2), int((p1.y + p2.y) / 2)

    def get_blinking_ratio(eye_points, facial_landmarks):
        left_point = (facial_landmarks.part(eye_points[0]).x, facial_landmarks.part(eye_points[0]).y)
        right_point = (facial_landmarks.part(eye_points[3]).x, facial_landmarks.part(eye_points[3]).y)
        center_top = midpoint(facial_landmarks.part(eye_points[1]), facial_landmarks.part(eye_points[2]))
        center_bottom = midpoint(facial_landmarks.part(eye_points[5]), facial_landmarks.part(eye_points[4]))

        hor_line_length = hypot((left_point[0] - right_point[0]), (left_point[1] - right_point[1]))
        ver_line_length = hypot((center_top[0] - center_bottom[0]), (center_top[1] - center_bottom[1]))

        ratio = hor_line_length / ver_line_length
        return ratio

    def get_gaze_ratio(eye_points, facial_landmarks, frame):
        left_eye_region = np.array([(facial_landmarks.part(eye_points[0]).x, facial_landmarks.part(eye_points[0]).y),
                                    (facial_landmarks.part(eye_points[1]).x, facial_landmarks.part(eye_points[1]).y),
                                    (facial_landmarks.part(eye_points[2]).x, facial_landmarks.part(eye_points[2]).y),
                                    (facial_landmarks.part(eye_points[3]).x, facial_landmarks.part(eye_points[3]).y),
                                    (facial_landmarks.part(eye_points[4]).x, facial_landmarks.part(eye_points[4]).y),
                                    (facial_landmarks.part(eye_points[5]).x, facial_landmarks.part(eye_points[5]).y)], np.int32)

        height, width, _ = frame.shape
        mask = np.zeros((height, width), np.uint8)
        cv2.polylines(mask, [left_eye_region], True, 255, 2)
        cv2.fillPoly(mask, [left_eye_region], 255)
        eye = cv2.bitwise_and(gray, gray, mask=mask)

        min_x = np.min(left_eye_region[:, 0])
        max_x = np.max(left_eye_region[:, 0])
        min_y = np.min(left_eye_region[:, 1])
        max_y = np.max(left_eye_region[:, 1])

        gray_eye = eye[min_y: max_y, min_x: max_x]
        _, threshold_eye = cv2.threshold(gray_eye, 70, 255, cv2.THRESH_BINARY)
        
        if threshold_eye is None: 
            return None, None
        
        height, width = threshold_eye.shape
        left_side_threshold = threshold_eye[0: height, 0: int(width / 2)]
        left_side_white = cv2.countNonZero(left_side_threshold)

        right_side_threshold = threshold_eye[0: height, int(width / 2): width]
        right_side_white = cv2.countNonZero(right_side_threshold)

        if left_side_white == 0:
            gaze_ratio = 0.5
        elif right_side_white == 0:
            gaze_ratio = 2.5
        else:
            gaze_ratio = left_side_white / right_side_white

        return gaze_ratio, (min_x, min_y, max_x, max_y)
        # Function implementation


    results = []

    for path in image_paths:
        frame = cv2.imread(path)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = detector(gray)

        if len(faces) > 1:
            upload_result = cloudinary.uploader.upload(path)
            elapsed_seconds = datetime.now().timestamp()
            results.append(("Multiple faces", elapsed_seconds,"Cloudinary URL", upload_result["secure_url"]))
            

            continue

        elif len(faces) == 0:
            upload_result = cloudinary.uploader.upload(path)
            elapsed_seconds = datetime.now().timestamp()
            results.append(("No face detected!", elapsed_seconds,"Cloudinary URL", upload_result["secure_url"]))

            continue

        for face in faces:
            landmarks = predictor(gray, face)

            left_eye_ratio = get_blinking_ratio([36, 37, 38, 39, 40, 41], landmarks)
            right_eye_ratio = get_blinking_ratio([42, 43, 44, 45, 46, 47], landmarks)
            blinking_ratio = (left_eye_ratio + right_eye_ratio) / 2

            if blinking_ratio > 5.7:
                results.append(("BLINKING", datetime.now().timestamp()))

            gaze_ratio_left_eye, left_eye_coords = get_gaze_ratio([36, 37, 38, 39, 40, 41], landmarks, frame)
            gaze_ratio_right_eye, right_eye_coords = get_gaze_ratio([42, 43, 44, 45, 46, 47], landmarks, frame)

            if gaze_ratio_right_eye is not None and gaze_ratio_left_eye is not None:
                gaze_ratio = (gaze_ratio_right_eye + gaze_ratio_left_eye) / 2
            else:
                gaze_ratio = None

            if gaze_ratio is not None:
                if gaze_ratio < 0.5:
                    upload_result = cloudinary.uploader.upload(path)
                    results.append(("RIGHT", datetime.now().timestamp(),"Cloudinary URL", upload_result["secure_url"]))
                    
                elif 0.5 < gaze_ratio < 2:
                    pass
                elif gaze_ratio > 2:
                    upload_result = cloudinary.uploader.upload(path)
                    results.append(("LEFT", datetime.now().timestamp(),"Cloudinary URL", upload_result["secure_url"]))
                    
                    

    results_df = pd.DataFrame(results, columns=["Direction", "Timestamp","Cloudinary URL","URL"])

    # Serialize DataFrame to dictionary
    results_dict = results_df.to_dict(orient='records')

    return results_dict
