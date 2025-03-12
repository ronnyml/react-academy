# React Academy

## 📌 Project Overview
This project is a **React, Express, TypeScript, and Vite**-powered learning platform that integrates courses, students, teachers, payments, enrollments, and certifications. It provides a seamless experience for both educators and learners while simplifying management tasks.

## 📂 Project Structure

```
├── App.tsx                   # Main application component
├── assets/                   # Static assets (images, icons, etc.)
├── components/               # Reusable UI components
│   ├── dashboard/            # Dashboard-related components
│   ├── Sidebar.tsx           # Sidebar navigation component
│   └── ui/                   # General UI components
├── config/                   # Configuration files
│   └── queryConfig.ts        # React Query configuration
├── context/                  # Global state management (React Context API)
├── hooks/                    # Custom hooks for reusable logic
├── index.css                 # Global styles
├── layouts/                  # Page layouts
│   └── BaseLayout.tsx        # Base layout for application pages
├── lib/                      # Utility libraries
│   └── utils.ts              # General utility functions
├── main.tsx                  # Application entry point
├── pages/                    # Page components (routes)
├── routes.tsx                # Application routes
├── services/                 # API services for fetching and managing data
├── types/                    # TypeScript type definitions
├── utils/                    # Additional utility functions
│   └── api.ts                # API interaction utility
└── vite-env.d.ts             # TypeScript environment declaration
```

## 📦 Dependencies

| Library                   | Description |
|---------------------------|-------------|
| `shadcn`                  | Pre-built UI components for modern applications |
| `@tailwindcss/vite`       | TailwindCSS integration with Vite for utility-first styling |
| `@tanstack/react-query`   | Data fetching and caching solution for React |
| `axios`                   | HTTP client for API requests |
| `lucide-react`            | Icon library for React applications |
| `react-router-dom`        | Declarative routing for React applications |
| `recharts`                | Library for creating charts and data visualizations |
| `tailwindcss`             | CSS framework for rapid UI development |

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Install **Node.js** (>= 18)
- Install **npm**

### 2️⃣ Installation
```sh
# Clone the repository
git clone https://github.com/ronnyml/react-academy.git

# Navigate into the project directory
cd react-academy

# Install dependencies
npm install
```

### 3️⃣ Running the Project
```sh
# Start the development server
npm run dev
```
- The app will be available at `http://localhost:5173` (default Vite port).

### 4️⃣ Building for Production
```sh
# Build the project
npm run build
```