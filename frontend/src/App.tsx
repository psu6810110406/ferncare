import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// อิมพอร์ต Component หน้าต่างๆ
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingDetailsPage from './pages/BookingDetailsPage'
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import AdminDashboard from './pages/admin/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';
// 🌟 1. เพิ่มการ Import หน้าจัดการวันหยุดเข้ามา (เช็ค Path ให้ตรงกับโฟลเดอร์ของคุณด้วยนะครับ)
import AdminHolidayPage from './pages/admin/AdminHolidayPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/booking-details" element={<BookingDetailsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<HistoryDetailPage />} />
        
        {/* 🌟 2. แก้ Path ของฝั่งแอดมินให้ตรงกับที่ตั้งไว้ใน Navbar */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/holidays" element={<AdminHolidayPage />} />

        {/* 🌟 3. ตัวดักจับ URL ที่ไม่มีอยู่จริง (ควรอยู่บรรทัดสุดท้ายเสมอ) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;