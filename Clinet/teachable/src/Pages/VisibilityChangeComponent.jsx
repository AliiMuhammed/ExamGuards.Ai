import React, { useEffect, useState } from "react";

const VisibilityChangeComponent = () => {
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === "visible"
  );
  const [isFocused, setIsFocused] = useState(true);
  const [fallScreenVisible, setFallScreenVisible] = useState(false);
  const [isMultiScreen, setIsMultiScreen] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (
        !document.fullscreenElement &&
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement
      ) {
        console.log("User exited full screen.");
        setFallScreenVisible(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    setIsMultiScreen(window.screen.width > window.innerWidth || window.screen.height > window.innerHeight);
    console.log(window.screen.width)
    console.log(window.innerWidth)
    console.log( window.screen.height)
    console.log( window.innerHeight)
  }, []);

  function handleRequestFullScreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }

    setFallScreenVisible(true);
  }

  return (
    <div>
      <h1>{isVisible ? "Page is in focus" : "Page is out of focus"}</h1>
      <div>
        <h1>
          {isFocused
            ? "Window is in focus"
            : "Window is out of focus or minimized"}
        </h1>
      </div>
      <div>
        <h1>
          {fallScreenVisible
            ? "Fall screen is visible"
            : "Fall screen is not visible"}
        </h1>
      </div>
      <div>
        <h1>
          {isMultiScreen
            ? "User has multiple screens"
            : "User has a single screen"}
        </h1>
      </div>
      <button onClick={handleRequestFullScreen}>Request Full Screen</button>
    </div>
  );
};

export default VisibilityChangeComponent;
