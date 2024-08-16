import { Router } from "express";
import {
  forgotPasswordWithAnswer,
  forgotPasswordWithOTP,
  getUser,
  logInUser,
  loginWithGoogle,
  refreshAccessToken,
  registerUser,
  registerWithGoogle,
  sendEmailWithOTP,
  updateProfile,
  updateProfileImage,
  updateSecurityKeyAndAddress,
  userLoggOut,
  verifyAccount,
} from "../controllers/user.controller.js";
import upload from "./../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("profileImage"), registerUser);
userRouter.route("/register-google").post(registerWithGoogle);
userRouter.route("/login-google").post(loginWithGoogle);
userRouter.route("/verify").post(verifyAccount);
userRouter.route("/login").post(logInUser);
userRouter
  .route("/update-address-security")
  .post(verifyJWT, updateSecurityKeyAndAddress);
userRouter.route("/logout").post(verifyJWT, userLoggOut);
userRouter.route("/refresh").post(refreshAccessToken);
userRouter.route("/update-password").post(verifyJWT, updateProfile);
userRouter
  .route("/update-profile-image")
  .post(verifyJWT, upload.single("profileImage"), updateProfileImage);
userRouter.route("/get-user").get(verifyJWT, getUser);
userRouter.route("/forgot").post(forgotPasswordWithAnswer);
userRouter.route("/sentOTP").post(sendEmailWithOTP);
userRouter.route("/forgotOTP").post(forgotPasswordWithOTP);

export default userRouter;
