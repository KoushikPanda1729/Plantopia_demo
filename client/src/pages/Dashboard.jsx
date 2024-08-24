import "../styles/dashboard.css";
import React, { useState } from "react";
import { redirect, Outlet, NavLink } from "react-router-dom";

// export const dashboardLoader = async () => {
//   if (!user || user.role !== "admin") {
//     return redirect("/login");
//   }
//   return user;
// };

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
