import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// อิมพอร์ต Component หน้าต่างๆ (แก้ Path ให้ตรงกับที่คุณเก็บไฟล์ไว้นะครับ)
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingDetailsPage from './pages/BookingDetailsPage'
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import AdminDashboard from './pages/admin/AdminDashboardPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* เมื่อมีคนพยายามไปหน้าเข้าสู่ระบบ หรือ สมัครสมาชิก */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* หน้ากรอกรายละเอียด (ที่เราเพิ่งสร้าง) */}
        <Route path="/booking-details" element={<BookingDetailsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<HistoryDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;