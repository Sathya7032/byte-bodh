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
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Products from "./pages/Products";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import GoogleSuccess from "./auth/GoogleSuccess";
import PrivateRoutes from "./services/PrivateRoutes";
import AdminPrivateRoutes from "./services/AdminPrivateRoutes";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import Profile from "./portfolio/Profile";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProfileTemplate from "./portfolio/ProfileTemplate";
import PortfolioTemplates from "./portfolio/PortfolioTemplates";
import LinktreeTemplatesPage from "./portfolio/LinktreeTemplatesPage";
import LinktreePage from "./portfolio/LinktreePage";
import PublicLinktree from "./portfolio/PublicLinktree";
import InstagramAutomationPage from "./portfolio/InstagramAutomationPage";
import InstagramStudioPage from "./portfolio/instagram/InstagramStudioPage";
import InstagramConnectTrigger from "./portfolio/InstagramConnectTrigger";
import InstagramCallbackPage from "./portfolio/InstagramCallbackPage";
import Contacts from "./portfolio/Contacts";
import QRCodePage from "./portfolio/QRCodePage";
import Settings from "./portfolio/Settings";
import CustomDomain from "./portfolio/CustomDomain";
import Subscription from "./portfolio/Subscription";
import AdminLogin from "./admin/AdminLogin";
import DashboardPage from "./admin/pages/DashboardPage";
import AdminBlogs from "./admin/pages/AdminBlogs";
import Templates from "./admin/pages/Templates";
import AdminPayments from "./admin/pages/AdminPayments";
import AdminSubscriptions from "./admin/pages/AdminSubscriptions";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminLinktree from "./admin/pages/AdminLinktree";
import AdminLinktreeTemplates from "./admin/pages/AdminLinktreeTemplates";
import PageNotFound from "./pages/PageNotFound";
import TemplatesPage from "./pages/Templates";
import PublicPortfolioPage from "./bytebodh-folio/PublicPortfolioPage";
import Disclaimer from "./pages/Disclaimer";
import { isSubdomainPortfolio } from "./config/api";

const App = () => {
  const googleClientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID ||
    "852006735822-0baodraihfd46f7jur3odb7m80vijlug.apps.googleusercontent.com";

  if (isSubdomainPortfolio()) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ToastContainer position="top-right" theme="colored" />
          <Routes>
            <Route path="/" element={<PublicPortfolioPage />} />
            <Route path="/linktree" element={<PublicLinktree />} />
            <Route path="/linktree/:username" element={<PublicLinktree />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ToastContainer position="top-right" theme="colored" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* ===== PROTECTED ROUTES ===== */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/linktree" element={<LinktreePage />} />
            <Route path="/instagram-studio" element={<InstagramStudioPage />} />
            <Route path="/instagram-automation" element={<InstagramAutomationPage />} />
            <Route path="/instagram-connect" element={<InstagramConnectTrigger />} />
            <Route path="/instagram/connect" element={<InstagramConnectTrigger />} />
            <Route path="/instagram/callback" element={<InstagramCallbackPage />} />
            <Route path="/auth/instagram/callback" element={<InstagramCallbackPage />} />
            <Route path="/profile-template" element={<ProfileTemplate />} />
            <Route path="/portfolio-templates" element={<PortfolioTemplates />} />
            <Route path="/linktree-templates" element={<LinktreeTemplatesPage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/qr-code" element={<QRCodePage />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/custom-domain" element={<CustomDomain />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route element={<AdminPrivateRoutes />}>
            <Route path="/admin-dashboard" element={<DashboardPage />} />
            <Route path="/admin-blogs" element={<AdminBlogs />} />
            <Route path="/admin-users" element={<AdminUsers />} />
            <Route path="/admin-subscriptions" element={<AdminSubscriptions />} />
            <Route path="/admin-payments" element={<AdminPayments />} />
            <Route path="/admin-templates" element={<Templates />} />
            <Route path="/admin-linktree-templates" element={<AdminLinktreeTemplates />} />
            <Route path="/admin-linktree" element={<AdminLinktree />} />
          </Route>

          {/* ===== ADMIN LOGIN ===== */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* ===== TEMPLATE PREVIEW PAGE ===== */}
          <Route path="/templates/preview/:templateId" element={<PublicPortfolioPage isPreview={true} />} />

          {/* ===== DIRECT PORTFOLIO ON ROOT DOMAIN ===== */}
          <Route path="/portfolio/:username" element={<PublicPortfolioPage />} />
          <Route path="/p/:username" element={<PublicPortfolioPage />} />

          {/* ===== PUBLIC LINKTREE BIO PAGE (bytebodh.in/:username) ===== */}
          <Route path="/linktree/:username" element={<PublicLinktree />} />
          <Route path="/:username" element={<PublicLinktree />} />

          {/* ===== 404 PAGE NOT FOUND ===== */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
