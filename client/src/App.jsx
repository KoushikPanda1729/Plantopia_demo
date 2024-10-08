import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import {
  Home,
  Profile,
  Login,
  Register,
  Errorpage,
  Account,
  VerifyAccount,
  ForgotPassword,
  ResendOTP,
  ForgotViaSecurityKey,
  SendEmailForgotPassword,
  NewPassword,
  SetSecurityAndAddress,
} from "./pages/index";
import { loginAction, loginLoader } from "./pages/Login";
import { profileLoader } from "./pages/Profile";
import { accountLoader } from "./pages/Account";
import { registerAction, registerLoader } from "./pages/Register";
import { verifyAccountAction } from "./pages/VerifyAccount";
import { logoutAction } from "./pages/Logout";
import { getUser } from "./utils/getUser";
import { resendOTPAction } from "./pages/ResendOTP";
import {
  resendOTPActionForgot,
  resendOTPForgotLoader,
} from "./pages/SendEmailForgotPassword";
import { newPasswordAction, newPasswordLoader } from "./pages/NewPassword";
import {
  forgotViaSecurityKeyAction,
  forgotViaSecurityKeyLoader,
} from "./pages/ForgotViaSecurityKey";
import {
  setSecurityAndAddressAction,
  setSecurityAndAddressLoader,
} from "./pages/SetSecurityAndAddress";
import Dashboard, { dashboardLoader } from "./pages/Dashboard";
import CreateCategory, { createCategoryAction } from "./pages/CreateCategory";
import CreateProduct, { createProductAction } from "./pages/CreateProduct";
import Orders from "./pages/Orders";
import Allproducts from "./pages/Allproducts";
import UpdateProduct, {
  updateProductAction,
  updateProductLoader,
} from "./pages/UpdateProduct";
import { fetchAllProductLoader } from "./pages/Home";
import SingleProductPage, {
  singleProductPageLoader,
} from "./pages/SingleProductPage";
const router = createBrowserRouter(
  createRoutesFromElements(
    // <Route path="/" element={<RootLayout />} loader={rootLoader}>
    <Route path="/" element={<RootLayout />} loader={getUser} id="parentId">
      <Route index element={<Home />} loader={fetchAllProductLoader} />
      <Route
        path="/:id"
        element={<SingleProductPage />}
        loader={singleProductPageLoader}
      />
      <Route
        path="/register"
        element={<Register />}
        action={registerAction}
        loader={registerLoader}
      />
      <Route
        path="/login"
        element={<Login />}
        action={loginAction}
        loader={loginLoader}
      />
      <Route path="/account" element={<Account />} loader={accountLoader} />

      {/* dashboard  */}

      <Route path="/dashboard" element={<Dashboard />} loader={dashboardLoader}>
        <Route
          path="/dashboard/create-category"
          element={<CreateCategory />}
          action={createCategoryAction}
        />
        <Route
          path="/dashboard/create-product"
          element={<CreateProduct />}
          action={createProductAction}
        />
        <Route
          path="/dashboard/update-product/:id"
          element={<UpdateProduct />}
          loader={updateProductLoader}
          action={updateProductAction}
        />
        <Route path="/dashboard/all-products" element={<Allproducts />} loader={fetchAllProductLoader} />
        <Route
          path="/dashboard/all-products/:id"
          element={<SingleProductPage />}
          loader={singleProductPageLoader}
        />
        <Route path="/dashboard/order" element={<Orders />} />
      </Route>
      <Route path="/profile" element={<Profile />} loader={profileLoader} />
      <Route path="*" element={<Errorpage />} />
      <Route path="/logout" action={logoutAction} />
      <Route
        path="/update-security-address"
        element={<SetSecurityAndAddress />}
        loader={setSecurityAndAddressLoader}
        action={setSecurityAndAddressAction}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/new-password"
        element={<NewPassword />}
        action={newPasswordAction}
        loader={newPasswordLoader}
      />
      <Route
        path="/resend-otp-forgot-pass"
        element={<SendEmailForgotPassword />}
        action={resendOTPActionForgot}
        loader={resendOTPForgotLoader}
      />
      <Route
        path="/forgot-via-securityKey"
        element={<ForgotViaSecurityKey />}
        action={forgotViaSecurityKeyAction}
        loader={forgotViaSecurityKeyLoader}
      />

      <Route
        path="/resend-otp"
        element={<ResendOTP />}
        action={resendOTPAction}
      />
      <Route
        path="/verify-account"
        element={<VerifyAccount />}
        action={verifyAccountAction}
      />
    </Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
