import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getLocalStorage } from "../helper/localStorage";
import { LOCAL_STORAGE_USER } from "../helper/helper";

const userAuth = () => {
  const user = getLocalStorage(LOCAL_STORAGE_USER);
  if (user) {
    return {
      role: user.role,
      auth: true,
    };
  } else {
    return {
      role: null,
      auth: false,
    };
  }
};

export default function PublicRoute() {
  const { auth, role } = userAuth();
  return (
    <>
      {auth ? (
        role === "admin" ? (
          <Navigate to="/dashboard/admin/" />
        ) : 
        role === "manajer" ? (
          <Navigate to="/dashboard/manajer/" />
        ) : (
          <Navigate to="/dashboard/kasir/" />
        )
      ) : (
        <Outlet />
      )}
    </>
  );
}
