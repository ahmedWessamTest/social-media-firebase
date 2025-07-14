import React, { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signout } from "../src/services/auth_service";

const Navbar = () => {
  const user = useRef(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();
  const handleSignout = useCallback(async () => {
    const isLoggedOut = await signout();
    if (isLoggedOut) {
      localStorage.clear();
      navigate("/auth/login");
    }
  }, [navigate]);
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link to={"/"} className="navbar-brand d-flex align-items-center gap-1">
          <svg width="25" height="25" fill="currentColor" viewBox="0 0 48 48">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
          </svg>
          <h2 className="fw-bold h4 m-0">ConnectHub</h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="d-flex order-last align-items-center col-12 col-lg-4 gap-3 mt-3 mt-lg-0">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Search"
              />
            </div>
            <div className="text-nowrap">
              <h5 className="d-inline h6">{user.current.displayName} </h5>
              <i className="fa-solid fa-user"></i>
            </div>
            <button className="btn" title="logout" onClick={handleSignout}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Explore
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Notifications
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Messages
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
