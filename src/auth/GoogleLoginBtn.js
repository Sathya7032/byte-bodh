// components/auth/GoogleLoginBtn.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';
import { googleLogin } from './authService';

const GoogleLoginBtn = ({ onSuccess, onFailure }) => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      
      if (response.success) {
        onSuccess(response);
      } else {
        onFailure();
      }
    } catch (error) {
      console.error('Google login error:', error);
      onFailure();
    }
  };

  return (
    <div className="google-login-wrapper">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          console.log('Google Login Failed');
          onFailure();
        }}
        useOneTap
        shape="rectangular"
        size="large"
        width="100%"
        theme="filled_blue"
        text="signin_with"
        locale="en"
      />
      {/* Alternative custom button */}
      <Button 
        variant="outline-primary" 
        className="w-100 mt-2 d-flex align-items-center justify-content-center"
        onClick={() => document.querySelector('[data-testid="google-login-button"]').click()}
      >
        <FaGoogle className="me-2" />
        Continue with Google
      </Button>
    </div>
  );
};

export default GoogleLoginBtn;