# Job Notifications Admin Panel - Integration Guide

## Overview

A professional job notification management system has been integrated into the ByteBodh admin dashboard. This module allows administrators to create, edit, view, and delete job postings with full CRUD functionality.

## Features

### 1. **Job Notifications Listing Page**
   - Display all job notifications in a professional table format
   - Real-time search by job title, company name, or location
   - Filter by status (All, Active, Inactive)
   - Statistics cards showing total, active, and inactive jobs
   - Quick actions: View, Edit, Delete
   - Responsive design for mobile and desktop

### 2. **Create/Edit Job Form**
   - Comprehensive form with all job details
   - Fields included:
     - Job Title (required)
     - Company Name (required)
     - Location
     - Employment Type (Full-Time, Part-Time, Internship, Contract, Freelance)
     - Experience Required (years)
     - Application Deadline
     - Job Link
     - Job Description (required)
     - Required Skills
     - Requirements
     - Active Status toggle

### 3. **Job Detail View**
   - Complete job information display
   - Visual indication of deadline expiration
   - Quick action buttons (Edit, Delete)
   - Professional card-based layout
   - Organized sections for description, skills, and requirements

## File Structure

```
src/
├── api/
│   └── jobNotifications.js          # API integration service
├── admin/
│   ├── pages/
│   │   ├── JobNotifications.js       # Listing page
│   │   ├── JobNotificationForm.js    # Create/Edit form
│   │   └── JobNotificationDetail.js  # Detail view page
│   └── Sidebar.js                    # Updated with Job Notifications menu item
└── App.js                            # Routes added
```

## API Endpoints

The following REST API endpoints are used:

```
GET    /api/job-notifications              # Get all job notifications
GET    /api/job-notifications/{id}         # Get single job notification
POST   /api/job-notifications              # Create new job notification
PUT    /api/job-notifications/{id}         # Update job notification
DELETE /api/job-notifications/{id}         # Delete job notification
```

## API Request/Response Format

### Create Job Notification Request
```json
{
  "jobTitle": "Senior React Developer",
  "companyName": "TechCorp Inc.",
  "jobDescription": "We are looking for an experienced React developer...",
  "jobLink": "https://example.com/jobs/123",
  "requiredSkills": "React, JavaScript, REST APIs, PostgreSQL",
  "requirements": "Bachelor's degree, 3+ years experience",
  "location": "Bangalore, India",
  "employmentType": "Full-Time",
  "experienceRequired": 3,
  "applicationDeadline": "2026-02-20T23:59:59",
  "isActive": true
}
```

### Response Format
```json
{
  "success": true,
  "status": 200,
  "message": "Job Notification fetched successfully",
  "data": {
    "id": 1,
    "jobTitle": "Senior React Developer",
    "companyName": "TechCorp Inc.",
    "jobDescription": "...",
    "jobLink": "...",
    "requiredSkills": "...",
    "requirements": "...",
    "location": "Bangalore, India",
    "employmentType": "Full-Time",
    "experienceRequired": 3,
    "applicationDeadline": "2026-02-20T23:59:59",
    "isActive": true,
    "createdAt": "2026-01-20T10:30:00",
    "updatedAt": "2026-01-20T10:30:00"
  },
  "timestamp": "2026-01-20T10:30:00"
}
```

## Routing

The following routes have been added to the application:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin/job-notifications` | JobNotifications.js | List all jobs |
| `/admin/job-notifications/create` | JobNotificationForm.js | Create new job |
| `/admin/job-notifications/{id}` | JobNotificationDetail.js | View job details |
| `/admin/job-notifications/{id}/edit` | JobNotificationForm.js | Edit existing job |

## Features in Detail

### 1. **Listing Page Features**
- **Search Functionality**: Real-time search across job title, company, and location
- **Filter Options**: Filter by Active/Inactive status
- **Statistics Cards**: Display total jobs, active jobs, and inactive jobs
- **Action Buttons**: 
  - Eye icon: View full details
  - Edit icon: Edit the job
  - Trash icon: Delete the job
- **Status Badges**: Visual indicators for job status
- **Deadline Display**: Shows application deadline with expiration warning
- **Employment Type Badge**: Quick visual reference for job type

### 2. **Form Features**
- **Validation**: Required fields are marked and validated
- **Date Picker**: For application deadline selection
- **Status Toggle**: Easy activate/deactivate jobs
- **Success/Error Messages**: User feedback for all operations
- **Auto-redirect**: Returns to list after successful creation/update

### 3. **Detail View Features**
- **Quick Stats**: Display key information in a grid
- **Professional Layout**: Organized sections with clear typography
- **Action Buttons**: Direct access to Edit and Delete
- **Deadline Indicator**: Shows if deadline has expired
- **Job Link**: Direct link to external job posting
- **Timestamp Info**: Shows created and last updated times

## Usage Instructions

### Creating a Job Notification

1. Navigate to **Job Notifications** in the admin sidebar
2. Click **"Create Job"** button
3. Fill in all required fields (marked with *)
4. Optional: Add skills, requirements, and external job link
5. Toggle **"Mark as Active"** if you want students to see it immediately
6. Click **"Create Job"** to save

### Editing a Job Notification

1. Go to **Job Notifications** list
2. Click the **Edit** icon (pencil) on the job row
3. Modify the details as needed
4. Click **"Update Job"** to save changes

### Viewing Job Details

1. In the list, click the **View** icon (eye) on any job
2. Review complete details in the organized layout
3. Use action buttons to Edit or Delete

### Deleting a Job Notification

1. Click the **Delete** icon (trash) on any job in the list
2. Confirm the deletion when prompted
3. The job will be permanently removed

## Styling & Design

- **Color Scheme**: Blue/Indigo gradients for primary actions
- **Responsive**: Fully mobile-optimized with breakpoints
- **Icons**: Bootstrap Icons for professional appearance
- **Cards**: Clean, shadow-based card layout
- **Transitions**: Smooth hover effects and state transitions
- **Status Colors**:
  - Active: Green
  - Inactive: Red
  - Employment Type: Blue
  - Deadline: Gray (Red if expired)

## Dependencies

Required npm packages:
- `react-router-dom`: For routing
- `react-bootstrap-icons`: For icons (Eye, Edit, Trash2, MapPin, Briefcase, etc.)
- `axios`: For API calls
- `react-toastify`: For notifications (optional)

## Error Handling

- API errors are caught and displayed to users
- Invalid form submissions are prevented
- Confirmation dialogs for destructive actions (delete)
- Loading states during API calls
- Clear error messages for debugging

## Future Enhancements

Potential improvements for future versions:
- Bulk actions (select multiple jobs)
- Export job listings to CSV/PDF
- Job statistics and analytics dashboard
- Email notifications when deadline is near
- Student application tracking
- Advanced filters (by skills, experience, company)
- Job template system for quick posting
- Automated job listing from external sources
- Student interest/bookmark system

## Technical Details

### State Management
- Uses React hooks (useState, useEffect)
- Local component state for forms
- API integration via axios

### Error Handling
- Try-catch blocks in all API calls
- User-friendly error messages
- Confirmation dialogs for destructive actions

### Performance
- Lazy loading of job details
- Efficient search filtering
- Optimized re-renders

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify API endpoints are accessible
3. Ensure authentication token is valid
4. Check network requests in browser DevTools

---

**Version**: 1.0
**Last Updated**: January 20, 2026
**Status**: Production Ready
