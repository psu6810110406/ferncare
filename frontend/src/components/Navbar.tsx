// src/components/Navbar.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Clock, LogOut } from 'lucide-react';
import logo from '../assets/logo.png'; // เช็ค path รูปให้ถูกต้องด้วยนะครับ

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // เช็คว่ามี Token หรือไม่ (ถ้ามี = ล็อกอินแล้ว)
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    // ลบ Token ออกจากเครื่อง
    localStorage.removeItem('token');
    setIsMenuOpen(false); // ปิดเมนู
    navigate('/'); // พากลับไปหน้า Home (หรือหน้า Login ก็ได้)
    
    // (Optional) สั่งรีเฟรชหน้าเพื่อให้สถานะอัปเดต 100%
    window.location.reload(); 
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* แถบด้านบน */}
      <div className="px-5 py-3 flex justify-between items-center max-w-md mx-auto">
        
        {/* โลโก้ (กดแล้วกลับหน้าแรก) */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ferncare Logo" className="h-10 w-auto" />
          <span className="text-xl font-extrabold text-[#1A4F90] tracking-tight">ferncare</span>
        </Link>

        {/* ปุ่มเมนู (จะเปลี่ยนตามสถานะล็อกอิน) */}
        {isLoggedIn ? (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#1A4F90] hover:bg-blue-50 p-2 rounded-full transition-colors"
          >
            {/* ถ้าเมนูเปิดอยู่ให้โชว์กากบาท (X) ถ้าปิดอยู่ให้โชว์ขีดสามขีด (Menu) */}
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
          <Link 
            to="/login" 
            className="bg-[#1A4F90] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#153f72] transition-colors shadow-sm"
          >
            เข้าสู่ระบบ
          </Link>
        )}
      </div>

      {/* เมนู Dropdown (จะแสดงก็ต่อเมื่อล็อกอินแล้ว และ กดปุ่มเมนู) */}
      {isMenuOpen && isLoggedIn && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-2 z-50">
          <div className="max-w-md mx-auto flex flex-col px-4">
            
            <Link 
              to="/profile" 
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User size={18} className="text-[#1A4F90]" />
              <span className="text-sm font-medium">ดูรายละเอียดบัญชี</span>
            </Link>
            
            <Link 
              to="/history" 
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Clock size={18} className="text-[#1A4F90]" />
              <span className="text-sm font-medium">ประวัติการใช้บริการ</span>
            </Link>
            
            <div className="h-px bg-gray-100 my-1 mx-2"></div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 rounded-xl text-red-600 transition-colors text-left w-full"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">ออกจากระบบ</span>
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}