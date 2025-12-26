import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { processGoogleToken } from '../services/auth';

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      console.log("GoogleSuccess: Handling callback");
      
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      
      console.log("GoogleSuccess: Token from URL:", token ? "Present" : "Missing");

      if (!token) {
        toast.error("No authentication token received. Please try again.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Process the Google token
        const result = processGoogleToken(token);
        
        if (result.success) {
          // Clear URL parameters to prevent re-processing
          window.history.replaceState({}, document.title, "/google-success");
          
          toast.success(result.message || "Google login successful!");
          
          // Small delay before redirect
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1000);
        } else {
          toast.error(result.message || "Failed to process Google login");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("GoogleSuccess error:", error);
        toast.error("An error occurred during Google login");
        navigate("/login", { replace: true });
      }
    };

    // Add a small delay to ensure component is mounted
    const timer = setTimeout(handleGoogleCallback, 100);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <div className="text-center">
        <div className="spinner-border text-light mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mb-2">Completing Google Authentication</h3>
        <p className="mb-0">Please wait while we log you in...</p>
      </div>
    </div>
  );
};

export default GoogleSuccess;