import React from "react";
import { requireAuth } from "../utils/requireAuth";
import axios from "axios";
import { useLoaderData } from "react-router-dom";

export const profileLoader = async ({ request }) => {
  const { pathname } = new URL(request.url);
  await requireAuth(pathname);
  const data = await axios.get(`/api/v1/users/get-user`);
  // console.log(data);

  return data;
};
const Profile = () => {
  const data = useLoaderData();
  // console.log(data.data.data.email);

  return <div>Profile , HIi there</div>;
};

export default Profile;
