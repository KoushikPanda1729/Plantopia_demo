import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/forgotVai.css";

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-option">
        <NavLink to={"/resend-otp-forgot-pass"}>
          <input type="submit" value={"Forgot via OTP"} />
        </NavLink>
      </div>
      <div className="forgot-password-option">
        <NavLink to={"/forgot-via-securityKey"}>
          <input type="submit" value={"Forgot via Security Key"} />
        </NavLink>
      </div>
    </div>
  );
};

export default ForgotPassword;
