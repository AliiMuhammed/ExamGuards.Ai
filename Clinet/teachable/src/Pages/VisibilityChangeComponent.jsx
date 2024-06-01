import React, { useEffect, useState } from "react";

const VisibilityChangeComponent = () => {
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === "visible"
  );
  const [isFocused, setIsFocused] = useState(true);

  const handleVisibilityChange = () => {
    setIsVisible(document.visibilityState === "visible");
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);
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
    </div>
  );
};

export default VisibilityChangeComponent;
