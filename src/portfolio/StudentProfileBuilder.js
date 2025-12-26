import React, { useState, useEffect } from 'react'
import DashboardLayout from './components/DashboardLayout'
import { getMyProfile } from '../api/profileService'
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Globe, 
  FileText, 
  Download,
  Mail,
  Phone,
  Award,
  ExternalLink,
  Linkedin,
  Github
} from 'lucide-react'

const StudentProfileBuilder = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await getMyProfile()
      setProfile(response.data)
      // Select first template by default
      setSelectedTemplate(resumeTemplates[0])
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const resumeTemplates = [
    {
      id: 1,
      name: 'Modern Professional',
      description: 'Clean and contemporary design for tech professionals',
      color: 'bg-blue-50 border-blue-200',
      thumbnail: '📄',
      style: 'modern'
    },
    {
      id: 2,
      name: 'Creative Portfolio',
      description: 'Visually appealing with emphasis on projects',
      color: 'bg-purple-50 border-purple-200',
      thumbnail: '🎨',
      style: 'creative'
    },
    {
      id: 3,
      name: 'Academic',
      description: 'Traditional format with focus on education',
      color: 'bg-green-50 border-green-200',
      thumbnail: '📚',
      style: 'academic'
    },
    {
      id: 4,
      name: 'Minimalist',
      description: 'Simple and elegant with maximum content',
      color: 'bg-gray-50 border-gray-200',
      thumbnail: '⚪',
      style: 'minimalist'
    }
  ]

  const formatDate = (month, year) => {
    if (!year) return 'Present'
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthName = month ? monthNames[month - 1] : ''
    return monthName ? `${monthName} ${year}` : `${year}`
  }

  const generateResumePDF = async () => {
    if (!selectedTemplate || !profile) return
    
    setGeneratingPDF(true)
    try {
      // Dynamically import the libraries
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      // Create a temporary div with resume content
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'absolute'
      tempDiv.style.left = '-9999px'
      tempDiv.style.width = '794px' // A4 width in pixels at 96 DPI
      tempDiv.style.padding = '40px'
      tempDiv.style.backgroundColor = 'white'
      
      // Generate resume HTML based on selected template
      const resumeHTML = generateResumeHTML(selectedTemplate.style)
      tempDiv.innerHTML = resumeHTML
      
      document.body.appendChild(tempDiv)
      
      // Generate canvas from HTML
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      // Remove temp div
      document.body.removeChild(tempDiv)
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Save PDF
      const filename = `${profile.fullName.replace(/\s+/g, '_')}_Resume_${selectedTemplate.name.replace(/\s+/g, '_')}.pdf`
      pdf.save(filename)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setGeneratingPDF(false)
    }
  }

  const generateResumeHTML = (style) => {
    if (!profile) return ''
    
    // Different HTML templates based on style
    switch(style) {
      case 'modern':
        return `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 794px; margin: 0 auto;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 8px; margin-bottom: 30px;">
              <div style="display: flex; align-items: center; gap: 30px;">
                <img src="${profile.user.pictureUrl}" alt="${profile.fullName}" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; object-fit: cover;">
                <div>
                  <h1 style="font-size: 36px; margin: 0 0 10px 0;">${profile.fullName}</h1>
                  <h2 style="font-size: 20px; margin: 0 0 15px 0; opacity: 0.9;">${profile.headline}</h2>
                  <div style="display: flex; gap: 20px; font-size: 14px;">
                    <div>📧 ${profile.email}</div>
                    <div>📱 ${profile.mobileNumber}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Summary -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">Professional Summary</h3>
              <p style="line-height: 1.6;">${profile.summary}</p>
            </div>
            
            <!-- Two Column Layout -->
            <div style="display: flex; gap: 30px;">
              <!-- Left Column -->
              <div style="flex: 1;">
                <!-- Experience -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">Experience</h3>
                  ${profile.experience.map(exp => `
                    <div style="margin-bottom: 20px;">
                      <h4 style="margin: 0 0 5px 0; font-size: 16px;">${exp.jobTitle}</h4>
                      <div style="color: #666; font-size: 14px; margin-bottom: 5px;">${exp.company}, ${exp.location}</div>
                      <div style="color: #888; font-size: 13px; margin-bottom: 8px;">${formatDate(exp.startMonth, exp.startYear)} - ${formatDate(exp.endMonth, exp.endYear)}</div>
                      <p style="font-size: 14px; line-height: 1.5; margin: 0;">${exp.description}</p>
                    </div>
                  `).join('')}
                </div>
                
                <!-- Education -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">Education</h3>
                  ${profile.education.map(edu => `
                    <div style="margin-bottom: 15px;">
                      <h4 style="margin: 0 0 5px 0; font-size: 16px;">${edu.degree} in ${edu.fieldOfStudy}</h4>
                      <div style="color: #666; font-size: 14px;">${edu.institution}</div>
                      <div style="color: #888; font-size: 13px;">${edu.startYear} - ${edu.endYear} • CGPA: ${edu.cgpa}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
              
              <!-- Right Column -->
              <div style="width: 250px;">
                <!-- Skills -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">Skills</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${profile.skills.map(skill => `
                      <span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 20px; font-size: 13px;">${skill}</span>
                    `).join('')}
                  </div>
                </div>
                
                <!-- Projects -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">Projects</h3>
                  ${profile.projects.map(project => `
                    <div style="margin-bottom: 15px;">
                      <h4 style="margin: 0 0 5px 0; font-size: 15px;">${project.title}</h4>
                      <div style="color: #666; font-size: 13px; margin-bottom: 5px;">${project.techStack}</div>
                      <p style="font-size: 13px; line-height: 1.4; margin: 0;">${project.description}</p>
                    </div>
                  `).join('')}
                </div>
                
                <!-- Social Links -->
                <div>
                  <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 5px; margin-bottom: 15px;">Social Links</h3>
                  ${profile.socialMediaLinks.map(link => `
                    <div style="margin-bottom: 8px; font-size: 14px;">
                      ${link.platform === 'LINKEDIN' ? '🔗' : '🐙'} ${link.platform}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `
        
      case 'minimalist':
        return `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 794px; margin: 0 auto; padding: 40px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 30px;">
              <h1 style="font-size: 42px; margin: 0 0 10px 0; font-weight: 300; letter-spacing: 2px;">${profile.fullName}</h1>
              <h2 style="font-size: 20px; margin: 0 0 20px 0; color: #666; font-weight: 300;">${profile.headline}</h2>
              <div style="display: flex; justify-content: center; gap: 30px; font-size: 14px; color: #888;">
                <div>${profile.email}</div>
                <div>${profile.mobileNumber}</div>
              </div>
            </div>
            
            <!-- Summary -->
            <div style="margin-bottom: 30px; line-height: 1.8; color: #444;">
              ${profile.summary}
            </div>
            
            <!-- Content -->
            <div style="display: flex; flex-direction: column; gap: 30px;">
              <!-- Experience -->
              <div>
                <h3 style="font-size: 18px; margin: 0 0 20px 0; font-weight: 500; letter-spacing: 1px;">EXPERIENCE</h3>
                ${profile.experience.map(exp => `
                  <div style="margin-bottom: 25px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <h4 style="margin: 0; font-size: 16px;">${exp.jobTitle}</h4>
                      <div style="color: #888; font-size: 14px;">${formatDate(exp.startMonth, exp.startYear)} - ${formatDate(exp.endMonth, exp.endYear)}</div>
                    </div>
                    <div style="color: #666; font-size: 14px; margin-bottom: 10px;">${exp.company}, ${exp.location}</div>
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #555;">${exp.description}</p>
                  </div>
                `).join('')}
              </div>
              
              <!-- Education -->
              <div>
                <h3 style="font-size: 18px; margin: 0 0 20px 0; font-weight: 500; letter-spacing: 1px;">EDUCATION</h3>
                ${profile.education.map(edu => `
                  <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <h4 style="margin: 0; font-size: 16px;">${edu.degree}</h4>
                      <div style="color: #888; font-size: 14px;">${edu.startYear} - ${edu.endYear}</div>
                    </div>
                    <div style="color: #666; font-size: 14px;">${edu.institution}</div>
                    <div style="color: #888; font-size: 13px;">CGPA: ${edu.cgpa}</div>
                  </div>
                `).join('')}
              </div>
              
              <!-- Skills & Projects -->
              <div style="display: flex; gap: 40px;">
                <div style="flex: 1;">
                  <h3 style="font-size: 18px; margin: 0 0 15px 0; font-weight: 500; letter-spacing: 1px;">SKILLS</h3>
                  <div>
                    ${profile.skills.map(skill => `
                      <div style="margin-bottom: 8px; font-size: 14px; color: #555;">• ${skill}</div>
                    `).join('')}
                  </div>
                </div>
                
                <div style="flex: 1;">
                  <h3 style="font-size: 18px; margin: 0 0 15px 0; font-weight: 500; letter-spacing: 1px;">PROJECTS</h3>
                  ${profile.projects.map(project => `
                    <div style="margin-bottom: 20px;">
                      <h4 style="margin: 0 0 5px 0; font-size: 15px;">${project.title}</h4>
                      <div style="color: #666; font-size: 13px; margin-bottom: 5px;">${project.techStack}</div>
                      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #555;">${project.description}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `
        
      default:
        return `
          <div style="font-family: Arial, sans-serif; max-width: 794px; margin: 0 auto; padding: 30px;">
            <h1 style="font-size: 28px; margin-bottom: 10px;">${profile.fullName}</h1>
            <h2 style="font-size: 18px; color: #666; margin-bottom: 20px;">${profile.headline}</h2>
            
            <div style="display: flex; gap: 20px; margin-bottom: 30px;">
              <div>Email: ${profile.email}</div>
              <div>Phone: ${profile.mobileNumber}</div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">SUMMARY</h3>
              <p>${profile.summary}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">EXPERIENCE</h3>
              ${profile.experience.map(exp => `
                <div style="margin-bottom: 15px;">
                  <strong>${exp.jobTitle}</strong><br/>
                  ${exp.company}, ${exp.location}<br/>
                  ${formatDate(exp.startMonth, exp.startYear)} - ${formatDate(exp.endMonth, exp.endYear)}<br/>
                  ${exp.description}
                </div>
              `).join('')}
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">EDUCATION</h3>
              ${profile.education.map(edu => `
                <div style="margin-bottom: 10px;">
                  <strong>${edu.degree} in ${edu.fieldOfStudy}</strong><br/>
                  ${edu.institution}<br/>
                  ${edu.startYear} - ${edu.endYear} • CGPA: ${edu.cgpa}
                </div>
              `).join('')}
            </div>
            
            <div style="display: flex; gap: 30px;">
              <div style="flex: 1;">
                <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">SKILLS</h3>
                ${profile.skills.map(skill => `<div>• ${skill}</div>`).join('')}
              </div>
              
              <div style="flex: 1;">
                <h3 style="border-bottom: 1px solid #000; padding-bottom: 5px;">PROJECTS</h3>
                ${profile.projects.map(project => `
                  <div style="margin-bottom: 10px;">
                    <strong>${project.title}</strong><br/>
                    ${project.techStack}<br/>
                    ${project.description}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">Unable to load profile data</h2>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Profile Builder</h1>
          <p className="text-gray-600 mt-2">View your profile and download resumes in different templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Preview */}
          <div className="lg:col-span-2">
            {/* Rest of your existing JSX for displaying profile data */}
            {/* ... (keep all the existing profile display JSX from previous version) ... */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start space-x-6">
                <img
                  src={profile.user.pictureUrl}
                  alt={profile.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                  <p className="text-blue-600 font-medium">{profile.headline}</p>
                  <p className="text-gray-600 mt-2">{profile.summary}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{profile.mobileNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{profile.isFresher ? 'Fresher' : 'Experienced'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Education</h3>
              </div>
              <div className="space-y-4">
                {profile.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-gray-500 text-sm">
                      {edu.startYear} - {edu.endYear} • CGPA: {edu.cgpa}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Briefcase className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Experience</h3>
              </div>
              <div className="space-y-4">
                {profile.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                    <p className="text-gray-600">{exp.company}, {exp.location}</p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear)}
                    </p>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Code className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
                </div>
                <div className="space-y-4">
                  {profile.projects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:border-blue-300 transition-colors">
                      <h4 className="font-semibold text-gray-900">{project.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{project.techStack}</p>
                      <p className="text-gray-700 text-sm mt-2 line-clamp-2">{project.description}</p>
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 text-sm mt-2 hover:text-blue-800"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Project
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Resume Templates */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Resume Templates</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Select a template and download your resume in PDF format
                </p>

                <div className="space-y-4">
                  {resumeTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : template.color
                      } hover:shadow-md`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-start">
                        <div className="text-3xl mr-3">{template.thumbnail}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={generateResumePDF}
                  disabled={!selectedTemplate || generatingPDF}
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                    selectedTemplate && !generatingPDF
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  } transition-colors`}
                >
                  {generatingPDF ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Resume as PDF
                    </>
                  )}
                </button>

                <p className="text-gray-500 text-sm text-center mt-3">
                  {selectedTemplate
                    ? `Selected: ${selectedTemplate.name}`
                    : 'Select a template to download'}
                </p>
                
                <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="font-medium mb-1">Note:</p>
                  <p>This generates PDF client-side using html2canvas & jspdf. Image quality may vary.</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h3>
                <div className="space-y-3">
                  {profile.socialMediaLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center">
                        {link.platform === 'LINKEDIN' ? (
                          <Linkedin className="w-5 h-5 text-blue-700 mr-2" />
                        ) : (
                          <Github className="w-5 h-5 text-gray-800 mr-2" />
                        )}
                        <span className="font-medium text-gray-700">{link.platform}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentProfileBuilder