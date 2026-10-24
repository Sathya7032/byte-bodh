import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

/**
 * Guards all user dashboard routes.
 *
 * - Checks synchronously on every render/route change (no spinner flash, no window where a
 *   protected screen renders for a signed-out user).
 * - Re-checks when the page is restored from the browser's back/forward cache (pressing "Back"
 *   after logging out), when the tab regains focus, and when another tab logs out.
 */
const PrivateRoutes = () => {
  const location = useLocation();
  const [, forceRecheck] = useState(0);

  useEffect(() => {
    const recheck = () => forceRecheck((n) => n + 1);
    const onPageShow = (e) => {
      if (e.persisted && !isAuthenticated()) window.location.replace("/login");
    };
    const onStorage = (e) => {
      if (e.key === null || e.key === "accessToken" || e.key === "user") recheck();
    };
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", recheck);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", recheck);
    };
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: `${location.pathname}${location.search}` }} replace />;
  }
  return <Outlet />;
};

export default PrivateRoutes;
