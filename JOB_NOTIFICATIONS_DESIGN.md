# Job Notifications Admin Module - Visual Reference & Features

## 🎯 Module Overview

A complete job notification management system for ByteBodh admin dashboard with professional UI/UX design.

---

## 📄 Page 1: Job Notifications Listing

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    HEADER SECTION                        │
│  Job Notifications | "Manage and post job opportunities" │
│                                  [+ Create Job]          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             FILTERS & SEARCH SECTION                     │
│  [🔍 Search by job title, company, location...] [Status]│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  STATISTICS CARDS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Total Jobs   │  │ Active       │  │ Inactive     │   │
│  │      15      │  │      10      │  │      5       │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   DATA TABLE                             │
│ ┌──────────┬──────────┬──────────┬──────┬──────┬──────┐ │
│ │Job Title │ Company  │Location  │Type  │Dead  │Status│ │
│ ├──────────┼──────────┼──────────┼──────┼──────┼──────┤ │
│ │React Dev │TechCorp  │Bangalore │FT    │Feb20 │Active│ │
│ │ [👁Edit🗑] │
│ ├──────────┼──────────┼──────────┼──────┼──────┼──────┤ │
│ │Java Dev  │CodeWorks │Remote    │PT    │Mar10 │Inactive
│ │ [👁Edit🗑] │
│ └──────────┴──────────┴──────────┴──────┴──────┴──────┘ │
└─────────────────────────────────────────────────────────┘
```

### Features:
- ✅ Real-time search across 3 fields
- ✅ Filter by Active/Inactive/All
- ✅ Statistics at a glance
- ✅ 7-column data table
- ✅ Quick action buttons
- ✅ Responsive grid on mobile
- ✅ Loading spinner animation
- ✅ Empty state message

### Color Scheme:
- Active Jobs: 🟢 Green badge
- Inactive Jobs: 🔴 Red badge
- Expired Deadline: 🔴 Red text
- Type Badge: 🔵 Blue background

---

## 📝 Page 2: Create/Edit Job Form

### Form Structure
```
┌─────────────────────────────────────────────────────────┐
│  [← Back]  Create New Job Notification                  │
│            "Fill in the job details to create one"       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   FORM SECTION                           │
│                                                          │
│  Basic Information                                       │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Job Title * [________________________] │  Company * │
│  │ [____________________]                               ││
│  ├──────────────────┬──────────────────┐                │
│  │ Location         │ Employment Type  │                │
│  │ [____________]   │ [Full-Time ▼]   │                │
│  ├──────────────────┬──────────────────┐                │
│  │ Experience       │ Deadline         │                │
│  │ [__] years       │ [Date Picker]    │                │
│  └──────────────────┴──────────────────┘                │
│                                                          │
│  Job Details                                             │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Job Description * (required)                         ││
│  │ [                                                    ]││
│  │ [                                                    ]││
│  │ [                                                    ]││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Required Skills (comma-separated)                    ││
│  │ [React, JavaScript, REST APIs, PostgreSQL]           ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Requirements                                         ││
│  │ [                                                    ]││
│  │ [                                                    ]││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  Additional Info                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Job Link                                             ││
│  │ [https://example.com/jobs/123]                       ││
│  │                                                      ││
│  │ ☑ Mark as Active                                    ││
│  │ "Active jobs will be visible to students"            ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  [Cancel]  [Create Job]                                │
└─────────────────────────────────────────────────────────┘
```

### Form Fields:
1. **Job Title** (Required) - Text input
2. **Company Name** (Required) - Text input
3. **Location** - Text input
4. **Employment Type** (Required) - Dropdown
   - Full-Time
   - Part-Time
   - Internship
   - Contract
   - Freelance
5. **Experience Required** - Number input (years)
6. **Application Deadline** - Date picker
7. **Job Description** (Required) - Text area
8. **Required Skills** - Text area (comma-separated)
9. **Requirements** - Text area
10. **Job Link** - URL input
11. **Active Status** - Toggle checkbox

### Validation:
- Required fields marked with *
- Email-style URL validation
- Number validation for experience
- Form submission prevention on errors

---

## 📋 Page 3: Job Detail View

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  [← Back]  Job Details                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              JOB HEADER CARD                            │
│  Senior React Developer                    [Status: Active]
│  TechCorp Inc.                                           │
│                                                          │
│  ┌──────────┬──────────┬──────────┬──────────┐          │
│  │Full-Time │3 years   │Bangalore │Jan 20   │          │
│  └──────────┴──────────┴──────────┴──────────┘          │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────┐
│   MAIN CONTENT (2/3 width)   │  SIDEBAR (1/3 width)     │
│                              │                          │
│ Job Description              │  ┌──────────────────┐    │
│ ┌────────────────────────┐   │  │ QUICK ACTIONS    │    │
│ │ We are seeking a       │   │  │ ┌──────────────┐ │    │
│ │ talented React         │   │  │ │ [✏ Edit Job] │ │    │
│ │ Developer to join our  │   │  │ ├──────────────┤ │    │
│ │ engineering team...    │   │  │ │ [🗑 Delete]  │ │    │
│ │                        │   │  │ └──────────────┘ │    │
│ │ Responsibilities:      │   │  └──────────────────┘    │
│ │ • Design React apps    │   │                          │
│ │ • Optimize performance │   │  DEADLINE                │
│ │ • Write unit tests     │   │  ┌──────────────────┐    │
│ │                        │   │  │ Feb 20, 2026     │    │
│ └────────────────────────┘   │  │ 4:30 PM          │    │
│                              │  │ ✓ Active         │    │
│ Required Skills              │  └──────────────────┘    │
│ ┌────────────────────────┐   │                          │
│ │ [React] [JavaScript]   │   │  JOB LINK                │
│ │ [REST APIs] [CSS/SCSS] │   │  ┌──────────────────┐    │
│ │ [PostgreSQL] [Docker]  │   │  │ bit.ly/job-123   │    │
│ └────────────────────────┘   │  └──────────────────┘    │
│                              │                          │
│ Requirements                 │  METADATA                │
│ ┌────────────────────────┐   │  ┌──────────────────┐    │
│ │ • Bachelor's degree    │   │  │ ID: 1            │    │
│ │ • 3+ years experience  │   │  │ Created:         │    │
│ │ • Experience with AWS  │   │  │ Jan 20, 2026     │    │
│ │ • Strong communication │   │  │ Last Updated:    │    │
│ └────────────────────────┘   │  │ Jan 20, 2026     │    │
│                              │  └──────────────────┘    │
└──────────────────────────────┴──────────────────────────┘
```

### Sections:
1. **Header Card**: Title, Company, Status, Key Info
2. **Job Description**: Full text with line breaks
3. **Required Skills**: Badge-style display
4. **Requirements**: Bullet points formatted
5. **Quick Actions**: Edit and Delete buttons
6. **Deadline Info**: Shows status and expiration
7. **Job Link**: External link button
8. **Metadata**: Created/Updated timestamps

---

## 🎨 Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Primary Button | Blue #3B82F6 | Create, Edit actions |
| Gradient Button | Blue → Indigo | Main actions |
| Active Status | Green #10B981 | Active jobs |
| Inactive Status | Red #EF4444 | Inactive jobs |
| Employment Type | Blue #3B82F6 | Type badges |
| Deadline Expired | Red #DC2626 | Expiration warning |
| Text Primary | Gray #1F2937 | Main text |
| Text Secondary | Gray #6B7280 | Secondary text |
| Border | Gray #E5E7EB | Dividers |
| Background | Gray #F9FAFB | Page background |
| Card Background | White #FFFFFF | Cards |
| Hover | Gray #F3F4F6 | Hover states |

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Single column layout
- Stacked form fields
- Dropdown filters
- Table converts to cards
- Hamburger menu

### Tablet (640px - 1024px)
- 2-column form
- Table with horizontal scroll
- Side-by-side stats cards

### Desktop (> 1024px)
- Full layout
- Multi-column form
- Full table view
- 3-column detail page

---

## 🔄 User Workflows

### Create Job Workflow
1. Click "Create Job" button → Form page
2. Fill required fields (marked with *)
3. Add optional details
4. Toggle "Active" if ready
5. Click "Create Job"
6. Success message & redirect to list

### Edit Job Workflow
1. Find job in list
2. Click Edit icon
3. Update fields
4. Click "Update Job"
5. Success message & redirect to list

### Delete Job Workflow
1. Find job in list/detail view
2. Click Delete icon
3. Confirm deletion
4. Job removed, redirect to list

### Search/Filter Workflow
1. Enter search term in search box
2. Results filter in real-time
3. Use status filter for additional filtering
4. Results update dynamically

---

## ✨ Interactive Elements

### Buttons
- **Primary**: Blue with gradient on hover
- **Secondary**: Border style with hover fill
- **Danger**: Red with confirmation

### Inputs
- **Text/URL**: Focus ring blue, placeholder text
- **Date Picker**: Calendar icon, native picker
- **Select**: Dropdown with chevron icon
- **Checkbox**: Toggle with label text

### Tables
- **Hover**: Row highlight on hover
- **Icons**: Clickable action buttons
- **Status**: Color-coded badges
- **Scroll**: Horizontal scroll on small screens

### Cards
- **Shadow**: Box-shadow on hover
- **Border**: Subtle border-bottom
- **Padding**: Consistent spacing
- **Transitions**: Smooth color/shadow transitions

---

## 📊 Data Display

### Statistics Cards
- Icon + Label + Number
- Color-coded left border
- Responsive grid layout

### Table Columns
1. Job Title + Experience
2. Company Name
3. Location + Icon
4. Employment Type (Badge)
5. Deadline (Date)
6. Status (Badge)
7. Actions (Icons)

### Detail Sections
- Card-based layout
- Header area
- Content area
- Sidebar area
- Footer area

---

## ⚡ Performance Features

- Lazy loading job details
- Efficient search debouncing
- Minimal re-renders
- Optimized image/icon loading
- CSS transitions for smooth UI

---

## 🔐 Security Indicators

- ✅ Confirmation dialogs for deletion
- ✅ Form validation
- ✅ Protected routes
- ✅ Token-based auth
- ✅ Error handling

---

**Design Version**: 1.0  
**Status**: Production Ready  
**Last Updated**: January 20, 2026
