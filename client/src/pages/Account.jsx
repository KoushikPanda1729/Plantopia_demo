import React from "react";
import { requireAuth } from "../utils/requireAuth";

export const accountLoader = async ({ request }) => {
  const { pathname } = new URL(request.url);
  await requireAuth(pathname);
  return null;
};
const Account = () => {
  return <div>Account</div>;
};

export default Account;
