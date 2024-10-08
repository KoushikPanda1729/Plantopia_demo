import axios from "axios";
import React, { useRef } from "react";
import {
  Form,
  NavLink,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import "../styles/forgotVaiSecurityKey.css";
import { getUser } from "../utils/getUser";
import image from "../styles/image/spinner-white.svg";
import toast from "react-hot-toast";

export const forgotViaSecurityKeyLoader = async () => {
  const user = await getUser();
  if (user) {
    return redirect("/");
  }
  return null;
};

export const forgotViaSecurityKeyAction = async ({ request }) => {
  const data = await request.formData();
  const credentials = {
    email: data.get("email"),
    newPassword: data.get("newPassword"),
    answer: data.get("securityKey"),
  };
  try {
    await axios.post(`/api/v1/users/forgot`, credentials);
    toast.success("Password Updated");
  } catch (error) {
    toast.error("Failed");
    return false;
  }

  return true;
};

const ForgotViaSecurityKey = () => {
  const data = useActionData();
  const { state } = useNavigation();
  const isSubmitting = state === "submitting";

  const emailRef = useRef();
  const securityKeyRef = useRef();
  const newPasswordRef = useRef();

  if (data === true) {
    emailRef.current.value = "";
    securityKeyRef.current.value = "";
    newPasswordRef.current.value = "";
  }

  return (
    <div className="forgot-container">
      <h3>Forgot password</h3>
      <Form method="POST" action="/forgot-via-securityKey" replace>
        <div className="email">
          <label>Email</label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            required
            ref={emailRef}
          />
        </div>
        <div className="securityKey">
          <label>Security Key</label>
          <input type="text" name="securityKey" required ref={securityKeyRef} />
        </div>
        <div className="newPassword">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            required
            ref={newPasswordRef}
          />
        </div>
        <div>
          <button
            type="submit"
            className="submit-button" // Add or update this class for styling
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="loading-wrapper wait-spinner-login">
                <p>Please Wait...</p>
                <img className="spinner-green" src={image} alt="spinner" />
              </div>
            ) : (
              "Forgot password"
            )}
          </button>
        </div>
        {data && (
          <p className="goto-login">
            Password updated, go to <NavLink to="/login">Sign In</NavLink>
          </p>
        )}
        {data === false && (
          <p className="wrong-credencial">Wrong credentials</p>
        )}
      </Form>
    </div>
  );
};

export default ForgotViaSecurityKey;
