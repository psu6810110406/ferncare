import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// อิมพอร์ต Component หน้าต่างๆ (แก้ Path ให้ตรงกับที่คุณเก็บไฟล์ไว้นะครับ)
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingDetailsPage from './pages/BookingDetailsPage'
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* เมื่อมีคนพยายามไปหน้าเข้าสู่ระบบ หรือ สมัครสมาชิก */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* หน้ากรอกรายละเอียด (ที่เราเพิ่งสร้าง) */}
        <Route path="/booking-details" element={<BookingDetailsPage />} />
        
        <Route path="/history" element={<HistoryPage />} />

        <Route path="/history/:id" element={<HistoryDetailPage />} />

        {/* กันเหนียว: ถ้าพิมพ์ URL มั่วๆ ให้กลับมาหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;