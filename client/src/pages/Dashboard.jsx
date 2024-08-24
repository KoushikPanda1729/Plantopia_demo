import "../styles/dashboard.css";
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { requireAuthAdmin } from "../utils/requireAuth";

export const dashboardLoader = async ({ request }) => {
  const { pathname } = new URL(request.url);
  await requireAuthAdmin(pathname);
  return null;
};

const Dashboard = () => {
  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <NavLink to={"/dashboard/create-category"}>
            <button className="dropdown-btn">Category</button>
          </NavLink>

          <NavLink to={"/dashboard/create-product"}>
            <button className="dropdown-btn">Product</button>
          </NavLink>
          <NavLink to={"/dashboard/order"}>
            <button className="dropdown-btn">Orders</button>
          </NavLink>
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
