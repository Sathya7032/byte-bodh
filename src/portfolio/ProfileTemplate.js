import React, { useEffect, useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaUserGraduate, 
  FaBriefcase, 
  FaCode, 
  FaProjectDiagram, 
  FaLink, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaBuilding, 
  FaTools, 
  FaGithub, 
  FaLinkedin, 
  FaGlobe, 
  FaExternalLinkAlt,
  FaLaptopCode,
  FaDatabase,
  FaServer,
  FaHome,
  FaUser,
  FaFileCode,
  FaHandshake,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaStar,
  FaChevronRight
} from 'react-icons/fa';
import { SiLeetcode, SiSpringboot, SiMysql, SiJavascript, SiPython, SiReact, SiNodedotjs, SiDocker, SiGit } from 'react-icons/si';
import { getMyProfile } from '../api/profileService';

const ProfileTemplate = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'education', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'JD';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (initials) => {
    const colors = [
      '#2563EB', '#059669', '#7C3AED', '#DC2626', '#D97706',
      '#EC4899', '#0891B2', '#65A30D', '#EA580C', '#4F46E5'
    ];
    const index = initials.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getMonthName = (monthNumber) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthNumber - 1] || '';
  };

  const getSkillIcon = (skill) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('java') && !skillLower.includes('javascript')) return <SiJavascript className="w-5 h-5" />;
    if (skillLower.includes('javascript') || skillLower.includes('js')) return <SiJavascript className="w-5 h-5" />;
    if (skillLower.includes('spring')) return <SiSpringboot className="w-5 h-5" />;
    if (skillLower.includes('mysql')) return <SiMysql className="w-5 h-5" />;
    if (skillLower.includes('python')) return <SiPython className="w-5 h-5" />;
    if (skillLower.includes('react')) return <SiReact className="w-5 h-5" />;
    if (skillLower.includes('node')) return <SiNodedotjs className="w-5 h-5" />;
    if (skillLower.includes('docker')) return <SiDocker className="w-5 h-5" />;
    if (skillLower.includes('git')) return <SiGit className="w-5 h-5" />;
    if (skillLower.includes('api') || skillLower.includes('rest')) return <FaServer className="w-5 h-5" />;
    if (skillLower.includes('database')) return <FaDatabase className="w-5 h-5" />;
    return <FaCode className="w-5 h-5" />;
  };

  const getSocialIcon = (platform) => {
    switch (platform.toUpperCase()) {
      case 'GITHUB': return <FaGithub className="w-5 h-5" />;
      case 'LINKEDIN': return <FaLinkedin className="w-5 h-5" />;
      case 'LEETCODE': return <SiLeetcode className="w-5 h-5" />;
      case 'PORTFOLIO': return <FaGlobe className="w-5 h-5" />;
      default: return <FaLink className="w-5 h-5" />;
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-4">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{error}</h3>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No profile found</h3>
          <p className="text-gray-600">Please create your profile to view it here.</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(profile.fullName);
  const avatarColor = getAvatarColor(initials);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: avatarColor }}
              >
                {initials}
              </div>
              <span className="font-semibold text-gray-800 hidden sm:block">{profile.fullName}</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'home', label: 'Home', icon: <FaHome className="w-4 h-4" /> },
                { id: 'about', label: 'About', icon: <FaUser className="w-4 h-4" /> },
                { id: 'skills', label: 'Skills', icon: <FaTools className="w-4 h-4" /> },
                { id: 'education', label: 'Education', icon: <FaGraduationCap className="w-4 h-4" /> },
                { id: 'experience', label: 'Experience', icon: <FaBriefcase className="w-4 h-4" /> },
                { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="w-4 h-4" /> },
                { id: 'contact', label: 'Contact', icon: <FaHandshake className="w-4 h-4" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeSection === item.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                {[
                  { id: 'home', label: 'Home', icon: <FaHome className="w-4 h-4" /> },
                  { id: 'about', label: 'About', icon: <FaUser className="w-4 h-4" /> },
                  { id: 'skills', label: 'Skills', icon: <FaTools className="w-4 h-4" /> },
                  { id: 'education', label: 'Education', icon: <FaGraduationCap className="w-4 h-4" /> },
                  { id: 'experience', label: 'Experience', icon: <FaBriefcase className="w-4 h-4" /> },
                  { id: 'projects', label: 'Projects', icon: <FaProjectDiagram className="w-4 h-4" /> },
                  { id: 'contact', label: 'Contact', icon: <FaHandshake className="w-4 h-4" /> }
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeSection === item.id 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FaUserGraduate className="mr-2" />
                    {profile.isFresher ? 'Fresher' : 'Professional'} Portfolio
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{profile.fullName}</span>
                </h1>
                
                <h2 className="text-xl md:text-2xl text-gray-600 mb-6 flex items-center flex-wrap gap-2">
                  <span>{profile.headline}</span>
                  {profile.isFresher && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <FaUserGraduate className="mr-1" /> Seeking Opportunities
                    </span>
                  )}
                </h2>
                
                <p className="text-lg text-gray-500 mb-8 max-w-2xl">{profile.summary}</p>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaHandshake className="mr-2" />
                    Get In Touch
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('projects')}
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-all duration-200 shadow hover:shadow-md"
                  >
                    <FaFileCode className="mr-2" />
                    View Projects
                  </button>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                    {profile.user?.pictureUrl ? (
                      <img 
                        src={profile.user.pictureUrl} 
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4 rounded-lg shadow-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profile.experience?.length || 0}+</div>
                      <div className="text-sm">Years Exp</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={() => scrollToSection('about')}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white transition-colors"
            >
              <FaChevronDown className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <FaUser className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">{profile.summary}</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaEnvelope className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                        <p className="text-gray-600">{profile.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <FaPhone className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Phone</h4>
                        <p className="text-gray-600">{profile.mobileNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{profile.projects?.length || 0}</div>
                    <div className="font-semibold text-gray-800">Projects</div>
                    <div className="text-sm text-gray-500 mt-1">Completed</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">{profile.skills?.length || 0}</div>
                    <div className="font-semibold text-gray-800">Skills</div>
                    <div className="text-sm text-gray-500 mt-1">Technical</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">{profile.education?.length || 0}</div>
                    <div className="font-semibold text-gray-800">Education</div>
                    <div className="text-sm text-gray-500 mt-1">Qualifications</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {profile.experience?.length > 0 ? `${profile.experience.length}+` : '0'}
                    </div>
                    <div className="font-semibold text-gray-800">Experience</div>
                    <div className="text-sm text-gray-500 mt-1">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-4">
                  <FaTools className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Skills</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">Technologies and tools I work with</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-4"></div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {profile.skills?.map((skill, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-700/50 group"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {getSkillIcon(skill)}
                      </div>
                      <span className="font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                        {skill}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <FaGraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Education</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto"></div>
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-200 to-indigo-200"></div>
                
                {profile.education?.map((edu, index) => (
                  <div 
                    key={edu.id} 
                    className={`relative mb-12 ${index % 2 === 0 ? 'md:mr-auto md:pr-8 md:pl-0 md:text-right' : 'md:ml-auto md:pl-8 md:pr-0'} md:w-1/2`}
                  >
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border-4 border-white shadow-lg"></div>
                    </div>
                    
                    <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2 md:mt-0">
                            <FaCalendarAlt className="mr-2" />
                            {edu.startYear} - {edu.endYear}
                          </span>
                        </div>
                        
                        {edu.fieldOfStudy && (
                          <p className="text-gray-600 font-medium mb-3">{edu.fieldOfStudy}</p>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-gray-500 text-sm">
                          <span className="flex items-center mb-2 sm:mb-0">
                            <FaBuilding className="mr-2" />
                            {edu.institution}
                          </span>
                          {edu.cgpa && (
                            <span className="flex items-center">
                              <FaStar className="mr-2 text-yellow-500" />
                              CGPA: <strong className="ml-1">{edu.cgpa}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        {profile.experience?.length > 0 && (
          <section id="experience" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-4">
                    <FaBriefcase className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Work Experience</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">Professional journey and career highlights</p>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto mt-4"></div>
                </div>
                
                <div className="space-y-8">
                  {profile.experience.map((exp) => (
                    <div 
                      key={exp.id} 
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                        <div className="mb-4 lg:mb-0">
                          <h3 className="text-xl font-bold text-white mb-2">{exp.jobTitle}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-gray-300">
                            <span className="flex items-center">
                              <FaBuilding className="mr-2" />
                              {exp.company}
                            </span>
                            {exp.location && (
                              <span className="flex items-center">
                                <FaMapMarkerAlt className="mr-2" />
                                {exp.location}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center px-4 py-2 bg-gray-700/50 rounded-lg">
                          <FaCalendarAlt className="mr-2 text-blue-400" />
                          <span className="text-gray-200">
                            {getMonthName(exp.startMonth)} {exp.startYear} -{' '}
                            {exp.endMonth ? `${getMonthName(exp.endMonth)} ${exp.endYear}` : 'Present'}
                          </span>
                          {exp.currentlyWorking && (
                            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-400 rounded">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {exp.description && (
                        <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <FaProjectDiagram className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Showcasing my technical capabilities and problem-solving skills</p>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-4"></div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profile.projects?.map((project) => (
                  <div 
                    key={project.id} 
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                          <div className="flex items-center text-gray-600 mb-3">
                            <FaLaptopCode className="mr-2" />
                            <span className="text-sm">{project.techStack}</span>
                          </div>
                        </div>
                        
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCode className="mr-2" />
                            <span>Code Available</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-200">
                            View Details
                            <FaChevronRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-300 mb-4">
                  <FaHandshake className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
                <p className="text-blue-200 max-w-2xl mx-auto">Let's connect and discuss opportunities</p>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 mx-auto mt-4"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="grid gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                          <FaEnvelope className="w-6 h-6 text-blue-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Email</h4>
                          <p className="text-blue-200">{profile.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                          <FaPhone className="w-6 h-6 text-green-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Phone</h4>
                          <p className="text-green-200">{profile.mobileNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {profile.socialMediaLinks?.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Connect With Me</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {profile.socialMediaLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mr-3 group-hover:scale-110 transition-transform duration-300">
                              {getSocialIcon(link.platform)}
                            </div>
                            <div>
                              <div className="font-medium text-white">{link.platform}</div>
                              <div className="text-sm text-blue-200 truncate">{link.profileUrl}</div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-4 mb-6 md:mb-0">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{profile.fullName}</h3>
                  <p className="text-gray-400">{profile.headline}</p>
                </div>
              </div>
              
              <div className="flex space-x-6">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projects
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm mb-4 md:mb-0">
                  © {new Date().getFullYear()} {profile.fullName}. All rights reserved.
                </p>
                
                <div className="text-gray-400 text-sm">
                  <span className="mr-4">
                    <FaCalendarAlt className="inline mr-2" />
                    Last updated: {new Date(profile.updatedTime || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfileTemplate;