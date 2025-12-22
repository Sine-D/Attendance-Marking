Attendance Marking System
A comprehensive full-stack web application designed to streamline student attendance tracking, leave management, and data analytics. This system provides an intuitive interface for students and administrators to manage daily attendance activities efficiently.

🚀 Features
Smart Attendance Tracking: Easy check-in and check-out functionality for students.
Leave Management System: Submit, track, and manage leave requests seamlessly.
Analytics Dashboard: Interactive charts and reports (using Recharts) to visualize attendance trends and statistics.
Modern UI/UX: Responsive design with smooth animations (Framer Motion) and 3D visual elements (React Three Fiber).
Data Export: Generate PDF reports of attendance and student data.
Calendar View: Visual overview of attendance checks.
🛠️ Tech Stack
Client-Side
Framework: React.js
State Management: Redux Toolkit
Styling: TailwindCSS
Animations: Framer Motion
3D Graphics: React Three Fiber / Drei / Three.js
Visualization: Recharts
Utilities: Date-fns, Axios, jsPDF, React Calendar
Server-Side
Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose
Environment: Dotenv
Security: CORS
📦 Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v16 or higher recommended)
MongoDB (Local instance or Atlas cloud cluster)
Installation
Clone the repository

git clone https://github.com/Sine-D/Attendance-Marking.git
cd Attendance-Marking
Server Setup Navigate to the server directory and install dependencies:

cd server
npm install
Create a .env file in the server directory with your database config:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance-db
PORT=5000
Client Setup Navigate to the client directory and install dependencies:

cd ../client
npm install
Running the Application
You need to run both the client and server terminals.

1. Start the Backend Server

# In the /server directory
npm run dev
The server will start on http://localhost:5000.

2. Start the Frontend Client

# In the /client directory
npm start
The client will launch in your browser at http://localhost:3000.
