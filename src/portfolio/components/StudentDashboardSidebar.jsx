import React, { useEffect, useState } from "react";
import {
  HouseDoor,
  FileEarmarkPerson,
  Collection,
  Envelope,
  QrCode,
  Gear,
  Award,
  Link45deg,
  Instagram,
  Lightning,
  Palette,
  XLg,
  QuestionCircle,
} from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../../services/auth";
import { getSubscriptionStatus } from "../../api/subscriptionService";

const StudentDashboardSidebar = ({ isOpen, onMenuItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubscribed, setIsSubscribed] = useState(() => {
    const u = getUser();
    return Boolean(u?.hasActiveSubscription);
  });

  useEffect(() => {
    getSubscriptionStatus()
      .then((res) => {
        const data = res.data?.data || res.data;
        if (data?.active || data?.status === "ACTIVE") {
          setIsSubscribed(true);
        }
      })
      .catch(() => {});
  }, []);

  // Get active item from current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") return "dashboard";
    if (path === "/profile") return "portfolio";
    if (path === "/linktree") return "linktree";
    if (path === "/linktree-templates") return "linktree-templates";
    if (path === "/portfolio-templates") return "portfolio-templates";
    if (path === "/instagram-studio") return "instagram-studio";
    if (path === "/instagram-automation") return "instagram-automation";
    if (path === "/contacts") return "contacts";
    if (path === "/qr-code") return "qr-code";
    if (path === "/subscription") return "subscription";
    if (path === "/settings") return "settings";
    return "";
  };

  const activeItem = getActiveItem();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <HouseDoor size={20} />,
      path: "/dashboard",
    },
    {
      id: "portfolio",
      label: "Portfolio Details",
      icon: <FileEarmarkPerson size={20} />,
      path: "/profile",
    },
    {
      id: "linktree",
      label: "Linktree (Bio Links)",
      icon: <Link45deg size={21} />,
      path: "/linktree",
      badge: "LIVE",
    },
    {
      id: "linktree-templates",
      label: "Linktree Templates",
      icon: <Palette size={19} />,
      path: "/linktree-templates",
      badge: "NEW",
    },
    {
      id: "portfolio-templates",
      label: "Portfolio Templates",
      icon: <Collection size={20} />,
      path: "/portfolio-templates",
    },
    {
      id: "instagram-studio",
      label: "Instagram Studio",
      icon: <Instagram size={19} />,
      path: "/instagram-studio",
      badge: "NEW",
    },
    {
      id: "instagram-automation",
      label: "Instagram Automation",
      icon: <Lightning size={19} />,
      path: "/instagram-automation",
    },
    {
      id: "contacts",
      label: "Inquiries & Messages",
      icon: <Envelope size={20} />,
      path: "/contacts",
    },
    {
      id: "qr-code",
      label: "Portfolio & QR",
      icon: <QrCode size={20} />,
      path: "/qr-code",
    },
    {
      id: "subscription",
      label: isSubscribed ? "Pro Subscription" : "Subscription & Plans",
      icon: <Award size={20} />,
      path: "/subscription",
      badge: isSubscribed ? "PRO" : null,
      isProBadge: isSubscribed,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Gear size={20} />,
      path: "/settings",
    },
  ];

  const handleNavigate = (id, path) => {
    onMenuItemClick(id);
    navigate(path);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-slate-50/90 border-r border-slate-200/60 backdrop-blur-md transition-all duration-300 z-50 lg:static flex flex-col
        ${isOpen ? "w-[280px]" : "w-[80px]"}`}
    >
      {/* ===== BRAND ===== */}
      <div className="p-4 border-b border-slate-200/60 flex items-center justify-between bg-white/50 flex-shrink-0">
        {isOpen ? (
          <>
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center mr-2 shadow-lg shadow-emerald-500/20 animate-pulse">
                <FileEarmarkPerson size={18} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-slate-800 text-sm tracking-tight">ByteBodh</span>
                <span className="text-[9px] text-emerald-600 font-bold tracking-wider -mt-0.5">FOLIO BUILDER</span>
              </div>
            </div>

            <button
              onClick={() => onMenuItemClick("collapse")}
              className="lg:hidden text-slate-500 hover:text-emerald-600 hover:bg-slate-100 p-1.5 rounded-xl transition-colors"
              title="Collapse"
            >
              <XLg size={16} />
            </button>
          </>
        ) : (
          <div className="mx-auto w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/15">
            <FileEarmarkPerson size={18} />
          </div>
        )}
      </div>

      {/* ===== MENU ===== */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id, item.path)}
            className={`w-full cursor-pointer flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 transform active:scale-95
              ${
                activeItem === item.id
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-semibold"
                  : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 hover:translate-x-1"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`flex-shrink-0 transition-colors duration-300 ${activeItem === item.id ? "text-white" : "text-slate-400"}`}>
                {item.icon}
              </span>
              {isOpen && <span className="text-sm font-semibold tracking-tight">{item.label}</span>}
            </div>

            {isOpen && item.badge && (
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  item.isProBadge
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : activeItem === item.id
                    ? "bg-white/20 text-white"
                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ===== SETTINGS & HELP ===== */}
      <div className="w-full border-t border-slate-200/60 p-3 bg-slate-50/95 backdrop-blur-sm flex-shrink-0">
        <button
          onClick={() => handleNavigate("help", "/help")}
          className={`w-full cursor-pointer flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 transform active:scale-95
            ${
              activeItem === "help"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-semibold"
                : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50 hover:translate-x-1"
            }`}
        >
          <span className={`flex-shrink-0 transition-colors duration-300 ${activeItem === "help" ? "text-white" : "text-slate-400"}`}>
            <QuestionCircle size={20} />
          </span>
          {isOpen && <span className="text-sm font-semibold tracking-tight">Help & Support</span>}
        </button>
      </div>
    </div>
  );
};

export default StudentDashboardSidebar;