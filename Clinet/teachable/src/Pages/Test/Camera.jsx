import React, { useRef, useEffect } from "react";

const Camera = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    let currentVideoRef = videoRef.current;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        currentVideoRef.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    };

    startCamera();

    return () => {
      // Clean up by stopping the stream when the component unmounts
      if (currentVideoRef && currentVideoRef.srcObject) {
        const stream = currentVideoRef.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return (
    <video className="exam-video" ref={videoRef} autoPlay playsInline></video>
  );
};

export default Camera;
