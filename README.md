<<<<<<< HEAD
# 🤝 HELPLINK

> Community-powered PWA connecting help seekers with volunteers in real-time across 10 humanitarian categories.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [Help Categories](#-help-categories)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Security](#-security)

## 🌟 Overview

- 🔒 **Verified Requests** - Admin verification system for authenticity
- 📱 **Mobile-First PWA** - Works offline and installable on any device
- 🎯 **Category-Based** - 10 specialized help categories
- ⚡ **Urgency Levels** - Priority-based request handling

- Create detailed help requests with images
- Choose from 10 specialized categories
- Set urgency levels (Normal, Urgent, Critical)
- Track request status in real-time
- Communicate directly with helpers via messaging

### For Helpers/Volunteers
- Browse open help requests by category

# 🤝 HELPLINK

> Community-powered PWA connecting help seekers with volunteers in real-time across 10 humanitarian categories.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [User Roles](#-user-roles)
- [Help Categories](#-help-categories)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Security](#-security)
- [Contributing](#-contributing)

---

## 🌟 Overview

**HELPLINK** is a Progressive Web Application designed to bridge the gap between people in need and volunteers willing to help. Whether it's a blood donation emergency, disaster relief, or educational support, HELPLINK provides a platform for communities to come together and support each other.

### Key Highlights

- 🚀 **Real-time Connections** - Instant notifications and live updates
- 🔒 **Verified Requests** - Admin verification system for authenticity
- 📱 **Mobile-First PWA** - Works offline and installable on any device
- 🎯 **Category-Based** - 10 specialized help categories
- ⚡ **Urgency Levels** - Priority-based request handling

---

## ✨ Features

### For Help Seekers
- Create detailed help requests with images
- Choose from 10 specialized categories
- Set urgency levels (Normal, Urgent, Critical)
- Track request status in real-time
- Communicate directly with helpers via messaging

### For Helpers/Volunteers
- Browse open help requests by category
- Filter by location and urgency
- Respond to requests with offers to help
- Message request owners directly
- Build a helper reputation

### For Administrators
- Dashboard with platform statistics
- Verify and moderate help requests
- Manage user accounts and roles
- Monitor platform activity
- Delete inappropriate content

### Core Functionality
- **Authentication** - Email-based signup/login with role selection
- **Real-time Messaging** - Direct communication between users
- **Image Upload** - Attach images to help requests
- **Location-Based** - City-based request filtering
- **Status Tracking** - Open → In Progress → Resolved → Closed
- **Push Notifications** - Real-time alerts for new responses

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.3 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| React Router 6 | Navigation |
| TanStack Query | Data Fetching & Caching |
| React Hook Form | Form Management |
| Zod | Schema Validation |
| Lucide React | Icons |
| Framer Motion | Animations |

### Backend (Lovable Cloud)
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Row Level Security | Data Protection |
| Realtime | Live Updates |
| Storage | Image Hosting |
| Edge Functions | Serverless Logic |

### DevOps
| Technology | Purpose |
|------------|---------|
| Vite | Build Tool |
| PWA Plugin | Offline Support |
| ESLint | Code Linting |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      HELPLINK PWA                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │ Components  │  │   Hooks     │         │
│  │  - Index    │  │  - Layout   │  │  - useAuth  │         │
│  │  - Browse   │  │  - Requests │  │  - useAdmin │         │
│  │  - Admin    │  │  - UI       │  │  - useHelp  │         │
│  │  - Profile  │  │  - Forms    │  │  - useRealtime│       │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    Supabase Client                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Database   │  │   Auth      │  │  Storage    │         │
│  │  (Postgres) │  │  (Email)    │  │  (Images)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                 Row Level Security (RLS)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema

### Tables

#### `profiles`
Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| full_name | TEXT | User's display name |
| phone | TEXT | Contact number (optional) |
| avatar_url | TEXT | Profile picture URL |
| city | TEXT | User's city |
| bio | TEXT | User description |
| is_helper | BOOLEAN | Volunteer status |
| is_seeker | BOOLEAN | Help seeker status |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

#### `help_requests`
Stores all help requests.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Request owner |
| title | TEXT | Request title |
| description | TEXT | Detailed description |
| category | ENUM | Help category |
| urgency | ENUM | normal/urgent/critical |
| status | ENUM | open/in_progress/resolved/closed |
| city | TEXT | Location city |
| location | TEXT | Specific location |
| image_url | TEXT | Attached image |
| contact_phone | TEXT | Contact number |
| additional_info | JSONB | Category-specific data |
| is_verified | BOOLEAN | Admin verified |
| verified_by | UUID | Admin who verified |
| verified_at | TIMESTAMP | Verification time |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### `help_responses`
Stores responses to help requests.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| request_id | UUID | References help_requests |
| helper_id | UUID | Responder's user ID |
| message | TEXT | Response message |
| status | TEXT | pending/accepted/rejected |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### `messages`
Direct messaging between users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| sender_id | UUID | Message sender |
| receiver_id | UUID | Message recipient |
| request_id | UUID | Related request (optional) |
| content | TEXT | Message content |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Sent time |

#### `user_roles`
Manages user permissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User reference |
| role | ENUM | admin/moderator/user |

### Views

- `help_requests_public` - Public view without sensitive data
- `profiles_public` - Public profile information
- `admin_requests_view` - Admin view with requester details
- `admin_users_view` - Admin view with user roles

### Database Functions

```
-- Check if user has a specific role
has_role(_user_id UUID, _role app_role) → BOOLEAN

-- Check if user owns a request
user_owns_request(_user_id UUID, _request_id UUID) → BOOLEAN

-- Check if user has responded to a request
user_has_responded_to_request(_user_id UUID, _request_id UUID) → BOOLEAN
```

---

## 👥 User Roles

### Regular User
- Create help requests
- Respond to other requests
- Send/receive messages
- Update own profile

### Helper/Volunteer
- All user permissions
- Browse and filter requests
- Offer assistance
- Track helping history

### Administrator
- All user permissions
- Access admin dashboard
- Verify/reject requests
- Manage all users
- Delete any content
- View platform statistics

---

## 📂 Help Categories

| Category | Icon | Description |
|----------|------|-------------|
| 🩸 Blood Donation | Droplet | Blood and plasma donation requests |
| 🏥 Medical Assistance | Heart | Medical care and health support |
| 🚨 Emergency | AlertTriangle | Urgent crisis situations |
| 🍲 Food & Grocery | Utensils | Food assistance and groceries |
| 📚 Education | GraduationCap | Educational support and tutoring |
| 💰 Financial | Wallet | Financial assistance needs |
| 🏠 Shelter & Housing | Home | Housing and accommodation |
| 💼 Job & Skills | Briefcase | Employment and skill training |
| 👴 Senior Citizen | UserCheck | Elderly care and support |
| 🌊 Disaster Relief | CloudRain | Natural disaster response |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun package manager
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd helplink

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Variables

The project uses Lovable Cloud, which automatically configures these environment variables:

```env
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   │   ├── AdminRequestsTab.tsx
│   │   └── AdminUsersTab.tsx
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── requests/        # Request-related components
│   │   ├── CategoryCard.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── RequestCard.tsx
│   │   └── UrgencyBadge.tsx
│   └── ui/              # shadcn/ui components

├── hooks/
│   ├── useAuth.tsx      # Authentication hook
│   ├── useAdmin.tsx     # Admin utilities
│   ├── useHelpRequests.tsx  # Request CRUD
│   ├── useResponses.tsx     # Response management
│   └── useRealtimeNotifications.tsx

├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/Signup
│   ├── Browse.tsx       # Browse requests
│   ├── CreateRequest.tsx # New request form
│   ├── RequestDetail.tsx # Request details
│   ├── Dashboard.tsx    # User dashboard
│   ├── Profile.tsx      # User profile
│   ├── Messages.tsx     # Messaging
│   ├── Admin.tsx        # Admin panel
│   └── NotFound.tsx     # 404 page
│
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client
│       └── types.ts     # Generated types
│
├── lib/
│   ├── constants.ts     # App constants
│   └── utils.ts         # Utility functions
│
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## 🔌 API Reference

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()
```

### Help Requests

```typescript
// Create request
const { data, error } = await supabase
  .from('help_requests')
  .insert({
    title: 'Need blood donation',
    description: 'Urgent O+ blood needed',
    category: 'blood_donation',
    urgency: 'critical',
    user_id: userId
  })

// Fetch open requests
const { data } = await supabase
  .from('help_requests_public')
  .select('*')
  .eq('status', 'open')
  .order('created_at', { ascending: false })
```

### Responses

```typescript
// Create response
const { error } = await supabase
  .from('help_responses')
  .insert({
    request_id: requestId,
    helper_id: userId,
    message: 'I can help with this'
  })

// Fetch responses for a request
const { data } = await supabase
  .from('help_responses')
  .select('*')
  .eq('request_id', requestId)
```

---

## 🔐 Security

### Row Level Security (RLS)

All tables are protected with RLS policies:

- **Profiles**: Users can only view/edit their own profile
- **Help Requests**: 
  - Anyone can view open requests (public view)
  - Owners can view full details
  - Only owners can update/delete their requests
  - Admins have full access
- **Responses**: 
  - Only visible to request owner and responder
  - Helpers can only edit their own responses
- **Messages**: 
  - Only sender and receiver can view
  - Only sender can create
- **User Roles**: 
  - Users can view their own roles
  - Only admins can modify roles

### Authentication Flow

1. User signs up with email/password
2. Email verification sent (if enabled)
3. Profile created automatically via trigger
4. Default 'user' role assigned
5. Admin promotes users to admin role if needed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)

---

<p align="center">
  Made with ❤️ for communities in need
</p>

- Filter by location and urgency
- Respond to requests with offers to help
- Message request owners directly
- Build a helper reputation

### For Administrators
- Dashboard with platform statistics
- Verify and moderate help requests
- Manage user accounts and roles
- Monitor platform activity
- Delete inappropriate content

### Core Functionality
- **Authentication** - Email-based signup/login with role selection
- **Real-time Messaging** - Direct communication between users
- **Image Upload** - Attach images to help requests
- **Location-Based** - City-based request filtering
- **Status Tracking** - Open → In Progress → Resolved → Closed
- **Push Notifications** - Real-time alerts for new responses

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.3 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component Library |
| React Router 6 | Navigation |
| TanStack Query | Data Fetching & Caching |
| React Hook Form | Form Management |
| Zod | Schema Validation |
| Lucide React | Icons |
| Framer Motion | Animations |

### Backend (Lovable Cloud)
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Row Level Security | Data Protection |
| Realtime | Live Updates |
| Storage | Image Hosting |
| Edge Functions | Serverless Logic |

### DevOps
| Technology | Purpose |
|------------|---------|
| Vite | Build Tool |
| PWA Plugin | Offline Support |
| ESLint | Code Linting |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      HELPLINK PWA                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │ Components  │  │   Hooks     │         │
│  │  - Index    │  │  - Layout   │  │  - useAuth  │         │
│  │  - Browse   │  │  - Requests │  │  - useAdmin │         │
│  │  - Admin    │  │  - UI       │  │  - useHelp  │         │
│  │  - Profile  │  │  - Forms    │  │  - useRealtime│       │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    Supabase Client                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Database   │  │   Auth      │  │  Storage    │         │
│  │  (Postgres) │  │  (Email)    │  │  (Images)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                 Row Level Security (RLS)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema

### Tables

#### `profiles`
Stores user profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| full_name | TEXT | User's display name |
| phone | TEXT | Contact number (optional) |
| avatar_url | TEXT | Profile picture URL |
| city | TEXT | User's city |
| bio | TEXT | User description |
| is_helper | BOOLEAN | Volunteer status |
| is_seeker | BOOLEAN | Help seeker status |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

#### `help_requests`
Stores all help requests.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Request owner |
| title | TEXT | Request title |
| description | TEXT | Detailed description |
| category | ENUM | Help category |
| urgency | ENUM | normal/urgent/critical |
| status | ENUM | open/in_progress/resolved/closed |
| city | TEXT | Location city |
| location | TEXT | Specific location |
| image_url | TEXT | Attached image |
| contact_phone | TEXT | Contact number |
| additional_info | JSONB | Category-specific data |
| is_verified | BOOLEAN | Admin verified |
| verified_by | UUID | Admin who verified |
| verified_at | TIMESTAMP | Verification time |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### `help_responses`
Stores responses to help requests.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| request_id | UUID | References help_requests |
| helper_id | UUID | Responder's user ID |
| message | TEXT | Response message |
| status | TEXT | pending/accepted/rejected |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update |

#### `messages`
Direct messaging between users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| sender_id | UUID | Message sender |
| receiver_id | UUID | Message recipient |
| request_id | UUID | Related request (optional) |
| content | TEXT | Message content |
| is_read | BOOLEAN | Read status |
| created_at | TIMESTAMP | Sent time |

#### `user_roles`
Manages user permissions.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User reference |
| role | ENUM | admin/moderator/user |

### Views

- `help_requests_public` - Public view without sensitive data
- `profiles_public` - Public profile information
- `admin_requests_view` - Admin view with requester details
- `admin_users_view` - Admin view with user roles

### Database Functions

```sql
-- Check if user has a specific role
has_role(_user_id UUID, _role app_role) → BOOLEAN

-- Check if user owns a request
user_owns_request(_user_id UUID, _request_id UUID) → BOOLEAN

-- Check if user has responded to a request
user_has_responded_to_request(_user_id UUID, _request_id UUID) → BOOLEAN
```

---

## 👥 User Roles

### Regular User
- Create help requests
- Respond to other requests
- Send/receive messages
- Update own profile

### Helper/Volunteer
- All user permissions
- Browse and filter requests
- Offer assistance
- Track helping history

### Administrator
- All user permissions
- Access admin dashboard
- Verify/reject requests
- Manage all users
- Delete any content
- View platform statistics

---

## 📂 Help Categories

| Category | Icon | Description |
|----------|------|-------------|
| 🩸 Blood Donation | Droplet | Blood and plasma donation requests |
| 🏥 Medical Assistance | Heart | Medical care and health support |
| 🚨 Emergency | AlertTriangle | Urgent crisis situations |
| 🍲 Food & Grocery | Utensils | Food assistance and groceries |
| 📚 Education | GraduationCap | Educational support and tutoring |
| 💰 Financial | Wallet | Financial assistance needs |
| 🏠 Shelter & Housing | Home | Housing and accommodation |
| 💼 Job & Skills | Briefcase | Employment and skill training |
| 👴 Senior Citizen | UserCheck | Elderly care and support |
| 🌊 Disaster Relief | CloudRain | Natural disaster response |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun package manager
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd helplink

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Variables

The project uses Lovable Cloud, which automatically configures these environment variables:

```env
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   │   ├── AdminRequestsTab.tsx
│   │   └── AdminUsersTab.tsx
│   ├── layout/          # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── requests/        # Request-related components
│   │   ├── CategoryCard.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── RequestCard.tsx
│   │   └── UrgencyBadge.tsx
│   └── ui/              # shadcn/ui components
│
├── hooks/
│   ├── useAuth.tsx      # Authentication hook
│   ├── useAdmin.tsx     # Admin utilities
│   ├── useHelpRequests.tsx  # Request CRUD
│   ├── useResponses.tsx     # Response management
│   └── useRealtimeNotifications.tsx
│
├── pages/
│   ├── Index.tsx        # Landing page
│   ├── Auth.tsx         # Login/Signup
│   ├── Browse.tsx       # Browse requests
│   ├── CreateRequest.tsx # New request form
│   ├── RequestDetail.tsx # Request details
│   ├── Dashboard.tsx    # User dashboard
│   ├── Profile.tsx      # User profile
│   ├── Messages.tsx     # Messaging
│   ├── Admin.tsx        # Admin panel
│   └── NotFound.tsx     # 404 page
│
├── integrations/
│   └── supabase/
│       ├── client.ts    # Supabase client
│       └── types.ts     # Generated types
│
├── lib/
│   ├── constants.ts     # App constants
│   └── utils.ts         # Utility functions
│
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

---

## 🔌 API Reference

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: { full_name: 'John Doe' }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()
```

### Help Requests

```typescript
// Create request
const { data, error } = await supabase
  .from('help_requests')
  .insert({
    title: 'Need blood donation',
    description: 'Urgent O+ blood needed',
    category: 'blood_donation',
    urgency: 'critical',
    user_id: userId
  })

// Fetch open requests
const { data } = await supabase
  .from('help_requests_public')
  .select('*')
  .eq('status', 'open')
  .order('created_at', { ascending: false })

// Update request status
const { error } = await supabase
  .from('help_requests')
  .update({ status: 'resolved' })
  .eq('id', requestId)
```

### Responses

```typescript
// Create response
const { error } = await supabase
  .from('help_responses')
  .insert({
    request_id: requestId,
    helper_id: userId,
    message: 'I can help with this'
  })

// Fetch responses for a request
const { data } = await supabase
  .from('help_responses')
  .select('*')
  .eq('request_id', requestId)
```

---

## 🔐 Security

### Row Level Security (RLS)

All tables are protected with RLS policies:

- **Profiles**: Users can only view/edit their own profile
- **Help Requests**: 
  - Anyone can view open requests (public view)
  - Owners can view full details
  - Only owners can update/delete their requests
  - Admins have full access
- **Responses**: 
  - Only visible to request owner and responder
  - Helpers can only edit their own responses
- **Messages**: 
  - Only sender and receiver can view
  - Only sender can create
- **User Roles**: 
  - Users can view their own roles
  - Only admins can modify roles

### Authentication Flow

1. User signs up with email/password
2. Email verification sent (if enabled)
3. Profile created automatically via trigger
4. Default 'user' role assigned
5. Admin promotes users to admin role if needed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)

---

<p align="center">
  Made with ❤️ for communities in need
</p>
=======


Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
>>>>>>> fd5fd62 (first commit)
