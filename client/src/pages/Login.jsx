import "../styles/login.css";
import React from "react";
import {
  Form,
  NavLink,
  redirect,
  useActionData,
  useLocation,
  useNavigation,
} from "react-router-dom";
import axios from "axios";
import { getUser } from "../utils/getUser";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export const loginLoader = async () => {
  const user = await getUser();
  if (user) {
    return redirect("/");
  } else {
    return null;
  }
};

export const loginAction = async ({ request }) => {
  const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";

  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");
  const credentials = {
    email,
    password,
  };

  try {
    await axios.post(`/api/v1/users/login`, credentials);
    return redirect(redirectTo);
  } catch (error) {
    if (error?.response?.data?.data?.verification) {
      return { move: true };
    } else {
      return { error: "Invalid credentials" };
    }
  }
};

const Login = () => {
  const data = useActionData();
  const location = useLocation();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const loginURL = location.pathname + location.search;

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const userData = jwtDecode(token);

    let { email, email_verified: isVerified } = userData;
    const credentials = {
      email,
      address: false,
      role: "user",
      answer: false,
      isVerified,
    };

    const objectURL = new URL(window.location.href);
    const redirectTo = objectURL.searchParams.get("redirectTo") || "/";
    setLoading(true);
    try {
      const res = await axios.post(`/api/v1/users/login-google`, credentials);
      window.location.href = redirectTo;
    } catch (error) {
      console.log("Error occurred at registration:", error.message);
      setNotExists(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
  };
  const [loading, setLoading] = useState(false);
  const [notExists, setNotExists] = useState(false);
  return (
    <>
      <Form method="POST" action={loginURL} replace className="login-form">
        <div className="login-container">
          <div className="social">
            {notExists && (
              <span className="redirect-login-register ">
                User not exists go to{" "}
                <NavLink to={"/register"}>Sign up </NavLink>
              </span>
            )}
            <div className="login-social-container">
              <h1 className="login-heading">WellCome Back</h1>
              <span>
                {" "}
                Welcome to Plantopia, where every leaf and petal tells a story!
                🌿🌺
              </span>
              <div className="login-social-option">
                {loading ? (
                  <span className="submitting-button">
                    <div>Please wait .....</div>{" "}
                  </span>
                ) : (
                  <GoogleLogin
                    type="standard"
                    theme="outline"
                    size="large"
                    text={"signin_with"}
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
          </div>
          <div className="login-fields-container">
            <div className="login-logo">
              <img
                className="plant-register"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fneem-leaves-white-background-medicinal-leaf-herb-green-leef-293390420.jpg&f=1&nofb=1&ipt=50d11f45bf6377c71da35e4e8824bec12124eaae2b3222d332fafc750affeffb&ipo=images"
                alt="plant-register"
              />
              <p className="login-label">Plantopia Sign In</p>
            </div>
            {data && data?.error && (
              <p className="login-error">{data?.error}</p>
            )}

            {data && data?.move && (
              <p className="not-verified">
                {data && data?.move && (
                  <p>
                    User is not verified Please go to the{" "}
                    <NavLink to={"/resend-otp"}>verification</NavLink>{" "}
                  </p>
                )}
              </p>
            )}
            <div className="login-field">
              <label htmlFor="">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="off"
                required
                className="login-input"
              />
            </div>
            <div className="login-field">
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="off"
                required
                className="login-input"
              />
              <p className="forgot-password">
                <NavLink to={"/forgot-password"}>Forgot password ?</NavLink>
              </p>
            </div>
            <div className="login-submit">
              <input
                type="submit"
                value={`${isSubmitting ? "Submitting..." : "sign In"}`}
                disabled={isSubmitting}
                className="loginButton"
              />
            </div>
            <div className="goto-Register">
              Don't have an account?{" "}
              <span>
                <NavLink to={"/register"}>Sign Up</NavLink>
              </span>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default Login;
