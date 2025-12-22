# 📊 Attendance Marking System

A modern, full-stack Attendance Marking & Management System built with the MERN stack. Features a stunning glassmorphic UI, real-time analytics, and automated reporting.

## ✨ Features

- **🚀 Modern Dashboard**: High-performance dashboard with glassmorphic aesthetics.
- **📅 Attendance Calendar**: Visual representation of attendance records over time.
- **📈 Advanced Analytics**: Real-time insights and data visualization for attendance trends.
- **📄 Automated Reports**: Generate and export attendance reports in PDF and CSV formats.
- **🏥 Leave Management**: Simple and effective system for applying and tracking leave.
- **🤖 HR Assistant**: Integrated AI-powered assistant for HR-related queries (powered by ApplyLeave logic).
- **✨ 3D Animations**: Immersive user experience with Framer Motion and Three.js backgrounds.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Hooks, Functional Components)
- Redux Toolkit (State Management)
- Framer Motion (Animations)
- Three.js & @react-three/fiber (3D Backgrounds)
- Tailwind CSS (Modern Styling)
- Recharts (Data Visualization)

**Backend:**
- Node.js & Express
- MongoDB with Mongoose (Database)
- JWT (Authentication - optional/ready)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB account (Atlas or Local)
- Vercel CLI (optional for deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sine-D/Attendance-Marking.git
   cd Attendance-Marking
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

3. **Setup Client:**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the application:**
   - Start Server: `cd server && npm run dev`
   - Start Client: `cd client && npm run start`

## ☁️ Deployment

This project is optimized for deployment on **Vercel**.

1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the `vercel.json` and deploy both frontend and backend.
3. Add your `MONGODB_URI` environment variable in the Vercel project settings.

