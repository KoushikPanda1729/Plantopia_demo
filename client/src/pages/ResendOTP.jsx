import axios from "axios";
import React from "react";
import { Form, redirect, useNavigation } from "react-router-dom";
import "../styles/resendOTP.css";
import image from "../styles/image/spinner-white.svg";

export const resendOTPAction = async ({ request }) => {
  const data = await request.formData();
  const credentials = {
    email: data.get("email"),
  };
  try {
    await axios.post(`/api/v1/users/sentOTP`, credentials);
  } catch (error) {
    return null;
  }

  return redirect("/verify-account");
};

const ResendOTP = () => {
  const { state } = useNavigation();
  const isSubmitting = state === "submitting";
  return (
    <div className="resend-otp-container">
      <h2>Resend OTP</h2>
      <Form
        method="POST"
        action="/resend-otp"
        className="resend-otp-form"
        replace
      >
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="loading-wrapper wait-spinner-login">
              <p>Please Wait...</p>
              <img className="spinner-green" src={image} alt="spinner" />
            </div>
          ) : (
            "Send OTP"
          )}
        </button>
      </Form>
    </div>
  );
};

export default ResendOTP;
