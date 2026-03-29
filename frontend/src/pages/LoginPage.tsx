import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axios';

interface JwtPayload {
  sub: number;
  username: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem('token', token);

      const decodedUser = jwtDecode<JwtPayload>(token);
      console.log('ข้อมูลผู้ใช้:', decodedUser);

      if (decodedUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/booking');
      }

    } catch (err) {
      console.error('Login failed:', err);
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    // เปลี่ยนเป็นพื้นหลังเต็มจอ สีครีม (#FAF6F1) ลบกรอบมือถือทิ้งทั้งหมด
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      
      {/* กล่องล็อกอินสีขาว จัดให้อยู่ตรงกลาง */}
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        
        {/* หัวข้อ "เข้าสู่ระบบ" ใช้รหัสสีตรงๆ เพื่อให้แสดงผลได้ */}
        <h1 className="text-3xl font-bold text-[#1A4F90] mb-8">เข้าสู่ระบบ</h1>
        
        {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
          
          <div className="w-full">
            <label className="block text-xs font-medium text-[#1A4F90] mb-1">ชื่อผู้ใช้</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#F8F9FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4F90]"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-[#1A4F90] mb-1">รหัสผ่าน</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#F8F9FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4F90]"
              required
            />
          </div>

          <div className="flex items-center justify-between text-xs mt-1 mb-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-[#1A4F90] focus:ring-[#1A4F90]" />
              <span className="ml-2 text-gray-600">จดจำฉัน</span>
            </label>
            <a href="#" className="text-[#1A4F90] hover:underline">ลืมรหัสผ่าน?</a>
          </div>

          {/* ปุ่ม "เข้าสู่ระบบ" เปลี่ยนมาใช้โค้ดสีตรงๆ bg-[#1A4F90] ปุ่มจะมีสีเลยตั้งแต่แรก */}
          <button 
            type="submit" 
            className="w-full bg-[#1A4F90] text-white font-bold py-3 rounded-xl hover:bg-[#153f72] transition-colors shadow-md"
          >
            เข้าสู่ระบบ
          </button>

          <div className="text-center text-xs text-gray-600 mt-2 mb-2">
            ยังไม่มีบัญชีผู้ใช้?
            <Link to="/register" className="text-[#1A4F90] hover:underline ml-1 font-medium">สมัครบัญชี</Link>
          </div>
        </form>

        <div className="relative flex py-4 items-center w-full mt-4">
          <div className="grow border-t border-gray-200"></div>
          <span className="shrink mx-4 text-gray-400 text-xs">OR</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* ปุ่ม "เข้าสู่ระบบด้วย GOOGLE" */}
        <button 
          type="button" 
          className="w-full bg-[#1A4F90] text-white font-medium py-3 rounded-xl hover:bg-[#153f72] transition-colors flex items-center justify-center gap-2 mt-4 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.42 8.16C15.42 7.63 15.37 7.12 15.28 6.63H8V9.52H12.16C11.98 10.43 11.43 11.2 10.63 11.71V13.6H13.09C14.53 12.3 15.42 10.39 15.42 8.16Z" fill="#4285F4"/>
            <path d="M8 15.6C10.05 15.6 11.77 14.93 13.09 13.6L10.63 11.71C9.95 12.16 9.07 12.42 8 12.42C6.03 12.42 4.36 11.08 3.77 9.29H1.24V11.23C2.49 13.71 5.04 15.6 8 15.6Z" fill="#34A853"/>
            <path d="M3.77 9.29C3.62 8.85 3.54 8.39 3.54 7.91C3.54 7.43 3.62 6.97 3.77 6.53V4.59H1.24C0.73 5.61 0.44 6.72 0.44 7.91C0.44 9.1 0.73 10.21 1.24 11.23L3.77 9.29Z" fill="#FBBC05"/>
            <path d="M8 3.39C9.11 3.39 10.11 3.77 10.89 4.51L12.91 2.49C11.76 1.41 10.05 0.74 8 0.74C5.04 0.74 2.49 2.63 1.24 5.11L3.77 7.05C4.36 5.26 6.03 3.92 8 3.39Z" fill="#EA4335"/>
          </svg>
          เข้าสู่ระบบด้วย GOOGLE
        </button>
      </div>
    </div>
  );
}