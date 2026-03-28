import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // เคลียร์ error เก่าทิ้งก่อน
    
    // 1. ตรวจสอบความปลอดภัยของรหัสผ่าน (ใช้ลอจิกเดิม เช็คทีละข้อ)
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว (A-Z)');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว (a-z)');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว (0-9)');
      return;
    }

    // 2. เช็คว่ารหัสผ่าน 2 ช่องตรงกันไหม
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง');
      return;
    }

    try {
      // ยิง API ไปที่ Backend เพื่อสร้างบัญชี
      await api.post('/auth/register', {
        username,
        password,
      });

      // ถ้าสมัครสำเร็จ โชว์ข้อความแปบนึงแล้วเด้งไปหน้า Login
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Registration failed:', err);
      
      // 3. จับ Error จาก Backend มาโชว์
      // ปกติถ้าชื่อซ้ำ NestJS ที่คุณเขียนไว้จะพ่น Status 409 (ConflictException) ออกมา
      if (err.response && err.response.status === 409) {
        setError('ชื่อผู้ใช้นี้มีคนใช้งานแล้ว กรุณาใช้ชื่ออื่นครับ');
      } 
      // ดัก Error กรณีอื่นๆ (เช่น Database ล่ม หรือต่อ Backend ไม่ติด)
      else {
        setError('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        
        <h1 className="text-3xl font-bold text-[#1A4F90] mb-2">สร้างบัญชีใหม่</h1>
        <p className="text-gray-500 text-sm mb-6">กรอกข้อมูลด้านล่างเพื่อสมัครสมาชิก</p>
        
        {/* แสดงข้อความ Error หรือ Success */}
        {error && <p className="text-red-500 text-xs mb-4 text-center bg-red-50 p-2 rounded-lg w-full">{error}</p>}
        {success && <p className="text-green-600 text-xs mb-4 text-center bg-green-50 p-2 rounded-lg w-full">สมัครสมาชิกสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...</p>}
        
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          
          <div className="w-full">
            <label className="block text-xs font-medium text-[#1A4F90] mb-1">ชื่อผู้ใช้</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="ตั้งชื่อผู้ใช้ของคุณ"
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
              placeholder="ตั้งรหัสผ่านของคุณ"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#F8F9FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4F90]"
              required
            />
            {/* --- เริ่มกล่องคำแนะนำความปลอดภัย (เงื่อนไขด้านล่าง) --- */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5 mt-1 text-[11px] text-gray-600">
              <p className="font-medium text-gray-700 mb-1">ความปลอดภัยของรหัสผ่าน:</p>
              <ul className="space-y-0.5 pl-1 list-disc list-inside">
                <li>ความยาว 6 ตัวอักษรขึ้นไป</li>
                <li>มีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว</li>
                <li>มีตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว</li>
                <li>มีตัวเลข (0-9) อย่างน้อย 1 ตัว</li>
              </ul>
            </div>
            {/* --- จบกล่องคำแนะนำความปลอดภัย --- */}
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-[#1A4F90] mb-1">ยืนยันรหัสผ่าน</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="พิมพ์รหัสผ่านอีกครั้ง"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#F8F9FA] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A4F90]"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={success} // ถ้าสมัครสำเร็จแล้วให้ปุ่มกดไม่ได้
            className="w-full bg-[#1A4F90] text-white font-bold py-3 rounded-xl hover:bg-[#153f72] transition-colors shadow-md mt-4 disabled:opacity-50"
          >
            {success ? 'กำลังดำเนินการ...' : 'สมัครบัญชี'}
          </button>

          <div className="text-center text-xs text-gray-600 mt-2">
            มีบัญชีผู้ใช้อยู่แล้ว?
            {/* ใช้ component Link ของ react-router-dom เพื่อเปลี่ยนหน้าแบบสมูทๆ */}
            <Link to="/login" className="text-[#1A4F90] hover:underline ml-1 font-medium">เข้าสู่ระบบ</Link>
          </div>
        </form>

      </div>
    </div>
  );
}