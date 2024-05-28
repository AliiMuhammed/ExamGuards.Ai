import React, { useState, useEffect } from "react";
import http from "./../../Helper/http";
import "./style/test.css";
import Camera from "./Camera";
const TestDownload = () => {
  const [stream, setStream] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(stream);

        const intervalId = setInterval(() => {
          captureImage(stream);
        }, 1000);

        setIntervalId(intervalId);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const captureImage = (stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play(); // Start playing the video
      setTimeout(() => {
        // Wait for a short delay before capturing the image
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          sendImage(blob);
        }, "image/jpeg");
      }, 500); // Delay of 1 second
    };
  };

  const sendImage = (imageBlob) => {
    const formData = new FormData();
    formData.append("image_files", imageBlob, "image.jpg");
    http
      .POST("detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("------------------------------------------------------");
        console.log("Image sent successfully");
        console.log(response.data.message);
        console.log(response.data.imageFiles);
        setMsg(response.data.message);
        console.log("------------------------------------------------------");
      })
      .catch((error) => {
        console.error("Error sending image:", error);
      });
  };

  return (
    <section className="exam">
      <div className="container">
        {stream && (
          <>
            <Camera />
            <video
              style={{ display: "none" }}
              autoPlay
              ref={(videoElement) => {
                if (videoElement) {
                  videoElement.srcObject = stream;
                }
              }}
            />
            <div className="message">
              <p>{msg}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TestDownload;
