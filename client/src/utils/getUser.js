import Cookies from "js-cookie";

export const getUser = async () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const image = Cookies.get("img");
  if (accessToken && refreshToken) {
    return { success: true, img: image };
  }
  return null;
};
