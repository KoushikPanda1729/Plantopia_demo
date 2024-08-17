import React, { useState } from "react";
import { Form, NavLink, Outlet, useRouteLoaderData } from "react-router-dom";
import "../styles/nav.css";


const RootLayout = () => {
  const user = useRouteLoaderData("parentId");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <>
      <main>
        <nav className="nav">
          <h1 className="logo">
            <NavLink to={"/"}>
              Plantopia{" "}
              <img
                className="plant"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fpotted-plant-isolated-white-transparent-background-cutout-generative-ai-illustration_145713-6023.jpg&f=1&nofb=1&ipt=8c00477af47bc287f34acbbe10174fc78d78bb77647e06f05a4d31571662418e&ipo=images"
                alt="plant-image"
              />
            </NavLink>
          </h1>
          <div
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
            {!user && (
              <li className="nav-item">
                <NavLink to={"/api/login"}>Sign In</NavLink>
              </li>
            )}
            {!user && (
              <li className="nav-item get-start">
                <NavLink to={"/register"}>Get Started</NavLink>
              </li>
            )}

            {user && (
              <li className="nav-item image">
                <NavLink to={"/profile"}>
                  {" "}
                  <img src={user?.img} alt="profile_logo" />{" "}
                </NavLink>
              </li>
            )}
            {user && (
              <Form method="POST" action="/logout" className="logout-form">
                <button className="logout-button">Logout</button>
              </Form>
            )}
          </ul>
        </nav>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
