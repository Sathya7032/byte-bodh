import React, { useState, useEffect, useCallback } from 'react'
import DashboardLayout from './components/DashboardLayout'
import { getMyProfile } from '../api/profileService'
import { toast } from 'react-toastify'
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
  Github,
  Eye,
  X,
  FileCheck
} from 'lucide-react'

const resumeTemplates = [
  {
    id: 1,
    name: 'Modern Professional',
    description: 'Clean and contemporary sidebar design for tech professionals',
    color: 'bg-blue-50 border-blue-200',
    thumbnail: '💼',
    style: 'modern'
  },
  {
    id: 2,
    name: 'Creative Portfolio',
    description: 'Visually appealing design with vibrant gradient accent',
    color: 'bg-purple-50 border-purple-200',
    thumbnail: '🎨',
    style: 'creative'
  },
  {
    id: 3,
    name: 'Academic / Classic',
    description: 'Traditional and formal serif layout for scholars',
    color: 'bg-green-50 border-green-200',
    thumbnail: '📚',
    style: 'academic'
  },
  {
    id: 4,
    name: 'Minimalist',
    description: 'Simple and elegant monochromatic layout maximizing space',
    color: 'bg-gray-50 border-gray-200',
    thumbnail: '⚪',
    style: 'minimalist'
  }
]

const StudentProfileBuilder = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const fetchProfile = useCallback(async () => {
    try {
      const response = await getMyProfile()
      setProfile(response.data)
      // Select first template by default
      setSelectedTemplate(resumeTemplates[0])
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const formatDate = (month, year) => {
    if (!year) return 'Present'
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthName = month ? monthNames[month - 1] : ''
    return monthName ? `${monthName} ${year}` : `${year}`
  }

  const formatCertDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (e) {
      return dateString;
    }
  }

  const generateResumePDF = async (templateToUse = selectedTemplate) => {
    if (!templateToUse || !profile) {
      toast.warning('Please select a template to download.')
      return
    }
    
    setGeneratingPDF(true)
    const toastId = toast.loading(`Generating your ${templateToUse.name} PDF...`)
    
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
      const resumeHTML = generateResumeHTML(templateToUse.style)
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
      const safeName = profile?.fullName || "User"
      const filename = `${safeName.replace(/\s+/g, '_')}_Resume_${templateToUse.name.replace(/\s+/g, '_')}.pdf`
      pdf.save(filename)
      toast.update(toastId, { render: 'Resume PDF downloaded successfully!', type: 'success', isLoading: false, autoClose: 3000 })
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.update(toastId, { render: 'Error generating PDF. Please try again.', type: 'error', isLoading: false, autoClose: 4000 })
    } finally {
      setGeneratingPDF(false)
    }
  }

  const generateResumeHTML = (style) => {
    if (!profile) return ''
    
    switch(style) {
      case 'modern':
        return `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 794px; margin: 0 auto; color: #1e293b; padding: 10px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%); color: white; padding: 35px; border-radius: 12px; margin-bottom: 25px;">
              <div style="display: flex; align-items: center; gap: 25px;">
                ${profile.pictureUrl ? `<img src="${profile.pictureUrl}" alt="${profile.fullName}" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid rgba(255, 255, 255, 0.3); object-fit: cover;">` : ''}
                <div>
                  <h1 style="font-size: 30px; margin: 0 0 6px 0; font-weight: 800; letter-spacing: -0.5px;">${profile.fullName}</h1>
                  <h2 style="font-size: 16px; margin: 0 0 15px 0; opacity: 0.9; font-weight: 500; color: #c7d2fe;">${profile.headline}</h2>
                  <div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 12.5px;">
                    <div>📧 ${profile.email}</div>
                    ${profile.mobileNumber ? `<div>📱 ${profile.mobileNumber}</div>` : ''}
                  </div>
                </div>
              </div>
            </div>
            
            <div style="display: flex; gap: 25px; text-align: left;">
              <!-- Left Column (Main Content) -->
              <div style="flex: 1.6;">
                <!-- Summary -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Professional Summary</h3>
                  <p style="line-height: 1.6; font-size: 13px; margin: 0; color: #334155;">${profile.summary}</p>
                </div>
                
                <!-- Experience -->
                ${profile.experience && profile.experience.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 15px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Work Experience</h3>
                  ${profile.experience.map(exp => `
                    <div style="margin-bottom: 18px;">
                      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
                        <h4 style="margin: 0; font-size: 13.5px; font-weight: 700; color: #0f172a;">${exp.jobTitle}</h4>
                        <span style="color: #64748b; font-size: 11.5px; font-weight: 500;">${formatDate(exp.startMonth, exp.startYear)} - ${formatDate(exp.endMonth, exp.endYear)}</span>
                      </div>
                      <div style="color: #4f46e5; font-size: 12px; font-weight: 600; margin-bottom: 6px;">${exp.company}${exp.location ? ` &bull; ${exp.location}` : ''}</div>
                      <p style="font-size: 12.5px; line-height: 1.5; margin: 0; color: #475569;">${exp.description}</p>
                    </div>
                  `).join('')}
                </div>` : ''}
                
                <!-- Education -->
                ${profile.education && profile.education.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 15px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Education</h3>
                  ${profile.education.map(edu => `
                    <div style="margin-bottom: 12px;">
                      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
                        <h4 style="margin: 0; font-size: 13.5px; font-weight: 700; color: #0f172a;">${edu.degree} &bull; <span style="font-weight: 500; color: #475569;">${edu.fieldOfStudy}</span></h4>
                        <span style="color: #64748b; font-size: 11.5px; font-weight: 500;">${edu.startYear} - ${edu.endYear}</span>
                      </div>
                      <div style="color: #475569; font-size: 12px; font-weight: 500;">${edu.institution} ${edu.cgpa ? `&bull; <strong style="color: #0f172a;">CGPA: ${edu.cgpa}</strong>` : ''}</div>
                    </div>
                  `).join('')}
                </div>` : ''}
              </div>
              
              <!-- Right Column (Sidebar) -->
              <div style="flex: 1; border-left: 1px solid #e2e8f0; padding-left: 20px;">
                <!-- Skills -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Skills</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${profile.skills.map(skill => `
                      <span style="background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">${skill}</span>
                    `).join('')}
                  </div>
                </div>
                
                <!-- Projects -->
                ${profile.projects && profile.projects.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Key Projects</h3>
                  ${profile.projects.map(project => `
                    <div style="margin-bottom: 12px;">
                      <h4 style="margin: 0 0 3px 0; font-size: 13px; font-weight: 700; color: #0f172a;">${project.title}</h4>
                      <div style="color: #64748b; font-size: 11px; font-weight: 600; margin-bottom: 4px; font-style: italic;">${project.techStack}</div>
                      <p style="font-size: 11.5px; line-height: 1.4; margin: 0; color: #475569;">${project.description}</p>
                    </div>
                  `).join('')}
                </div>` : ''}
                
                <!-- Certifications -->
                ${profile.certifications && profile.certifications.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Certifications</h3>
                  ${profile.certifications.map(cert => `
                    <div style="margin-bottom: 10px; text-align: left;">
                      <h4 style="margin: 0; font-size: 12.5px; font-weight: 700; color: #0f172a;">${cert.name}</h4>
                      <div style="color: #64748b; font-size: 10.5px;">
                        ${cert.startDate ? formatCertDate(cert.startDate) : ''} 
                        ${cert.endDate ? ` - ${formatCertDate(cert.endDate)}` : ''}
                      </div>
                      ${cert.description ? `<p style="font-size: 11px; margin: 2px 0 0 0; color: #475569;">${cert.description}</p>` : ''}
                    </div>
                  `).join('')}
                </div>` : ''}

                <!-- Social Links -->
                ${profile.socialMediaLinks && profile.socialMediaLinks.length > 0 ? `
                <div>
                  <h3 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Social Media</h3>
                  <div style="display: flex; flex-direction: column; gap: 5px;">
                    ${profile.socialMediaLinks.map(link => `
                      <a href="${link.profileUrl}" target="_blank" style="font-size: 12px; color: #4f46e5; text-decoration: none; font-weight: 600;">
                        ${link.platform === 'LINKEDIN' ? '🔗 LinkedIn' : '🐙 GitHub'}
                      </a>
                    `).join('')}
                  </div>
                </div>` : ''}
              </div>
            </div>
          </div>
        `
        
      case 'creative':
        return `
          <div style="font-family: 'Inter', sans-serif; max-width: 794px; margin: 0 auto; color: #1e1b4b; padding: 10px;">
            <!-- Premium Banner -->
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: white; padding: 30px; border-radius: 14px; margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
                <div style="text-align: left;">
                  <span style="background: rgba(255, 255, 255, 0.2); padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Creative Folio</span>
                  <h1 style="font-size: 32px; margin: 8px 0 4px 0; font-weight: 800; letter-spacing: -0.5px;">${profile.fullName}</h1>
                  <h2 style="font-size: 16px; margin: 0 0 12px 0; font-weight: 500; color: #f5f3ff;">${profile.headline}</h2>
                  <div style="display: flex; gap: 15px; font-size: 12px; flex-wrap: wrap;">
                    <span>📧 ${profile.email}</span>
                    ${profile.mobileNumber ? `<span>📱 ${profile.mobileNumber}</span>` : ''}
                  </div>
                </div>
                ${profile.pictureUrl ? `
                <div>
                  <img src="${profile.pictureUrl}" alt="${profile.fullName}" style="width: 90px; height: 90px; border-radius: 20px; border: 3px solid white; object-fit: cover;">
                </div>` : ''}
              </div>
            </div>
            
            <!-- Summary -->
            <div style="margin-bottom: 22px; background: #faf5ff; padding: 16px; border-radius: 10px; border-left: 4px solid #7c3aed; text-align: left;">
              <h3 style="color: #7c3aed; margin: 0 0 6px 0; font-size: 14px; font-weight: 800; text-transform: uppercase;">About Me</h3>
              <p style="line-height: 1.5; font-size: 12.5px; margin: 0; color: #3730a3;">${profile.summary}</p>
            </div>
            
            <div style="display: flex; gap: 25px; text-align: left;">
              <!-- Left Column -->
              <div style="flex: 1.5;">
                <!-- Experience -->
                ${profile.experience && profile.experience.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #db2777; margin: 0 0 15px 0; font-size: 15px; font-weight: 800; text-transform: uppercase;">Career Path</h3>
                  ${profile.experience.map(exp => `
                    <div style="margin-bottom: 18px; position: relative; padding-left: 14px; border-left: 2px solid #f472b6;">
                      <div style="position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #db2777;"></div>
                      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
                        <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: #1e1b4b;">${exp.jobTitle}</h4>
                        <span style="color: #6b7280; font-size: 11px; font-weight: 600;">${formatDate(exp.startMonth, exp.startYear)} - ${formatDate(exp.endMonth, exp.endYear)}</span>
                      </div>
                      <div style="color: #7c3aed; font-size: 12px; font-weight: 700; margin-bottom: 5px;">${exp.company} &bull; ${exp.location}</div>
                      <p style="font-size: 12px; line-height: 1.5; margin: 0; color: #4b5563;">${exp.description}</p>
                    </div>
                  `).join('')}
                </div>` : ''}
                
                <!-- Education -->
                ${profile.education && profile.education.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #db2777; margin: 0 0 15px 0; font-size: 15px; font-weight: 800; text-transform: uppercase;">Academic Foundation</h3>
                  ${profile.education.map(edu => `
                    <div style="margin-bottom: 15px; padding-left: 14px; border-left: 2px solid #c084fc; position: relative;">
                      <div style="position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #7c3aed;"></div>
                      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3px;">
                        <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: #1e1b4b;">${edu.degree}</h4>
                        <span style="color: #6b7280; font-size: 11px; font-weight: 600;">${edu.startYear} - ${edu.endYear}</span>
                      </div>
                      <div style="color: #4b5563; font-size: 12px; font-weight: 600;">${edu.institution} &bull; <strong style="color: #db2777;">CGPA: ${edu.cgpa}</strong></div>
                    </div>
                  `).join('')}
                </div>` : ''}
              </div>
              
              <!-- Right Column (Sidebar) -->
              <div style="flex: 1; background: #faf5ff; padding: 18px; border-radius: 12px;">
                <!-- Skills -->
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #7c3aed; margin: 0 0 12px 0; font-size: 13px; font-weight: 800; text-transform: uppercase;">Skills</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                    ${profile.skills.map(skill => `
                      <span style="background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%); color: #701a75; padding: 4px 10px; border-radius: 10px; font-size: 10.5px; font-weight: 700; border: 1px solid #f3d8f4;">${skill}</span>
                    `).join('')}
                  </div>
                </div>
                
                <!-- Projects -->
                ${profile.projects && profile.projects.length > 0 ? `
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #7c3aed; margin: 0 0 12px 0; font-size: 13px; font-weight: 800; text-transform: uppercase;">Projects</h3>
                  ${profile.projects.map(project => `
                    <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                      <h4 style="margin: 0 0 3px 0; font-size: 12px; font-weight: 800; color: #1e1b4b;">${project.title}</h4>
                      <div style="color: #db2777; font-size: 10.5px; font-weight: 700; margin-bottom: 4px;">${project.techStack}</div>
                      <p style="font-size: 11px; line-height: 1.4; margin: 0; color: #4b5563;">${project.description}</p>
                    </div>
                  `).join('')}
                </div>` : ''}
                
                <!-- Certifications -->
                ${profile.certifications && profile.certifications.length > 0 ? `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #7c3aed; margin: 0 0 12px 0; font-size: 13px; font-weight: 800; text-transform: uppercase;">Accreditations</h3>
                  ${profile.certifications.map(cert => `
                    <div style="margin-bottom: 10px;">
                      <h4 style="margin: 0; font-size: 12px; font-weight: 700; color: #1e1b4b;">${cert.name}</h4>
                      <div style="color: #db2777; font-size: 9.5px; font-weight: 600;">
                        ${cert.startDate ? formatCertDate(cert.startDate) : ''}
                        ${cert.endDate ? ` - ${formatCertDate(cert.endDate)}` : ''}
                      </div>
                      ${cert.description ? `<p style="font-size: 10.5px; margin: 2px 0 0 0; color: #4b5563;">${cert.description}</p>` : ''}
                    </div>
                  `).join('')}
                </div>` : ''}
              </div>
            </div>
          </div>
        `
        
      case 'academic':
        return `
          <div style="font-family: 'Georgia', 'Times New Roman', serif; max-width: 794px; margin: 0 auto; color: #111111; padding: 30px 20px; line-height: 1.5; text-align: left;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="font-size: 26px; font-weight: normal; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: 0.5px;">${profile.fullName}</h1>
              <h2 style="font-size: 14px; font-style: italic; font-weight: normal; color: #555555; margin: 0 0 15px 0;">${profile.headline}</h2>
              <div style="border-top: 1.5px solid #222222; border-bottom: 1.5px solid #222222; padding: 6px 0; font-size: 11.5px; display: flex; justify-content: center; gap: 20px; text-transform: uppercase;">
                <span>Email: ${profile.email}</span>
                ${profile.mobileNumber ? `<span>Phone: ${profile.mobileNumber}</span>` : ''}
              </div>
            </div>
            
            <!-- Summary -->
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: 13.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #222222; padding-bottom: 2px; margin: 0 0 8px 0;">Professional Statement</h3>
              <p style="font-size: 12.5px; margin: 0; line-height: 1.55; text-align: justify; color: #222;">${profile.summary}</p>
            </div>
            
            <!-- Education -->
            ${profile.education && profile.education.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: 13.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #222222; padding-bottom: 2px; margin: 0 0 12px 0;">Education</h3>
              ${profile.education.map(edu => `
                <div style="margin-bottom: 10px; font-size: 12.5px;">
                  <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 1px;">
                    <span>${edu.institution}</span>
                    <span>${edu.startYear} &ndash; ${edu.endYear}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-style: italic; color: #444;">
                    <span>${edu.degree} in ${edu.fieldOfStudy}</span>
                    ${edu.cgpa ? `<span>CGPA: ${edu.cgpa}</span>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Experience -->
            ${profile.experience && profile.experience.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: 13.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #222222; padding-bottom: 2px; margin: 0 0 12px 0;">Academic & Professional Experience</h3>
              ${profile.experience.map(exp => `
                <div style="margin-bottom: 12px; font-size: 12.5px;">
                  <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 1px;">
                    <span>${exp.company}${exp.location ? `, ${exp.location}` : ''}</span>
                    <span>${formatDate(exp.startMonth, exp.startYear)} &ndash; ${formatDate(exp.endMonth, exp.endYear)}</span>
                  </div>
                  <div style="font-style: italic; margin-bottom: 3px; color: #444;">${exp.jobTitle}</div>
                  <p style="margin: 0; line-height: 1.45; text-align: justify; color: #333;">${exp.description}</p>
                </div>
              `).join('')}
            </div>` : ''}
            
            <!-- Projects -->
            ${profile.projects && profile.projects.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: 13.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #222222; padding-bottom: 2px; margin: 0 0 12px 0;">Selected Projects</h3>
              ${profile.projects.map(project => `
                <div style="margin-bottom: 10px; font-size: 12.5px;">
                  <div style="font-weight: bold; margin-bottom: 1px;">${project.title} &bull; <span style="font-weight: normal; font-style: italic; font-size: 11.5px;">${project.techStack}</span></div>
                  <p style="margin: 0; line-height: 1.4; text-align: justify; color: #333;">${project.description}</p>
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Certifications -->
            ${profile.certifications && profile.certifications.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <h3 style="font-size: 13.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #222222; padding-bottom: 2px; margin: 0 0 12px 0;">Certifications</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
                ${profile.certifications.map(cert => `
                  <tr style="vertical-align: top;">
                    <td style="padding: 2px 0; font-weight: bold; width: 70%;">${cert.name}</td>
                    <td style="padding: 2px 0; text-align: right; color: #555555;">
                      ${cert.startDate ? formatCertDate(cert.startDate) : ''}
                      ${cert.endDate ? ` &ndash; ${formatCertDate(cert.endDate)}` : ''}
                    </td>
                  </tr>
                  ${cert.description ? `<tr><td colspan="2" style="font-size: 11.5px; color: #444444; padding-bottom: 4px;">${cert.description}</td></tr>` : ''}
                `).join('')}
              </table>
            </div>` : ''}

            <!-- Skills -->
            <div>
              <h3 style="font-size: 13.5px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #222222; padding-bottom: 2px; margin: 0 0 8px 0;">Skills</h3>
              <p style="font-size: 12.5px; margin: 0; line-height: 1.4; color: #333;">
                ${profile.skills.join(', ')}
              </p>
            </div>
          </div>
        `
        
      case 'minimalist':
        return `
          <div style="font-family: Arial, sans-serif; max-width: 794px; margin: 0 auto; color: #2d3748; padding: 30px; line-height: 1.55; text-align: left;">
            <!-- Header -->
            <div style="margin-bottom: 25px;">
              <h1 style="font-size: 28px; font-weight: 300; color: #1a202c; letter-spacing: 0.5px; margin: 0 0 4px 0;">${profile.fullName}</h1>
              <div style="font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">${profile.headline}</div>
              <div style="font-size: 11.5px; color: #718096; display: flex; gap: 15px; flex-wrap: wrap;">
                <span>${profile.email}</span>
                ${profile.mobileNumber ? `<span>&bull; ${profile.mobileNumber}</span>` : ''}
              </div>
            </div>

            <!-- Summary -->
            <div style="margin-bottom: 22px;">
              <p style="margin: 0; font-size: 12.5px; color: #4a5568;">${profile.summary}</p>
            </div>

            <!-- Experience -->
            ${profile.experience && profile.experience.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Experience</div>
              ${profile.experience.map(exp => `
                <div style="margin-bottom: 14px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1a202c;">
                    <span>${exp.jobTitle} &bull; <span style="font-weight: 400; color: #4a5568;">${exp.company}</span></span>
                    <span style="font-weight: 400; color: #718096; font-size: 11px;">${formatDate(exp.startMonth, exp.startYear)} &ndash; ${formatDate(exp.endMonth, exp.endYear)}</span>
                  </div>
                  <p style="margin: 3px 0 0 0; font-size: 12px; color: #4a5568; line-height: 1.45;">${exp.description}</p>
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Education -->
            ${profile.education && profile.education.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Education</div>
              ${profile.education.map(edu => `
                <div style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; color: #1a202c;">
                    <span>${edu.degree} &bull; <span style="font-weight: 400; color: #4a5568;">${edu.fieldOfStudy}</span></span>
                    <span style="font-weight: 400; color: #718096; font-size: 11px;">${edu.startYear} &ndash; ${edu.endYear}</span>
                  </div>
                  <div style="font-size: 11.5px; color: #718096; margin-top: 1px;">${edu.institution} ${edu.cgpa ? `&bull; CGPA: ${edu.cgpa}` : ''}</div>
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Projects -->
            ${profile.projects && profile.projects.length > 0 ? `
            <div style="margin-bottom: 22px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">Projects</div>
              ${profile.projects.map(project => `
                <div style="margin-bottom: 10px; font-size: 12px;">
                  <div style="font-weight: 600; color: #1a202c; margin-bottom: 1px;">${project.title} &bull; <span style="font-weight: 400; color: #718096; font-size: 11px;">${project.techStack}</span></div>
                  <p style="margin: 0; color: #4a5568; line-height: 1.4;">${project.description}</p>
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Certifications & Skills Grid -->
            <div style="display: flex; gap: 30px; font-size: 12px; margin-top: 15px;">
              <div style="flex: 1.2;">
                <div style="font-size: 11px; font-weight: 700; color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Certifications</div>
                ${profile.certifications && profile.certifications.length > 0 ? profile.certifications.map(cert => `
                  <div style="margin-bottom: 8px;">
                    <div style="font-weight: 600; color: #1a202c;">${cert.name}</div>
                    <div style="font-size: 11px; color: #718096;">
                      ${cert.startDate ? formatCertDate(cert.startDate) : ''}
                      ${cert.endDate ? ` &ndash; ${formatCertDate(cert.endDate)}` : ''}
                    </div>
                  </div>
                `).join('') : '<div style="color: #a0aec0; font-style: italic;">No certifications listed.</div>'}
              </div>

              <div style="flex: 0.8;">
                <div style="font-size: 11px; font-weight: 700; color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Skills</div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                  ${profile.skills.map(skill => `
                    <span style="border: 1px solid #cbd5e0; color: #4a5568; padding: 2px 7px; border-radius: 4px; font-size: 10.5px;">${skill}</span>
                  `).join('')}
                </div>
              </div>
          </div>
        `
      default:
        return '';
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading profile and templates...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl m-6">
          <h2 className="text-2xl font-black text-slate-800">Unable to load profile data</h2>
          <p className="text-slate-500 mt-2 font-medium">Please ensure your portfolio profile is set up correctly in the "My Portfolio" tab.</p>
        </div>
      </DashboardLayout>
    )
  }

  const isProfileComplete = 
    profile.fullName &&
    profile.headline &&
    profile.summary &&
    profile.skills?.length > 0 &&
    profile.education?.length > 0 &&
    (profile.isFresher || profile.experience?.length > 0);

  return (
    <DashboardLayout containerClassName="w-full space-y-8 flex flex-col bg-transparent animate-fadeIn">
        {!isProfileComplete && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <h3 className="text-amber-800 font-bold text-sm">Your profile is incomplete!</h3>
              <p className="text-amber-700 text-xs mt-0.5">Please add your full name, headline, summary, education, skills, and experience (if applicable) in "My Portfolio" to complete your resume.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden border border-slate-800 text-left">
          <div className="absolute -top-[10%] -left-[10%] w-[200px] h-[200px] rounded-full bg-[#6C63FF]/10 blur-[50px] pointer-events-none"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-[#6C63FF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#6C63FF]/30">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Student Resume Builder</h1>
                <p className="text-xs text-slate-400 font-semibold mt-1">Export your structured academic & work milestones to ATS-compliant templates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Premium Resume Showcase Grid */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm mb-8 text-left">
          <div className="flex items-center mb-6">
            <FileCheck className="w-6 h-6 text-[#6C63FF] mr-2.5" />
            <div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">Premium Resume Templates</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Select a layout to preview in real-time or download as a PDF.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resumeTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative border border-slate-200 hover:border-[#6C63FF] bg-slate-50/50 hover:bg-white rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#6C63FF]/5 text-[#6C63FF] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                    {template.thumbnail}
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{template.name}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{template.description}</p>
                </div>

                <div className="mt-5 flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 py-2 px-3 border border-slate-200 hover:border-[#6C63FF] text-slate-600 hover:text-[#6C63FF] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer bg-white"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => generateResumePDF(template)}
                    disabled={generatingPDF}
                    className="flex-1 py-2 px-3 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-[#6C63FF]/10"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Left Column - Profile Details Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header info */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {profile.pictureUrl ? (
                  <img
                    src={profile.pictureUrl}
                    alt={profile.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-indigo-50 text-[#6C63FF] rounded-2xl flex items-center justify-center text-3xl font-black">
                    {profile?.fullName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-black text-slate-800">{profile.fullName}</h2>
                  <p className="text-[#6C63FF] text-xs font-bold tracking-wider mt-0.5 uppercase">{profile.headline}</p>
                  <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">{profile.summary}</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-xs text-slate-500 font-semibold">
                      <Mail className="w-4 h-4 mr-2 text-[#6C63FF]" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.mobileNumber && (
                      <div className="flex items-center text-xs text-slate-500 font-semibold">
                        <Phone className="w-4 h-4 mr-2 text-[#6C63FF]" />
                        <span>{profile.mobileNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-slate-500 font-semibold">
                      <Award className="w-4 h-4 mr-2 text-[#6C63FF]" />
                      <span>{profile.isFresher ? 'Entry-Level Candidate' : 'Experienced Professional'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center mb-5 pb-3 border-b border-slate-100">
                <GraduationCap className="w-5.5 h-5.5 text-[#6C63FF] mr-2.5" />
                <h3 className="text-base font-black text-slate-800">Education Details</h3>
              </div>
              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div key={index} className="pl-4 border-l-4 border-[#6C63FF] py-0.5">
                      <h4 className="font-bold text-slate-800 text-sm">{edu.degree} in {edu.fieldOfStudy}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{edu.institution}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">
                        {edu.startYear} - {edu.endYear} {edu.cgpa ? `• CGPA/Percent: ${edu.cgpa}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-semibold italic">No education records added.</p>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center mb-5 pb-3 border-b border-slate-100">
                <Briefcase className="w-5.5 h-5.5 text-[#6C63FF] mr-2.5" />
                <h3 className="text-base font-black text-slate-800">Professional Experience</h3>
              </div>
              {profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-5">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="pl-4 border-l-4 border-emerald-500 py-0.5">
                      <h4 className="font-bold text-slate-800 text-sm">{exp.jobTitle}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1">
                        {formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear)}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-semibold italic">No experience records added.</p>
              )}
            </div>

            {/* Skills & Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center mb-5 pb-3 border-b border-slate-100">
                  <Code className="w-5.5 h-5.5 text-[#6C63FF] mr-2.5" />
                  <h3 className="text-base font-black text-slate-800">Skills</h3>
                </div>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#6C63FF] rounded-xl text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold italic">No skills listed.</p>
                )}
              </div>

              {/* Projects */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center mb-5 pb-3 border-b border-slate-100">
                  <Globe className="w-5.5 h-5.5 text-[#6C63FF] mr-2.5" />
                  <h3 className="text-base font-black text-slate-800">Projects</h3>
                </div>
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="space-y-4">
                    {profile.projects.map((project, index) => (
                      <div key={index} className="border border-slate-100 rounded-2xl p-4 hover:border-indigo-100 transition-colors">
                        <h4 className="font-bold text-slate-800 text-xs">{project.title}</h4>
                        <p className="text-[10px] text-indigo-500 font-bold mt-0.5">{project.techStack}</p>
                        <p className="text-[11px] text-slate-400 font-semibold mt-2 line-clamp-2 leading-relaxed">{project.description}</p>
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-[#6C63FF] font-bold mt-3 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-semibold italic">No projects listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Social Links & Instructions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Social Links Card */}
            {profile.socialMediaLinks && profile.socialMediaLinks.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-black text-slate-800 mb-4">Linked Accounts</h3>
                <div className="space-y-3">
                  {profile.socialMediaLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center">
                        {link.platform === 'LINKEDIN' ? (
                          <Linkedin className="w-5 h-5 text-blue-700 mr-2.5" />
                        ) : (
                          <Github className="w-5 h-5 text-slate-800 mr-2.5" />
                        )}
                        <span className="font-bold text-slate-700 text-xs">{link.platform}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#6C63FF] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Instruction Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100/50 p-6 shadow-sm text-left">
              <h3 className="text-base font-black text-slate-800 mb-2.5 flex items-center gap-1.5">
                <span>💡</span> Resume Tips
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-500 font-semibold">
                <li className="flex gap-2">
                  <span className="text-[#6C63FF]">•</span>
                  <span><strong>ATS Compliance</strong>: Standard linear templates (Minimalist, Academic) achieve the highest readability on automated applicant tracking systems.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#6C63FF]">•</span>
                  <span><strong>Keep it updated</strong>: Add milestones, new skills, and certifications in the Profile tab to automatically reflect them here.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#6C63FF]">•</span>
                  <span><strong>Action verbs</strong>: Describe your work experience tasks using strong action verbs (e.g. Developed, Led, Architected).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      {/* Interactive Fullscreen Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 text-left">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Resume Preview: {previewTemplate.name}</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">This represents the compiled layout. Download to get the full A4 PDF.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateResumePDF(previewTemplate)}
                  disabled={generatingPDF}
                  className="px-4 py-2 bg-[#6C63FF] hover:bg-[#5b52e6] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-[#6C63FF]/20 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {generatingPDF ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </>
                  )}
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/50 flex justify-center">
              <div className="w-full max-w-[800px] my-auto">
                {/* Simulated A4 Page */}
                <div 
                  className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-slate-200/60 overflow-hidden mx-auto"
                  style={{ minHeight: '850px' }}
                  dangerouslySetInnerHTML={{ __html: generateResumeHTML(previewTemplate.style) }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentProfileBuilder