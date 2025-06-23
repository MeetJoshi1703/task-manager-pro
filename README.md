# TaskFlow - Modern Project Management Platform

A comprehensive, real-time collaborative project management application built with React and TypeScript, featuring intuitive Kanban boards and seamless team collaboration.

## 🎯 Project Overview

TaskFlow is a modern web-based project management platform designed to streamline team workflows through visual Kanban boards. The application provides real-time collaboration capabilities, comprehensive task management, and an intuitive user interface that adapts to both individual and team productivity needs.

## ✨ Key Features

### Core Functionality
- **Interactive Kanban Boards** - Drag-and-drop task management with customizable columns
- **Real-time Collaboration** - Live updates across all connected users using WebSocket technology
- **Comprehensive Task Management** - Create, edit, assign, and track tasks with priorities, due dates, and tags
- **Team Management** - Invite team members, manage permissions, and track member activity
- **Dashboard Analytics** - Project overview with statistics, progress tracking, and performance insights

### User Experience
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Dark/Light Mode** - Adaptive theming with user preference persistence
- **Advanced Search & Filtering** - Powerful search capabilities with multiple filter options
- **Real-time Notifications** - Instant updates for task changes, assignments, and mentions
- **Intuitive Navigation** - Clean, modern interface with logical information architecture

![Screenshot 2025-06-22 230704](https://github.com/user-attachments/assets/ae30eaa4-0a86-4f6b-862f-1c18e3149a6a)
*Landing page showcasing the application's modern design and value proposition*

![Screenshot 2025-06-22 230717](https://github.com/user-attachments/assets/7ee17416-43d2-4d14-ba79-7d03470360d1)
*Authentication modal with clean signup/login interface*

## 🛠️ Technology Stack

### Frontend Framework & Core
- **React 19.1.0** - Latest React with concurrent features and improved performance
- **TypeScript 5.8.3** - Type-safe development with enhanced developer experience
- **Vite 6.3.5** - Lightning-fast build tool and development server

### State Management & Data Flow
- **Zustand 5.0.5** - Lightweight, scalable state management solution
- **Axios 1.10.0** - HTTP client with request/response interceptors
- **React Router DOM 7.6.2** - Declarative client-side routing

### UI/UX & Styling
- **TailwindCSS 4.1.10** - Utility-first CSS framework for rapid UI development
- **Lucide React 0.516.0** - Beautiful, customizable icon library
- **PostCSS 8.5.6** - CSS post-processing with autoprefixer support

### Interactive Features
- **React DnD 16.0.1** - Drag and drop functionality with HTML5 backend
- **Socket.IO Client 4.8.1** - Real-time bidirectional communication

![Screenshot 2025-06-22 230724](https://github.com/user-attachments/assets/c0cda79a-be76-45b9-9f7b-89ccc1c126df)
*Dashboard overview displaying project statistics and recent activity*

![Screenshot 2025-06-22 230911](https://github.com/user-attachments/assets/85040c59-8cc7-4ce4-ac64-db766dffe4af)
*Interactive Kanban board with drag-and-drop functionality*

## 🏗️ Architecture & Design Patterns

### Component Architecture
The application follows a modular component architecture with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level page components
├── hooks/              # Custom React hooks for shared logic
├── store/              # Zustand state management stores
├── services/           # API service layer and HTTP clients
├── types/              # TypeScript type definitions
└── utils/              # Utility functions and helpers
```

### State Management Strategy
Implemented using Zustand with modular store architecture:
- **Auth Store** - User authentication and session management
- **Board Store** - Board, column, and task state management
- **UI Store** - Application UI state, theme, and modal management
- **Notification Store** - Real-time notification handling

### Design Patterns Utilized
- **Container/Presentational Pattern** - Clear separation of logic and UI components
- **Custom Hooks Pattern** - Reusable stateful logic across components
- **Service Layer Pattern** - Centralized API communication and error handling
- **Observer Pattern** - Real-time updates via WebSocket connections

![Screenshot 2025-06-22 231122](https://github.com/user-attachments/assets/78b170e4-98d9-4491-a5a5-df2d6ae42fac)
*Board creation modal with customization options*

![Screenshot 2025-06-22 231130](https://github.com/user-attachments/assets/cfb18cf3-079b-4cd1-ad7c-a37ae164cfe0)
*Board management interface showing multiple project boards*

## 🚀 Installation & Setup

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd taskflow-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Configuration
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Server
```bash
# Start development server
npm run dev

# Application available at: http://localhost:5173
```

![Screenshot 2025-06-22 231849](https://github.com/user-attachments/assets/a51501c6-d6bf-45c7-a0b2-46be6445ade1)
*Task creation modal with comprehensive task details*

![Screenshot 2025-06-22 232318](https://github.com/user-attachments/assets/7349cb6e-f1dd-4144-bc05-754b2015be80)
*Task management interface showing task details and assignees*

## 📁 Project Structure

```
taskflow-frontend/
├── public/                 # Static assets and favicon
├── src/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── boards/        # Board-related components
│   │   ├── tasks/         # Task management components
│   │   ├── ui/            # Reusable UI components
│   │   └── layout/        # Layout components
│   ├── pages/             # Route components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── BoardView.tsx   # Individual board view
│   │   ├── TasksView.tsx   # Task list view
│   │   └── LandingPage.tsx # Landing page
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hook
│   │   ├── useBoard.ts    # Board management hook
│   │   └── useSocket.ts   # WebSocket hook
│   ├── store/             # Zustand stores
│   │   ├── authStore.ts   # Authentication state
│   │   ├── boardStore.ts  # Board management state
│   │   └── uiStore.ts     # UI state management
│   ├── services/          # API services
│   │   ├── api.ts         # Base API configuration
│   │   ├── authService.ts # Authentication services
│   │   └── boardService.ts # Board API services
│   ├── types/             # TypeScript definitions
│   │   ├── auth.ts        # Authentication types
│   │   ├── board.ts       # Board and task types
│   │   └── api.ts         # API response types
│   └── utils/             # Utility functions
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # TailwindCSS configuration
└── vite.config.ts         # Vite build configuration
```

![Screenshot 2025-06-22 232330](https://github.com/user-attachments/assets/bececacf-be46-4b69-934c-1b935aa87eb1)
*Team management interface for adding and managing board members*

![Screenshot 2025-06-22 232345](https://github.com/user-attachments/assets/d17f6ecc-498e-45d7-ac17-ffa9dc7f058d)
*User profile management with avatar upload and preferences*

## 🔧 Core Functionality

### Authentication System
- **JWT-based Authentication** - Secure token-based user sessions with automatic refresh
- **User Registration & Login** - Comprehensive authentication flow with validation
- **Session Management** - Persistent login state with secure token storage
- **Password Security** - Encrypted password storage and secure authentication

### Board Management
- **Dynamic Board Creation** - Create customizable boards with templates and themes
- **Column Management** - Add, edit, reorder, and delete columns with drag-and-drop
- **Board Sharing** - Invite team members with role-based permissions
- **Board Organization** - Categorize and organize boards with tags and priorities

### Task Management
- **Rich Task Creation** - Detailed task forms with descriptions, priorities, and due dates
- **Drag & Drop Interface** - Intuitive task movement between columns and reordering
- **Task Assignment** - Assign tasks to team members with notification system
- **Task Tracking** - Monitor task progress with status updates and completion tracking

### Real-time Features
- **Live Synchronization** - Instant updates across all connected users
- **Collaborative Editing** - Multiple users can interact simultaneously without conflicts
- **Activity Notifications** - Real-time alerts for task updates and team activities
- **Presence Indicators** - Visual indicators showing active team members

![Screenshot 2025-06-22 232357](https://github.com/user-attachments/assets/605cda92-d533-4cac-8ff6-c0fdee2d219f)
*Task list view with filtering and search capabilities*

![Screenshot 2025-06-22 232404](https://github.com/user-attachments/assets/ecae6b51-62d3-4041-bea8-7cc4de6c631d)
*Notification center showing real-time updates and alerts*

## 🎨 User Interface Design

### Design Philosophy
The interface design emphasizes clarity, efficiency, and user experience:
- **Minimalist Approach** - Clean, uncluttered interface focusing on essential functionality
- **Consistent Design Language** - Uniform components and interactions throughout the application
- **Accessibility First** - WCAG 2.1 compliance ensuring inclusive design for all users
- **Performance Oriented** - Optimized interactions with smooth animations and fast loading

### Theme System
Advanced theming with support for:
- **Light/Dark Mode** - Automatic system preference detection with manual override
- **Color Customization** - Customizable accent colors for personal preferences
- **Typography** - Carefully selected font pairings for optimal readability
- **Responsive Breakpoints** - Mobile-first design with tablet and desktop optimizations

### Interactive Elements
- **Micro-interactions** - Subtle animations providing feedback for user actions
- **Loading States** - Skeleton screens and progress indicators for better perceived performance
- **Hover Effects** - Contextual feedback on interactive elements
- **Keyboard Navigation** - Full keyboard accessibility for power users

![Screenshot 2025-06-22 232411](https://github.com/user-attachments/assets/a84efa00-cb35-488e-92be-17138b91168a)
*Settings panel with theme customization and user preferences*

![Screenshot 2025-06-22 233529](https://github.com/user-attachments/assets/347d7c9c-193b-49ec-910b-b754507bb10d)
*Dark mode interface showcasing the adaptive theming system*

## ⚡ Performance Optimization

### Bundle Optimization
- **Code Splitting** - Route-based and component-based lazy loading
- **Tree Shaking** - Elimination of unused code for smaller bundle sizes
- **Asset Optimization** - Compressed images and optimized static assets
- **Caching Strategy** - Intelligent caching for improved loading performance

### Runtime Performance
- **Virtual Scrolling** - Efficient rendering for large lists and datasets
- **Memoization** - Strategic use of React.memo and useMemo for expensive operations
- **Debounced Operations** - Optimized search and input handling to reduce API calls
- **Lazy Loading** - Components and images loaded on demand

### Core Web Vitals
- **Largest Contentful Paint (LCP)** - Optimized for fast initial content rendering
- **First Input Delay (FID)** - Minimized for responsive user interactions
- **Cumulative Layout Shift (CLS)** - Stable layout with minimal content shifting

![Screenshot 2025-06-22 233547](https://github.com/user-attachments/assets/af0fa10b-5184-4d17-9cbe-e9ad4cf1860f)
*Mobile responsive design showing optimal layout adaptation*

![Screenshot 2025-06-22 233553](https://github.com/user-attachments/assets/1f958442-9ec9-4f90-858a-b42edd77607a)
*Mobile task management interface with touch-optimized interactions*

## 🧪 Development & Testing

### Build Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint code analysis
npm run type-check   # TypeScript type checking
npm run format       # Code formatting with Prettier
```

### Code Quality Measures
- **TypeScript** - Static type checking for enhanced code reliability
- **ESLint** - Comprehensive linting with custom rules for consistency
- **Prettier** - Automated code formatting for uniform style
- **Husky** - Git hooks for pre-commit quality checks

### Testing Strategy
- **Component Testing** - Unit tests for individual components and functions
- **Integration Testing** - Testing component interactions and data flow
- **End-to-End Testing** - Full user workflow testing with real browser automation
- **Accessibility Testing** - Automated and manual accessibility compliance testing

## 📊 Technical Specifications

### Browser Support
- **Modern Browsers** - Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers** - iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement** - Graceful degradation for older browsers

### Performance Metrics
- **Bundle Size** - Optimized to under 500KB gzipped
- **Loading Time** - Initial page load under 2 seconds
- **Interactive Time** - Page becomes interactive within 3 seconds
- **Lighthouse Score** - Target score of 90+ for performance, accessibility, and best practices

### Security Features
- **XSS Protection** - Input sanitization and Content Security Policy
- **CSRF Protection** - Token-based request validation
- **Secure Authentication** - JWT tokens with secure storage
- **Data Validation** - Client and server-side input validation

---

**TaskFlow Frontend** - Built with modern web technologies for optimal performance and user experience.
