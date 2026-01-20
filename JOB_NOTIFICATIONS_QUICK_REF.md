# Job Notifications Module - Quick Reference

## 📁 File Locations

```
src/
├── api/jobNotifications.js                    ← API Services
├── admin/pages/
│   ├── JobNotifications.js                    ← List Page
│   ├── JobNotificationForm.js                 ← Create/Edit
│   └── JobNotificationDetail.js               ← View Details
└── App.js                                     ← Routes
```

## 🌐 URLs

| URL | Component | Action |
|-----|-----------|--------|
| `/admin/job-notifications` | JobNotifications.js | List all jobs |
| `/admin/job-notifications/create` | JobNotificationForm.js | Create new |
| `/admin/job-notifications/123` | JobNotificationDetail.js | View details |
| `/admin/job-notifications/123/edit` | JobNotificationForm.js | Edit job |

## 🔌 API Endpoints

```bash
GET    /api/job-notifications              # List all
GET    /api/job-notifications/{id}         # Get by ID
POST   /api/job-notifications              # Create
PUT    /api/job-notifications/{id}         # Update
DELETE /api/job-notifications/{id}         # Delete
```

## 📦 API Request Payload

```javascript
{
  jobTitle: "string (required)",
  companyName: "string (required)",
  jobDescription: "string (required)",
  jobLink: "string (optional, URL)",
  requiredSkills: "string (comma-separated)",
  requirements: "string",
  location: "string",
  employmentType: "Full-Time|Part-Time|Internship|Contract|Freelance",
  experienceRequired: "number (years)",
  applicationDeadline: "ISO datetime string",
  isActive: "boolean"
}
```

## 🎯 Main Features

### Listing Page
```
✅ Search in real-time
✅ Filter by status
✅ View statistics
✅ Quick actions (View/Edit/Delete)
✅ Responsive table
✅ Deadline tracking
```

### Form Page
```
✅ Create new jobs
✅ Edit existing jobs
✅ 11 editable fields
✅ Form validation
✅ Error messages
✅ Loading states
```

### Detail Page
```
✅ Full job view
✅ Professional layout
✅ Edit/Delete buttons
✅ Deadline indicator
✅ External links
✅ Metadata display
```

## 🎨 UI Components Used

- **Icons**: react-bootstrap-icons
  - `Eye` - View detail
  - `Edit` - Edit job
  - `Trash2` - Delete
  - `MapPin` - Location
  - `Briefcase` - Job type
  - `Calendar` - Deadline
  - `Badge` - Status
  - `Plus` - Create
  - `Search` - Search
  - `ArrowLeft` - Back
  - `Clock` - Expired

- **Forms**: Native HTML5
- **Layout**: Tailwind CSS
- **Routing**: React Router v6

## 📊 Database Fields

| Field | Type | Size | Required | Notes |
|-------|------|------|----------|-------|
| id | Integer | - | Yes | Auto-generated |
| jobTitle | String | 150 | Yes | Job position name |
| companyName | String | 150 | Yes | Company name |
| jobDescription | Text | - | Yes | Full description |
| jobLink | String | 500 | No | External URL |
| requiredSkills | Text | - | No | Comma-separated |
| requirements | Text | - | No | Job requirements |
| location | String | 100 | No | Job location |
| employmentType | String | 50 | No | Job type |
| experienceRequired | Integer | - | No | Years required |
| applicationDeadline | DateTime | - | No | Application close |
| isActive | Boolean | - | No | Visibility flag |
| createdAt | DateTime | - | Auto | Creation timestamp |
| updatedAt | DateTime | - | Auto | Update timestamp |

## 🔄 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Unauthorized |
| 404 | Not found |
| 500 | Server error |

## 🛠️ Common Tasks

### Add a new job
```bash
1. Navigate to /admin/job-notifications
2. Click "Create Job"
3. Fill form
4. Click "Create Job"
```

### Edit a job
```bash
1. Find job in list
2. Click Edit icon
3. Update fields
4. Click "Update Job"
```

### Delete a job
```bash
1. Click Delete icon
2. Confirm deletion
3. Job removed
```

### Search jobs
```bash
1. Type in search box
2. Results filter automatically
3. Search across title, company, location
```

### Filter by status
```bash
1. Use status dropdown
2. Select: All | Active | Inactive
3. List updates
```

## 📱 Responsive Behavior

| Screen | Behavior |
|--------|----------|
| Mobile | Single column, stacked form, cards |
| Tablet | 2 columns, horizontal scroll table |
| Desktop | Full layout, 3-column detail view |

## 🔐 Authentication

- Uses Bearer Token (JWT)
- Auto token refresh on 401
- Protected routes via PrivateRoutes
- Logout on token failure

## ⚠️ Error Handling

```javascript
try {
  // API call
} catch (error) {
  // Show error message
  // Log to console
  // Return null or default value
}
```

## 💾 State Management

| Component | State | Type |
|-----------|-------|------|
| JobNotifications | notifications, loading, searchTerm, filterStatus | Array, Boolean, String |
| JobNotificationForm | formData, loading, submitting, error, success | Object, Boolean, String |
| JobNotificationDetail | job, loading | Object, Boolean |

## 🎯 Key Props

### JobNotifications
- None (uses hooks)

### JobNotificationForm
- id (from URL params)

### JobNotificationDetail
- id (from URL params)

## 📈 Performance Tips

1. Use search debouncing
2. Lazy load job details
3. Memoize components if needed
4. Optimize re-renders
5. Use CSS transitions

## 🐛 Debugging

### Common Issues

**Jobs not loading**
- Check API endpoint
- Verify token is valid
- Check network tab
- Look at console errors

**Form not submitting**
- Validate all required fields
- Check form data structure
- Verify API endpoint
- Check for validation errors

**Search not working**
- Ensure search field is focused
- Check search term value
- Verify list has data
- Clear browser cache

## 📞 API Response Format

### Success Response
```json
{
  "success": true,
  "status": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-01-20T10:30:00"
}
```

### Error Response
```json
{
  "success": false,
  "status": 400,
  "message": "Error description",
  "errors": [ ... ],
  "timestamp": "2026-01-20T10:30:00"
}
```

## 🎓 Learning Resources

- React Hooks: useState, useEffect
- React Router: useParams, useNavigate
- Axios: interceptors, error handling
- Tailwind CSS: responsive utilities
- Bootstrap Icons: icon library

## ✅ Checklist

Before deployment:
- ✅ Test all CRUD operations
- ✅ Verify responsive design
- ✅ Check API endpoints
- ✅ Test error handling
- ✅ Verify authentication
- ✅ Test on mobile devices
- ✅ Check console for warnings
- ✅ Verify accessibility
- ✅ Test with sample data
- ✅ Review documentation

---

**Last Updated**: January 20, 2026  
**Module Version**: 1.0  
**Status**: Production Ready
