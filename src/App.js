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
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import { Analytics } from "@vercel/analytics/react";
import ByteBodhQRGenerator from "./qr-code/ByteBodhQRGenerator";
import Products from "./pages/Products";
import StudentProfileBuilder from "./portfolio/StudentProfileBuilder";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import GoogleSuccess from "./auth/GoogleSuccess";
import PrivateRoutes from "./services/PrivateRoutes";
import AdminPrivateRoutes from "./services/AdminPrivateRoutes";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import Profile from "./portfolio/Profile";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProfileTemplate from "./portfolio/ProfileTemplate";
import PortfolioTemplates from "./portfolio/PortfolioTemplates";
import DashboardJobs from "./portfolio/DashboardJobs";
import DashboardJobDetail from "./portfolio/DashboardJobDetail";
import DashboardBlogs from "./portfolio/DashboardBlogs";
import DashboardBlogDetail from "./portfolio/DashboardBlogDetail";
import Contacts from "./portfolio/Contacts";
import Tasks from "./portfolio/Tasks";
import HelpSupportPage from "./portfolio/HelpSupportPage";
import QRCodePage from "./portfolio/QRCodePage";
import BillingsPage from "./portfolio/BillingsPage";
import Settings from "./portfolio/Settings";
import Referrals from "./portfolio/Referrals";
import AdminLogin from "./admin/AdminLogin";
import DashboardPage from "./admin/pages/DashboardPage";
import InvoiceGenerator from "./products/InvoiceGenerator";
import ImageCompressor from "./products/ImageCompressor";
import Categories from "./admin/pages/Categories";
import Blogs from "./admin/pages/Blogs";
import AdminBlogDetail from "./admin/pages/AdminBlogDetail";
import BlogForm from './admin/pages/BlogForm'
import AdminContacts from "./admin/pages/AdminContacts";
import Users from "./admin/pages/Users";
import CodeEditor from "./products/CodeEditor";
import JobNotifications from "./admin/pages/JobNotifications";
import JobNotificationForm from "./admin/pages/JobNotificationForm";
import JobNotificationDetail from "./admin/pages/JobNotificationDetail";
import Quiz from "./admin/pages/Quiz";
import Templates from "./admin/pages/Templates";
import AdminUserTemplates from "./admin/pages/AdminUserTemplates";
import AdminPayments from "./admin/pages/AdminPayments";
import PageNotFound from "./pages/PageNotFound";
import PublicPortfolioPage from "./bytebodh-folio/PublicPortfolioPage";
import Disclaimer from "./pages/Disclaimer";

function isSubdomainPortfolio() {
  return false;
}


const App = () => {
  const googleClientId =
    "514767744864-96k6mjju1fu0hjbd0qj31nq95gugg8t9.apps.googleusercontent.com";

  if (isSubdomainPortfolio()) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ToastContainer position="top-right" theme="colored" />
          <Routes>
            <Route path="/" element={<PublicPortfolioPage />} />
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
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/qr" element={<ByteBodhQRGenerator />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/invoive-generator" element={<InvoiceGenerator />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* ===== PROTECTED ROUTES ===== */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-template" element={<ProfileTemplate />} />
            <Route path="/portfolio-templates" element={<PortfolioTemplates />} />
            <Route path="/resume-builder" element={<StudentProfileBuilder />} />

            <Route path="/contacts" element={<Contacts />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/dashboard-jobs" element={<DashboardJobs />} />
            <Route path="/dashboard-jobs/:id" element={<DashboardJobDetail />} />
            <Route path="/dashboard-blogs" element={<DashboardBlogs />} />
            <Route path="/dashboard-blogs/:slug" element={<DashboardBlogDetail />} />
            <Route path="/help" element={<HelpSupportPage />} />
            <Route path="/qr-code" element={<QRCodePage />} />
            <Route path="/billings" element={<BillingsPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/referrals" element={<Referrals />} />
          </Route>

          <Route element={<AdminPrivateRoutes />}>
            <Route path="/admin-dashboard" element={<DashboardPage />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin-blogs" element={<Blogs />} />
            <Route path="/admin-templates" element={<Templates />} />
            <Route path="/admin-user-templates" element={<AdminUserTemplates />} />
            <Route path="/admin-payments" element={<AdminPayments />} />
            <Route path="/admin-blogs/:id" element={<AdminBlogDetail />} />
            <Route path="/admin-blogs/create" element={<BlogForm />} />
            <Route path="/admin-blogs/edit/:id" element={<BlogForm />} />
            <Route path="/admin-contacts" element={<AdminContacts />} />
            <Route path="/admin-users" element={<Users />} />
            <Route path="/admin/job-notifications" element={<JobNotifications />} />
            <Route path="/admin/job-notifications/create" element={<JobNotificationForm />} />
            <Route path="/admin/job-notifications/:id" element={<JobNotificationDetail />} />
            <Route path="/admin/job-notifications/:id/edit" element={<JobNotificationForm />} />
            <Route path="/admin-quiz" element={<Quiz />} />
          </Route>

          {/* ===== ADMIN LOGIN ===== */}
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* ===== TEMPLATE PREVIEW PAGE ===== */}
          <Route path="/templates/preview/:templateId" element={<PublicPortfolioPage isPreview={true} />} />

          {/* ===== PUBLIC PORTFOLIO PAGE ===== */}
          <Route path="/:username" element={<PublicPortfolioPage />} />
          
          {/* ===== 404 PAGE NOT FOUND ===== */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
