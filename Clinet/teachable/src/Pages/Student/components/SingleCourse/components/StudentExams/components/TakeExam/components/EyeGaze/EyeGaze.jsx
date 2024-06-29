import React, { useEffect, useRef, useCallback, useState } from 'react';
import http from '../../../../../../../../../../Helper/http'; // Adjust the path as per your project structure
import { useParams } from 'react-router';
import { openToast } from '../../../../../../../../../../Redux/Slices/toastSlice';
import { useDispatch } from 'react-redux';

const EyeGaze = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { Examid } = useParams();
  const [capturedImage, setCapturedImage] = useState(null);
  const dispatch = useDispatch();

  // Initialize video stream on component mount
  useEffect(() => {
    const setupCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (error) {
          console.error('Error accessing webcam:', error);
        }
      }
    };
    setupCamera();
  }, []);

  // Function to capture image from video stream
  const captureImage = useCallback(() => {
    if (videoRef.current) {
      const canvas = canvasRef.current;
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL('image/jpeg');
      setCapturedImage((prevImage) => {
        if (prevImage !== imageSrc) {
          return imageSrc;
        }
        return prevImage;
      });
    }
  }, []);

  // Set interval to capture image every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      captureImage();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [captureImage]);

  // Send captured image to server when available
  useEffect(() => {
    const sendImageToServer = async () => {
      if (capturedImage) {
        try {
          console.log('Preparing to send image to server...');
          // Convert base64 to file
          const byteString = atob(capturedImage.split(',')[1]);
          const mimeString = capturedImage.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const file = new File([blob], 'capturedImage.jpg');

          // Create form data
          const formData = new FormData();
          formData.append('image_files', file);

          // Send form data to server
          const response = await http.POST(`detect/${Examid}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          // Log the response
          console.log('Response from server:', response.data);

          // Handle response
          if (response.data.message !== "No cheating detected") {
            dispatch(openToast({
              msg: "Eye gaze detected",
              type: "error",
            }));
          }

          console.log('Image sent successfully EYE:', response.data);
        } catch (error) {
          console.error('Error sending the image:', error);
        }
      }
    };

    sendImageToServer();
  }, [capturedImage, Examid, dispatch]);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default EyeGaze;
