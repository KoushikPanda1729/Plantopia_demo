import axios from "axios";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";

export const logoutAction = async () => {
  await axios.post("/api/v1/users/logout");
  toast.success("Logout");
  return redirect("/login");
};
