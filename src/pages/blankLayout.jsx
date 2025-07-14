import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const BlankLayout = () => {
  const localToken = localStorage.getItem("userToken");
  if (localToken) {
    return <Outlet />;
  }
  return <Navigate to={"/auth/login"} />;
};

export default BlankLayout;
