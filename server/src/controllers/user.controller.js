import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/ApiErrors.util.js";
import { User } from "../models/user.model.js";
import {
  deleteOnCloudinary,
  uploadOnCloudinary,
  uploadOnCloudinaryForGoogle,
} from "../utils/cloudinary.util.js";
import ApiResponces from "../utils/ApiResponces.util.js";
import jwt from "jsonwebtoken";
import { generateRandom6DigitNumber } from "./../utils/otpGenerate.util.js";
import sendMail from "../utils/sendEmail.util.js";
import { expireTimeFunction } from "../utils/timeExpire.util.js";
import bcrypt from "bcrypt";

const demo = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "success From vercel " });
});

export const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(
      "Error occured at generate access token and refresh token : ",
      error
    );
    return error;
  }
};

const registerWithGoogle = asyncHandler(async (req, res) => {
  const {
    userName,
    email,
    password,
    fullName,
    address,
    role,
    answer,
    profileImage,
    isVerified,
  } = req.body;

  const existsUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existsUser) {
    return res
      .status(400)
      .json(new ApiResponces(400, {}, "User is already exists"));
  }
  const cloudinaryPath = await uploadOnCloudinaryForGoogle(profileImage?.url);
  if (!cloudinaryPath) {
    return res.status(400).json("Error ata cloudinary");
  }

  const { public_id, url } = cloudinaryPath;

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    fullName,
    address,
    role,
    answer,
    isVerified,
    profileImage: {
      public_id,
      url,
    },
  });

  if (!user) {
    return res.status(400).json(new ApiResponces(400, {}, "User not created"));
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(400)
      .json(new ApiResponces(400, {}, "Somthing went Wrong"));
  }
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(createdUser?._id);

  const options = {
    // httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .cookie("img", createdUser?.profileImage?.url, options)
    .json(
      new ApiResponces(
        200,
        { user: createdUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const loginWithGoogle = asyncHandler(async (req, res) => {
  const { email, isVerified } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new ApiResponces(400, {}, "Username or Email not found"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json(new ApiResponces(400, { value: true }, "User is not Exists"));
  }

  // const isPasswordValid = await user.isPasswordCorrect(password);

  // if (!isPasswordValid) {
  //   return res
  //     .status(400)
  //     .json(new ApiResponces(400, { value: true }, "Password is not correct"));
  // }

  if (!isVerified) {
    return res
      .status(400)
      .json(
        new ApiResponces(400, { verification: true }, "User is not verified")
      );
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -answer"
  );

  const options = {
    // httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .cookie("img", loggedInUser?.profileImage.url, options)
    .json(
      new ApiResponces(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const registerUser = asyncHandler(async (req, res, _) => {
  try {
    //Get details from users
    const { userName, email, password, fullName, address, role, answer } =
      req.body;
    //Check validation
    if (
      [userName, email, password, fullName, address, role, answer].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    //check the role of user
    if (!(role === "user" || role === "admin")) {
      throw new ApiError(400, "Please define the correct role");
    }

    //check user is exists or not
    const existsUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existsUser) {
      throw new ApiError(400, "User is already exists");
    }
    //Local file path
    if (!req?.file?.path) {
      throw new ApiError(400, "Profile image is required");
    }
    const localFilePath = req?.file?.path;

    const cloudinaryObject = await uploadOnCloudinary(localFilePath);
    if (!cloudinaryObject) {
      throw new ApiError(400, "Cloudinary upload error");
    }
    const { public_id, url } = cloudinaryObject;

    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      password,
      fullName,
      address,
      role,
      answer,
      profileImage: {
        public_id,
        url,
      },
    });

    if (!user) {
      throw new ApiError(400, "User not created ");
    }

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -answer"
    );

    if (!createdUser) {
      throw new ApiError(400, "Something went wrong");
    }

    user.otp = generateRandom6DigitNumber();
    user.expireAt = Date.now() + 3 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const userEmail = user?.email;
    const userOTP = user?.otp;
    await sendMail(userEmail, "Email sends for verification", userOTP);

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(createdUser?._id);

    const options = {
      // httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .cookie("img", user?.profileImage?.url, options)
      .json(
        new ApiResponces(
          200,
          { user: createdUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiResponces(400, { error }, "Some error occured in regitration")
      );
  }
});

const updateSecurityKeyAndAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req?.user?._id;
    const { address, answer } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found" });
    }
    const hashAnswer = await bcrypt.hash(answer, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          address,
          answer: hashAnswer,
        },
      },
      {
        new: true,
      }
    ).select("-password -answer -refreshToken");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json(new ApiResponces(200, user, "User updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponces(
          400,
          { details: error.message },
          "An error occurred while updating the user"
        )
      );
  }
});

const verifyAccount = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }
  const user = await User.findOne({ otp });
  if (!user) {
    throw new ApiError(400, "OTP does not exists");
  }
  const isOTPExpired = expireTimeFunction(user?.expireAt);
  if (isOTPExpired) {
    user.otp = undefined;
    user.expireAt = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(400, "OTP is expired");
  }
  user.isVerified = true;
  user.otp = undefined;
  user.expireAt = undefined;
  await user.save({ validateBeforeSave: false });
  const userEmail = user?.email;
  await sendMail(userEmail, "User verification");

  return res.status(200).json(new ApiResponces(200, {}, "Account is verified"));
});

const logInUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!(userName || email)) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return res
      .status(400)
      .json(new ApiResponces(400, { value: true }, "User is not Exists"));
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json(new ApiResponces(400, { value: true }, "Password is not correct"));
  }

  if (!user?.isVerified) {
    return res
      .status(400)
      .json(
        new ApiResponces(400, { verification: true }, "User is not verified")
      );
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -answer"
  );

  const options = {
    // httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .cookie("img", loggedInUser?.profileImage?.url, options)
    .json(
      new ApiResponces(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const userLoggOut = asyncHandler(async (req, res, _) => {
  const userId = req?.user?._id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $unset: { refreshToken: null },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(400, "Unauthorized request");
  }

  const options = {
    // httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .clearCookie("img", options)
    .json(new ApiResponces(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req?.cookies?.refreshToken || req?.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(400, "Invalid refresh token");
  }

  const decodedToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decodedToken?._id);

  if (incommingRefreshToken !== user.refreshToken) {
    throw new ApiError(400, "Token is expired or used");
  }

  const options = {
    // httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user?._id);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponces(
        200,
        { accessToken, refreshToken },
        "Token generate successfully"
      )
    );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  if ([newPassword, oldPassword].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(req?.user?._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Old password is not correct ");
  }

  if (newPassword === oldPassword) {
    throw new ApiError(400, "New password is never same as old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponces(200, {}, "password changed successfully"));
});

const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req?.file?.path) {
    throw new ApiError(400, "Profile image is required");
  }

  const profileImageLocalPath = req?.file?.path;

  const cloudinaryObject = await uploadOnCloudinary(profileImageLocalPath);
  if (!cloudinaryObject) {
    throw new ApiError(400, "Cloudinary upload error");
  }
  const { public_id, url } = cloudinaryObject;

  await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        profileImage: {
          public_id,
          url,
        },
      },
    },
    {
      new: true,
    }
  );

  await deleteOnCloudinary(req?.user?.profileImage?.public_id);
  return res
    .status(200)
    .json(new ApiResponces(200, {}, "Profile image updated successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id).select(
    "-password -answer -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponces(200, user, "Profile fetch successfully"));
});

const forgotPasswordWithAnswer = asyncHandler(async (req, res) => {
  const { answer, email, newPassword } = req.body;

  if ([answer, email, newPassword].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User is not exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(newPassword);
  if (isPasswordValid) {
    throw new ApiError(400, "New password never same as old password");
  }

  const isAnswerValid = await user.isAnswerCorrect(answer);
  if (!isAnswerValid) {
    throw new ApiError(400, "Answer is not correct");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });
  return res
    .status(200)
    .json(new ApiResponces(200, {}, "Password updated successfully"));
});

const sendEmailWithOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    user.otp = generateRandom6DigitNumber();
    user.expireAt = Date.now() + 3 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const userEmail = user?.email;
    const userOTP = user?.otp;
    await sendMail(userEmail, "Password-Change ", userOTP);
    return res
      .status(200)
      .json(new ApiResponces(200, {}, "Email send successfully"));
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiError(400, error?.message || "Error occured while sending Email")
      );
  }
});

const forgotPasswordWithOTP = asyncHandler(async (req, res) => {
  const { otp, newPassword } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }
  if ([newPassword].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ otp });

  if (!user) {
    throw new ApiError(400, "Invalid OTP");
  }

  const isPasswordValid = await user.isPasswordCorrect(newPassword);
  if (isPasswordValid) {
    throw new ApiError(400, "New password is never same as old password");
  }

  const isOTPExpired = expireTimeFunction(user?.expireAt);
  if (isOTPExpired) {
    user.otp = undefined;
    user.expireAt = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(400, "OTP is expired");
  }

  user.password = newPassword;
  user.otp = undefined;
  user.expireAt = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponces(200, {}, "Password updated successfully"));
});

export {
  registerUser,
  logInUser,
  userLoggOut,
  updateProfile,
  refreshAccessToken,
  updateProfileImage,
  getUser,
  forgotPasswordWithAnswer,
  sendEmailWithOTP,
  forgotPasswordWithOTP,
  verifyAccount,
  registerWithGoogle,
  loginWithGoogle,
  updateSecurityKeyAndAddress,
  demo,
};
