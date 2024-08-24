import Cookies from "js-cookie";

export const getUser = async () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const image = Cookies.get("img");
  const role = Cookies.get("role");
  if (accessToken && refreshToken) {
    return { success: true, img: image, role };
  }
  return null;
};
