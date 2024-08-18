import axios from "axios";
import React, { useState } from "react";
import { Form, NavLink, redirect, useNavigation } from "react-router-dom";
import "../index.css";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

export const registerAction = async ({ request }) => {
  const formData = await request.formData(); // Directly get the FormData
  console.log(formData);

  try {
    await axios.post(`/api/v1/users/register`, formData);
    return redirect("/verify-account");
  } catch (error) {
    console.log("Error occurred at registration:", error.message);
    return redirect("/login");
  }
};

const Register = () => {
  const { state } = useNavigation();
  const isSubmitting = state === "submitting";
  const [profileImagePreview, setProfileImagePreview] = useState(null);

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

    try {
      const res = await axios.post(
        `/api/v1/users/register-google`,
        credentials
      );
      if (res?.data?.data?.user?.address === "false") {
        window.location.href = "/update-security-address";
      } else {
        window.location.href = "/profile";
      }
    } catch (error) {
      console.log("Error occurred at registration:", error.message);
      window.location.href = "/login";
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };

  return (
    <div className="register-container">
      <div className="social-container">
        <div className="goto-signIn">
          Already sign up ?{" "}
          <span>
            <NavLink to={"/login"}>Sign in</NavLink>
          </span>
        </div>
        <div className="signUp">
          <h1>Sign up via </h1>
          <p>
            Welcome to Plantopia, where every leaf and petal tells a story! Dive
            into our lush world of vibrant greenery and discover the joys of
            nurturing plants. Join our community of plant lovers and let your
            green thumb flourish! 🌿🌺
          </p>
          <div className="signUp-content">
            <GoogleLogin
              type="standard"
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
          </div>
        </div>
      </div>
      <Form
        method="POST"
        action="/register"
        encType="multipart/form-data"
        className="register-form"
      >
        <div className="register-title">
          <img
            className="plant-register"
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fneem-leaves-white-background-medicinal-leaf-herb-green-leef-293390420.jpg&f=1&nofb=1&ipt=50d11f45bf6377c71da35e4e8824bec12124eaae2b3222d332fafc750affeffb&ipo=images"
            alt="plant-register"
          />
          <div className="title">Plantopia signUp</div>
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

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="off"
            required
            className="form-control"
          />
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
          <label htmlFor="role">Role</label>
          <select name="role" id="role" required className="form-control">
            <option value="user">User</option>
            {/* <option value="admin">Admin</option> */}
          </select>
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

        <div className="form-group">
          <input
            type="submit"
            value={isSubmitting ? "Submitting..." : "Submit"}
            disabled={isSubmitting}
            className="submit-button"
          />
        </div>
      </Form>
    </div>
  );
};

export default Register;
