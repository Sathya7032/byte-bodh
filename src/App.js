import React from "react";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import AboutUs from "./pages/AboutUs";
import BlogDetail from "./pages/BlogDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";
// import Jobs from "./pages/Jobs";
// import JobDetail from "./pages/JobDetail";
import { Analytics } from "@vercel/analytics/react";
import ByteBodhQRGenerator from "./qr-code/ByteBodhQRGenerator";
import Products from "./pages/Products";
import StudentProfileBuilder from "./portfolio/StudentProfileBuilder";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import GoogleSuccess from "./auth/GoogleSuccess";
import PrivateRoutes from "./services/PrivateRoutes";
import Register from "./auth/Register";
import Profile from "./portfolio/Profile";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProfileTemplate from "./portfolio/ProfileTemplate";
import Portfolio from "./portfolio/Portfolio";
import Contacts from "./portfolio/Contacts";
import Tasks from "./portfolio/Tasks";
import HelpSupportPage from "./portfolio/HelpSupportPage";

const App = () => {
  const googleClientId =
    "514767744864-96k6mjju1fu0hjbd0qj31nq95gugg8t9.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ToastContainer position="top-right" theme="colored" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/qr" element={<ByteBodhQRGenerator />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/portfolio/:username" element={<Portfolio />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          {/*         
          <Route path="/jobs" element={<Jobs />} />
          
          <Route path="/jobs/:id" element={<JobDetail />} />
           */}

          {/* ===== PROTECTED ROUTES ===== */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-template" element={<ProfileTemplate />} />
            <Route path="/resume-builder" element={<StudentProfileBuilder />} />

            <Route path="/contacts" element={<Contacts />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/help" element={<HelpSupportPage />} />
          </Route>
        </Routes>
        <Analytics />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
