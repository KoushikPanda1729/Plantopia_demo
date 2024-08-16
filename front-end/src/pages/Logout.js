import axios from "axios";
import { redirect } from "react-router-dom";

export const logoutAction = async () => {
  await axios.post("/api/v1/users/logout");
  return redirect("/login");
};
