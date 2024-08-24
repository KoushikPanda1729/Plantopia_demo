import { redirect } from "react-router-dom";
import { getUser } from "./getUser";

export const requireAuth = async (redirectTo) => {
  const user = await getUser();
  if (!user) {
    throw redirect(`/login?redirectTo=${redirectTo}`);
  }
};

export const requireAuthAdmin = async (redirectTo) => {
  const user = await getUser();
  if (!(user && user?.role === "admin")) {
    throw redirect(`/login?redirectTo=${redirectTo}`);
  }
};
