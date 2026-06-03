import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Files,
  Search,
  GitBranch,
  Settings,
  Terminal,
  ChevronRight,
  ChevronDown,
  Play,
  Eye,
  Code,
  Folder,
  FolderOpen,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Award,
  Send,
  ExternalLink,
  Menu,
  X,
  FileJson,
  FileCode,
  FileText,
  Coffee,
  Check,
  AlertCircle
} from "lucide-react";
import { createContactMessage } from "../api/profileService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TemplateFive = ({ profile }) => {
  const { username: routeUsername } = useParams();

  // Extract username dynamically
  const getUsernameFromDomain = () => {
    const hostname = window.location.hostname;
    if (hostname.endsWith(".localhost")) {
      const subdomain = hostname.replace(".localhost", "");
      return subdomain && subdomain !== "www" ? subdomain : null;
    }
    if (hostname.endsWith(".bytebodh.in")) {
      const subdomain = hostname.replace(".bytebodh.in", "");
      return subdomain && subdomain !== "www" ? subdomain : null;
    }
    return null;
  };

  const username = profile.user?.username || routeUsername || getUsernameFromDomain() || "user";

  // IDE States
  const [activeFile, setActiveFile] = useState("bio.json");
  const [openFiles, setOpenFiles] = useState(["bio.json", "skills.ts", "experience.js"]);
  const [viewMode, setViewMode] = useState("preview"); // 'code' or 'preview'
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("explorer"); // 'explorer', 'search', 'git', 'extensions'
  
  // Folder tree toggle states
  const [foldersOpen, setFoldersOpen] = useState({
    profile: true,
    professional: true,
    contact: true
  });

  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-close explorer on mobile load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExplorerOpen(false);
      } else {
        setExplorerOpen(true);
      }
    };
    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  // Skill parsing
  const skillList = useMemo(() => {
    if (!profile.skills) return [];
    return profile.skills.map((skill) => {
      if (typeof skill === "object" && skill !== null) {
        return { name: skill.name, proficiency: skill.proficiency || 85 };
      }
      return { name: skill, proficiency: 85 };
    });
  }, [profile.skills]);

  // Experience calculation
  const totalExperienceYears = useMemo(() => {
    if (!profile.experience || profile.experience.length === 0) return 5;
    let years = 0;
    profile.experience.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate && exp.endDate.toUpperCase() !== "PRESENT" ? new Date(exp.endDate) : new Date();
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        years += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      }
    });
    return Math.max(Math.ceil(years), 1);
  }, [profile.experience]);

  // Handle contact form inputs
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit contact message
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const contactData = {
        id: profile?.user?.id,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        recipientUsername: username
      };

      const response = await createContactMessage(contactData);
      if (response.data?.success) {
        toast.success("Message compiled & delivered successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error(response.data?.message || "Internal server error");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to compile message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resolve file icon and language
  const getFileInfo = (filename) => {
    if (filename.endsWith(".json")) return { icon: <FileJson className="w-4 h-4 text-yellow-500 shrink-0" />, lang: "JSON" };
    if (filename.endsWith(".js")) return { icon: <FileCode className="w-4 h-4 text-amber-400 shrink-0" />, lang: "JavaScript" };
    if (filename.endsWith(".ts")) return { icon: <FileCode className="w-4 h-4 text-sky-400 shrink-0" />, lang: "TypeScript" };
    if (filename.endsWith(".py")) return { icon: <FileCode className="w-4 h-4 text-blue-500 shrink-0" />, lang: "Python" };
    if (filename.endsWith(".md")) return { icon: <FileText className="w-4 h-4 text-[#519aba] shrink-0" />, lang: "Markdown" };
    if (filename.endsWith(".html")) return { icon: <FileText className="w-4 h-4 text-orange-500 shrink-0" />, lang: "HTML" };
    return { icon: <FileText className="w-4 h-4 text-slate-400 shrink-0" />, lang: "Text" };
  };

  const getSocialIcon = (platform) => {
    const p = platform.toUpperCase();
    if (p.includes("GITHUB")) return <Github className="w-4 h-4" />;
    if (p.includes("LINKEDIN")) return <Linkedin className="w-4 h-4" />;
    if (p.includes("TWITTER") || p.includes("X")) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const toggleFolder = (folder) => {
    setFoldersOpen((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  // Open file helper
  const openFile = (file) => {
    if (!openFiles.includes(file)) {
      setOpenFiles((prev) => [...prev, file]);
    }
    setActiveFile(file);
    // Close explorer drawer on mobile view once active file is selected
    if (window.innerWidth < 1024) {
      setExplorerOpen(false);
    }
  };

  // Close file helper
  const closeFile = (file, e) => {
    e.stopPropagation();
    const updated = openFiles.filter((f) => f !== file);
    setOpenFiles(updated);
    if (activeFile === file && updated.length > 0) {
      setActiveFile(updated[updated.length - 1]);
    } else if (updated.length === 0) {
      setActiveFile("bio.json");
      setOpenFiles(["bio.json"]);
    }
  };

  // Cool Build & Run compilation simulation animation
  const handleRunCode = () => {
    if (viewMode === "preview") return; // already in preview
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setViewMode("preview");
      toast.info(`Compiled ${activeFile} successfully!`, {
        icon: "🚀",
        style: { background: "#1e1e24", color: "#61afef" }
      });
    }, 1200);
  };

  // File tree structure list
  const fileStructure = [
    {
      name: "profile",
      isFolder: true,
      children: ["bio.json", "skills.ts"]
    },
    {
      name: "professional",
      isFolder: true,
      children: ["experience.js", "projects.py", "education.md"]
    },
    {
      name: "contact",
      isFolder: true,
      children: ["contact.html"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#18181c] text-[#abb2bf] font-mono select-none flex flex-col relative overflow-hidden">
      <ToastContainer position="bottom-right" autoClose={2500} theme="dark" />

      {/* Compiler Animation Overlay */}
      {isCompiling && (
        <div className="fixed inset-0 bg-[#0f1419]/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center font-mono text-emerald-400 p-6 text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-bold tracking-widest animate-pulse mb-3">BUILDING & COMPILING PORTFOLIO...</p>
          <div className="bg-[#1e1e24] border border-white/10 rounded-xl p-4 max-w-lg w-full text-left text-xs text-slate-300 font-mono shadow-2xl">
            <p className="text-emerald-500">$ npm run build</p>
            <p className="text-slate-400 mt-1">&gt; bytebodh-folio-engine@5.0.0 build</p>
            <p className="text-slate-400">&gt; react-scripts build --env=production</p>
            <p className="text-blue-400 mt-2">Analyzing active file tree...</p>
            <p className="text-yellow-400">Loading module: {activeFile}</p>
            <p className="text-[#98c379] mt-1">Status: OK [Parsed successfully in 412ms]</p>
          </div>
        </div>
      )}

      {/* VS Code Title Bar */}
      <div className="bg-[#21252b] border-b border-[#181a1f] px-3 py-2 flex items-center justify-between text-xs text-[#9da5b4]">
        <div className="flex items-center gap-1.5 font-sans">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <span className="ml-2 hidden sm:inline text-[11px]">ByteBodh Studio - {profile.fullName}</span>
        </div>
        <div className="bg-[#1e2227] px-8 py-1 rounded border border-[#181a1f] text-[11px] truncate max-w-[50%] select-text font-sans">
          {username}.bytebodh.in &mdash; {activeFile}
        </div>
        <div className="flex items-center gap-3 font-sans text-[11px]">
          <span className="hidden md:inline px-2 py-0.5 bg-[#2c313c] text-emerald-400 rounded-sm font-semibold border border-emerald-500/20">Production</span>
          <span className="hidden lg:inline text-slate-500">v1.2.0</span>
        </div>
      </div>

      {/* Main IDE Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* SIDEBAR 1: Left Mini Activity Bar */}
        <div className="w-12 sm:w-16 bg-[#21252b] border-r border-[#181a1f] flex flex-col justify-between items-center py-4 z-40">
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={() => {
                setActiveSidebarTab("explorer");
                setExplorerOpen(!explorerOpen);
              }}
              className={`py-3 w-full flex justify-center border-l-2 transition-all relative group ${
                explorerOpen && activeSidebarTab === "explorer"
                  ? "text-[#61afef] border-[#61afef]"
                  : "text-[#676f7d] border-transparent hover:text-[#abb2bf]"
              }`}
              title="Explorer"
            >
              <Files className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all bg-[#2c313c] text-[#abb2bf] text-[10px] px-2 py-1 rounded border border-[#181a1f] whitespace-nowrap shadow-xl z-50 font-sans">
                Explorer (Ctrl+Shift+E)
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab("search");
                setExplorerOpen(true);
              }}
              className={`py-3 w-full flex justify-center border-l-2 transition-all relative group ${
                explorerOpen && activeSidebarTab === "search"
                  ? "text-[#61afef] border-[#61afef]"
                  : "text-[#676f7d] border-transparent hover:text-[#abb2bf]"
              }`}
              title="Search"
            >
              <Search className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all bg-[#2c313c] text-[#abb2bf] text-[10px] px-2 py-1 rounded border border-[#181a1f] whitespace-nowrap shadow-xl z-50 font-sans">
                Search (Ctrl+Shift+F)
              </span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab("git");
                setExplorerOpen(true);
              }}
              className={`py-3 w-full flex justify-center border-l-2 transition-all relative group ${
                explorerOpen && activeSidebarTab === "git"
                  ? "text-[#61afef] border-[#61afef]"
                  : "text-[#676f7d] border-transparent hover:text-[#abb2bf]"
              }`}
              title="Source Control"
            >
              <GitBranch className="w-5.5 h-5.5 sm:w-6 sm:h-6" />
              <span className="absolute left-14 scale-0 group-hover:scale-100 transition-all bg-[#2c313c] text-[#abb2bf] text-[10px] px-2 py-1 rounded border border-[#181a1f] whitespace-nowrap shadow-xl z-50 font-sans">
                Source Control (Ctrl+Shift+G)
              </span>
              <span className="absolute top-1.5 right-1 bg-[#61afef] text-[#21252b] text-[8px] font-bold px-1 rounded-full shrink-0 scale-75 sm:scale-100">
                1
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-3 w-full items-center">
            {profile.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.fullName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-orange-500 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => openFile("bio.json")}
                title="Profile Settings"
              />
            ) : (
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-orange-500"
                onClick={() => openFile("bio.json")}
              >
                {profile.fullName?.[0]}
              </div>
            )}
            <button className="text-[#676f7d] hover:text-[#abb2bf] p-2 transition-colors relative group" title="Settings">
              <Settings className="w-5 h-5" />
              <span className="absolute left-14 bottom-0 scale-0 group-hover:scale-100 transition-all bg-[#2c313c] text-[#abb2bf] text-[10px] px-2 py-1 rounded border border-[#181a1f] whitespace-nowrap shadow-xl z-50 font-sans">
                Settings
              </span>
            </button>
          </div>
        </div>

        {/* SIDEBAR 2: Explorer/Search Drawer (Collapsible) */}
        {explorerOpen && (
          <div className="w-56 sm:w-64 bg-[#1e2227] border-r border-[#181a1f] flex flex-col shrink-0 z-30 absolute lg:relative inset-y-0 left-12 lg:left-0 shadow-2xl lg:shadow-none h-full max-h-full">
            
            {/* Header with Title and Close Button (For mobile layout) */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-[#181a1f]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9da5b4] font-sans">
                {activeSidebarTab === "explorer" && "Explorer: Workspace"}
                {activeSidebarTab === "search" && "Search Files"}
                {activeSidebarTab === "git" && "Source Control: Git"}
              </span>
              <button
                className="lg:hidden text-[#9da5b4] hover:text-white"
                onClick={() => setExplorerOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Content Switch */}
            <div className="flex-1 overflow-y-auto py-2 text-[13px]">
              
              {/* TAB 1: File Explorer View */}
              {activeSidebarTab === "explorer" && (
                <div className="space-y-1.5 select-none">
                  {/* Repo Root Toggle */}
                  <div className="flex items-center gap-1.5 px-3 py-1 text-slate-300 font-bold uppercase text-[10px] tracking-wider bg-[#282c34]/30">
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>ByteBodh_Portfolio</span>
                  </div>

                  <div className="px-1.5 space-y-1">
                    {fileStructure.map((folder) => {
                      const isOpen = foldersOpen[folder.name];
                      return (
                        <div key={folder.name} className="space-y-0.5">
                          {/* Folder Name */}
                          <div
                            onClick={() => toggleFolder(folder.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#2c313c]/50 rounded cursor-pointer text-slate-300 transition-colors"
                          >
                            {isOpen ? (
                              <ChevronDown className="w-3.5 h-3.5 text-[#61afef]" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            {isOpen ? (
                              <FolderOpen className="w-4 h-4 text-[#e5c07b] shrink-0" />
                            ) : (
                              <Folder className="w-4 h-4 text-[#e5c07b] shrink-0" />
                            )}
                            <span className="font-medium text-[#abb2bf]">{folder.name}</span>
                          </div>

                          {/* Folder Children */}
                          {isOpen && (
                            <div className="pl-6 space-y-0.5">
                              {folder.children.map((file) => {
                                const isActive = activeFile === file;
                                return (
                                  <div
                                    key={file}
                                    onClick={() => openFile(file)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors ${
                                      isActive 
                                        ? "bg-[#2c313c] text-white" 
                                        : "hover:bg-[#2c313c]/30 text-[#abb2bf] hover:text-white"
                                    }`}
                                  >
                                    {getFileInfo(file).icon}
                                    <span>{file}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: Search View */}
              {activeSidebarTab === "search" && (
                <div className="px-4 py-3 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Search Query</label>
                    <input
                      type="text"
                      placeholder="Search profile content..."
                      className="w-full bg-[#21252b] border border-[#181a1f] px-3 py-2 text-xs rounded text-white focus:outline-none focus:border-[#61afef] transition-colors"
                    />
                  </div>
                  <div className="text-[11px] text-[#676f7d] leading-relaxed">
                    Type a query to search inside biography elements, skills list, project descriptions, and achievements.
                  </div>
                </div>
              )}

              {/* TAB 3: Source Control View */}
              {activeSidebarTab === "git" && (
                <div className="px-4 py-3 space-y-4">
                  <div className="flex items-center justify-between text-xs border-b border-[#181a1f] pb-2 text-slate-300">
                    <span>Source Control: Git</span>
                    <span className="font-bold text-[#61afef]">main*</span>
                  </div>
                  
                  {/* Commits Info */}
                  <div className="space-y-3">
                    <div className="bg-[#2c313c]/30 border border-white/5 rounded-lg p-3 space-y-1 text-xs">
                      <p className="font-bold text-[#abb2bf]">Uncommitted Changes</p>
                      <p className="text-[10px] text-yellow-500">M contact/contact.html (Local form updates)</p>
                    </div>

                    <button
                      onClick={() => toast.success("Changes committed successfully to main!")}
                      className="w-full bg-[#61afef] hover:bg-[#4d97d9] text-[#21252b] font-bold text-xs py-2 px-3 rounded shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <GitBranch className="w-4 h-4" /> Commit & Push
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* EDITOR AREA (Remaining space) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e24] overflow-hidden">
          
          {/* File Tabs Bar & Action Buttons */}
          <div className="bg-[#21252b] border-b border-[#181a1f] flex items-center justify-between overflow-x-auto select-none no-scrollbar">
            
            {/* Open File Tabs */}
            <div className="flex overflow-x-auto shrink-0 max-w-[70%] no-scrollbar">
              {openFiles.map((file) => {
                const isActive = activeFile === file;
                return (
                  <div
                    key={file}
                    onClick={() => openFile(file)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs border-r border-[#181a1f] cursor-pointer transition-all select-none whitespace-nowrap ${
                      isActive 
                        ? "bg-[#1e1e24] text-white border-t-2 border-t-orange-500" 
                        : "bg-[#21252b] text-[#676f7d] hover:text-[#abb2bf] hover:bg-[#282c34]/20"
                    }`}
                  >
                    {getFileInfo(file).icon}
                    <span>{file}</span>
                    <button
                      onClick={(e) => closeFile(file, e)}
                      className="p-0.5 rounded-full hover:bg-slate-700/50 hover:text-white shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions (Run, Code/Preview Toggle, etc.) */}
            <div className="flex items-center gap-2 px-3 py-1 shrink-0 font-sans text-xs">
              {/* Explorer toggle button for mobile */}
              <button
                onClick={() => setExplorerOpen(!explorerOpen)}
                className="lg:hidden p-1.5 rounded hover:bg-[#2c313c] text-[#abb2bf]"
                title="Toggle Explorer"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>

              {/* Build/Run Button */}
              {viewMode === "code" && (
                <button
                  onClick={handleRunCode}
                  className="bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-400 px-3 py-1.5 rounded border border-emerald-500/30 flex items-center gap-1.5 transition-all shadow-md font-bold cursor-pointer"
                  title="Run Code"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Run Code</span>
                </button>
              )}

              {/* View Mode Switcher [Code | Preview] */}
              <div className="flex items-center bg-[#2c313c] rounded-lg p-0.5 border border-white/5 select-none">
                <button
                  onClick={() => setViewMode("code")}
                  className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all font-bold ${
                    viewMode === "code"
                      ? "bg-[#1e1e24] text-[#61afef] shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Code</span>
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all font-bold ${
                    viewMode === "preview"
                      ? "bg-[#1e1e24] text-[#98c379] shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
              </div>
            </div>

          </div>

          {/* MAIN CONTAINER: Line Numbers + Content Panel */}
          <div className="flex-1 flex overflow-hidden select-text text-sm">
            
            {/* Editor Mode: Code View (Syntax Highlighted) */}
            {viewMode === "code" && (
              <div className="flex-1 flex overflow-y-auto bg-[#1e1e24] py-4 pr-4 pl-3 sm:pl-4 font-mono font-medium leading-relaxed leading-6 whitespace-pre md:whitespace-pre overflow-x-auto text-[12px] sm:text-xs text-slate-300">
                {/* Simulated Editor Line Numbers */}
                <div className="w-8 sm:w-10 select-none text-right pr-3.5 text-[#4b5263] border-r border-[#282c34] text-right font-light shrink-0">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Simulated Syntax Highlighting Code Elements */}
                <div className="pl-4 flex-1 select-text overflow-x-auto no-scrollbar">
                  
                  {/* bio.json code syntax */}
                  {activeFile === "bio.json" && (
                    <div className="space-y-0.5">
                      <div className="text-gray-500">{"// Personal profile representation schema"}</div>
                      <div>
                        <span className="text-[#e06c75]">{`{`}</span>
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#e06c75]">"fullName"</span>: <span className="text-[#98c379]">"{profile.fullName}"</span>,
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#e06c75]">"headline"</span>: <span className="text-[#98c379]">"{profile.headline}"</span>,
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#e06c75]">"aboutSummary"</span>: <span className="text-[#98c379]">"{profile.summary || "Professional developer portfolio"}"</span>,
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#e06c75]">"contacts"</span>: <span className="text-[#d19a66]">{`{`}</span>
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`    `}</span>
                        <span className="text-[#e06c75]">"email"</span>: <span className="text-[#98c379]">"{profile.email}"</span>,
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`    `}</span>
                        <span className="text-[#e06c75]">"mobile"</span>: <span className="text-[#98c379]">"{profile.mobileNumber}"</span>,
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`    `}</span>
                        <span className="text-[#e06c75]">"location"</span>: <span className="text-[#98c379]">"{profile.location}"</span>
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#d19a66]">{`}`}</span>,
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#e06c75]">"socials"</span>: <span className="text-[#c678dd]">{`[`}</span>
                      </div>
                      {profile.socialMediaLinks?.map((social, i) => (
                        <div key={i}>
                          <span className="text-[#abb2bf]">{`    `}</span>
                          <span className="text-[#abb2bf]">{`{ `}</span>
                          <span className="text-[#e06c75]">"platform"</span>: <span className="text-[#98c379]">"{social.platform}"</span>, 
                          <span className="text-[#e06c75]"> "url"</span>: <span className="text-[#98c379]">"{social.url}"</span>
                          <span className="text-[#abb2bf]">{` }`}</span>
                          {i < profile.socialMediaLinks.length - 1 && ","}
                        </div>
                      ))}
                      <div>
                        <span className="text-[#abb2bf]">{`  `}</span>
                        <span className="text-[#c678dd]">{`]`}</span>
                      </div>
                      <div>
                        <span className="text-[#e06c75]">{`}`}</span>
                      </div>
                    </div>
                  )}

                  {/* skills.ts code syntax */}
                  {activeFile === "skills.ts" && (
                    <div className="space-y-0.5">
                      <div>
                        <span className="text-[#c678dd]">export interface</span> <span className="text-[#e5c07b]">Skill</span> <span className="text-[#abb2bf]">{`{`}</span>
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  name: string;`}</span>
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`  proficiency: number;`}</span>
                      </div>
                      <div>
                        <span className="text-[#abb2bf]">{`}`}</span>
                      </div>
                      <div className="h-4"></div>
                      <div>
                        <span className="text-[#c678dd]">export const</span> <span className="text-[#61afef]">developerSkills</span>: <span className="text-[#e5c07b]">Skill</span><span className="text-[#c678dd]">[]</span> = <span className="text-[#abb2bf]">[</span>
                      </div>
                      {skillList.map((skill, i) => (
                        <div key={i}>
                          <span className="text-[#abb2bf]">{`  { name: `}</span>
                          <span className="text-[#98c379]">"{skill.name}"</span>
                          <span className="text-[#abb2bf]">{`, proficiency: `}</span>
                          <span className="text-[#d19a66]">{skill.proficiency}</span>
                          <span className="text-[#abb2bf]">{` }`}</span>
                          {i < skillList.length - 1 && ","}
                        </div>
                      ))}
                      <div>
                        <span className="text-[#abb2bf]">];</span>
                      </div>
                    </div>
                  )}

                  {/* experience.js code syntax */}
                  {activeFile === "experience.js" && (
                    <div className="space-y-0.5">
                      <div className="text-gray-500">{"// professional work history dataset"}</div>
                      <div>
                        <span className="text-[#c678dd]">export const</span> <span className="text-[#61afef]">getExperienceHistory</span> = () =&gt; <span className="text-[#abb2bf]">{`[`}</span>
                      </div>
                      {profile.experience?.map((exp, i) => (
                        <div key={i} className="pl-4 space-y-0.5">
                          <div>
                            <span className="text-[#abb2bf]">{`{`}</span>
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`  `}</span>
                            <span className="text-[#e06c75]">company</span>: <span className="text-[#98c379]">"{exp.company}"</span>,
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`  `}</span>
                            <span className="text-[#e06c75]">role</span>: <span className="text-[#98c379]">"{exp.position}"</span>,
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`  `}</span>
                            <span className="text-[#e06c75]">duration</span>: <span className="text-[#98c379]">"{exp.startDate} - {exp.endDate || "Present"}"</span>,
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`  `}</span>
                            <span className="text-[#e06c75]">description</span>: <span className="text-[#98c379]">`{exp.description}`</span>
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`}`}</span>
                            {i < profile.experience.length - 1 && ","}
                          </div>
                        </div>
                      ))}
                      {(!profile.experience || profile.experience.length === 0) && (
                        <div className="pl-4 text-gray-500">{"// No experiences provided"}</div>
                      )}
                      <div>
                        <span className="text-[#abb2bf]">{`];`}</span>
                      </div>
                    </div>
                  )}

                  {/* projects.py code syntax */}
                  {activeFile === "projects.py" && (
                    <div className="space-y-0.5">
                      <div className="text-gray-500">{"# -*- coding: utf-8 -*-"}</div>
                      <div className="text-gray-500">{"# Python structure representing prototype links"}</div>
                      <div className="h-4"></div>
                      <div>
                        <span className="text-[#61afef]">portfolio_projects</span>: <span className="text-[#c678dd]">list</span> = <span className="text-[#abb2bf]">[</span>
                      </div>
                      {profile.projects?.map((proj, i) => (
                        <div key={i} className="pl-4 space-y-0.5">
                          <div>
                            <span className="text-[#abb2bf]">{`{`}</span>
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`    `}</span>
                            <span className="text-[#98c379]">"title"</span>: <span className="text-[#98c379]">"{proj.title}"</span>,
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`    `}</span>
                            <span className="text-[#98c379]">"summary"</span>: <span className="text-[#98c379]">"{proj.description}"</span>,
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`    `}</span>
                            <span className="text-[#98c379]">"stack"</span>: <span className="text-[#abb2bf]">[</span>
                            {(proj.technologies || proj.techStack?.split(",") || []).map((t, idx) => (
                              <span key={idx}>
                                <span className="text-[#98c379]">"{t.trim()}"</span>
                                {idx < (proj.technologies || proj.techStack?.split(",") || []).length - 1 && ", "}
                              </span>
                            ))}
                            <span className="text-[#abb2bf]">]</span>,
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`    `}</span>
                            <span className="text-[#98c379]">"prototype_url"</span>: <span className="text-[#61afef]">"{proj.link || proj.projectUrl}"</span>
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">{`}`}</span>
                            {i < profile.projects.length - 1 && ","}
                          </div>
                        </div>
                      ))}
                      {(!profile.projects || profile.projects.length === 0) && (
                        <div className="pl-4 text-gray-500">{"# No projects provided"}</div>
                      )}
                      <div>
                        <span className="text-[#abb2bf]">]</span>
                      </div>
                    </div>
                  )}

                  {/* education.md code syntax */}
                  {activeFile === "education.md" && (
                    <div className="space-y-0.5 text-slate-300">
                      <div>
                        <span className="text-[#61afef] font-bold"># Academic Foundations</span>
                      </div>
                      <div className="h-4"></div>
                      {profile.education?.map((edu, i) => (
                        <div key={i} className="space-y-0.5">
                          <div>
                            <span className="text-[#e5c07b] font-semibold">## {edu.degree}</span>
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">- **Institution**: {edu.institution}</span>
                          </div>
                          <div>
                            <span className="text-[#abb2bf]">- **Timeline**: {edu.startDate} - {edu.endDate}</span>
                          </div>
                          {edu.fieldOfStudy && (
                            <div>
                              <span className="text-[#abb2bf]">- **Major**: {edu.fieldOfStudy}</span>
                            </div>
                          )}
                          {edu.gpa && (
                            <div>
                              <span className="text-[#abb2bf]">- **GPA Metric**: {edu.gpa}</span>
                            </div>
                          )}
                          <div className="h-4"></div>
                        </div>
                      ))}
                      {(!profile.education || profile.education.length === 0) && (
                        <div className="text-gray-500">*No educational milestones catalogued*</div>
                      )}
                    </div>
                  )}

                  {/* contact.html code syntax */}
                  {activeFile === "contact.html" && (
                    <div className="space-y-0.5">
                      <div>
                        <span className="text-gray-500">{"<!-- HTML form for sending message -->"}</span>
                      </div>
                      <div>
                        <span className="text-[#e06c75]">&lt;form</span> <span className="text-[#d19a66]">action=</span><span className="text-[#98c379]">"POST"</span> <span className="text-[#d19a66]">onSubmit=</span><span className="text-[#98c379]">"send"</span><span className="text-[#e06c75]">&gt;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#e06c75]">&lt;input</span> <span className="text-[#d19a66]">type=</span><span className="text-[#98c379]">"text"</span> <span className="text-[#d19a66]">name=</span><span className="text-[#98c379]">"senderName"</span> <span className="text-[#d19a66]">placeholder=</span><span className="text-[#98c379]">"Name"</span> <span className="text-[#d19a66]">required</span> <span className="text-[#e06c75]">/&gt;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#e06c75]">&lt;input</span> <span className="text-[#d19a66]">type=</span><span className="text-[#98c379]">"email"</span> <span className="text-[#d19a66]">name=</span><span className="text-[#98c379]">"senderEmail"</span> <span className="text-[#d19a66]">placeholder=</span><span className="text-[#98c379]">"Email"</span> <span className="text-[#d19a66]">required</span> <span className="text-[#e06c75]">/&gt;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#e06c75]">&lt;textarea</span> <span className="text-[#d19a66]">name=</span><span className="text-[#98c379]">"messageBody"</span> <span className="text-[#d19a66]">placeholder=</span><span className="text-[#98c379]">"Enter message details..."</span> <span className="text-[#d19a66]">required</span><span className="text-[#e06c75]">&gt;&lt;/textarea&gt;</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-[#e06c75]">&lt;button</span> <span className="text-[#d19a66]">type=</span><span className="text-[#98c379]">"submit"</span><span className="text-[#e06c75]">&gt;</span><span className="text-white">Transmit Message</span><span className="text-[#e06c75]">&lt;/button&gt;</span>
                      </div>
                      <div>
                        <span className="text-[#e06c75]">&lt;/form&gt;</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Editor Mode: Preview View (Interactive UI Panel) */}
            {viewMode === "preview" && (
              <div className="flex-1 overflow-y-auto bg-[#1e2227] p-4 sm:p-8 select-text font-sans scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-12 pb-16">
                  
                  {/* PREVIEW: bio.json */}
                  {activeFile === "bio.json" && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="flex flex-col md:flex-row items-center gap-8 bg-[#21252b] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="relative shrink-0">
                          {profile.pictureUrl ? (
                            <img
                              src={profile.pictureUrl}
                              alt={profile.fullName}
                              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-orange-500 shadow-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-orange-600 flex items-center justify-center text-white text-4xl font-bold">
                              {profile.fullName?.[0]}
                            </div>
                          )}
                          <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#21252b] p-1.5 rounded-full border-4 border-[#21252b]">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        <div className="text-center md:text-left space-y-3 flex-1 min-w-0">
                          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight truncate">
                            {profile.fullName}
                          </h1>
                          <p className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block">
                            {profile.headline || "Developer"}
                          </p>
                          <p className="text-slate-300 text-sm leading-relaxed italic">
                            "{profile.summary || "Full stack developer crafting reliable web services and premium user interfaces."}"
                          </p>
                        </div>
                      </div>

                      {/* Info Cards */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-[#21252b]/55 p-6 rounded-2xl border border-white/5 space-y-4">
                          <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Contact Credentials
                          </h3>
                          <div className="space-y-2 text-xs">
                            {profile.email && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                <span className="truncate">{profile.email}</span>
                              </div>
                            )}
                            {profile.mobileNumber && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                <span>{profile.mobileNumber}</span>
                              </div>
                            )}
                            {profile.location && (
                              <div className="flex items-center gap-2 text-slate-300">
                                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                <span className="truncate">{profile.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-[#21252b]/55 p-6 rounded-2xl border border-white/5 space-y-4">
                          <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                            <Coffee className="w-4 h-4" /> Professional Stats
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-[#1e1e24] p-3 rounded-xl border border-white/5">
                              <p className="text-2xl font-bold text-white">+{totalExperienceYears}</p>
                              <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">Exp Years</p>
                            </div>
                            <div className="bg-[#1e1e24] p-3 rounded-xl border border-white/5">
                              <p className="text-2xl font-bold text-white">+{Math.max(profile.projects?.length || 0, 5)}</p>
                              <p className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">Projects</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Social Buttons */}
                      {profile.socialMediaLinks?.length > 0 && (
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          {profile.socialMediaLinks.map((social, idx) => (
                            <a
                              key={idx}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#21252b] border border-white/10 hover:border-orange-500/50 rounded-xl flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-all shadow-md"
                            >
                              {getSocialIcon(social.platform)}
                              <span className="capitalize font-semibold">{social.platform.toLowerCase()}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PREVIEW: skills.ts */}
                  {activeFile === "skills.ts" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-2 border-b border-[#2c313c] pb-3">
                        <Terminal className="w-5 h-5 text-sky-400" />
                        <h2 className="font-bold text-lg text-white">Core Competencies & Stack</h2>
                      </div>
                      
                      <div className="bg-[#21252b] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="grid sm:grid-cols-2 gap-6">
                          {skillList.map((skill, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-between text-xs font-bold font-mono">
                                <span className="text-slate-300">{skill.name}</span>
                                <span className="text-sky-400">{skill.proficiency}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#1e1e24] rounded-full overflow-hidden border border-white/5">
                                <div
                                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(97,175,239,0.3)]"
                                  style={{ width: `${skill.proficiency}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                          {skillList.length === 0 && (
                            <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PREVIEW: experience.js */}
                  {activeFile === "experience.js" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-2 border-b border-[#2c313c] pb-3">
                        <Terminal className="w-5 h-5 text-amber-400" />
                        <h2 className="font-bold text-lg text-white">Employment Timeline</h2>
                      </div>

                      <div className="space-y-6 relative pl-5 border-l-2 border-[#2c313c] ml-3">
                        {profile.experience?.map((exp, idx) => (
                          <div key={idx} className="relative group pl-2">
                            {/* Bullet Dot */}
                            <div className="absolute -left-[30px] top-1.5 w-4 h-4 bg-[#1e2227] border-2 border-amber-500 rounded-full group-hover:bg-amber-400 transition-all duration-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]"></div>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                                  {exp.position}
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold">{exp.company}</p>
                              </div>
                              <span className="text-[10px] font-bold px-3 py-1 bg-[#21252b] border border-white/5 rounded-full text-amber-400 whitespace-nowrap self-start">
                                {exp.startDate} &mdash; {exp.endDate || "Present"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl whitespace-pre-line bg-[#21252b]/30 p-4 rounded-xl border border-white/5">
                              {exp.description}
                            </p>
                          </div>
                        ))}
                        {(!profile.experience || profile.experience.length === 0) && (
                          <p className="text-xs text-slate-400 italic">No professional experiences listed yet.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PREVIEW: projects.py */}
                  {activeFile === "projects.py" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-2 border-b border-[#2c313c] pb-3">
                        <Terminal className="w-5 h-5 text-blue-500" />
                        <h2 className="font-bold text-lg text-white">Prototypes & Production Apps</h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {profile.projects?.map((proj, idx) => (
                          <div key={idx} className="bg-[#21252b] border border-white/5 hover:border-blue-500/30 rounded-2xl p-5 hover:bg-[#282c34]/50 transition-all flex flex-col justify-between group shadow-xl">
                            <div className="space-y-3">
                              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center text-lg group-hover:bg-blue-500 group-hover:text-white transition-all">
                                📂
                              </div>
                              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                                {proj.title}
                              </h3>
                              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                                {proj.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#2c313c] space-y-4">
                              <div className="flex flex-wrap gap-1">
                                {(proj.technologies || proj.techStack?.split(",") || []).map((t, i) => (
                                  <span key={i} className="text-[9px] font-bold px-2 py-0.5 bg-[#1e1e24] border border-white/5 rounded text-slate-400">
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>

                              {(proj.link || proj.projectUrl) && (
                                <a
                                  href={proj.link || proj.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors"
                                >
                                  Open Prototype <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!profile.projects || profile.projects.length === 0) && (
                          <p className="text-xs text-slate-400 italic md:col-span-2">No projects listed yet.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PREVIEW: education.md */}
                  {activeFile === "education.md" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-2 border-b border-[#2c313c] pb-3">
                        <Terminal className="w-5 h-5 text-purple-400" />
                        <h2 className="font-bold text-lg text-white">Education & Certifications</h2>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {profile.education?.map((edu, idx) => (
                          <div key={idx} className="bg-[#21252b] border border-white/5 rounded-2xl p-6 space-y-3 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                              <h3 className="font-bold text-sm text-white leading-snug">{edu.degree}</h3>
                              <span className="text-[9px] font-bold text-purple-400 px-2 py-0.5 bg-purple-500/10 rounded-full border border-purple-500/20 whitespace-nowrap self-start">
                                {edu.startDate} - {edu.endDate}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 font-semibold">{edu.institution}</p>
                            {edu.fieldOfStudy && (
                              <p className="text-[11px] text-slate-500">Major: {edu.fieldOfStudy}</p>
                            )}
                            {edu.gpa && (
                              <div className="text-[11px] font-bold text-purple-400/90">GPA Metric: {edu.gpa}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      {profile.certifications?.length > 0 && (
                        <div className="space-y-4 pt-4">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Award className="w-4 h-4 text-purple-400" /> Credentials Earned
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {profile.certifications.map((cert, idx) => (
                              <div key={idx} className="p-4 bg-[#21252b] border border-white/5 rounded-2xl flex items-center gap-3">
                                <Award className="w-5 h-5 text-purple-400 shrink-0" />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-xs text-white truncate">{cert.name}</h4>
                                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{cert.issuingOrganization}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PREVIEW: contact.html */}
                  {activeFile === "contact.html" && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center gap-2 border-b border-[#2c313c] pb-3">
                        <Terminal className="w-5 h-5 text-orange-400" />
                        <h2 className="font-bold text-lg text-white">Contact Terminal</h2>
                      </div>

                      <div className="bg-[#21252b] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
                        <form onSubmit={handleContactSubmit} className="space-y-5 font-sans">
                          <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Your Name</label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleContactChange}
                                placeholder="John Doe"
                                required
                                className="w-full bg-[#1e1e24] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Your Email</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleContactChange}
                                placeholder="john@example.com"
                                required
                                className="w-full bg-[#1e1e24] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors font-mono"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Message details</label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleContactChange}
                              rows="5"
                              placeholder="Describe your inquiry..."
                              required
                              className="w-full bg-[#1e1e24] border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors resize-none font-mono"
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-800 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/10 cursor-pointer font-mono"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message <Send className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

          {/* Simulated Debug Console / Terminal Panel at the bottom (Toggleable) */}
          {showConsole && (
            <div className="h-40 bg-[#15181d] border-t border-[#181a1f] flex flex-col z-20">
              <div className="bg-[#1e2227] px-4 py-2 flex items-center justify-between text-xs border-b border-[#181a1f] text-[#9da5b4] select-none font-sans shrink-0">
                <div className="flex items-center gap-4">
                  <span className="font-bold border-b border-t-2 border-b-transparent border-t-transparent hover:text-white cursor-pointer py-0.5">Problems</span>
                  <span className="font-bold border-b-2 border-b-orange-500 text-white py-0.5 flex items-center gap-1.5">
                    Terminal <span className="bg-[#2c313c] text-white text-[9px] px-1 rounded-sm">1</span>
                  </span>
                  <span className="font-bold border-b border-t-2 border-b-transparent border-t-transparent hover:text-white cursor-pointer py-0.5">Debug Console</span>
                </div>
                <button
                  onClick={() => setShowConsole(false)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Console logs output */}
              <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto leading-relaxed select-text text-slate-300 space-y-1">
                <p className="text-slate-500">[{new Date().toLocaleTimeString()}] Initializing portfolio workspace environment...</p>
                <p className="text-emerald-400">✔ Ready to display public profile for developer "{username}"</p>
                <p className="text-slate-400">Loaded templates: 5, active: 5 (VS Code IDE Theme)</p>
                <p className="text-blue-400">Active Session: active tab: {activeFile}, mode: {viewMode}</p>
                <p className="text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                  <span>Warning: contact/contact.html has uncommitted changes. Use "Git Commit" sidebar view.</span>
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* VS Code Status Bar at bottom */}
      <div className="bg-[#21252b] border-t border-[#181a1f] px-3 py-1.5 flex items-center justify-between text-[11px] text-[#9da5b4] font-sans select-none z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 px-1 bg-[#61afef] text-[#21252b] font-bold rounded-sm text-[10px] uppercase">
            <Coffee className="w-3 h-3" />
            <span>ByteBodh</span>
          </div>
          <button
            onClick={() => toast.success("Connected to git server - Repository synced!")}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>main*</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            title="Toggle Console Panel"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Terminal</span>
          </button>
          <div className="hidden sm:block">
            <span>Ln 1, Col 1</span>
          </div>
          <div className="hidden md:block">
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-1 text-[#61afef]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#61afef]"></div>
            <span>{getFileInfo(activeFile).lang}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFive;
