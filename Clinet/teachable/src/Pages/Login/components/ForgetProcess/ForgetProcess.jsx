import React, { useState } from "react";
import ForgetPassword from "./../ForgetPassword/ForgetPassword";
import OTP from "./../OTP/OTP";
import RestPass from "./../RestPassword/RestPass";

const ForgetProcess = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [showResetPass, setShowResetPass] = useState(false);

  const handleShowOTP = () => {
    setShowOTP(true);
  };

  const handleShowResetPass = () => {
    setShowResetPass(true);
  };

  return (
    <div>
      {!showOTP && <ForgetPassword handleShowOTP={handleShowOTP} />}
      {showOTP && !showResetPass && (
        <OTP handleShowResetPass={handleShowResetPass} />
      )}
      {showResetPass && <RestPass />}
    </div>
  );
};

export default ForgetProcess;
