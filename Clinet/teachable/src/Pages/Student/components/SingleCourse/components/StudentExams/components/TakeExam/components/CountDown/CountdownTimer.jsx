import React, { useState, useEffect } from "react";
import "./style/CountdownTimer.css"; // Import CSS file for styling

const CountdownTimer = ({ startMinutes }) => {
  const [timeLeft, setTimeLeft] = useState(startMinutes * 60); // Convert minutes to seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours > 0 ? `${hours}:` : ""}${
      hours > 0 && minutes < 10 ? `0${minutes}` : minutes
    }:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  // Calculate the circumference of the circle
  const circumference = 2 * Math.PI * 45;

  // Calculate the dash offset based on the remaining time
  const dashOffset =
    ((startMinutes * 60 - timeLeft) / (startMinutes * 60)) * circumference;

  return (
    <div className="countdown-timer-container">
      <div className="countdown-timer">
        <svg className="countdown-svg" viewBox="0 0 100 100">
          <circle
            className="countdown-svg-circle"
            cx="50"
            cy="50"
            r="45"
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        <h2 className="countdown-timer-text">
          {formatTime(timeLeft)}
        </h2>
      </div>
    </div>
  );
};

export default CountdownTimer;
