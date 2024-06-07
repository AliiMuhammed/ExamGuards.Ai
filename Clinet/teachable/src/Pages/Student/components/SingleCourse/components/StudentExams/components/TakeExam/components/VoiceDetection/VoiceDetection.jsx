import React, { useEffect, useRef } from "react";
import http from "../../../../../../../../../../Helper/http";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../../../../../Redux/Slices/toastSlice";

const VoiceDetection = () => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { Examid } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const initRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Microphone accessed successfully");
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          console.log("Data available:", event.data);
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          console.log("Recording stopped");
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          audioChunksRef.current = [];

          const formData = new FormData();
          formData.append("voice_file", audioBlob, "voice.wav");
          try {
            const response = await http.POST(
              `/detect/voiceRecognition/${Examid}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("Upload response:", response.data.message);
            if (response.data.message !== "No cheating detected") {
              dispatch(
                openToast({
                  type: "error",
                  msg: "Cheating Voice detected",
                })
              );
            } else {
            }
          } catch (error) {
            console.error("Error uploading the audio file:", error);
            console.error(
              "Error details:",
              error.response ? error.response.data : error.message
            );
          }
        };
      } catch (error) {
        console.error("Error accessing the microphone:", error);
      }
    };

    initRecording();

    const startRecording = () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "inactive"
      ) {
        console.log("Starting recording");
        mediaRecorderRef.current.start();
        setTimeout(() => {
          console.log("Stopping recording");
          mediaRecorderRef.current.stop();
        }, 5000); // Change this to 5000 for 5 seconds
      }
    };

    const intervalId = setInterval(startRecording, 5000); // Change this to 5000 for 5 seconds

    return () => {
      clearInterval(intervalId);
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [Examid]);

  return <></>;
};

export default VoiceDetection;


