import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import "../styles/newPassword.css";
import { getUser } from "../utils/getUser";

export const newPasswordLoader = async () => {
  const user = await getUser();
  if (user) {
    return redirect("/");
  }
  return null;
};

export const newPasswordAction = async ({ request }) => {
  const data = await request.formData();
  const credentials = {
    otp: data.get("otp"),
    newPassword: data.get("password"),
  };

  try {
    await axios.post(`/api/v1/users/forgotOTP`, credentials);
  } catch (error) {
    console.log("Error occurred at registration:", error.message);
    return null;
  }
  return redirect("/login");
};

const NewPassword = () => {
  const data = useActionData();
  const [timeLeft, setTimeLeft] = useState(180);
  const { state } = useNavigation();
  const isSubmitting = state === "submitting";
  const focusInput = useRef();

  useEffect(() => {
    focusInput.current.focus();

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div className="verify-container">
      <h2>Verify OTP</h2>
      <Form method="POST" action="/new-password" replace>
        <div>
          <label htmlFor="otp">OTP</label>
          <input
            type="number"
            name="otp"
            id="otp"
            required
            min="100000"
            max="999999"
            ref={focusInput}
            onInput={(e) => {
              if (e.target.value.length > 6)
                e.target.value = e.target.value.slice(0, 6);
            }}
          />
        </div>
        <div>
          <label htmlFor="">New password</label>
          <input type="password" name="password" autoComplete="off" required />
        </div>
        <div>
          <input
            type="submit"
            value={isSubmitting ? "Submitting..." : "Submit"}
            disabled={isSubmitting || timeLeft === 0}
          />
          <p>
            {timeLeft > 0
              ? `Time left: ${formatTime(timeLeft)}`
              : "OTP expired"}
          </p>
          {data === null && <p className="otp-color">Wrong OTP</p>}
        </div>
      </Form>
    </div>
  );
};

export default NewPassword;
