import React, { useState } from "react";
import { Form, NavLink, Outlet, useRouteLoaderData } from "react-router-dom";
import "../styles/nav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faThLarge,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";

const RootLayout = () => {
  const userData = useRouteLoaderData("parentId");
  const [user, setUser] = useState(userData);

  const updateUserProfileImage = (newImageUrl) => {
    setUser((prevUser) => ({
      ...prevUser,
      img: newImageUrl,
    }));
  };
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
            className={`hamburger-nav-menu ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-list ${menuOpen ? "open" : ""}`}>
            {!userData && (
              <li className="nav-item get-into">
                <NavLink to={"/login"}>Sign In</NavLink>
              </li>
            )}
            {!userData && (
              <li className="nav-item get-start">
                <NavLink to={"/register"}>Get Started</NavLink>
              </li>
            )}

            <li className="nav-item cart">
              <div className="item-count">7</div>
              <FontAwesomeIcon icon={faShoppingCart} />
            </li>

            {userData && (
              <li className="nav-item image">
                <NavLink to={"/profile"}>
                  {" "}
                  <img
                    src={!user?.img ? userData?.img : user?.img}
                    alt="profile_logo"
                  />{" "}
                  <p
                    style={{
                      fontSize: "0.8rem",
                      textAlign: "center",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Profile
                  </p>
                </NavLink>
              </li>
            )}

            {userData && user?.role === "admin" && (
              <li className="nav-item dashboard">
                <NavLink to={"/dashboard"}>
                  <FontAwesomeIcon icon={faThLarge} />
                  <p>Dashboard</p>
                </NavLink>
              </li>
            )}
            {userData && (
              <Form method="POST" action="/logout" className="logout-form">
                <button className="logout-button">
                  Logout <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </Form>
            )}
          </ul>
        </nav>
        <Outlet context={{ updateUserProfileImage }} />
      </main>
    </>
  );
};

export default RootLayout;
