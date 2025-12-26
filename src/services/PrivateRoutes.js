import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const PrivateRoutes = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    console.log("PrivateRoutes: Checking authentication...");
    
    // Check authentication status
    const checkAuth = async () => {
      try {
        const authStatus = isAuthenticated();
        console.log("PrivateRoutes: Authentication status:", authStatus);
        setIsAuth(authStatus);
      } catch (error) {
        console.error("PrivateRoutes: Error checking auth:", error);
        setIsAuth(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Small delay to prevent race conditions
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render child routes
  if (isAuth) {
    console.log("PrivateRoutes: User authenticated, rendering outlet");
    return <Outlet />;
  }

  // If not authenticated, redirect to login
  console.log("PrivateRoutes: User not authenticated, redirecting to login");
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export default PrivateRoutes;