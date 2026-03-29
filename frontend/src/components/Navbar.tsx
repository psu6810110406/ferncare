// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Clock, LogOut, LayoutDashboard, CalendarOff } from 'lucide-react'; // 👈 นำเข้า Icon สำหรับ Admin เพิ่ม
import logo from '../assets/logo.png'; 

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null); // 👈 เพิ่ม State สำหรับเก็บ Role
  const navigate = useNavigate();
  
  const isLoggedIn = !!localStorage.getItem('token');

  // 🌟 ดึงข้อมูล Role จาก localStorage เมื่อ Component โหลดหรือเมื่อสถานะล็อกอินเปลี่ยน
  useEffect(() => {
    if (isLoggedIn) {
      try {
        // สมมติว่าเก็บข้อมูลผู้ใช้เป็น JSON string ใน localStorage ชื่อ 'user'
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          setRole(userObj.role); // คาดหวังว่า role จะเป็น 'admin' หรือ 'user'
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    } else {
      setRole(null);
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // 👈 อย่าลืมลบข้อมูล user ด้วยนะครับ
    setIsMenuOpen(false); 
    navigate('/'); 
    window.location.reload(); 
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* แถบด้านบน */}
      <div className="px-5 py-3 flex justify-between items-center max-w-md mx-auto">
        
        {/* โลโก้ */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Ferncare Logo" className="h-10 w-auto" />
          <span className="text-xl font-extrabold text-[#1A4F90] tracking-tight">ferncare</span>
        </Link>

        {/* ปุ่มเมนู */}
        {isLoggedIn ? (
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#1A4F90] hover:bg-blue-50 p-2 rounded-full transition-colors"
          >
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

      {/* เมนู Dropdown */}
      {isMenuOpen && isLoggedIn && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-2 z-50">
          <div className="max-w-md mx-auto flex flex-col px-4">
            
            {/* 🌟 แสดงเมนูตาม Role */}
            {role === 'admin' ? (
              /* เมนูสำหรับ ADMIN */
              <>
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={18} className="text-[#1A4F90]" />
                  <span className="text-sm font-medium">แดชบอร์ดแอดมิน</span>
                </Link>
                <Link 
                  to="/admin/holidays" 
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 rounded-xl text-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <CalendarOff size={18} className="text-[#1A4F90]" />
                  <span className="text-sm font-medium">จัดการวันหยุด</span>
                </Link>
              </>
            ) : (
              /* เมนูสำหรับ USER (หรือกรณีที่ยังไม่มี Role กำหนดชัดเจน) */
              <>
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
                  <span className="text-sm font-medium">ประวัติการจองคิว</span>
                </Link>
              </>
            )}
            
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