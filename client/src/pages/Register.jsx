import axios from "axios";
import React, { useState } from "react";
import {
  Form,
  NavLink,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import "../index.css";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { getUser } from "../utils/getUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import image from "../styles/image/spinner-white.svg";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";

export const registerLoader = async () => {
  const user = await getUser();
  if (user) {
    return redirect("/");
  } else {
    return null;
  }
};

export const registerAction = async ({ request }) => {
  const formData = await request.formData();
  try {
    await axios.post(`/api/v1/users/register`, formData);
    return redirect("/verify-account");
  } catch (error) {
    console.log(error);
    console.log("Already registered:", error.message);
    toast.error("User already signup");
    return { data: null };
  }
};

const Register = () => {
  const { state } = useNavigation();
  const isSubmitting = state === "submitting";
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const data = useActionData();

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImagePreview(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibilityConfirm = () => {
    setShowConPassword(!showConPassword);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const userData = jwtDecode(token);

    let {
      given_name: userName,
      email,
      sub: password,
      name: fullName,
      picture: url,
      email_verified: isVerified,
    } = userData;
    userName = userName + Math.floor(Math.random() * 10000000);
    const credentials = {
      userName,
      email,
      password,
      fullName,
      profileImage: {
        url,
        public_id: "Not Exists",
      },
      address: false,
      role: "user",
      answer: false,
      isVerified,
    };
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/v1/users/register-google`,
        credentials
      );
      if (res?.data?.data?.user?.address === "false") {
        window.location.href = "/update-security-address";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.log("Error occurred at registration:", error.message);
      setAlreadyExists(true);
      toast.error("User Already SignUp");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  const [loading, setLoading] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  return (
    <div className="register-container">
      <div className="social-container">
        <div className="goto-signIn">
          Already sign up?{" "}
          <span>
            <NavLink to={"/login"}>Sign in</NavLink>
          </span>
        </div>
        <div className="signUp">
          <h1>Sign up via</h1>
          <p>
            Welcome to Plantopia, where every leaf and petal tells a story! 🌿🌺
          </p>
          <div className="signUp-content">
            {loading ? (
              <span className="submitting-button">
                <div className="wait-spinner">
                  <p>Please wait .....</p>
                  <img className="spinner" src={image} alt="spinner" />
                </div>{" "}
              </span>
            ) : (
              <GoogleLogin
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                logo_alignment="left"
                width="30"
                locale="en"
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            )}
          </div>
        </div>
        {alreadyExists && (
          <span className="redirect-login-register">
            <span style={{ color: "red" }}>Already signed up Go to</span>{" "}
            <NavLink to={"/login"}>Sign in</NavLink>
          </span>
        )}
      </div>
      <Form
        method="POST"
        action="/register"
        encType="multipart/form-data"
        className="register-form"
        replace
      >
        <div className="register-title">
          <img
            className="plant-register"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fneem-leaves-white-background-medicinal-leaf-herb-green-leef-293390420.jpg&f=1&nofb=1&ipt=50d11f45bf6377c71da35e4e8824bec12124eaae2b3222d332fafc750affeffb&ipo=images"
            alt="plant-register"
          />
          <div className="title">Plantopia Sign Up</div>
        </div>

        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            name="userName"
            id="userName"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="form-group password-field">
          <label htmlFor="password">Password</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="off"
              required
              className="form-control password-view"
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="form-group password-field">
          <label htmlFor="password">Confirm Password</label>
          <div className="password-container">
            <input
              type={showConPassword ? "text" : "password"}
              name="confirm-password"
              id="confirm-password"
              autoComplete="off"
              required
              className="form-control password-view"
            />
            <span
              className="password-toggle"
              onClick={togglePasswordVisibilityConfirm}
            >
              {showConPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            id="profileImage"
            accept="image/*"
            onChange={handleProfileImageChange}
            required
            className="form-control"
          />
          {profileImagePreview && (
            <div className="image-preview">
              <img
                src={profileImagePreview}
                alt="Profile Preview"
                className="preview-image"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="answer">Security Key</label>
          <input
            type="text"
            name="answer"
            id="answer"
            autoComplete="off"
            required
            className="form-control"
          />
        </div>

        <div className="login-submit">
          <button type="submit" disabled={isSubmitting} className="loginButton">
            {isSubmitting ? (
              <div className="loading-wrapper wait-spinner-login">
                <p>Please Wait...</p>
                <img className="spinner-green" src={image} alt="spinner" />
              </div>
            ) : (
              <>
                Sign Up{" "}
                <FontAwesomeIcon icon={faSignInAlt} />
              </>
            )}
          </button>
        </div>
        {data?.data === null && (
          <p className="redirect-to-login">
            User already Sign Up. Go to <NavLink to={"/login"}>Sign in</NavLink>{" "}
          </p>
        )}
      </Form>
    </div>
  );
};

export default Register;
