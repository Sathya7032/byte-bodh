import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TemplateOne from "./TemplateOne";
import TemplateTwo from "./TemplateTwo";
import TemplateThree from "./TemplateThree";
import TemplateFour from "./TemplateFour";
import TemplateFive from "./TemplateFive";
import TemplateSix from "./TemplateSix";
import TemplateSeven from "./TemplateSeven";
import TemplateEight from "./TemplateEight";
import TemplateNine from "./TemplateNine";
import TemplateTen from "./TemplateTen";
import TemplateEleven from "./TemplateEleven";
import TemplateTwelve from "./TemplateTwelve";
import TemplateThirteen from "./TemplateThirteen";
import TemplateFourteen from "./TemplateFourteen";
import TemplateFifteen from "./TemplateFifteen";
import TemplateSixteen from "./TemplateSixteen";
import TemplateSeventeen from "./TemplateSeventeen";
import TemplateEighteen from "./TemplateEighteen";
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
  headline: "Senior Cloud & Systems Engineer",
  email: "shreya.dev@bytebodh.in",
  mobileNumber: "+91 99999 88888",
  location: "Bangalore, India",
  summary: "High-performing Software Engineer with expertise in building scalable cloud microservices, high-performance networking products, and responsive web platforms with modern UI architectures.",
  pictureUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/shreya-resume.pdf",
  viewsCount: 1520,
  skills: [
    { name: "React & Next.js", proficiency: 95, category: "Frontend" },
    { name: "Node.js & TypeScript", proficiency: 92, category: "Backend" },
    { name: "Go & Rust", proficiency: 88, category: "Systems" },
    { name: "Docker & Kubernetes", proficiency: 90, category: "DevOps" },
    { name: "AWS & Terraform", proficiency: 86, category: "Cloud" },
    { name: "PostgreSQL & Redis", proficiency: 88, category: "Database" }
  ],
  experience: [
    {
      position: "Senior Systems Engineer",
      company: "ArchSystems Cloud Labs",
      startDate: "2023-01",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Architecting microservice networking components, eBPF telemetry tools, and zero-trust authentication pipelines handling 1M+ active connections."
    },
    {
      position: "Full-Stack Developer",
      company: "NovaScale Tech",
      startDate: "2021-04",
      endDate: "2022-12",
      location: "Remote, India",
      description: "Designed responsive React web dashboards and high-throughput RESTful APIs serving 500k monthly active users."
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science",
      institution: "Delhi University",
      fieldOfStudy: "Systems Programming",
      startDate: "2017",
      endDate: "2021",
      gpa: "9.4/10",
      description: "Graduated top of class. Specialized in Distributed Systems and Operating System Architecture."
    }
  ],
  projects: [
    {
      title: "Ivory Elite — Recruiter Portfolio",
      description: "A clean white theme & emerald accent portfolio template featuring 24px rounded cards, glassmorphism, timelines, and recruiter contact form.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/ivory-elite"
    },
    {
      title: "eBPF Packet Router & Firewall",
      description: "High-performance Linux kernel network driver optimizing packet filter throughput with zero CPU overhead.",
      techStack: "C, Linux Dev, eBPF, Go",
      technologies: ["C", "Linux Dev", "eBPF", "Go"],
      imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/ebpf-router"
    }
  ],
  certifications: [
    {
      name: "Offensive Security Certified Professional (OSCP)",
      issuingOrganization: "OffSec",
      issueDate: "2023",
      description: "Industry-standard practical penetration testing & security credential."
    },
    {
      name: "AWS Certified Solutions Architect",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2024",
      description: "Cloud infrastructure design & deployment specialization."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateThreeMock = {
  fullName: "Elena Rostova",
  headline: "Executive Product & Design Director",
  email: "elena.design@bytebodh.in",
  mobileNumber: "+91 99999 11111",
  location: "Bangalore, India",
  summary: "Executive Design Leader with 8+ years of experience shaping product identity, directing design systems for fintech and enterprise SaaS products, and building high-impact design engineering teams.",
  pictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/elena-resume.pdf",
  viewsCount: 1650,
  skills: [
    { name: "Figma & Design Systems", proficiency: 98, category: "UI/UX" },
    { name: "React & Next.js", proficiency: 92, category: "Frontend" },
    { name: "TypeScript & TailwindCSS", proficiency: 94, category: "Frontend" },
    { name: "Blender 3D & Spline", proficiency: 86, category: "3D Art" },
    { name: "User Research & Product Strategy", proficiency: 95, category: "Strategy" }
  ],
  experience: [
    {
      position: "Executive Product Design Director",
      company: "Aura Creative & Product Studio",
      startDate: "2023-01",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Directing product design sprints, component library design systems, and visual identity for enterprise web and mobile applications."
    },
    {
      position: "Lead UI/UX Engineer",
      company: "Nova Fintech Solutions",
      startDate: "2020-03",
      endDate: "2022-12",
      location: "Remote, India",
      description: "Architected multi-brand design systems adopted across 4 sub-products serving 2M+ active users."
    }
  ],
  education: [
    {
      degree: "B.Des in Communication & Visual Design",
      institution: "National Institute of Design",
      fieldOfStudy: "Visual Identity",
      startDate: "2016",
      endDate: "2020",
      gpa: "9.8/10",
      description: "Graduated with highest honors. Specialized in Digital Product Interfaces and Typography."
    }
  ],
  projects: [
    {
      title: "Royal Sapphire — Executive Portfolio System",
      description: "Dual-column recruiter-friendly portfolio template with sticky sidebar, horizontal project cards, and interview scheduler.",
      techStack: "React, TailwindCSS, Framer Motion, Figma",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Figma"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/royal-sapphire"
    },
    {
      title: "Nova Fintech Neomorphic Wallet",
      description: "Clean mobile banking interface mockup and dark-mode payment screens featuring frosted glass cards and real-time transaction graphs.",
      techStack: "Figma, React, TailwindCSS",
      technologies: ["Figma", "React", "TailwindCSS"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://figma.com"
    }
  ],
  certifications: [
    {
      name: "Interaction Design Specialist (IxDF)",
      issuingOrganization: "Interaction Design Foundation",
      issueDate: "2024",
      description: "Advanced human-computer interaction and usability engineering certification."
    },
    {
      name: "Certified Enterprise Design System Architect",
      issuingOrganization: "Nielsen Norman Group",
      issueDate: "2023",
      description: "Specialized design system scaling and governance."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
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

const templateFiveMock = {
  fullName: "Sathya Prakash",
  headline: "Lead Full-Stack Developer & DevOps Specialist",
  email: "sathya@bytebodh.in",
  mobileNumber: "+91 94444 55555",
  location: "Bangalore, India",
  summary: "Architecting microservices, serverless APIs, and reactive frontend experiences. Fan of clean code, automated pipelines, and VS Code dark themes.",
  pictureUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
  skills: [
    { name: "React & Next.js", proficiency: 95 },
    { name: "Node.js & TypeScript", proficiency: 92 },
    { name: "Python & FastAPIs", proficiency: 88 },
    { name: "Docker & Kubernetes", proficiency: 85 },
    { name: "AWS & Terraform", proficiency: 80 }
  ],
  experience: [
    {
      position: "Lead Full-Stack Developer",
      company: "ByteBodh Tech Labs",
      startDate: "2023-01",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Directing UI architecture redesigns, optimizing webpack/vite compile times, and mentoring 6 backend and frontend developers on TypeScript modules."
    },
    {
      position: "Senior Systems Engineer",
      company: "TechScale Solutions",
      startDate: "2021-02",
      endDate: "2022-12",
      location: "Chennai, India",
      description: "Implemented high-throughput messaging brokers (RabbitMQ/Kafka) and optimized MySQL database queries to reduce API latency spikes by 40%."
    }
  ],
  education: [
    {
      degree: "B.E. in Computer Science & Engineering",
      institution: "Anna University",
      fieldOfStudy: "Computer Science",
      startDate: "2017",
      endDate: "2021",
      gpa: "8.9/10"
    }
  ],
  projects: [
    {
      title: "ByteBodh folio CMS Engine",
      description: "A headless CMS system parsing static JSON configurations into dynamic SEO-optimized developer portfolios.",
      techStack: "React, Express, MongoDB, TailwindCSS",
      technologies: ["React", "Express", "MongoDB", "TailwindCSS"],
      link: "https://github.com/bytebodh/cms-engine",
      projectUrl: "https://github.com/bytebodh/cms-engine"
    },
    {
      title: "Auto-Deploy DevOps Webhook",
      description: "Simulated CI/CD container orchestrator syncing github webhook events with local Kubernetes clusters.",
      techStack: "Go, Kubernetes, GitHub API",
      technologies: ["Go", "Kubernetes", "GitHub API"],
      link: "https://github.com/bytebodh/devops-webhook",
      projectUrl: "https://github.com/bytebodh/devops-webhook"
    }
  ],
  certifications: [
    {
      name: "HashiCorp Certified Terraform Associate",
      issuingOrganization: "HashiCorp",
      issueDate: "2024"
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuingOrganization: "The Linux Foundation",
      issueDate: "2023"
    }
  ],
  socialMediaLinks: [
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" }
  ]
};

const templateSixMock = {
  fullName: "Priya Nair",
  headline: "Senior Creative Digital Product Designer & Developer",
  email: "priya.nair@bytebodh.in",
  mobileNumber: "+91 91234 56789",
  location: "Hyderabad, India",
  summary: "Crafting award-winning web applications, interactive visual identities, and seamless digital product experiences with pixel precision inspired by Framer & Stripe UI aesthetics.",
  pictureUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/priya-resume.pdf",
  viewsCount: 1720,
  skills: [
    { name: "Framer & Figma", proficiency: 98, category: "Design" },
    { name: "React & Next.js", proficiency: 94, category: "Frontend" },
    { name: "TypeScript & TailwindCSS", proficiency: 92, category: "Frontend" },
    { name: "Three.js & WebGL", proficiency: 88, category: "3D Animation" },
    { name: "Python & FastAPI", proficiency: 85, category: "Backend" }
  ],
  experience: [
    {
      position: "Senior Creative Product Designer",
      company: "Coral Studio Labs",
      startDate: "2023-06",
      endDate: "Present",
      location: "Hyderabad, India",
      description: "Directing product design sprints, micro-animations, component libraries, and interactive customer portals for high-growth SaaS startups."
    },
    {
      position: "UI/UX Front-End Engineer",
      company: "Stripe Design Partner Agency",
      startDate: "2021-03",
      endDate: "2023-05",
      location: "Remote, India",
      description: "Designed responsive web interfaces and design systems, reducing user onboarding drop-off by 24%."
    }
  ],
  education: [
    {
      degree: "M.Tech in Human-Computer Interaction & AI",
      institution: "IIT Hyderabad",
      fieldOfStudy: "Interaction Design",
      startDate: "2019",
      endDate: "2021",
      gpa: "9.6/10",
      description: "Specialized in micro-interactions, responsive design systems, and generative AI user interfaces."
    }
  ],
  projects: [
    {
      title: "Coral Studio — Creative Portfolio Engine",
      description: "Modern Framer and Stripe inspired portfolio template featuring abstract shape floating hero, masonry grid layout with hover zoom, and animated skill badges.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/coral-studio"
    },
    {
      title: "EcoSentinel — Interactive Climate Risk Portal",
      description: "Real-time interactive climate risk visualization portal using Framer Motion timelines, satellite GIS feeds, and responsive dark mode charts.",
      techStack: "React, WebGL, GIS, Python",
      technologies: ["React", "WebGL", "GIS", "Python"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/ecosentinel"
    }
  ],
  certifications: [
    {
      name: "Google Professional UX & Interaction Designer",
      issuingOrganization: "Google Design",
      issueDate: "2023",
      description: "Advanced interaction design and usability engineering credential."
    },
    {
      name: "Framer Master & Design System Architect",
      issuingOrganization: "Framer Academy",
      issueDate: "2024",
      description: "Certified component architecture and interactive animation specialist."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateEighteenMock = {
  fullName: "Aarav Sharma",
  headline: "Senior Full-Stack & Cloud Systems Architect",
  email: "aarav.sharma@bytebodh.in",
  mobileNumber: "+91 98765 43210",
  location: "Bangalore, India",
  summary: "Senior Software Engineer with 5+ years of experience architecting high-throughput distributed microservices, building responsive cloud applications, and leading technical teams in fintech & AI domain.",
  pictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/resume.pdf",
  viewsCount: 1840,
  skills: [
    { name: "React & Next.js", proficiency: 96, category: "Frontend" },
    { name: "Node.js & TypeScript", proficiency: 94, category: "Backend" },
    { name: "Python & PyTorch", proficiency: 90, category: "AI / ML" },
    { name: "Docker & Kubernetes", proficiency: 92, category: "DevOps" },
    { name: "AWS & Cloud Native", proficiency: 88, category: "Cloud" },
    { name: "PostgreSQL & Redis", proficiency: 90, category: "Database" }
  ],
  experience: [
    {
      position: "Senior Software Engineer & Tech Lead",
      company: "Aura Fintech Systems",
      startDate: "2023-03",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Leading a team of 8 engineers architecting real-time payment gateway pipelines processing 2M+ transactions daily with 99.99% uptime.",
      highlights: [
        "Reduced payment settlement latency from 450ms to 85ms using Redis caching and Go microservices.",
        "Architected multi-region Kubernetes failover strategy on AWS reducing downtime by 99%."
      ]
    },
    {
      position: "Full-Stack Software Engineer",
      company: "ScaleLabs Tech",
      startDate: "2021-06",
      endDate: "2023-02",
      location: "Remote, India",
      description: "Built reactive web applications and GraphQL APIs for enterprise clients using React, TypeScript, and Node.js.",
      highlights: [
        "Pioneered design system adoption across 5 product teams, reducing frontend development sprint cycles by 30%."
      ]
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Indian Institute of Technology, Kharagpur",
      fieldOfStudy: "Computer Science",
      startDate: "2017",
      endDate: "2021",
      gpa: "9.6/10",
      description: "Graduated with Honors. Specialized in Distributed Operating Systems & Machine Learning Algorithms."
    }
  ],
  projects: [
    {
      title: "Emerald Edge — Recruiter Portfolio Platform",
      description: "Next-gen recruiter-friendly portfolio template engine with glassmorphic UI, live stats, and backend contact dispatching.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/emerald-edge"
    },
    {
      title: "Neural Vision Cloud Engine",
      description: "Real-time object detection and video stream processing service indexing multi-stream surveillance feeds.",
      techStack: "Python, PyTorch, FastAPI, Docker",
      technologies: ["Python", "PyTorch", "FastAPI", "Docker"],
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/neural-vision"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect Professional",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2024",
      description: "Advanced cloud architecture design and migration certification."
    },
    {
      name: "Certified Kubernetes Application Developer (CKAD)",
      issuingOrganization: "The Linux Foundation",
      issueDate: "2023",
      description: "Hands-on cloud-native container orchestration."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateTenMock = {
  fullName: "Aarav Mehta",
  headline: "Senior Staff Product Engineer & Systems Architect",
  email: "aarav.m@bytebodh.in",
  mobileNumber: "+91 98765 43210",
  location: "Bangalore, India",
  summary: "Designing and engineering high-impact digital applications inspired by Apple, Notion, and Linear. Focused on building elegant systems, intuitive product layouts, and performant user experiences.",
  pictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/aarav-resume.pdf",
  viewsCount: 1890,
  skills: [
    { name: "React & Next.js", proficiency: 98, category: "Frontend" },
    { name: "TypeScript & Node.js", proficiency: 95, category: "Fullstack" },
    { name: "GraphQL & REST APIs", proficiency: 92, category: "Backend" },
    { name: "TailwindCSS & Framer Motion", proficiency: 96, category: "Design System" },
    { name: "PostgreSQL & Redis", proficiency: 90, category: "Databases" },
    { name: "Docker & Kubernetes", proficiency: 86, category: "DevOps" }
  ],
  experience: [
    {
      position: "Senior Staff Product Engineer",
      company: "Linear Design Systems",
      startDate: "2022-08",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Leading frontend infrastructure, keyboard-driven UI workflows, micro-interaction design system components, and real-time state synchronization engines."
    },
    {
      position: "Lead UI Architect",
      company: "Notion Enterprise Labs",
      startDate: "2020-02",
      endDate: "2022-07",
      location: "Remote, India",
      description: "Architected modular block-editor interfaces, drag-and-drop workspace canvases, and collaborative document sharing primitives."
    }
  ],
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "IIIT Bangalore",
      fieldOfStudy: "Software Systems",
      startDate: "2016",
      endDate: "2020",
      gpa: "9.7/10",
      description: "Specialized in Distributed Systems, User Interface Architecture, and Operating Systems."
    }
  ],
  projects: [
    {
      title: "Bento Pro — Modular Grid Portfolio Engine",
      description: "Apple, Notion & Linear inspired Bento Grid portfolio platform featuring 28px rounded cards, colorful technology chips, and dark mode support.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/bento-pro"
    },
    {
      title: "PulseSync — High-Throughput Event Canvas",
      description: "Real-time collaborative diagramming and workflow canvas supporting 10,000+ concurrent websocket operations per room.",
      techStack: "TypeScript, Canvas API, WebSockets, Redis",
      technologies: ["TypeScript", "Canvas API", "WebSockets", "Redis"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/pulsesync"
    }
  ],
  certifications: [
    {
      name: "AWS Certified DevOps Engineer Professional",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2024",
      description: "Advanced cloud delivery, infrastructure automation, and governance."
    },
    {
      name: "Certified System Architecture Fellow",
      issuingOrganization: "Software Architecture Guild",
      issueDate: "2023",
      description: "Specialized enterprise application design certification."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateElevenMock = {
  fullName: "Kavya Sharma",
  headline: "Lead Full-Stack Storytelling Engineer & UX Strategist",
  email: "kavya.s@bytebodh.in",
  mobileNumber: "+91 97777 88888",
  location: "Bangalore, India",
  summary: "Exploring the evolution of career milestones through interactive digital storytelling, responsive architecture, and cloud-native full-stack development.",
  pictureUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/kavya-resume.pdf",
  viewsCount: 1940,
  skills: [
    { name: "React & Next.js", proficiency: 96, category: "Frontend" },
    { name: "TypeScript & TailwindCSS", proficiency: 94, category: "Frontend" },
    { name: "Node.js & Express", proficiency: 90, category: "Backend" },
    { name: "PostgreSQL & Prisma", proficiency: 88, category: "Databases" },
    { name: "Framer Motion & WebGL", proficiency: 92, category: "Animations" }
  ],
  experience: [
    {
      position: "Frontend Engineering Intern",
      company: "InnovateX Tech Labs",
      startDate: "2020-01",
      endDate: "2020-06",
      location: "Bangalore, India",
      description: "Built interactive dashboard widgets, implemented responsive UI components in React, and optimized web vitals for customer portals."
    },
    {
      position: "Lead Full-Stack Engineer",
      company: "Storyline Digital Products",
      startDate: "2021-07",
      endDate: "Present",
      location: "Bangalore, India",
      description: "Architecting interactive storytelling web applications, real-time collaboration tools, and micro-frontend design systems."
    }
  ],
  education: [
    {
      degree: "B.E. in Information Technology & Software Engineering",
      institution: "BMS College of Engineering",
      fieldOfStudy: "Software Engineering",
      startDate: "2016",
      endDate: "2020",
      gpa: "9.6/10",
      description: "Graduated with Distinction. Lead of Student Technical Guild and Web Innovation Club."
    }
  ],
  projects: [
    {
      title: "Journey — Career Storytelling Portfolio Engine",
      description: "Interactive timeline storytelling portfolio template connecting Hero, Education, Internships, Experience, Projects, Achievements, and Certifications.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/journey-portfolio"
    },
    {
      title: "StoryCanvas — Collaborative Diagramming Studio",
      description: "Real-time canvas engine allowing multi-user diagramming and flow visualizations with instant websocket state updates.",
      techStack: "React, WebSockets, Canvas API, Redis",
      technologies: ["React", "WebSockets", "Canvas API", "Redis"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/storycanvas"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer Associate",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2024",
      description: "Cloud-native web application deployment & serverless architecture."
    },
    {
      name: "Meta Certified Professional Front-End Developer",
      issuingOrganization: "Meta / Coursera",
      issueDate: "2023",
      description: "Advanced React component patterns and state management."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateTwelveMock = {
  fullName: "Lukas Weber",
  headline: "Principal Swiss Product Architect & Systems Designer",
  email: "lukas.weber@bytebodh.in",
  mobileNumber: "+41 44 123 4567",
  location: "Zurich, Switzerland",
  summary: "Functional design inspired by Dieter Rams & Apple. Eliminating unnecessary complexity to craft grid-aligned, high-throughput digital systems with mathematical precision.",
  pictureUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/lukas-resume.pdf",
  viewsCount: 2150,
  skills: [
    { name: "Design Systems & Typography", proficiency: 98, category: "Swiss Design" },
    { name: "React & Next.js Engine", proficiency: 95, category: "Frontend" },
    { name: "TypeScript & Micro-Frontends", proficiency: 94, category: "Architecture" },
    { name: "Node.js & High-Throughput APIs", proficiency: 92, category: "Backend" },
    { name: "Web Vitals & Performance Optimization", proficiency: 96, category: "Optimization" }
  ],
  experience: [
    {
      position: "Principal Swiss Product Architect",
      company: "Rams Digital Studio",
      startDate: "2022-01",
      endDate: "PRESENT",
      location: "Zurich, Switzerland",
      description: "Leading multi-brand design systems, typographic scale governance, micro-frontend performance optimization, and ultra-minimal client applications."
    },
    {
      position: "Lead UI Systems Engineer",
      company: "Helvetica Tech AG",
      startDate: "2019-04",
      endDate: "2021-12",
      location: "Geneva, Switzerland",
      description: "Architected grid-aligned enterprise dashboard components, reducing memory footprint by 40%."
    }
  ],
  education: [
    {
      degree: "M.Sc in Computer Science & Human-Centric Systems",
      institution: "ETH Zurich",
      fieldOfStudy: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      gpa: "5.9/6.0",
      description: "Graduated with distinction. Specialized in User Interface Formalisms, Typography Systems, and Distributed Computing."
    }
  ],
  projects: [
    {
      title: "Swiss One — Ultra-Minimalist Portfolio Engine",
      description: "Dieter Rams & Apple inspired Swiss International style portfolio template adhering strictly to a 3-color palette (White, Black, Red), huge luxury typography, and clean horizontal row projects.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/swiss-one"
    },
    {
      title: "Neue Grid — Typographic Layout Framework",
      description: "High-performance mathematical CSS grid layout generator built for luxury e-commerce and editorial digital publications.",
      techStack: "TypeScript, CSS Grid, Canvas, Web Vitals",
      technologies: ["TypeScript", "CSS Grid", "Canvas", "Web Vitals"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/neue-grid"
    }
  ],
  certifications: [
    {
      name: "Certified Swiss Design System Architect",
      issuingOrganization: "Zurich Design Guild",
      issueDate: "2024",
      description: "Advanced typographic scale and component grid governance."
    },
    {
      name: "AWS Certified Solutions Architect Professional",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023",
      description: "Enterprise cloud system performance and high availability."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateThirteenMock = {
  fullName: "Victoria Sterling",
  headline: "Senior Vice President & Director of Systems Engineering",
  email: "victoria.sterling@bytebodh.in",
  mobileNumber: "+91 99888 77777",
  location: "Mumbai, India",
  summary: "Delivering enterprise-scale platforms, high-throughput cloud infrastructure, and award-winning digital experiences designed with executive luxury precision and gold-standard reliability.",
  pictureUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/victoria-resume.pdf",
  viewsCount: 2150,
  skills: [
    { name: "Executive Engineering Leadership", proficiency: 98, category: "Leadership" },
    { name: "Enterprise Microservices Architecture", proficiency: 96, category: "Architecture" },
    { name: "React, Next.js & TypeScript", proficiency: 95, category: "Frontend" },
    { name: "Cloud Infrastructure & Kubernetes", proficiency: 92, category: "DevOps" },
    { name: "Cybersecurity & Risk Management", proficiency: 90, category: "Security" }
  ],
  experience: [
    {
      position: "Senior Vice President of Engineering",
      company: "Sterling Global Financials",
      startDate: "2022-03",
      endDate: "Present",
      location: "Mumbai, India",
      description: "Directing 120+ engineering leads, scaling high-throughput transaction processing systems, and managing enterprise cloud security compliance."
    },
    {
      position: "Director of Software Architecture",
      company: "Aura Fintech Holdings",
      startDate: "2019-01",
      endDate: "2022-02",
      location: "Mumbai, India",
      description: "Architected multi-region cloud financial engines processing $4B+ in annual transaction volume with 99.999% availability."
    }
  ],
  education: [
    {
      degree: "M.S. in Computer Science & Executive Leadership",
      institution: "Indian Institute of Management (IIM)",
      fieldOfStudy: "Systems Governance",
      startDate: "2015",
      endDate: "2017",
      gpa: "9.8/10",
      description: "Graduated top of class. Specialized in Enterprise Cloud Systems and Executive Technology Leadership."
    }
  ],
  projects: [
    {
      title: "Golden Frame — Executive Portfolio Platform",
      description: "Luxury brand-inspired executive portfolio featuring white premium background, soft golden borders (#D4AF37), gold gradients, large profile frame ring, and floating glass buttons.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/golden-frame"
    },
    {
      title: "Sterling Vault — High-Security Settlement Gateway",
      description: "Ultra-low latency financial transaction settlement gateway handling multi-currency cross-border transfers.",
      techStack: "Go, Kubernetes, Kafka, PostgreSQL",
      technologies: ["Go", "Kubernetes", "Kafka", "PostgreSQL"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/sterling-vault"
    }
  ],
  certifications: [
    {
      name: "Certified Chief Information Security Officer (C|CISO)",
      issuingOrganization: "EC-Council",
      issueDate: "2024",
      description: "Executive cybersecurity governance and risk management."
    },
    {
      name: "AWS Certified Solutions Architect Fellow",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023",
      description: "Highest-tier enterprise cloud architecture credential."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateFourteenMock = {
  fullName: "Oliver Vance",
  headline: "Senior Staff Product Architect & UI Systems Lead",
  email: "oliver.vance@bytebodh.in",
  mobileNumber: "+1 (415) 789-0123",
  location: "Cupertino, CA",
  summary: "Crafting isolated, floating glassmorphic interfaces where every section lives in its own levitating capsule, surrounded by generous whitespace, soft drop shadows, and glowing interactions inspired by Apple design principles.",
  pictureUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/oliver-resume.pdf",
  viewsCount: 2890,
  skills: [
    { name: "Floating UI & Spatial Design", proficiency: 98, category: "UI/UX" },
    { name: "React, Next.js & Framer Motion", proficiency: 96, category: "Frontend" },
    { name: "Apple Glassmorphism & Tokens", proficiency: 95, category: "Design Systems" },
    { name: "TypeScript & Web Vitals", proficiency: 94, category: "Engineering" },
    { name: "TailwindCSS & CSS Architecture", proficiency: 92, category: "Styling" }
  ],
  experience: [
    {
      position: "Senior Staff Product Architect",
      company: "Float UI Design Labs",
      startDate: "2022-04",
      endDate: "Present",
      location: "Cupertino, CA",
      description: "Directing spatial glass UI component engines, floating card levitation algorithms, and high-performance WebGL micro-interactions."
    },
    {
      position: "Lead UI Systems Engineer",
      company: "Apple Design Guild Partner",
      startDate: "2019-08",
      endDate: "2022-03",
      location: "Cupertino, CA",
      description: "Architected multi-platform design tokens and translucent glass surface rendering engines."
    }
  ],
  education: [
    {
      degree: "M.S. in Human-Computer Interaction",
      institution: "UC Berkeley",
      fieldOfStudy: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.98/4.0",
      description: "Graduated with honors. Specialized in Spatial User Interfaces and Micro-Interactions."
    }
  ],
  projects: [
    {
      title: "Float UI — Premium Floating Glass Portfolio",
      description: "Apple-inspired floating glass portfolio template where nothing touches each other. Every section lives inside an isolated floating capsule with glowing hover buttons and 36-40px rounded corners.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/float-ui"
    },
    {
      title: "Aether Glass — Translucent Component Engine",
      description: "High-throughput React glassmorphic component framework providing hardware-accelerated backdrop blur and glowing hover states.",
      techStack: "TypeScript, Canvas, Framer Motion, Web Vitals",
      technologies: ["TypeScript", "Canvas", "Framer Motion", "Web Vitals"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/aether-glass"
    }
  ],
  certifications: [
    {
      name: "Certified Apple Design Systems Fellow",
      issuingOrganization: "Apple Developer Guild",
      issueDate: "2024",
      description: "Excellence in spatial user interface architecture and accessibility."
    },
    {
      name: "AWS Certified Cloud Systems Architect",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023",
      description: "Enterprise cloud system performance and high availability."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateFifteenMock = {
  fullName: "Maya Lin",
  headline: "Senior UI/UX Product Designer & Systems Engineer",
  email: "maya.lin@bytebodh.in",
  mobileNumber: "+1 (415) 890-1234",
  location: "San Francisco, CA",
  summary: "Handcrafted software products, design systems, and digital experiences created with intentional visual rhythm, clean whitespace, and refined micro-interactions inspired by Apple, Stripe, Framer, and Linear.",
  pictureUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/maya-resume.pdf",
  viewsCount: 2890,
  skills: [
    { name: "Design Systems & Tokens", proficiency: 98, category: "UI/UX" },
    { name: "React, Next.js & Framer Motion", proficiency: 96, category: "Frontend" },
    { name: "Interactive Micro-Interactions", proficiency: 95, category: "Interaction Design" },
    { name: "TypeScript & Web Vitals", proficiency: 94, category: "Engineering" },
    { name: "Accessibility & WCAG", proficiency: 92, category: "Compliance" }
  ],
  experience: [
    {
      position: "Senior UI/UX Systems Specialist",
      company: "Linear Partner Labs",
      startDate: "2022-02",
      endDate: "Present",
      location: "San Francisco, CA",
      description: "Crafting multi-platform design tokens, high-performance web components, and fluid micro-interactions with 8-point spatial grid precision."
    },
    {
      position: "Lead Product Designer",
      company: "Framer Design Collective",
      startDate: "2019-05",
      endDate: "2022-01",
      location: "San Francisco, CA",
      description: "Designed award-winning e-commerce and SaaS interfaces featured on Awwwards and SiteInspire."
    }
  ],
  education: [
    {
      degree: "B.Des in Human-Computer Interaction & Software Engineering",
      institution: "Stanford University",
      fieldOfStudy: "Interaction Design",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.95/4.0",
      description: "Graduated with honors. Specialized in Digital Product Design, Micro-Interactions, and Web Systems."
    }
  ],
  projects: [
    {
      title: "Prism Flow — Handcrafted Portfolio Platform",
      description: "Apple, Stripe, Framer & Linear inspired handcrafted portfolio template with an asymmetrical layout, white background (#FFFFFF), soft gray surfaces (#F8FAFC), emerald & indigo accents, and 24-32px rounded cards.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/prism-flow"
    },
    {
      title: "Linear Flow — Motion Component Library",
      description: "High-performance React motion component library providing 60fps fluid page transitions and magnetic micro-interactions.",
      techStack: "TypeScript, Framer Motion, TailwindCSS, Storybook",
      technologies: ["TypeScript", "Framer Motion", "TailwindCSS", "Storybook"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/linear-flow"
    }
  ],
  certifications: [
    {
      name: "Certified Interaction Design Specialist",
      issuingOrganization: "Nielsen Norman Group (NN/g)",
      issueDate: "2024",
      description: "Advanced usability architecture and micro-interaction engineering."
    },
    {
      name: "Apple Design Guild Honor Award",
      issuingOrganization: "Apple Design Community",
      issueDate: "2023",
      description: "Excellence in accessibility and spatial typography design."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateSixteenMock = {
  fullName: "Sebastian Thorne",
  headline: "Senior Staff Engineer & Interactive Systems Lead",
  email: "sebastian.thorne@bytebodh.in",
  mobileNumber: "+1 (415) 345-6789",
  location: "New York, NY",
  summary: "Crafting 100vw × 100vh horizontal storytelling portfolios that feel handcrafted rather than AI generated, inspired by Apple product launches, Linear, and Framer.",
  pictureUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/sebastian-resume.pdf",
  viewsCount: 3120,
  skills: [
    { name: "Horizontal Storytelling UI", proficiency: 98, category: "UI/UX" },
    { name: "React, Next.js & Framer Motion", proficiency: 96, category: "Frontend" },
    { name: "Apple & Linear Interaction Design", proficiency: 95, category: "Design Systems" },
    { name: "TypeScript & WebGL Canvas", proficiency: 94, category: "Engineering" },
    { name: "TailwindCSS & CSS Grid Architecture", proficiency: 92, category: "Styling" }
  ],
  experience: [
    {
      position: "Senior Staff Interactive Engineer",
      company: "Linear Partner Network",
      startDate: "2022-05",
      endDate: "Present",
      location: "New York, NY",
      description: "Directing 100vw x 100vh horizontal storytelling engines, hardware-accelerated scroll translations, and multi-tier component libraries."
    },
    {
      position: "Lead UI Architect",
      company: "Framer Motion Studio",
      startDate: "2019-07",
      endDate: "2022-04",
      location: "New York, NY",
      description: "Architected interactive web presentations and fluid touch gesture navigation systems."
    }
  ],
  education: [
    {
      degree: "M.S. in Computer Science & Human-Computer Interaction",
      institution: "Columbia University",
      fieldOfStudy: "Interaction Design",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.96/4.0",
      description: "Graduated with highest honors. Specialized in Interactive Web Engines and Hardware-Accelerated Graphics."
    }
  ],
  projects: [
    {
      title: "Horizon Slides — 100vw Storytelling Portfolio",
      description: "Apple, Linear & Framer inspired 100vw x 100vh horizontal storytelling portfolio featuring 7 full-screen slides traversed via mousewheel, touch swipe, or left vertical navigation dock.",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/horizon-slides",
      githubUrl: "https://github.com/bytebodh/horizon-slides"
    },
    {
      title: "Linear Orbit — Motion Viewport Engine",
      description: "Ultra-fast JavaScript viewport translation library converting vertical wheel deltas into smooth horizontal slide movement.",
      techStack: "TypeScript, Canvas, Framer Motion, Web Vitals",
      technologies: ["TypeScript", "Canvas", "Framer Motion", "Web Vitals"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/linear-orbit",
      githubUrl: "https://github.com/bytebodh/linear-orbit"
    }
  ],
  certifications: [
    {
      name: "Certified Apple Design Systems Fellow",
      issuingOrganization: "Apple Developer Guild",
      issueDate: "2024",
      description: "Excellence in spatial user interface architecture and accessibility."
    },
    {
      name: "AWS Certified Cloud Solutions Architect",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023",
      description: "Enterprise cloud system performance and high availability."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
  ]
};

const templateSeventeenMock = {
  fullName: "Adrian Mercer",
  headline: "Principal Product Designer & Fluent Systems Architect",
  email: "adrian.mercer@bytebodh.in",
  mobileNumber: "+1 (206) 555-0199",
  location: "Seattle, WA",
  summary: "Crafting infinite horizontal workspaces, Fluent UI design systems, and Notion-style collaborative experiences with 28px border radius precision, custom track progress indicators, and Microsoft Fluent design polish.",
  pictureUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  resumeUrl: "https://example.com/adrian-resume.pdf",
  viewsCount: 3450,
  skills: [
    { name: "Fluent Design & Tokens", proficiency: 98, category: "UI/UX" },
    { name: "React, Next.js & Framer Motion", proficiency: 96, category: "Frontend" },
    { name: "Horizontal Workspace Engine", proficiency: 95, category: "Interaction Design" },
    { name: "TypeScript & Web Vitals", proficiency: 94, category: "Engineering" },
    { name: "Accessibility & WCAG 2.1", proficiency: 92, category: "Compliance" }
  ],
  experience: [
    {
      position: "Principal Fluent Product Designer",
      company: "Microsoft Fluent Design Studio",
      startDate: "2022-01",
      endDate: "Present",
      location: "Redmond, WA",
      description: "Directing Fluent UI design system tokens, infinite workspace scroll engines, and multi-tier component architecture across web applications."
    },
    {
      position: "Lead UI Systems Architect",
      company: "Vercel Partner Network",
      startDate: "2019-03",
      endDate: "2021-12",
      location: "Seattle, WA",
      description: "Architected high-throughput horizontal canvas layouts, Notion-inspired sticky boards, and fluid micro-interactions."
    }
  ],
  education: [
    {
      degree: "M.S. in Human-Centered Design & Engineering",
      institution: "University of Washington",
      fieldOfStudy: "Computer Science",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.97/4.0",
      description: "Graduated with top honors. Specialized in Spatial Workspace Canvas, Micro-Interactions, and Web Systems."
    }
  ],
  projects: [
    {
      title: "Metro Flow — Infinite Horizontal Workspace",
      description: "Microsoft Fluent Design, Vercel & Notion inspired horizontal workspace portfolio featuring asymmetrical sections (Welcome → Skills → Projects → Education → Experience → Certificates Wall → Contact).",
      techStack: "React, TailwindCSS, Framer Motion, Node.js",
      technologies: ["React", "TailwindCSS", "Framer Motion", "Node.js"],
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/metro-flow"
    },
    {
      title: "Fluent Canvas — Infinite Scroll Library",
      description: "High-performance React horizontal workspace component library providing hardware-accelerated wheel deltas and travel progress indicators.",
      techStack: "TypeScript, Framer Motion, TailwindCSS, Web Vitals",
      technologies: ["TypeScript", "Framer Motion", "TailwindCSS", "Web Vitals"],
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      link: "https://github.com/bytebodh/fluent-canvas"
    }
  ],
  certifications: [
    {
      name: "Certified Microsoft Fluent Systems Fellow",
      issuingOrganization: "Microsoft Design Guild",
      issueDate: "2024",
      description: "Excellence in Fluent UI component design and spatial accessibility."
    },
    {
      name: "AWS Certified Solutions Architect Professional",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023",
      description: "Highest-tier cloud system performance and high availability."
    }
  ],
  socialMediaLinks: [
    { platform: "LINKEDIN", url: "https://linkedin.com", profileUrl: "https://linkedin.com" },
    { platform: "GITHUB", url: "https://github.com/bytebodh", profileUrl: "https://github.com/bytebodh" },
    { platform: "TWITTER", url: "https://twitter.com", profileUrl: "https://twitter.com" }
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
      if (tId === 5) mockProfile = templateFiveMock;
      if (tId === 6 || tId === 7 || tId === 8 || tId === 9) mockProfile = templateSixMock;
      if (tId === 10) mockProfile = templateTenMock;
      if (tId === 11) mockProfile = templateElevenMock;
      if (tId === 12) mockProfile = templateTwelveMock;
      if (tId === 13) mockProfile = templateThirteenMock;
      if (tId === 14) mockProfile = templateFourteenMock;
      if (tId === 15) mockProfile = templateFifteenMock;
      if (tId === 16) mockProfile = templateSixteenMock;
      if (tId === 17) mockProfile = templateSeventeenMock;
      if (tId === 18) mockProfile = templateEighteenMock;
      
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

  // Dynamically update document title & meta tags for SEO when public portfolio loads
  useEffect(() => {
    if (profile?.fullName) {
      const pageTitle = isPreview
        ? `${profile.fullName} — Template #${templateId} Preview | ByteBodh`
        : `${profile.fullName} | ${profile.headline || "Professional Portfolio"}`;
      
      document.title = pageTitle;

      const descText = profile.summary || profile.headline || `${profile.fullName}'s interactive portfolio showcasing skills, projects, and career experience on ByteBodh.`;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", descText);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", descText);
        document.head.appendChild(metaDesc);
      }

      // OpenGraph social sharing meta tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", pageTitle);
      } else {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        ogTitle.setAttribute("content", pageTitle);
        document.head.appendChild(ogTitle);
      }

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", descText);
      } else {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        ogDesc.setAttribute("content", descText);
        document.head.appendChild(ogDesc);
      }

      if (profile.pictureUrl) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute("content", profile.pictureUrl);
        } else {
          ogImage = document.createElement("meta");
          ogImage.setAttribute("property", "og:image");
          ogImage.setAttribute("content", profile.pictureUrl);
          document.head.appendChild(ogImage);
        }
      }
    }
  }, [profile, isPreview, templateId]);

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
        <span>BYTEBODH TEMPLATE PREVIEW: {profile.fullName} (Template #{templateId})</span>
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
        return <TemplateTwo profile={profile} />;

      case 3:
        return <TemplateThree profile={profile} />;

      case 4:
        return <TemplateFour profile={profile} />;

      case 5:
        return <TemplateFive profile={profile} />;

      case 6:
        return <TemplateSix profile={profile} />;

      case 7:
        return <TemplateSeven profile={profile} />;

      case 8:
        return <TemplateEight profile={profile} />;

      case 9:
        return <TemplateNine profile={profile} />;

      case 10:
        return <TemplateTen profile={profile} />;

      case 11:
        return <TemplateEleven profile={profile} />;

      case 12:
        return <TemplateTwelve profile={profile} />;

      case 13:
        return <TemplateThirteen profile={profile} />;

      case 14:
        return <TemplateFourteen profile={profile} />;

      case 15:
        return <TemplateFifteen profile={profile} />;

      case 16:
        return <TemplateSixteen profile={profile} />;

      case 17:
        return <TemplateSeventeen profile={profile} />;

      case 18:
        return <TemplateEighteen profile={profile} />;

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