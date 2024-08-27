import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileLocalPath) => {
  try {
    if (!fileLocalPath) return null;
    const cloudinaryPath = await cloudinary.uploader.upload(fileLocalPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(fileLocalPath);
    return cloudinaryPath;
  } catch (error) {
    console.log("Error occured at cloudinary : ", error);
    fs.unlinkSync(fileLocalPath);
    return null;
  }
};

const uploadOnCloudinaryForGoogle = async (googleURL) => {
  try {
    if (!googleURL) return null;
    const cloudinaryPath = await cloudinary.uploader.upload(googleURL, {
      resource_type: "auto",
    });
    return cloudinaryPath;
  } catch (error) {
    return null;
  }
};
const deleteOnCloudinary = async (publicId) => {
  try {
    console.log(publicId);

    if (!publicId) return null;
    await cloudinary.uploader.destroy(publicId);
    return;
  } catch (error) {
    console.log("Error occured while deleting image : ", error);
    return null;
  }
};

const deleteMultipleImagesOnCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
};

export {
  uploadOnCloudinary,
  deleteOnCloudinary,
  uploadOnCloudinaryForGoogle,
  deleteMultipleImagesOnCloudinary,
};
