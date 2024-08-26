import React, { useEffect, useState } from "react";
import { requireAuth } from "../utils/requireAuth";
import axios from "axios";
import { Form, useLoaderData, useOutletContext } from "react-router-dom";
import "../styles/profile.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import image from "../styles/image/spinner-white.svg";
import toast from "react-hot-toast";

export const profileLoader = async ({ request }) => {
  const { pathname } = new URL(request.url);
  await requireAuth(pathname);
  const { data } = await axios.get(`/api/v1/users/get-user`);
  return data;
};

const Profile = () => {
  const data = useLoaderData();
  const { updateUserProfileImage } = useOutletContext();

  const email = data?.data?.email;
  const role = data?.data?.role;
  const fullName = data?.data?.fullName;
  const address = data?.data?.address;
  const userName = data?.data?.userName;
  const initialImage = data?.data?.profileImage?.url;

  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [loadingPassword, setIsLoadingPassword] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [successUpdate, setSuccessUpdate] = useState(false);
  const [profileImage, setProfileImage] = useState(initialImage);

  useEffect(() => {
    setProfileImage(initialImage);
  }, [initialImage]);

  const handlePasswordChange = async () => {
    setIsLoadingPassword(true);
    const credentials = {
      newPassword,
      oldPassword,
    };
    try {
      const response = await axios.post(
        `/api/v1/users/update-password`,
        credentials
      );
      setSuccessUpdate(true);
      toast.success("Password changed");
    } catch (error) {
      setInvalidCredentials(true);
      toast.error("Failed");
    } finally {
      setNewPassword("");
      setOldPassword("");
      setIsLoadingPassword(false);
    }
  };

  const handlePreviewImage = (e) => {
    const file = e.target.files[0];
    setProfileImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = async () => {
    if (!profileImageFile) {
      console.error("No file selected.");
      setInvalidCredentials(true);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("profileImage", profileImageFile);

      const response = await axios.post(
        `/api/v1/users/update-profile-image`,
        formData
      );
      const newImageUrl = response?.data?.data?.url;
      setProfileImage(newImageUrl);
      updateUserProfileImage(newImageUrl);
      setSuccessUpdate(true);
      toast.success("Profile image changed");
    } catch (error) {
      setInvalidCredentials(true);
      toast.error("Failed");
    } finally {
      setProfileImagePreview(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <div className="profile-info">
            <h2>
              {fullName}
              <p>{userName}</p>
            </h2>

            <p>{email}</p>
            <p>{address}</p>
            {role === "admin" && <p>{role}</p>}
          </div>
        </div>

        <div className="update-section">
          <h3>Update Profile Image</h3>

          {profileImagePreview && (
            <img
              src={profileImagePreview}
              alt="Profile Preview"
              className="profile-image-preview"
            />
          )}

          <input
            type="file"
            onChange={handlePreviewImage}
            className="input-file"
          />
          <button
            onClick={handleProfileImageChange}
            className="update-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-wrapper wait-spinner-login">
                <p>Please Wait...</p>
                <img className="spinner-green" src={image} alt="spinner" />
              </div>
            ) : (
              "Update"
            )}
          </button>
        </div>

        <div className="update-section">
          <h3>Update Password</h3>

          <div className="password-input-container">
            <input
              required
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className="input-field"
            />
            <div
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="toggle-password-btn"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <Form>
            <div className="password-input-container">
              <input
                required
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="input-field"
              />
              <div
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="toggle-password-btn"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              onClick={handlePasswordChange}
              className="update-btn"
              disabled={loadingPassword}
            >
              {loadingPassword ? (
                <div className="loading-wrapper wait-spinner-login">
                  <p>Please Wait...</p>
                  <img className="spinner-green" src={image} alt="spinner" />
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </Form>
        </div>
        {invalidCredentials && (
          <h3 style={{ padding: "1rem", fontSize: "1.3rem", color: "red" }}>
            Note: Invalid Credentials
          </h3>
        )}
        {successUpdate && (
          <h3 style={{ padding: "1rem", fontSize: "1.3rem", color: "green" }}>
            Successfully updated
          </h3>
        )}
      </div>
    </div>
  );
};

export default Profile;
