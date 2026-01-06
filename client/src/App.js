import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home";
import Services from './pages/Services/Services';
import Navbar from './components/Navbar';
import Attendance from './pages/Attendance/Attendance';
import MarkPresent from './components/MarkPresent';
import Reports from './pages/Reports/Reports';

import AttendanceCalendar from './pages/AttendanceCalendar/AttendanceCalendar';
import ApplyLeave from './pages/Leave/ApplyLeave';


function App() {

  return (
    <>
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={<Services />} />

          <Route path="/attendance" element={<Attendance />} />

          <Route path="/add-student" element={<MarkPresent />} />

          <Route path="/reports" element={<Reports />} />



          <Route path="/calendar" element={<AttendanceCalendar />} />

          <Route path="/hr-assistant" element={<ApplyLeave />} />

        </Routes>

      </BrowserRouter>
    </>
  );
}

export default App;
