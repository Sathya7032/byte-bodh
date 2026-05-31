import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateOne from "./TemplateOne";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import Portfolio from "../portfolio/Portfolio";
import { getPublicProfileByUsername } from "../api/profileService";

function getUsernameFromDomain() {
  const hostname = window.location.hostname;

  // For local development (e.g., username.localhost)
  if (hostname.endsWith(".localhost")) {
    const subdomain = hostname.replace(".localhost", "");
    return subdomain && subdomain !== "www" ? subdomain : null;
  }
  // For production (e.g., username.bytebodh.in)
  if (hostname.endsWith(".bytebodh.in")) {
    const subdomain = hostname.replace(".bytebodh.in", "");
    return subdomain && subdomain !== "www" ? subdomain : null;
  }

  return null;
}

// Mock profiles for template previews
const templateOneMock = {
  fullName: "Aarav Mehta",
  headline: "Computer Science Undergraduate @ IIT Bombay",
  email: "aarav.mehta@iitb.ac.in",
  mobileNumber: "+91 98765 43210",
  location: "Mumbai, Maharashtra, India",
  summary: "Passionate about building efficient deep learning models and NLP pipelines. Seeking master's research fellowships and software engineering roles.",
  pictureUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
  skills: [
    "Python",
    "PyTorch",
    "FastAPI",
    "Go",
    "Docker",
    "Kubernetes"
  ],
  experience: [
    {
      position: "Software Engineering Intern",
      company: "Microsoft Research",
      startDate: "May 2025",
      endDate: "July 2025",
      location: "Bangalore, India",
      description: "Contributed to low-resource translation models. Optimized training latency by 25% using quantization schemes."
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Indian Institute of Technology, Bombay",
      fieldOfStudy: "Computer Science",
      startDate: "2022",
      endDate: "2026",
      gpa: "9.8/10"
    }
  ],
  projects: [
    {
      title: "VisualSearch AI Engine",
      description: "Real-time semantic image recognition and search engine indexing 5 million frames using CLIP vector embeddings.",
      techStack: "Python, PyTorch, Milvus, FastAPI",
      technologies: ["Python", "PyTorch", "Milvus", "FastAPI"],
      link: "https://github.com/bytebodh/visual-search-ai",
      projectUrl: "https://github.com/bytebodh/visual-search-ai"
    }
  ],
  certifications: [
    {
      name: "Winner, Smart India Hackathon",
      issuingOrganization: "Ministry of Education, India",
      issueDate: "2024"
    }
  ],
  socialMediaLinks: [
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "LINKEDIN", url: "https://linkedin.com/company/bytebodh", profileUrl: "https://linkedin.com/company/bytebodh" }
  ]
};

const templateTwoMock = {
  fullName: "Shreya Dev",
  headline: "Systems & Security Software Engineer",
  email: "shreya@bytebodh.in",
  mobileNumber: "+91 99999 88888",
  location: "Remote, India",
  summary: "Hello! I build secure networking products, customized compilation modules, and performance tools. I operate primarily on Arch Linux.",
  pictureUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
  skills: [
    "Rust",
    "Go",
    "C++",
    "Assembly",
    "Linux Kernel",
    "eBPF"
  ],
  experience: [
    {
      position: "Kernel Engineer",
      company: "ArchSystems",
      startDate: "2024-01",
      endDate: "Present",
      location: "Remote",
      description: "Developing eBPF drivers for firewall packet routing, compiler optimizations, and sandbox environments."
    }
  ],
  education: [
    {
      degree: "B.Sc. in Computer Science",
      institution: "Delhi University",
      fieldOfStudy: "Systems Programming",
      startDate: "2020",
      endDate: "2023",
      gpa: "9.2/10"
    }
  ],
  projects: [
    {
      title: "kernel-fs-encrypt",
      description: "A lightweight Linux kernel module for on-the-fly partition encryption with minimal CPU overhead.",
      techStack: "C, Linux Dev, Crypto",
      technologies: ["C", "Linux Dev", "Crypto"],
      link: "https://github.com/bytebodh/kernel-fs-encrypt",
      projectUrl: "https://github.com/bytebodh/kernel-fs-encrypt"
    }
  ],
  certifications: [
    {
      name: "Offensive Security Certified Professional (OSCP)",
      issuingOrganization: "OffSec",
      issueDate: "2023"
    }
  ],
  socialMediaLinks: [
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" }
  ]
};

const templateThreeMock = {
  fullName: "Elena Rostova",
  headline: "Brand & Product Identity Designer",
  email: "elena.design@bytebodh.in",
  mobileNumber: "+91 99999 11111",
  location: "Goa, India",
  summary: "Shaping clean visual experiences, layout blueprints, and premium brand identities for digital products.",
  pictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  skills: [
    "Figma",
    "Adobe CC",
    "Blender 3D",
    "Webflow",
    "Design Systems"
  ],
  experience: [
    {
      position: "Lead Designer",
      company: "Aura Creative Studio",
      startDate: "2023-08",
      endDate: "Present",
      location: "Goa, India",
      description: "Directing product design sprints, creating geometric asset collections, and compiling brand styleguides for high-profile clients."
    }
  ],
  education: [
    {
      degree: "B.Des in Communication Design",
      institution: "National Institute of Design",
      fieldOfStudy: "Visual Identity",
      startDate: "2019",
      endDate: "2023",
      gpa: "A Grade"
    }
  ],
  projects: [
    {
      title: "Nova Fintech Wallet",
      description: "Clean mobile banking mockup and dark-mode payment screens featuring frosted glass cards.",
      techStack: "Figma, UI/UX",
      technologies: ["Figma", "UI/UX"],
      link: "https://figma.com",
      projectUrl: "https://figma.com"
    }
  ],
  certifications: [
    {
      name: "Interaction Design Specialist",
      issuingOrganization: "IxDF",
      issueDate: "2024"
    }
  ],
  socialMediaLinks: [
    { platform: "PORTFOLIO", url: "https://dribbble.com", profileUrl: "https://dribbble.com" }
  ]
};

const templateFourMock = {
  fullName: "Siddharth Sharma",
  headline: "Director of Engineering @ ScaleCorp",
  email: "siddharth.s@scalecorp.com",
  mobileNumber: "+91 90000 12345",
  location: "Bangalore, Karnataka, India",
  summary: "Leading large-scale cross-functional engineering organizations to design, deploy, and scale high-throughput cloud infrastructure handling millions of active clients.",
  pictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  skills: [
    { name: "Leadership", proficiency: 98 },
    { name: "Cloud Architecture", proficiency: 95 },
    { name: "System Scalability", proficiency: 92 },
    { name: "Cost Optimization", proficiency: 88 },
    { name: "Kubernetes & Docker", proficiency: 90 }
  ],
  experience: [
    {
      position: "Director of Engineering",
      company: "ScaleCorp Inc.",
      startDate: "2022-04",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Directing 4 development groups, architecting next-generation SaaS database layers, and optimizing cloud container instances saving $10M+ annually."
    }
  ],
  education: [
    {
      degree: "M.S. in Computer Science",
      institution: "Stanford University",
      fieldOfStudy: "Distributed Systems",
      startDate: "2014",
      endDate: "2016",
      gpa: "4.0/4.0"
    }
  ],
  projects: [
    {
      title: "SaaS Infrastructure Migration",
      description: "Zero-downtime migration of multi-tenant application databases to distributed clusters under peak SLA restrictions.",
      techStack: "Kubernetes, AWS, IaC",
      technologies: ["Kubernetes", "AWS", "IaC"],
      link: "https://scalecorp.com",
      projectUrl: "https://scalecorp.com"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect Professional",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2021"
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" }
  ]
};

function PublicPortfolioPage({ isPreview }) {
  const { username: urlUsername, templateId: previewTemplateId } = useParams();
  const [profile, setProfile] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPreview) {
      const tId = Number(previewTemplateId) || 1;
      setTemplateId(tId);
      
      let mockProfile = templateOneMock;
      if (tId === 2) mockProfile = templateTwoMock;
      if (tId === 3) mockProfile = templateThreeMock;
      if (tId === 4) mockProfile = templateFourMock;
      
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    const username = urlUsername || getUsernameFromDomain();

    if (!username) {
      setError("Invalid domain format");
      setLoading(false);
      return;
    }

    getPublicProfileByUsername(username)
      .then((res) => {
        console.log("Fetched public profile data in PublicPortfolioPage:", res.data);
        
        const profileData = res.data?.data;
        if (!profileData) {
          throw new Error("Profile data not found");
        }

        // Find active template ID from userTemplates in the response
        const activeTemplate = profileData.user?.userTemplates?.find(ut => ut.active);
        const templateId = activeTemplate?.template?.id || 1; // Fallback to template 1

        setProfile(profileData);
        setTemplateId(templateId);
      })
      .catch((err) => {
        console.error("Error fetching public profile:", err);
        setError(err.message || "Failed to load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlUsername, isPreview, previewTemplateId]);

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Loading portfolio...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        {error}
      </h2>
    );
  }

  if (!profile) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "100px" }}>
        Profile not found
      </h2>
    );
  }

  const PreviewHeader = () => (
    <div className="bg-slate-950 border-b border-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md text-xs font-bold font-sans">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>BYTEBODH TEMPLATE PREVIEW: {profile.fullName} ({templateId === 1 ? "Academic Minimalist" : templateId === 2 ? "Hacker Terminal" : templateId === 3 ? "Creative Gallery" : "Executive Brand"})</span>
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <span className="hidden sm:inline">💡 Previewing complete sample layout</span>
        <button 
          onClick={() => window.close()} 
          className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg transition-colors border border-slate-800"
        >
          Exit Preview
        </button>
      </div>
    </div>
  );

  const activeTemplateComponent = (() => {
    switch (templateId) {
      case 1:
        return <TemplateOne profile={profile} />;

      case 2:
        return <Portfolio profile={profile} />;

      case 3:
        return <TemplateThree profile={profile} />;

      case 4:
        return <TemplateFour profile={profile} />;

      default:
        return <TemplateOne profile={profile} />;
    }
  })();

  if (isPreview) {
    return (
      <div className="flex flex-col min-h-screen">
        <PreviewHeader />
        <div className="flex-1">
          {activeTemplateComponent}
        </div>
      </div>
    );
  }

  return activeTemplateComponent;
}

export default PublicPortfolioPage;