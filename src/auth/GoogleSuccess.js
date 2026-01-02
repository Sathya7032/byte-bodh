import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { processGoogleToken } from '../services/auth';
import { FaGoogle,  FaSpinner } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-400 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400 opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full border border-white border-opacity-20">
        {/* Google Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-white rounded-full p-4 shadow-xl">
              <FaGoogle className="text-4xl text-blue-600" />
            </div>
          </div>
        </div>

        {/* Spinning Loader */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaSpinner className="text-5xl text-white animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Completing Authentication
          </h2>
          <p className="text-lg text-white text-opacity-90 mb-2">
            Please wait while we log you in...
          </p>
          <div className="flex items-center justify-center space-x-2 text-white text-opacity-75">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-white rounded-full animate-progress"></div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-white text-opacity-60 text-sm mt-6">
          Securely connecting with Google
        </p>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 70%;
            transform: translateX(0);
          }
          100% {
            width: 100%;
            transform: translateX(0);
          }
        }
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default GoogleSuccess;