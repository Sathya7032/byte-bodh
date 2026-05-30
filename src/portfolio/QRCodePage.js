import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { getUser } from "../services/auth";
import { getMyProfile } from "../api/profileService";
import { getPortfolioUrl } from "../config/api";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";
import { 
  FaQrcode, 
  FaDownload, 
  FaShareAlt, 
  FaCopy, 
  FaExternalLinkAlt, 
  FaPalette, 
  FaInfoCircle,
  FaCheck
} from "react-icons/fa";

const QRCodePage = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState("#6C63FF"); // Default Brand Indigo color

  // Theme presets for QR code
  const colorPresets = [
    { name: "Brand Indigo", value: "#6C63FF", bg: "bg-[#6C63FF]" },
    { name: "Deep Navy", value: "#1e1b4b", bg: "bg-[#1e1b4b]" },
    { name: "Emerald Green", value: "#10B981", bg: "bg-[#10B981]" },
    { name: "Charcoal Dark", value: "#0f172a", bg: "bg-[#0f172a]" },
    { name: "Crimson Red", value: "#EF4444", bg: "bg-[#EF4444]" }
  ];

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setUsername(storedUser.username || "");
    }
    
    // Fetch profile to make sure we have the latest username
    getMyProfile()
      .then((res) => {
        const profileData = res.data || {};
        if (profileData.user?.username) {
          const fetchedUsername = profileData.user.username;
          setUsername(fetchedUsername);
          
          // Sync with local storage
          try {
            const stored = JSON.parse(localStorage.getItem("user") || "{}");
            stored.username = fetchedUsername;
            localStorage.setItem("user", JSON.stringify(stored));
          } catch (e) {
            console.error("Error syncing username:", e);
          }
        }
      })
      .catch((err) => console.error("Error loading profile for QR code:", err))
      .finally(() => setLoading(false));
  }, []);

  const portfolioUrl = getPortfolioUrl(username);

  const handleCopyLink = () => {
    if (!portfolioUrl) return;
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast.success("Portfolio link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!portfolioUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.fullName || "My"} Portfolio`,
          text: `Check out my personal developer portfolio on ByteBodh!`,
          url: portfolioUrl,
        });
        toast.success("Portfolio shared successfully!");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("page-qr-code-svg");
    if (!svg) {
      toast.error("QR Code element not found!");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const padding = 32;
      ctx.drawImage(img, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${username || 'my'}-portfolio-qr.png`);
          toast.success("QR Code downloaded successfully!");
        } else {
          toast.error("Failed to generate download blob.");
        }
      }, "image/png");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading QR Code settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout containerClassName="w-full space-y-6 animate-fadeIn">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800 text-left">
        <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
              <FaQrcode className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-sans">Portfolio QR Code</h1>
              <p className="text-xs text-slate-400 font-semibold mt-1">Generate, customize, and download a unique QR code linked directly to your public portfolio site.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left column: Customization Options & Details */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                <span>🔗</span> Your Portfolio Address
              </h2>
              <p className="text-xs text-slate-400 font-semibold mb-4 leading-relaxed">
                This is the public domain address where visitors and recruiters can see your live template layout and credentials.
              </p>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-slate-50 border border-slate-200/60 rounded-2xl p-2.5 w-full">
                <div className="flex items-center gap-2.5 pl-3 flex-1 overflow-hidden min-w-0">
                  <span className="text-[#6C63FF] font-extrabold text-sm">🌐</span>
                  <span className="text-xs font-bold text-slate-700 truncate">{portfolioUrl || "No URL generated"}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
                  >
                    {copied ? <FaCheck className="text-emerald-500" /> : <FaCopy className="text-indigo-500" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-[#6C63FF] hover:bg-[#5b52e6] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6C63FF]/15 active:scale-95"
                  >
                    <FaExternalLinkAlt size={10} /> View Site
                  </a>
                </div>
              </div>
            </div>

            {/* Customization color presets */}
            <div className="pt-4 border-t border-slate-100">
              <h2 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
                <FaPalette className="text-[#6C63FF] w-4 h-4" /> Customize QR Color
              </h2>
              <p className="text-xs text-slate-400 font-semibold mb-4">
                Select a visual theme color that matches your personal brand or matches your physical resume printout styling.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setQrColor(preset.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      qrColor === preset.value
                        ? "border-[#6C63FF] bg-[#6C63FF]/5 text-slate-800"
                        : "border-slate-200 hover:border-slate-300 text-slate-500 bg-white"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${preset.bg} inline-block border border-black/10`}></span>
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quick Share Tips */}
            <div className="pt-4 border-t border-slate-100 space-y-3.5">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FaInfoCircle className="text-indigo-400 w-3.5 h-3.5" /> Best Integration Practices
              </h3>
              <ul className="text-xs text-slate-500 font-semibold space-y-2 list-disc list-inside leading-relaxed pl-1">
                <li><span className="text-slate-700">Resume Header:</span> Put this QR code in the top right corner of your physical resume.</li>
                <li><span className="text-slate-700">Business Cards:</span> Place it on the back side of your business card alongside your tagline.</li>
                <li><span className="text-slate-700">LinkedIn Cover:</span> Add it to your customized LinkedIn banner layout.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: Dynamic Preview Frame */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between items-center text-center space-y-6">
            <div className="w-full text-left">
              <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-[#6C63FF] text-[9px] font-black uppercase tracking-widest rounded-full">
                Interactive Preview
              </span>
            </div>

            {/* QR Canvas Frame */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center justify-center shadow-inner relative overflow-hidden w-full max-w-[280px]">
              <div className="absolute top-0 right-0 w-[80px] h-[80px] rounded-full bg-[#6C63FF]/5 blur-[20px] pointer-events-none"></div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
                <QRCode
                  id="page-qr-code-svg"
                  value={portfolioUrl || "https://bytebodh.in"}
                  size={160}
                  level="H"
                  fgColor={qrColor}
                  bgColor="transparent"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-4 font-bold tracking-widest uppercase">
                scan to view profile
              </span>
            </div>

            {/* Sharing actions */}
            <div className="w-full flex flex-col gap-2.5">
              <button
                onClick={downloadQRCode}
                className="w-full py-3 bg-[#6C63FF] hover:bg-[#5b52e6] text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-[#6C63FF]/15 hover:shadow-lg hover:shadow-[#6C63FF]/25 cursor-pointer"
              >
                <FaDownload /> Download QR Code PNG
              </button>
              
              <button
                onClick={handleShare}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm"
              >
                <FaShareAlt className="text-slate-400" /> Share Portfolio Link
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default QRCodePage;
